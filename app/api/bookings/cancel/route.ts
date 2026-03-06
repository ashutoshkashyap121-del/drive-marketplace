export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { bookingId, mobile } = await req.json();

    if (!bookingId || !mobile) {
      return NextResponse.json({ error: "Booking ID and mobile are required" }, { status: 400 });
    }

    // ── 1. Fetch and validate booking ────────────────────────────────────────
    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(bookingId), mobile },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
    }

    if (booking.status === "COMPLETED") {
      return NextResponse.json({ error: "Completed bookings cannot be cancelled" }, { status: 400 });
    }

    if (booking.paymentStatus !== "PAID" || !booking.razorpayPaymentId) {
      return NextResponse.json({ error: "No payment found for this booking" }, { status: 400 });
    }

    // ── 2. Calculate refund amount ───────────────────────────────────────────
    const sessionDate = booking.bookingDate ? new Date(booking.bookingDate) : null;
    const hoursUntil = sessionDate
      ? (sessionDate.getTime() - Date.now()) / (1000 * 60 * 60)
      : 0;

    let refundPercent = 0;
    if (hoursUntil >= 24) refundPercent = 100;
    else if (hoursUntil > 0) refundPercent = 50;

    if (refundPercent === 0) {
      return NextResponse.json({ error: "Session has already passed. No refund applicable." }, { status: 400 });
    }

    const refundAmount = Math.round((booking.amount * refundPercent) / 100);

    // ── 3. Process refund via Razorpay ───────────────────────────────────────
    const refund = await razorpay.payments.refund(booking.razorpayPaymentId, {
      amount: refundAmount * 100, // paise
      notes: {
        reason: "Learner cancellation",
        bookingId: booking.id.toString(),
        refundPercent: refundPercent.toString(),
      },
    });

    // ── 4. Update booking in DB ──────────────────────────────────────────────
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: "CANCELLED",
        paymentStatus: "REFUNDED",
      },
    });

    return NextResponse.json({
      success: true,
      refundAmount,
      refundPercent,
      razorpayRefundId: refund.id,
    });

  } catch (error) {
    console.error("[CANCEL_BOOKING_ERROR]", error);
    return NextResponse.json({ error: "Failed to process cancellation" }, { status: 500 });
  }
}