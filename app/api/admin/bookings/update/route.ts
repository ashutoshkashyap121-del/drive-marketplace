export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin";
import { logAdminAction } from "@/lib/audit";
import { smsLearnerBookingConfirmed } from "@/lib/sms";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export async function POST(req: Request) {
  try {
    const auth = await authorizeAdminRequest(req, { requireCsrf: true });
    if (!auth.ok) {
      return auth.response;
    }

    const body = await req.json();
    const bookingId = body.id ?? body.bookingId;
    const { status, paymentStatus } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const existing = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      select: {
        status: true,
        paymentStatus: true,
        customerName: true,
        mobile: true,
        trainer: { select: { name: true, mobile: true } },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updated = await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      },
    });

    await logAdminAction({
      action: "BOOKING_UPDATED",
      entityType: "Booking",
      entityId: String(bookingId),
      metadata: {
        previousStatus: existing.status,
        newStatus: status,
        previousPaymentStatus: existing.paymentStatus,
        newPaymentStatus: paymentStatus,
      },
    });

    if (status === "CONFIRMED" && existing.status !== "CONFIRMED") {
      try {
        await smsLearnerBookingConfirmed({
          customerName: existing.customerName,
          customerMobile: existing.mobile,
          trainerName: existing.trainer.name,
          trainerMobile: existing.trainer.mobile,
          bookingId: Number(bookingId),
        });
      } catch (err) {
        console.error("[SMS_BOOKING_CONFIRMED_ERROR]", err);
      }
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("ADMIN BOOKING UPDATE ERROR:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
