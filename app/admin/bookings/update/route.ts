export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, status } = body;

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
