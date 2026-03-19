export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { waBookingCancelledLearner } from "@/lib/whatsapp";

function getRazorpayClient(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

export async function POST(req: NextRequest) {
  const razorpayClient = getRazorpayClient();
  if (!razorpayClient) {
    return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
  }

  try {
    const { bookingId, mobile } = await req.json();

    if (!bookingId || !mobile) {
      return NextResponse.json({ error: "Booking ID and mobile are required" }, { status: 400 });
    }

    // ── 1. Fetch and validate booking ────────────────────────────────────────
    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(bookingId), mobile },
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.status === "CANCELLED") return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
    if (booking.status === "COMPLETED") return NextResponse.json({ error: "Completed bookings cannot be cancelled" }, { status: 400 });
    if (booking.paymentStatus !== "PAID" || !booking.razorpayPaymentId) {
      return NextResponse.json({ error: "No payment found for this booking" }, { status: 400 });
    }

    // ── 2. Calculate refund ──────────────────────────────────────────────────
    const sessionDate = booking.bookingDate ? new Date(booking.bookingDate) : null;
    const hoursUntil = sessionDate ? (sessionDate.getTime() - Date.now()) / (1000 * 60 * 60) : 0;

    let refundPercent = 0;
    if (hoursUntil >= 24) refundPercent = 100;
    else if (hoursUntil > 0) refundPercent = 50;

    if (refundPercent === 0) {
      return NextResponse.json({ error: "Session has already passed. No refund applicable." }, { status: 400 });
    }

    const refundAmount = Math.round((booking.amount * refundPercent) / 100);

    // ── 3. Process Razorpay refund ───────────────────────────────────────────
    const refund = await razorpayClient.payments.refund(booking.razorpayPaymentId, {
      amount: refundAmount * 100,
      notes: {
        reason: "Learner cancellation",
        bookingId: booking.id.toString(),
        refundPercent: refundPercent.toString(),
      },
    });

    // ── 4. Update booking in DB ──────────────────────────────────────────────
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED", paymentStatus: "REFUNDED" },
    });

    // ── 5. WhatsApp learner cancellation notification ────────────────────────
    try {
      await waBookingCancelledLearner({
        learnerName: booking.customerName,
        learnerMobile: booking.mobile,
        bookingId: booking.id,
        refundAmount,
      });
    } catch (err) { console.error("[WA_CANCEL_ERROR]", err); }

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
