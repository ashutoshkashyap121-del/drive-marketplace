export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const vehicle = searchParams.get("vehicle");

    const trainers = await prisma.trainer.findMany({
      where: {
        status: "APPROVED",
        ...(city ? { city } : {}),
        ...(vehicle ? {
          vehicles: {
            some: {
              type: vehicle as "CAR" | "BIKE",
            },
          },
        } : {}),
      },
      include: {
        vehicles: true,
      },
    });

    return NextResponse.json(trainers);
  } catch (error) {
    console.error("TRAINERS API ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}