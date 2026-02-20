export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin";
import { verifyCSRF } from "@/lib/csrf";
import { logAdminAction } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    // 🔐 Session validation
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🛡️ CSRF validation
    if (!verifyCSRF(req)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    const body = await req.json();
    const { bookingId, status, paymentStatus } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // 🔎 Fetch old values before update
    const existing = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        status: true,
        paymentStatus: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status, paymentStatus },
    });

    // 📝 Audit log
    await logAdminAction({
      action: "BOOKING_UPDATED",
      entityType: "Booking",
      entityId: bookingId,
      metadata: {
        previousStatus: existing.status,
        previousPaymentStatus: existing.paymentStatus,
        newStatus: status,
        newPaymentStatus: paymentStatus,
      },
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error("ADMIN BOOKING UPDATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}