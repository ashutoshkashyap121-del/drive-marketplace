export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (
      !body.trainerId ||
      !body.trainerName ||
      body.amount === undefined
    ) {
      return NextResponse.json(
        { error: "Missing booking fields" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        trainerId: Number(body.trainerId),
        trainerName: body.trainerName,
        packageName: body.packageName || "Standard",
        amount: Number(body.amount),

        customerName: body.customerName,
        mobile: body.mobile,
        city: body.city,
        address: body.address,
      },
    });

    return NextResponse.json({ id: booking.id }, { status: 201 });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
