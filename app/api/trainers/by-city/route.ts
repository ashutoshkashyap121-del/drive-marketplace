// app/api/trainers/by-city/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildTrainerWhereInput, getCityTargets } from "@/lib/trainer-search";

export async function GET(req: NextRequest) {
  const city = (req.nextUrl.searchParams.get("city") ?? "").trim();
  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  try {
    const cityTargets = getCityTargets(city);
    const trainerWhere = buildTrainerWhereInput({ city });

    // Get active trainers in this city
    const trainers = await prisma.trainer.findMany({
      where: trainerWhere,
      select: {
        id: true,
        name: true,
        city: true,
        basePrice: true,
        experience: true,
        languages: true,
        vehicleTypes: true,
        packagesJson: true,
        rating: true,
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });

    // Get student waitlist count for this city
    const waitlistCount = await prisma.studentWaitlist.count({
      where: cityTargets.length
        ? {
            OR: cityTargets.map((targetCity) => ({
              city: { equals: targetCity, mode: "insensitive" },
            })),
          }
        : undefined,
    });

    return NextResponse.json({ trainers, waitlistCount });
  } catch (error) {
    console.error("Trainer search error:", error);
    return NextResponse.json({ trainers: [], waitlistCount: 0 });
  }
}
