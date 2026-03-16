// app/trainers/[id]/page.tsx
// SERVER component — SEO metadata + JSON-LD only
// UI is handled by TrainerPageClient.tsx (your existing file, zero changes)

import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import TrainerPageClient from "./TrainerPageClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const trainer = await prisma.trainer.findUnique({
    where: { id: Number(id) },
    select: {
      name: true, city: true, experience: true,
      rating: true, basePrice: true, adminNotes: true, packagesJson: true,
    },
  });

  if (!trainer) return { title: "Trainer Not Found | LearnDrive" };

  let locality = "";
  try {
    const meta = JSON.parse(trainer.adminNotes ?? "{}");
    if (meta.address) {
      const parts = meta.address.split(",");
      locality = parts.length >= 2 ? parts[1].trim() : "";
    }
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
    keywords: [
      trainer.name,
      `${trainer.name} fees`,
      `${trainer.name} reviews`,
      `${trainer.name} booking`,
      `${trainer.name} ${trainer.city}`,
      `driving school in ${trainer.city}`,
      `driving classes ${locationStr}`,
      `learn driving ${trainer.city}`,
      `motor training school ${trainer.city}`,
    ].join(", "),
    openGraph: {
      title,
      description,
      url:      `https://learndrive.in/trainers/${id}`,
      siteName: "LearnDrive",
      locale:   "en_IN",
      type:     "website",
    },
    alternates: { canonical: `https://learndrive.in/trainers/${id}` },
    robots: { index: true, follow: true },
  };
}

export default async function TrainerPage({ params }: Props) {
  const { id } = await params;

  const trainer = await prisma.trainer.findUnique({
    where: { id: Number(id) },
    select: {
      id: true, name: true, city: true, experience: true,
      rating: true, basePrice: true, packagesJson: true,
      adminNotes: true, mobile: true, pincode: true,
    },
  });

  let jsonLd = null;

  if (trainer) {
    let address = "", website = "", photoUrl = "";
    try {
      const meta = JSON.parse(trainer.adminNotes ?? "{}");
      address  = meta.address  ?? "";
      website  = meta.website  ?? "";
      photoUrl = meta.photoUrl ?? "";
    } catch {}

    let startingPrice = trainer.basePrice ?? 5500;
    try {
      const pkgs = JSON.parse(trainer.packagesJson ?? "[]");
      if (pkgs.length > 0) startingPrice = pkgs[0].price;
    } catch {}

    jsonLd = {
      "@context":  "https://schema.org",
      "@type":     "DrivingSchool",
      "name":      trainer.name,
      "url":       `https://learndrive.in/trainers/${trainer.id}`,
      "telephone": trainer.mobile,
      ...(website  ? { "sameAs": website }  : {}),
      ...(photoUrl ? { "image":  photoUrl } : {}),
      "address": {
        "@type":           "PostalAddress",
        "streetAddress":   address,
        "addressLocality": trainer.city,
        "addressCountry":  "IN",
        ...(trainer.pincode ? { "postalCode": trainer.pincode } : {}),
      },
      "priceRange": `₹${startingPrice.toLocaleString("en-IN")}`,
      ...(trainer.rating && trainer.rating > 0 ? {
        "aggregateRating": {
          "@type":       "AggregateRating",
          "ratingValue": trainer.rating.toFixed(1),
          "reviewCount": "10",
          "bestRating":  "5",
          "worstRating": "1",
        },
      } : {}),
      "openingHoursSpecification": {
        "@type":     "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "07:00", "closes": "20:00",
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name":  "Driving Packages",
        "itemListElement": [{
          "@type":         "Offer",
          "name":          "DL Package",
          "price":         startingPrice,
          "priceCurrency": "INR",
          "availability":  "https://schema.org/InStock",
          "url":           `https://learndrive.in/trainers/${trainer.id}`,
        }],
      },
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <TrainerPageClient />
    </>
  );
}