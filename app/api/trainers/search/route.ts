import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildTrainerWhereInput, searchTrainers } from "@/lib/trainer-search";

export async function GET(req: NextRequest) {
  const city = (req.nextUrl.searchParams.get("city") ?? "").trim();
  const pincode = (req.nextUrl.searchParams.get("pincode") ?? "").trim();
  const vehicleTypeParam = (req.nextUrl.searchParams.get("vehicleType") ?? "").trim();

  const requestedPage = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const requestedLimit = Number(req.nextUrl.searchParams.get("limit") ?? "20");
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1;
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(Math.floor(requestedLimit), 50) : 20;
  const skip = (page - 1) * limit;

  const where = buildTrainerWhereInput({
    city,
    pincode,
    vehicleType: vehicleTypeParam,
  });

  const [trainers, total] = await Promise.all([
    searchTrainers({ where, skip, take: limit }),
    prisma.trainer.count({ where }),
  ]);

  return NextResponse.json({
    trainers,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}
