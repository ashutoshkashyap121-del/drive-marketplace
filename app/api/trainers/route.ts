// app/api/trainers/route.ts
// Main trainer search API used by TrainersClient
// Returns packagesJson + languages so listing cards can show package details

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TrainerStatus, VehicleType } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const city    = searchParams.get("city");
  const vehicle = searchParams.get("vehicle");   // "CAR" | "BIKE"
  const pincode = searchParams.get("pincode");   // optional 6-digit

  if (!city || !vehicle) {
    return NextResponse.json({ error: "city and vehicle are required" }, { status: 400 });
  }

  // Map URL vehicle param to DB enum values
  const vehicleEnums: VehicleType[] =
    vehicle === "CAR"
      ? [VehicleType.CAR]
      : [VehicleType.BIKE_GEARED, VehicleType.BIKE_NON_GEARED];

  try {
    const trainers = await prisma.trainer.findMany({
      where: {
        status: TrainerStatus.APPROVED,
        city: { contains: city, mode: "insensitive" },
        vehicleTypes: { hasSome: vehicleEnums },
        // If pincode supplied, trainer must serve that pincode
        ...(pincode ? { serviceArea: { has: pincode } } : {}),
      },
      select: {
        id: true,
        name: true,
        city: true,
        experience: true,
        trainerType: true,
        rating: true,
        basePrice: true,
        packagesJson: true,     // ← needed for package detail cards
        languages: true,        // ← needed for language badges
        vehicleTypes: true,
        verifiedSchool: true,
        vehicles: {
          select: { type: true, dualControl: true, insured: true }
        },
      },
      orderBy: [
        { rating: "desc" },
        { createdAt: "desc" },
      ],
      take: 20,
    });

    return NextResponse.json(trainers);
  } catch (error) {
    console.error("Trainer search error:", error);
    return NextResponse.json([], { status: 500 });
  }
}