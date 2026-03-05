import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city        = searchParams.get("city")       ?? undefined;
  const pincode     = searchParams.get("pincode")    ?? undefined;
  // Support both "vehicle" (sent by frontend) and "vehicleType"
  const vehicleType = searchParams.get("vehicle") ?? searchParams.get("vehicleType") ?? undefined;
  const maxPrice    = searchParams.get("maxPrice")   ? Number(searchParams.get("maxPrice"))  : undefined;
  const minRating   = searchParams.get("minRating")  ? Number(searchParams.get("minRating")) : undefined;
  const lang        = searchParams.get("lang")       ?? undefined;
  const page        = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit       = Math.min(50, Number(searchParams.get("limit") ?? 20));

  const where: Record<string, any> = {
    status: "APPROVED", // ✅ correct field name (was isApproved: true)
  };

  // City filter
  if (city) where.city = city;

  // Pincode — trainer's serviceArea array must contain the searched pincode
  if (pincode) {
    where.serviceArea = { has: pincode };
  }

  // Vehicle type filter — handle both "CAR" and "BIKE" (BIKE matches BIKE_GEARED or BIKE_NON_GEARED)
  if (vehicleType) {
    if (vehicleType === "BIKE") {
      // Learner selects "Bike" — match either bike type
      where.vehicleTypes = {
        hasSome: ["BIKE_GEARED", "BIKE_NON_GEARED"],
      };
    } else {
      where.vehicleTypes = { has: vehicleType };
    }
  }

  if (maxPrice)   where.basePrice = { lte: maxPrice };
  if (minRating)  where.rating    = { gte: minRating };
  if (lang)       where.languages = { has: lang };

  const [total, trainers] = await Promise.all([
    prisma.trainer.count({ where }),
    prisma.trainer.findMany({
      where,
      select: {
        id:           true,
        name:         true,
        bio:          true,
        city:         true,
        pincode:      true,
        serviceArea:  true,
        vehicleTypes: true,
        basePrice:    true,
        experience:   true,
        languages:    true,
        rating:       true,
        trainerType:  true,
        vehicles: {
          select: {
            type:        true,
            dualControl: true,
            insured:     true,
          },
        },
      },
      orderBy: [
        { rating: "desc" },
        { basePrice: "asc" },
      ],
      skip:  (page - 1) * limit,
      take:  limit,
    }),
  ]);

  // Boost trainers whose home pincode exactly matches searched pincode
  const sorted = pincode
    ? trainers.sort((a, b) => {
        const aExact = a.pincode === pincode ? 1 : 0;
        const bExact = b.pincode === pincode ? 1 : 0;
        if (bExact !== aExact) return bExact - aExact;
        return (b.rating ?? 0) - (a.rating ?? 0);
      })
    : trainers;

  return NextResponse.json({
    trainers: sorted,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}