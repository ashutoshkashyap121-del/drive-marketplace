import { NextRequest, NextResponse } from "next/server";
import { buildTrainerWhereInput, searchTrainers } from "@/lib/trainer-search";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const city = (searchParams.get("city") ?? "").trim();
  const vehicle = (searchParams.get("vehicle") ?? "").trim();
  const pincode = (searchParams.get("pincode") ?? "").trim();

  if (!city || !vehicle) {
    return NextResponse.json({ error: "city and vehicle are required" }, { status: 400 });
  }

  try {
    const trainers = await searchTrainers({
      where: buildTrainerWhereInput({
        city,
        pincode,
        vehicleGroup: vehicle,
      }),
      take: 20,
    });

    return NextResponse.json(trainers);
  } catch (error) {
    console.error("Trainer search error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
