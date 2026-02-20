import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get("pincode")?.trim();
  const vehicle = searchParams.get("vehicle"); // optional filter

  if (!pincode || pincode.length < 6) {
    return NextResponse.json(
      { success: false, message: "Enter a valid 6-digit pincode" },
      { status: 400 }
    );
  }

  const trainers = await prisma.trainer.findMany({
    where: {
      status: "APPROVED",                          // only show approved trainers
      serviceArea: { has: pincode },               // Prisma array filter
      ...(vehicle ? { vehicleTypes: { has: vehicle as any } } : {}),
    },
    orderBy: { experience: "desc" },
    select: {
      id: true,
      name: true,
      city: true,
      bio: true,
      experience: true,
      vehicleTypes: true,
      languages: true,
      basePrice: true,
      trainerType: true,
      serviceArea: true,
    },
  });

  return NextResponse.json({ success: true, trainers });
}