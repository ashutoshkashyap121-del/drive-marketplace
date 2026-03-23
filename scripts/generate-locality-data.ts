/**
 * Extracts locality names from scraped school addresses
 * and creates a JSON file of all localities with their trainer IDs
 *
 * Run: npx tsx scripts/generate-locality-data.ts
 * This generates: public/locality-data.json (used by locality pages)
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

function extractLocality(address: string, city: string): string | null {
  if (!address) return null;

  const parts = address.split(",").map((p) => p.trim());

  for (let i = 1; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!part) continue;
    if (/^\d{6}$/.test(part)) continue;
    if (/india/i.test(part)) continue;
    if (/delhi$|mumbai$|bangalore$|hyderabad$/i.test(part) && part.split(" ").length > 1) continue;
    if (part.toLowerCase() === city.toLowerCase()) continue;
    if (/^new delhi$/i.test(part)) continue;

    const cleaned = part
      .replace(/\d+/g, "")
      .replace(/[-\/]/g, " ")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (cleaned.length > 3 && cleaned.length < 40) return cleaned;
  }

  return null;
}

async function main() {
  const trainers = await prisma.trainer.findMany({
    where: { status: "APPROVED", adminNotes: { contains: "scraped_gmb" } },
    select: { id: true, name: true, city: true, adminNotes: true },
  });

  const localityMap: Record<string, { city: string; trainers: number[]; displayName: string }> = {};

  for (const trainer of trainers) {
    let address = "";
    try {
      const meta = JSON.parse(trainer.adminNotes ?? "{}");
      address = meta.address ?? "";
    } catch {}

    if (!address) continue;

    const slug = extractLocality(address, trainer.city);
    if (!slug) continue;

    const displayName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (!localityMap[slug]) {
      localityMap[slug] = { city: trainer.city, trainers: [], displayName };
    }
    localityMap[slug].trainers.push(trainer.id);
  }

  const validLocalities = Object.fromEntries(
    Object.entries(localityMap).filter(([, data]) => data.trainers.length >= 1)
  );

  const outputPath = path.join(process.cwd(), "public", "locality-data.json");
  fs.writeFileSync(outputPath, JSON.stringify(validLocalities, null, 2));

  console.log(`Saved ${Object.keys(validLocalities).length} localities to public/locality-data.json`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
