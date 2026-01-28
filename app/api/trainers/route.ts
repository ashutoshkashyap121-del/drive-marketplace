import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");

  const trainers = await prisma.trainer.findMany({
    where: {
      approved: true,
      ...(city ? { city } : {}),
    },
    select: {
      id: true,
      name: true,        // ✅ THIS WAS MISSING
      city: true,
      experience: true,
      vehicles: true,
    },
  });

  return NextResponse.json(trainers);
}
