import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// City alias mapping — Delhi NCR expands to all NCR cities
const CITY_ALIASES: Record<string, string[]> = {
  "delhi ncr": ["Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"],
  "delhi":     ["Delhi"],
  "ncr":       ["Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"],
  "mumbai":    ["Mumbai", "Navi Mumbai", "Thane"],
  "bangalore": ["Bangalore", "Bengaluru"],
  "bengaluru": ["Bangalore", "Bengaluru"],
};

export async function GET(req: NextRequest) {
  const city        = req.nextUrl.searchParams.get("city") ?? "";
  const pincode     = req.nextUrl.searchParams.get("pincode") ?? "";
  const vehicleType = req.nextUrl.searchParams.get("vehicleType") ?? "";
  const page        = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limit       = Number(req.nextUrl.searchParams.get("limit") ?? "20");
  const skip        = (page - 1) * limit;

  const cityLower   = city.toLowerCase().trim();
  const cityTargets = CITY_ALIASES[cityLower] ?? (city ? [city] : []);

  const where: any = { status: "APPROVED" };

  if (cityTargets.length > 0) {
    where.city = { in: cityTargets, mode: "insensitive" };
  }

  if (vehicleType) {
    where.vehicleTypes = { has: vehicleType };
  }

  // Pincode search — show trainers whose serviceArea includes this pincode
  if (pincode) {
    where.serviceArea = { has: pincode };
  }

  const [trainers, total] = await Promise.all([
    prisma.trainer.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      select: {
        id: true, name: true, city: true, experience: true,
        rating: true, basePrice: true, packagesJson: true,
        adminNotes: true, languages: true, vehicleTypes: true,
        serviceArea: true, pincode: true,
      },
    }),
    prisma.trainer.count({ where }),
  ]);

  return NextResponse.json({ trainers, total, page, pages: Math.ceil(total / limit) });
}