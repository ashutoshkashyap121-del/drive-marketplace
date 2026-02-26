export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyBookingMade, notifyAdminNewBooking } from "@/lib/notifications";
import { smsTrainerNewBooking, smsAdminNewBooking } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trainerId, customerName, mobile, email, city, address, pincode, bookingDate } = body;

    if (!trainerId || !customerName || !mobile || !city || !address || !bookingDate) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const trainer = await prisma.trainer.findUnique({
      where: { id: parseInt(trainerId) },
    });

    if (!trainer || trainer.status !== "APPROVED") {
      return NextResponse.json({ error: "Trainer not available" }, { status: 404 });
    }

    const amount = trainer.basePrice ?? 0;
    const platformFee = Math.round(amount * 0.15);
    const trainerPayout = amount - platformFee;

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
      },
    });

    const bookingDateFormatted = new Date(bookingDate).toLocaleDateString("en-IN", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    // ── SMS trainer (awaited so Vercel doesn't kill early) ────────────────────
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

    // ── SMS admin ─────────────────────────────────────────────────────────────
    try {
      await smsAdminNewBooking({
        customerName,
        trainerName: trainer.name,
        amount,
        platformFee,
      });
    } catch (err) { console.error("[SMS_ADMIN_BOOKING_ERROR]", err); }

    // ── Email trainer (awaited) ───────────────────────────────────────────────
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

    // ── Email admin ───────────────────────────────────────────────────────────
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
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}