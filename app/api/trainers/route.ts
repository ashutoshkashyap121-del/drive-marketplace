// app/api/trainers/route.ts  (replace or merge with your existing file)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city") ?? undefined;
  const pincode = searchParams.get("pincode") ?? undefined;
  const vehicleType = searchParams.get("vehicleType") ?? undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
  const lang = searchParams.get("lang") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));

  const where: Record<string, any> = {
    isApproved: true,
    isActive: true,
  };

  // City filter
  if (city) where.city = city;

  // Pincode-based matching: trainer's serviceArea array must contain the requested pincode
  if (pincode) {
    where.serviceArea = { has: pincode };
  }

  // Vehicle type filter
  if (vehicleType) {
    where.vehicleTypes = { has: vehicleType };
  }

  // Price ceiling
  if (maxPrice) {
    where.pricePerHour = { lte: maxPrice };
  }

  // Rating floor
  if (minRating) {
    where.rating = { gte: minRating };
  }

  // Language filter
  if (lang) {
    where.languages = { has: lang };
  }

  const [total, trainers] = await Promise.all([
    prisma.trainer.count({ where }),
    prisma.trainer.findMany({
      where,
      select: {
        id: true,
        name: true,
        photoUrl: true,
        bio: true,
        city: true,
        pincode: true,
        serviceArea: true,
        vehicleTypes: true,
        pricePerHour: true,
        yearsExp: true,
        languages: true,
        rating: true,
        totalReviews: true,
      },
      orderBy: [
        { rating: "desc" },
        { pricePerHour: "asc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  // If pincode was specified, boost trainers whose home pincode matches exactly
  const sorted = pincode
    ? trainers.sort((a, b) => {
        const aExact = a.pincode === pincode ? 1 : 0;
        const bExact = b.pincode === pincode ? 1 : 0;
        if (bExact !== aExact) return bExact - aExact;
        return b.rating - a.rating;
      })
    : trainers;

  return NextResponse.json({
    trainers: sorted,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}