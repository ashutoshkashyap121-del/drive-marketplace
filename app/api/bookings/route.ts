import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trainerId, customerName, mobile, city, address, pincode, bookingDate } = body;

    if (!trainerId || !customerName || !mobile || !city || !address || !bookingDate) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const trainer = await prisma.trainer.findUnique({
      where: { id: parseInt(trainerId) },
    });

    if (!trainer || trainer.status !== "APPROVED") {
      return NextResponse.json({ error: "Trainer not available" }, { status: 404 });
    }

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
        amount: trainer.basePrice ?? 0,
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}