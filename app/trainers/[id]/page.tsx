// FILE 1: app/trainers/[id]/page.tsx  (SERVER — handles SEO only)
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import TrainerPageClient from "./TrainerPageClient";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trainer = await prisma.trainer.findUnique({
    where: { id: Number(params.id) },
    select: { name: true, city: true, experience: true, rating: true, basePrice: true, adminNotes: true, packagesJson: true },
  });
  if (!trainer) return { title: "Trainer Not Found | LearnDrive" };

  let locality = "";
  try {
    const meta = JSON.parse(trainer.adminNotes ?? "{}");
    if (meta.address) locality = meta.address.split(",")[1]?.trim() ?? "";
  } catch {}

  let startingPrice = trainer.basePrice ?? 5500;
  try {
    const pkgs = JSON.parse(trainer.packagesJson ?? "[]");
    if (pkgs.length > 0) startingPrice = pkgs[0].price;
  } catch {}

  const locationStr = locality ? `${locality}, ${trainer.city}` : trainer.city;
  const title       = `${trainer.name} — Driving Classes in ${trainer.city} | LearnDrive`;
  const description = `Book driving lessons with ${trainer.name} in ${locationStr}. ${trainer.experience}+ years experience. Starting ₹${startingPrice.toLocaleString("en-IN")}. ${trainer.rating && trainer.rating > 0 ? `Rated ${trainer.rating.toFixed(1)}★. ` : ""}Instant online booking on LearnDrive.`;

  return {
    title,
    description,
    keywords: [trainer.name, `${trainer.name} fees`, `${trainer.name} ${trainer.city}`, `driving school in ${trainer.city}`, `driving classes ${locationStr}`, `learn driving ${trainer.city}`, `motor training school ${trainer.city}`].join(", "),
    openGraph: { title, description, url: `https://learndrive.in/trainers/${params.id}`, siteName: "LearnDrive", locale: "en_IN", type: "website" },
    alternates: { canonical: `https://learndrive.in/trainers/${params.id}` },
    robots: { index: true, follow: true },
  };
}

export default function TrainerPage() {
  // TrainerPageClient is your existing page.tsx renamed — zero UI changes
  return <TrainerPageClient />;
}