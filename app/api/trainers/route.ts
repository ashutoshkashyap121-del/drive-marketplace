import { NextRequest, NextResponse } from "next/server";
import { buildTrainerWhereInput, getCityTargets, searchTrainers } from "@/lib/trainer-search";

function normalizeCityKey(city: string): string {
  const normalized = city.trim().toLowerCase();
  if (normalized === "gurugram") return "gurgaon";
  return normalized;
}

function nearestPincode(target: string, candidates: string[]): string | null {
  if (!/^\d{6}$/.test(target) || candidates.length === 0) return null;
  const targetNum = Number(target);
  let nearest = candidates[0];
  let bestDiff = Math.abs(Number(candidates[0]) - targetNum);
  for (const candidate of candidates.slice(1)) {
    const diff = Math.abs(Number(candidate) - targetNum);
    if (diff < bestDiff) {
      nearest = candidate;
      bestDiff = diff;
    }
  }
  return nearest;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const city = (searchParams.get("city") ?? "").trim();
  const vehicle = (searchParams.get("vehicle") ?? "").trim();
  const pincode = (searchParams.get("pincode") ?? "").trim();

  if (!city || !vehicle) {
    return NextResponse.json({ error: "city and vehicle are required" }, { status: 400 });
  }

  try {
    const baseWhere = buildTrainerWhereInput({
      city,
      vehicleGroup: vehicle,
    });

    const exactWhere = buildTrainerWhereInput({
      city,
      pincode,
      vehicleGroup: vehicle,
    });

    const exactTrainers = await searchTrainers({
      where: exactWhere,
      take: 20,
    });

    if (!pincode || exactTrainers.length > 0 || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json({
        trainers: exactTrainers,
        fallbackUsed: false,
      });
    }

    const cityTargets = getCityTargets(city).map(normalizeCityKey);
    const cityPool = await searchTrainers({
      where: baseWhere,
      take: 500,
    });

    const coveredPincodes = new Set<string>();
    for (const trainer of cityPool) {
      const trainerCity = normalizeCityKey(trainer.city);
      if (cityTargets.length > 0 && !cityTargets.includes(trainerCity)) continue;

      if (typeof trainer.pincode === "string" && /^\d{6}$/.test(trainer.pincode)) {
        coveredPincodes.add(trainer.pincode);
      }
      for (const code of trainer.serviceArea ?? []) {
        if (/^\d{6}$/.test(code)) coveredPincodes.add(code);
      }
    }

    const nearest = nearestPincode(pincode, [...coveredPincodes]);
    if (!nearest) {
      return NextResponse.json({
        trainers: [],
        fallbackUsed: false,
      });
    }

    const nearestWhere = buildTrainerWhereInput({
      city,
      pincode: nearest,
      vehicleGroup: vehicle,
    });
    const nearestTrainers = await searchTrainers({
      where: nearestWhere,
      take: 20,
    });

    return NextResponse.json({
      trainers: nearestTrainers,
      fallbackUsed: true,
      requestedPincode: pincode,
      fallbackPincode: nearest,
    });
  } catch (error) {
    console.error("Trainer search error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
