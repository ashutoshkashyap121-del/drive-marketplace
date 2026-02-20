// lib/pincode-match.ts
// Pincode-based trainer-to-learner matching utility

import { prisma } from "@/lib/prisma";

export type VehicleType = "CAR" | "BIKE" | "BIKE_GEARED" | "BIKE_NON_GEARED";

export interface MatchOptions {
  pincode: string;
  vehicleType: VehicleType;
  maxResults?: number;
}

/**
 * Find approved trainers who service a given pincode for a given vehicle type.
 * Trainers are sorted by:
 *   1. Whether their home pincode exactly matches (primary preference)
 *   2. Rating (descending)
 *   3. Price (ascending as tiebreaker)
 */
export async function findTrainersByPincode({
  pincode,
  vehicleType,
  maxResults = 20,
}: MatchOptions) {
  const trainers = await prisma.trainer.findMany({
    where: {
      isApproved: true,
      isActive: true,
      serviceArea: {
        has: pincode,
      },
      vehicleTypes: {
        has: vehicleType,
      },
    },
    select: {
      id: true,
      name: true,
      photoUrl: true,
      bio: true,
      city: true,
      pincode: true,
      vehicleTypes: true,
      pricePerHour: true,
      yearsExp: true,
      languages: true,
      rating: true,
      totalReviews: true,
    },
    orderBy: [{ rating: "desc" }, { pricePerHour: "asc" }],
    take: maxResults,
  });

  // Boost trainers whose home pincode matches exactly
  return trainers.sort((a, b) => {
    const aExact = a.pincode === pincode ? 1 : 0;
    const bExact = b.pincode === pincode ? 1 : 0;
    if (bExact !== aExact) return bExact - aExact;
    if (b.rating !== a.rating) return b.rating - a.rating;
    return a.pricePerHour - b.pricePerHour;
  });
}

/**
 * Validate an Indian pincode via the India Post API (free, no auth needed).
 * Returns { valid, district, state } or { valid: false }
 */
export async function validatePincode(pincode: string): Promise<{
  valid: boolean;
  district?: string;
  state?: string;
  postOffices?: string[];
}> {
  if (!/^\d{6}$/.test(pincode)) return { valid: false };

  try {
    const res = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`,
      { next: { revalidate: 86400 } } // cache for 24h
    );
    const data = await res.json();
    if (data[0]?.Status === "Success") {
      const po = data[0].PostOffice[0];
      return {
        valid: true,
        district: po.District,
        state: po.State,
        postOffices: data[0].PostOffice.map((p: any) => p.Name),
      };
    }
  } catch {
    // silently fail — don't block the UX on a 3rd party service
  }
  return { valid: false };
}

/**
 * Normalised vehicle type labels for display
 */
export const VEHICLE_LABELS: Record<VehicleType, string> = {
  CAR: "Car",
  BIKE: "Bike (Any)",
  BIKE_GEARED: "Bike (Geared)",
  BIKE_NON_GEARED: "Bike (Non-Geared / Scooter)",
};