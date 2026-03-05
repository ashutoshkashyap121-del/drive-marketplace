export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { notifyBookingMade, notifyAdminNewBooking } from "@/lib/notifications";
import { smsTrainerNewBooking, smsAdminNewBooking } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // Booking details
      trainerId,
      customerName,
      mobile,
      email,
      city,
      address,
      pincode,
      bookingDate,
    } = await req.json();

    // ── 1. Verify Razorpay signature ─────────────────────────────────────────
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // ── 2. Get trainer details ───────────────────────────────────────────────
    const trainer = await prisma.trainer.findUnique({
      where: { id: parseInt(trainerId) },
    });

    if (!trainer || trainer.status !== "APPROVED") {
      return NextResponse.json({ error: "Trainer not available" }, { status: 404 });
    }

    const amount = trainer.basePrice ?? 0;
    const platformFee = Math.round(amount * 0.15);
    const trainerPayout = amount - platformFee;

    // ── 3. Create booking in DB with PAID status ─────────────────────────────
    const booking = await prisma.booking.create({
      data: {
        trainerId: parseInt(trainerId),
        customerName,
        mobile,
        city,
        address,
        pincode: pincode || null,
        bookingDate: new Date(bookingDate),
        packageName: "Standard Session",
        amount,
        platformFee,
        trainerPayout,
        paymentStatus: "PAID",
        status: "PENDING",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    const bookingDateFormatted = new Date(bookingDate).toLocaleDateString("en-IN", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    // ── 4. SMS trainer ───────────────────────────────────────────────────────
    try {
      await smsTrainerNewBooking({
        trainerName: trainer.name,
        trainerMobile: trainer.mobile,
        customerName,
        customerMobile: mobile,
        city,
        packageName: "Standard Session",
        amount,
      });
    } catch (err) { console.error("[SMS_TRAINER_BOOKING_ERROR]", err); }

    // ── 5. SMS admin ─────────────────────────────────────────────────────────
    try {
      await smsAdminNewBooking({
        customerName,
        trainerName: trainer.name,
        amount,
        platformFee,
      });
    } catch (err) { console.error("[SMS_ADMIN_BOOKING_ERROR]", err); }

    // ── 6. Email trainer ─────────────────────────────────────────────────────
    if (trainer.email) {
      try {
        await notifyBookingMade({
          trainer: {
            name: trainer.name,
            email: trainer.email,
            mobile: trainer.mobile,
          },
          learner: {
            name: customerName,
            email: email || "",
            mobile,
          },
          booking: {
            id: booking.id,
            packageName: "Standard Session",
            amount,
            bookingDate: bookingDateFormatted,
            address,
            city,
          },
        });
      } catch (err) { console.error("[EMAIL_BOOKING_ERROR]", err); }
    }

    // ── 7. Email admin ───────────────────────────────────────────────────────
    try {
      await notifyAdminNewBooking({
        learnerName: customerName,
        trainerName: trainer.name,
        packageName: "Standard Session",
        amount,
        city,
      });
    } catch (err) { console.error("[EMAIL_ADMIN_BOOKING_ERROR]", err); }

    return NextResponse.json({ success: true, booking }, { status: 201 });

  } catch (error) {
    console.error("[RAZORPAY_VERIFY_ERROR]", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}