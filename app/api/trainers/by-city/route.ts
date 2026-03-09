// app/api/trainers/by-city/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TrainerStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");
  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  try {
    // Get active trainers in this city
    const trainers = await prisma.trainer.findMany({
      where: {
        city: { contains: city, mode: "insensitive" },
        status: TrainerStatus.APPROVED,
      },
      select: {
        id: true,
        name: true,
        city: true,
        basePrice: true,
        experience: true,
        languages: true,
        vehicleTypes: true,
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });

    // Get student waitlist count for this city
    const waitlistCount = await prisma.studentWaitlist.count({
      where: { city: { contains: city, mode: "insensitive" } },
    });

    return NextResponse.json({ trainers, waitlistCount });
  } catch (error) {
    console.error("Trainer search error:", error);
    return NextResponse.json({ trainers: [], waitlistCount: 0 });
  }
}