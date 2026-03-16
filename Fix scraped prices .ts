/**
 * Fix scraped school pricing — rating-based with ₹5,500 minimum + 10% fee
 * 
 * Rating logic:
 * ≥ 4.5 → ₹6,500 base → ₹7,150 total
 * ≥ 4.0 → ₹6,000 base → ₹6,600 total
 * ≥ 3.5 → ₹5,500 base → ₹6,050 total
 * < 3.5 → ₹5,500 base → ₹6,050 total (minimum)
 * 
 * Run: npx tsx scripts/fix-scraped-prices.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PLATFORM_FEE_PCT = 0.10;

function getBasePrice(rating: number | null): number {
  if (!rating || rating < 3.5) return 5500;
  if (rating >= 4.5) return 6500;
  if (rating >= 4.0) return 6000;
  return 5500; // 3.5 to 3.99
}

function buildPackagesJson(basePrice: number) {
  const platformFee = Math.round(basePrice * PLATFORM_FEE_PCT);
  const totalPrice  = basePrice + platformFee;
  return JSON.stringify([{
    id:          "pkg_dl",
    name:        "DL Package",
    price:       totalPrice,
    basePrice,
    platformFee,
    includes:    "Driving lessons in city & highway traffic, RTO road test preparation",
    hasVariants: false,
  }]);
}

async function main() {
  const scraped = await prisma.trainer.findMany({
    where:  { adminNotes: { contains: "scraped_gmb" } },
    select: { id: true, name: true, city: true, rating: true },
  });

  console.log(`Found ${scraped.length} scraped listings...\n`);

  let updated = 0;
  for (const trainer of scraped) {
    const basePrice    = getBasePrice(trainer.rating);
    const platformFee  = Math.round(basePrice * PLATFORM_FEE_PCT);
    const totalPrice   = basePrice + platformFee;
    const packagesJson = buildPackagesJson(basePrice);

    await prisma.trainer.update({
      where: { id: trainer.id },
      data:  { basePrice, packagesJson },
    });

    console.log(`✅ ${trainer.name} (${trainer.city}) — Rating: ${trainer.rating ?? "N/A"} → ₹${basePrice} + ₹${platformFee} fee = ₹${totalPrice}`);
    updated++;
  }

  console.log(`\n✅ Done — updated ${updated} listings`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });