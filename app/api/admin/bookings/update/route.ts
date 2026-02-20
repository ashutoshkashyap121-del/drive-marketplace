import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { bookingId, status, paymentStatus } = body;

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        paymentStatus,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("BOOKING UPDATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
