import { Prisma, TrainerStatus, VehicleType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const CITY_ALIASES: Record<string, string[]> = {
  "delhi ncr": ["Delhi", "Noida", "Gurgaon", "Gurugram", "Faridabad", "Ghaziabad"],
  delhi: ["Delhi"],
  ncr: ["Delhi", "Noida", "Gurgaon", "Gurugram", "Faridabad", "Ghaziabad"],
  mumbai: ["Mumbai", "Navi Mumbai", "Thane"],
  bangalore: ["Bangalore", "Bengaluru"],
  bengaluru: ["Bangalore", "Bengaluru"],
  gurgaon: ["Gurgaon", "Gurugram"],
  gurugram: ["Gurgaon", "Gurugram"],
};

const VEHICLE_TYPES = new Set<VehicleType>(Object.values(VehicleType));

function normalizeVehicleType(vehicleType: string): VehicleType | null {
  const normalized = vehicleType.toUpperCase().replace(/-/g, "_") as VehicleType;
  return VEHICLE_TYPES.has(normalized) ? normalized : null;
}

function getVehicleFilters(vehicleGroup: string): VehicleType[] {
  if (vehicleGroup === "CAR") return [VehicleType.CAR];
  if (vehicleGroup === "BIKE") return [VehicleType.BIKE_GEARED, VehicleType.BIKE_NON_GEARED];
  return [];
}

function getCityTargets(city: string): string[] {
  const normalizedCity = city.trim().toLowerCase();
  return CITY_ALIASES[normalizedCity] ?? (city.trim() ? [city.trim()] : []);
}

export function buildTrainerWhereInput({
  city,
  pincode,
  vehicleType,
  vehicleGroup,
}: {
  city?: string;
  pincode?: string;
  vehicleType?: string;
  vehicleGroup?: string;
}): Prisma.TrainerWhereInput {
  const where: Prisma.TrainerWhereInput = { status: TrainerStatus.APPROVED };
  const cityTargets = getCityTargets(city ?? "");

  if (cityTargets.length > 0) {
    where.OR = cityTargets.map((targetCity) => ({
      city: { equals: targetCity, mode: "insensitive" },
    }));
  }

  if (vehicleType?.trim()) {
    const normalizedVehicleType = normalizeVehicleType(vehicleType.trim());
    if (normalizedVehicleType) {
      where.vehicleTypes = { has: normalizedVehicleType };
    }
  } else if (vehicleGroup?.trim()) {
    const vehicleFilters = getVehicleFilters(vehicleGroup.trim().toUpperCase());
    if (vehicleFilters.length > 0) {
      where.vehicleTypes = { hasSome: vehicleFilters };
    }
  }

  if (pincode?.trim()) {
    where.serviceArea = { has: pincode.trim() };
  }

  return where;
}

export const trainerSearchSelect = {
  id: true,
  name: true,
  city: true,
  experience: true,
  trainerType: true,
  rating: true,
  basePrice: true,
  packagesJson: true,
  adminNotes: true,
  languages: true,
  vehicleTypes: true,
  serviceArea: true,
  pincode: true,
  verifiedSchool: true,
  vehicles: {
    select: {
      type: true,
      dualControl: true,
      insured: true,
    },
  },
} satisfies Prisma.TrainerSelect;

export async function searchTrainers({
  where,
  skip = 0,
  take = 20,
}: {
  where: Prisma.TrainerWhereInput;
  skip?: number;
  take?: number;
}) {
  return prisma.trainer.findMany({
    where,
    skip,
    take,
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    select: trainerSearchSelect,
  });
}
