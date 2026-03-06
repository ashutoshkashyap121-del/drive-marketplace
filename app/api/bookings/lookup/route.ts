export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const mobile = searchParams.get("mobile");

    if (!id || !mobile) {
      return NextResponse.json({ error: "Booking ID and mobile are required" }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id),
        mobile,
      },
      include: {
        trainer: { select: { name: true, mobile: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found. Check your booking ID and mobile number." }, { status: 404 });
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json({ error: "This booking has already been cancelled." }, { status: 400 });
    }

    if (booking.status === "COMPLETED") {
      return NextResponse.json({ error: "Completed bookings cannot be cancelled." }, { status: 400 });
    }

    if (booking.paymentStatus !== "PAID") {
      return NextResponse.json({ error: "Only paid bookings can be cancelled for a refund." }, { status: 400 });
    }

    return NextResponse.json({
      booking: {
        id: booking.id,
        trainerName: booking.trainer.name,
        bookingDate: booking.bookingDate,
        amount: booking.amount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        razorpayPaymentId: booking.razorpayPaymentId,
      },
    });
  } catch (error) {
    console.error("[BOOKING_LOOKUP_ERROR]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}