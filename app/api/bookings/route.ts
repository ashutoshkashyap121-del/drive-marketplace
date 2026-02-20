export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const trainerId = Number(body.trainerId);

    // 1️⃣ Get trainer
    const trainer = await prisma.trainer.findUnique({
      where: { id: trainerId },
      include: { vehicles: true },
    });

    if (!trainer) {
      return NextResponse.json(
        { error: "Trainer not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Must be an APPROVED trainer
    if (trainer.status !== "APPROVED") {
      return NextResponse.json(
        { error: "This trainer is not currently available" },
        { status: 400 }
      );
    }

    const amount = Number(body.amount);

    // 3️⃣ Revenue split: 20% platform fee, 80% trainer payout
    const platformFee = Math.round(amount * 0.2);
    const trainerPayout = amount - platformFee;

    // 4️⃣ Create booking
    const booking = await prisma.booking.create({
      data: {
        trainerId,
        packageName: body.packageName || "Standard Training",
        amount,
        platformFee,
        trainerPayout,
        customerName: body.customerName,
        mobile: body.mobile,
        city: body.city,
        address: body.address,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
    });

    return NextResponse.json({ id: booking.id });

  } catch (error) {
    console.error("BOOKING ERROR:", error);
    return NextResponse.json(
      { error: "Booking failed" },
      { status: 500 }
    );
  }
}