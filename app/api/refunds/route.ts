export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

function getEligibility(booking: {
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
}) {
  if (booking.status === "COMPLETED") {
    return { eligible: false, reason: "Completed sessions cannot be refunded." };
  }
  if (booking.status === "CANCELLED") {
    return { eligible: false, reason: "This booking is already cancelled." };
  }
  const pendingStatuses = new Set<BookingStatus>([
    BookingStatus.PENDING,
    BookingStatus.PENDING_COORDINATION,
  ]);
  if (!pendingStatuses.has(booking.status)) {
    return { eligible: false, reason: "This booking is already confirmed and not eligible for this refund flow." };
  }
  if (booking.paymentStatus === "REFUNDED") {
    return { eligible: false, reason: "This booking has already been refunded." };
  }
  if (booking.paymentStatus !== "PAID") {
    return { eligible: false, reason: "Only paid bookings are eligible for refund." };
  }
  const ageMs = Date.now() - new Date(booking.createdAt).getTime();
  if (ageMs < FOUR_HOURS_MS) {
    return { eligible: false, reason: "Refund is available only if booking is unconfirmed for 4+ hours." };
  }
  return { eligible: true as const, reason: "" };
}

export async function GET(req: NextRequest) {
  try {
    const bookingId = (req.nextUrl.searchParams.get("bookingId") ?? "").trim();
    const mobile = (req.nextUrl.searchParams.get("mobile") ?? "").trim();

    if (!bookingId || !mobile) {
      return NextResponse.json({ error: "Booking ID and mobile are required" }, { status: 400 });
    }

    const id = Number(bookingId);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id, mobile },
      select: {
        id: true,
        amount: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found. Check booking ID and mobile number." }, { status: 404 });
    }

    const { eligible, reason } = getEligibility(booking);

    return NextResponse.json({
      bookingId: booking.id,
      amount: booking.amount,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      eligibleForRefund: eligible,
      reason,
    });
  } catch (error) {
    console.error("[REFUNDS_GET_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bookingId = Number(body?.bookingId);
    const mobile = (body?.mobile ?? "").toString().trim();
    const reason = (body?.reason ?? "").toString().trim();

    if (!Number.isFinite(bookingId) || bookingId <= 0 || !mobile) {
      return NextResponse.json({ error: "Booking ID and mobile are required" }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, mobile },
      select: {
        id: true,
        amount: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
        razorpayPaymentId: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const { eligible, reason: eligibilityReason } = getEligibility(booking);
    if (!eligible) {
      return NextResponse.json(
        {
          error: eligibilityReason,
          eligibleForRefund: false,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
        },
        { status: 400 }
      );
    }

    if (!booking.razorpayPaymentId) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json({
        success: true,
        manualRefund: true,
        message:
          "Your booking is cancelled. Our team will process your refund manually and contact you shortly.",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    try {
      const refund = await razorpay.payments.refund(booking.razorpayPaymentId, {
        amount: booking.amount * 100,
        speed: "optimum",
        notes: {
          reason: reason || "Unconfirmed booking refund after 4 hours",
          bookingId: String(booking.id),
        },
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "CANCELLED",
          paymentStatus: "REFUNDED",
        },
      });

      return NextResponse.json({
        success: true,
        manualRefund: false,
        refundId: refund.id,
        message: "Refund has been initiated to your original payment method.",
      });
    } catch (refundError) {
      console.error("[REFUNDS_RAZORPAY_ERROR]", refundError);

      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "CANCELLED" },
      });

      return NextResponse.json({
        success: true,
        manualRefund: true,
        message:
          "Your booking is cancelled. Refund request is recorded and our team will process it manually.",
      });
    }
  } catch (error) {
    console.error("[REFUNDS_POST_ERROR]", error);
    return NextResponse.json({ error: "Failed to process refund" }, { status: 500 });
  }
}
