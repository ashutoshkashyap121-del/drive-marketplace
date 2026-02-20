export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trainerId } = body;

    if (!trainerId) {
      return NextResponse.json(
        { error: "trainerId required" },
        { status: 400 }
      );
    }

    await prisma.trainer.update({
      where: { id: trainerId },
      data: { status: "APPROVED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
