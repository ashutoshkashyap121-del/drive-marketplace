import { NextRequest, NextResponse } from "next/server";
import { Prisma, VehicleType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// City alias mapping - Delhi NCR expands to all NCR cities
const CITY_ALIASES: Record<string, string[]> = {
  "delhi ncr": ["Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"],
  delhi: ["Delhi"],
  ncr: ["Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad"],
  mumbai: ["Mumbai", "Navi Mumbai", "Thane"],
  bangalore: ["Bangalore", "Bengaluru"],
  bengaluru: ["Bangalore", "Bengaluru"],
};

const VEHICLE_TYPES = new Set<VehicleType>(Object.values(VehicleType));

export async function GET(req: NextRequest) {
  const city = (req.nextUrl.searchParams.get("city") ?? "").trim();
  const pincode = (req.nextUrl.searchParams.get("pincode") ?? "").trim();
  const vehicleTypeParam = (req.nextUrl.searchParams.get("vehicleType") ?? "").trim();

  const requestedPage = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const requestedLimit = Number(req.nextUrl.searchParams.get("limit") ?? "20");
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(Math.floor(requestedLimit), 50) : 20;
  const skip = (page - 1) * limit;

  const cityLower = city.toLowerCase();
  const cityTargets = CITY_ALIASES[cityLower] ?? (city ? [city] : []);

  const where: Prisma.TrainerWhereInput = { status: "APPROVED" };

  if (cityTargets.length > 0) {
    where.OR = cityTargets.map((targetCity) => ({
      city: { equals: targetCity, mode: "insensitive" },
    }));
  }

  if (vehicleTypeParam) {
    const normalizedVehicleType = vehicleTypeParam.toUpperCase().replace(/-/g, "_") as VehicleType;
    if (VEHICLE_TYPES.has(normalizedVehicleType)) {
      where.vehicleTypes = { has: normalizedVehicleType };
    }
  }

  // Pincode search - show trainers whose serviceArea includes this pincode
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
        id: true,
        name: true,
        city: true,
        experience: true,
        rating: true,
        basePrice: true,
        packagesJson: true,
        adminNotes: true,
        languages: true,
        vehicleTypes: true,
        serviceArea: true,
        pincode: true,
      },
    }),
    prisma.trainer.count({ where }),
  ]);

  return NextResponse.json({
    trainers,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
