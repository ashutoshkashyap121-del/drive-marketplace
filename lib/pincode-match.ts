import { prisma } from "@/lib/prisma";

export type VehicleType = "CAR" | "BIKE" | "BIKE_GEARED" | "BIKE_NON_GEARED";

export interface MatchOptions {
  pincode: string;
  vehicleType: VehicleType;
  maxResults?: number;
}

export async function findTrainersByPincode({
  pincode,
  vehicleType,
  maxResults = 20,
}: MatchOptions) {
  const trainers = await prisma.trainer.findMany({
    where: {
      status: "APPROVED",        // ✅ was: isApproved (doesn't exist)
                                 // ✅ removed: isActive (doesn't exist)
      serviceArea: { has: pincode },
      vehicleTypes: { has: vehicleType },
    },
    select: {
      id: true,
      name: true,
      photoUrl: true,
      bio: true,
      city: true,
      pincode: true,
      vehicleTypes: true,
      basePrice: true,           // ✅ was: pricePerHour
      experience: true,          // ✅ was: yearsExp
      languages: true,
      rating: true,
                                 // ✅ removed: totalReviews (doesn't exist)
    },
    orderBy: [{ rating: "desc" }, { basePrice: "asc" }], // ✅ was: pricePerHour
    take: maxResults,
  });

  return trainers.sort((a, b) => {
    const aExact = a.pincode === pincode ? 1 : 0;
    const bExact = b.pincode === pincode ? 1 : 0;
    if (bExact !== aExact) return bExact - aExact;
    if (b.rating !== a.rating) return (b.rating ?? 0) - (a.rating ?? 0); // ✅ null-safe
    return (a.basePrice ?? 0) - (b.basePrice ?? 0); // ✅ was: pricePerHour, null-safe
  });
}

export async function validatePincode(pincode: string): Promise<{
  valid: boolean;
  district?: string;
  state?: string;
  postOffices?: string[];
}> {
  if (!/^\d{6}$/.test(pincode)) return { valid: false };

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      next: { revalidate: 86400 },
    });
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
    // silently fail
  }
  return { valid: false };
}

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  CAR: "Car",
  BIKE: "Bike (Any)",
  BIKE_GEARED: "Bike (Geared)",
  BIKE_NON_GEARED: "Bike (Non-Geared / Scooter)",
};