/**
 * Fix scraped school pricing - rating-based with Rs 5,500 minimum + 10% fee
 *
 * Rating logic:
 * >= 4.5 -> Rs 6,500 base -> Rs 7,150 total
 * >= 4.0 -> Rs 6,000 base -> Rs 6,600 total
 * >= 3.5 -> Rs 5,500 base -> Rs 6,050 total
 * < 3.5 -> Rs 5,500 base -> Rs 6,050 total (minimum)
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

function buildPackagesJson(basePrice: number): string {
  const platformFee = Math.round(basePrice * PLATFORM_FEE_PCT);
  const totalPrice = basePrice + platformFee;

  return JSON.stringify([
    {
      id: "pkg_dl",
      name: "DL Package",
      price: totalPrice,
      basePrice,
      platformFee,
      includes: "Driving lessons in city & highway traffic, RTO road test preparation",
      hasVariants: false,
    },
  ]);
}

async function main() {
  const scraped = await prisma.trainer.findMany({
    where: { adminNotes: { contains: "scraped_gmb" } },
    select: { id: true, name: true, city: true, rating: true },
  });

  console.log(`Found ${scraped.length} scraped listings...\n`);

  let updated = 0;
  for (const trainer of scraped) {
    const basePrice = getBasePrice(trainer.rating);
    const platformFee = Math.round(basePrice * PLATFORM_FEE_PCT);
    const totalPrice = basePrice + platformFee;
    const packagesJson = buildPackagesJson(basePrice);

    await prisma.trainer.update({
      where: { id: trainer.id },
      data: { basePrice, packagesJson },
    });

    console.log(
      `Updated: ${trainer.name} (${trainer.city}) | Rating: ${trainer.rating ?? "N/A"} -> Rs ${basePrice} + Rs ${platformFee} fee = Rs ${totalPrice}`,
    );
    updated++;
  }

  console.log(`\nDone - updated ${updated} listings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
