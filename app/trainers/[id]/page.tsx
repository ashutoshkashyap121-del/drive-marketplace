import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TrainerProfileClient from "./TrainerProfileClient";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trainer = await prisma.trainer.findUnique({
    where: { id: Number(params.id) },
    select: { name: true, city: true, vehicleTypes: true, basePrice: true, bio: true },
  });

  if (!trainer) return { title: "Trainer Not Found" };

  const vehicles = trainer.vehicleTypes.join(" & ");

  return {
    title: `${trainer.name} — ${vehicles} Trainer in ${trainer.city}`,
    description:
      trainer.bio?.slice(0, 155) ||
      `Book ${trainer.name} for ${vehicles} driving lessons in ${trainer.city}. RTO verified. ₹${trainer.basePrice}/session.`,
    openGraph: {
      title: `${trainer.name} — Driving Trainer in ${trainer.city}`,
      description: `Book ${trainer.name} for ${vehicles} lessons in ${trainer.city}. ₹${trainer.basePrice}/session.`,
    },
  };
}

export default async function TrainerProfilePage({ params }: Props) {
  const trainer = await prisma.trainer.findUnique({
    where: { id: Number(params.id), status: "APPROVED" },
    include: {
      vehicles: true,
    },
  });

  if (!trainer) notFound();

  // Serialize for client component
  const trainerData = {
    id: trainer.id,
    name: trainer.name,
    mobile: trainer.mobile,
    city: trainer.city,
    bio: trainer.bio,
    experience: trainer.experience,
    vehicleTypes: trainer.vehicleTypes as string[],
    languages: trainer.languages,
    basePrice: trainer.basePrice,
    rating: trainer.rating,
    trainerType: trainer.trainerType,
    vehicles: trainer.vehicles.map((v) => ({
      type: v.type,
      vehicleNumber: v.vehicleNumber,
      vehicleYear: v.vehicleYear,
      dualControl: v.dualControl,
      insured: v.insured,
      insuranceValidUntil: v.insuranceValidUntil?.toISOString() ?? null,
    })),
  };

  return <TrainerProfileClient trainer={trainerData} />;
}