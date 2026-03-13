/**
 * One-time fix: updates all scraped listings in DB to new pricing
 * ₹5,500 base + 10% platform fee = ₹6,050 total, only "DL Package"
 *
 * Run: npx tsx scripts/fix-scraped-prices.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BASE_PRICE       = 5500;
const PLATFORM_FEE_PCT = 0.10;
const platformFee      = Math.round(BASE_PRICE * PLATFORM_FEE_PCT); // 550
const totalPrice       = BASE_PRICE + platformFee;                   // 6050

const newPackagesJson = JSON.stringify([
  {
    id:          "pkg_dl",
    name:        "DL Package",
    price:       totalPrice,
    basePrice:   BASE_PRICE,
    platformFee,
    includes:    "Driving lessons in city & highway traffic, RTO road test preparation",
    hasVariants: false,
  },
]);

async function main() {
  // Find all scraped listings
  const scraped = await prisma.trainer.findMany({
    where: { adminNotes: { contains: "scraped_gmb" } },
    select: { id: true, name: true, city: true, packagesJson: true, basePrice: true },
  });

  console.log(`Found ${scraped.length} scraped listings to update...\n`);

  let updated = 0;
  for (const trainer of scraped) {
    await prisma.trainer.update({
      where: { id: trainer.id },
      data: {
        basePrice:    BASE_PRICE,
        packagesJson: newPackagesJson,
      },
    });
    console.log(`✅ Updated: ${trainer.name} (${trainer.city})`);
    updated++;
  }

  console.log(`\n✅ Done — updated ${updated} listings to ₹${totalPrice} (₹${BASE_PRICE} + ₹${platformFee} fee)`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});