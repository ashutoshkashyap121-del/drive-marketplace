import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city");
  const vehicle = searchParams.get("vehicle");

  const trainers = await prisma.trainer.findMany({
    where: {
      approved: true,
      ...(city ? { city } : {}),
      ...(vehicle
        ? {
            vehicles: {
              some: { type: vehicle },
            },
          }
        : {}),
    },
    include: {
      vehicles: true,
    },
  });

  return NextResponse.json(trainers);
}
