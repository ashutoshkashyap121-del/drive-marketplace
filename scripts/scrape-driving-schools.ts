/**
 * LearnDrive — PAN India Driving School Scraper
 * Uses Google Places API (key already in GOOGLE_PLACES_API_KEY env var)
 *
 * Run: npx ts-node scripts/scrape-driving-schools.ts --city="Delhi NCR"
 * Or scrape all cities: npx ts-node scripts/scrape-driving-schools.ts --all
 */

import { PrismaClient } from "@prisma/client";
import * as https from "https";

const prisma = new PrismaClient();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const PLATFORM_MARKUP = 500; // ₹500 added to every scraped package

// ─── Cities to scrape ────────────────────────────────────────────────────────
const CITIES = [
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Surat", lat: 21.1702, lng: 72.8311 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { name: "Indore", lat: 22.7196, lng: 75.8577 },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { name: "Patna", lat: 25.5941, lng: 85.1376 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
  { name: "Noida", lat: 28.5355, lng: 77.391 },
  { name: "Gurgaon", lat: 28.4595, lng: 77.0266 },
  { name: "Faridabad", lat: 28.4089, lng: 77.3178 },
  { name: "Vadodara", lat: 22.3072, lng: 73.1812 },
  { name: "Rajkot", lat: 22.3039, lng: 70.8022 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Guess a rough package price from rating + review count
// Since GMB rarely shows prices, we build a sensible default
function estimatePackagePrice(rating: number, reviewCount: number): number {
  let base = 4000;
  if (rating >= 4.5) base = 5000;
  else if (rating >= 4.0) base = 4500;
  else if (rating < 3.5) base = 3500;
  // Add platform markup
  return base + PLATFORM_MARKUP;
}

function buildPackagesJson(price: number, schoolName: string) {
  return JSON.stringify([
    {
      id: "pkg_dl",
      name: "DL Package",
      price: price,
      days: 21,
      sessionLength: "45 min/day",
      distancePerDay: "5 km",
      includes: `Driving lessons in city traffic, Highway driving practice, RTO road test preparation, Learning Licence assistance`,
      vehicleModels: "Car (Manual)",
      hasVariants: false,
    },
    {
      id: "pkg_ll_dl",
      name: "LL + DL Package",
      price: Math.round(price * 1.25),
      days: 28,
      sessionLength: "45 min/day",
      distancePerDay: "5 km",
      includes: `Learning Licence application, Driving lessons, RTO test preparation, All paperwork assistance`,
      vehicleModels: "Car (Manual)",
      hasVariants: false,
    },
  ]);
}

// ─── Fetch places from Google ─────────────────────────────────────────────────

async function searchDrivingSchools(city: { name: string; lat: number; lng: number }) {
  const results: any[] = [];
  const radius = 15000; // 15km
  const query = `driving school near ${city.name} India`;
  const baseUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json`;

  let url = `${baseUrl}?query=${encodeURIComponent(query)}&location=${city.lat},${city.lng}&radius=${radius}&key=${GOOGLE_PLACES_API_KEY}`;

  console.log(`\n📍 Scraping ${city.name}...`);

  while (url) {
    const data = await fetchJson(url);

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error(`  ❌ API error for ${city.name}: ${data.status} — ${data.error_message ?? ""}`);
      break;
    }

    for (const place of (data.results ?? [])) {
      results.push(place);
    }

    // Handle pagination
    if (data.next_page_token) {
      await sleep(2000); // Google requires delay before next_page_token works
      url = `${baseUrl}?pagetoken=${data.next_page_token}&key=${GOOGLE_PLACES_API_KEY}`;
    } else {
      url = "";
    }
  }

  console.log(`  ✅ Found ${results.length} places`);
  return results;
}

async function getPlaceDetails(placeId: string): Promise<any> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,rating,user_ratings_total,photos,formatted_address,opening_hours&key=${GOOGLE_PLACES_API_KEY}`;
  const data = await fetchJson(url);
  return data.result ?? {};
}

// ─── Save to DB ───────────────────────────────────────────────────────────────

async function saveScrapedTrainer(place: any, details: any, city: string) {
  const rating = details.rating ?? place.rating ?? 4.0;
  const reviewCount = details.user_ratings_total ?? place.user_ratings_total ?? 0;
  const phone = details.formatted_phone_number?.replace(/\D/g, "") ?? "";
  const address = details.formatted_address ?? place.formatted_address ?? "";
  const website = details.website ?? null;
  const name = details.name ?? place.name;

  // Skip if already exists (by name + city)
  const existing = await prisma.trainer.findFirst({
    where: { name, city },
  });
  if (existing) {
    console.log(`  ⏩ Skip (already exists): ${name}`);
    return;
  }

  const estimatedPrice = estimatePackagePrice(rating, reviewCount);
  const packagesJson = buildPackagesJson(estimatedPrice, name);

  // Photo reference → URL
  const photoRef = place.photos?.[0]?.photo_reference ?? details.photos?.[0]?.photo_reference;
  const photoUrl = photoRef
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_PLACES_API_KEY}`
    : null;

  try {
    await prisma.trainer.create({
      data: {
        name,
        city,
        phone: phone || "0000000000",
        trainerType: "DRIVING_SCHOOL",
        vehicleTypes: ["CAR"],
        languages: ["Hindi", "English"],
        yearsExperience: 5,
        rating: rating,
        packagesJson,
        basePrice: estimatedPrice,
        status: "PENDING", // admin must approve before going live
        // Extra scraped metadata stored in adminNotes
        adminNotes: JSON.stringify({
          source: "scraped_gmb",
          placeId: place.place_id,
          address,
          website,
          reviewCount,
          photoUrl,
          scrapedAt: new Date().toISOString(),
          isUnverified: true, // flag — school hasn't registered themselves
        }),
        serviceArea: [],
        homeArea: city,
      },
    });
    console.log(`  💾 Saved: ${name} (${city}) — ₹${estimatedPrice}`);
  } catch (err: any) {
    console.error(`  ❌ DB error for ${name}: ${err.message}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function scrapeCity(city: { name: string; lat: number; lng: number }) {
  const places = await searchDrivingSchools(city);

  for (const place of places) {
    try {
      const details = await getPlaceDetails(place.place_id);
      await saveScrapedTrainer(place, details, city.name);
      await sleep(300); // be polite to the API
    } catch (err: any) {
      console.error(`  ❌ Error processing ${place.name}: ${err.message}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const cityFlag = args.find((a) => a.startsWith("--city="))?.split("=")[1];
  const allFlag = args.includes("--all");

  if (!GOOGLE_PLACES_API_KEY) {
    console.error("❌ GOOGLE_PLACES_API_KEY not set in environment");
    process.exit(1);
  }

  if (allFlag) {
    console.log(`🚀 Scraping all ${CITIES.length} cities PAN India...`);
    for (const city of CITIES) {
      await scrapeCity(city);
    }
  } else if (cityFlag) {
    const city = CITIES.find((c) => c.name.toLowerCase() === cityFlag.toLowerCase());
    if (!city) {
      console.error(`❌ City "${cityFlag}" not found. Available: ${CITIES.map((c) => c.name).join(", ")}`);
      process.exit(1);
    }
    await scrapeCity(city);
  } else {
    console.log("Usage:");
    console.log("  npx ts-node scripts/scrape-driving-schools.ts --city=Mumbai");
    console.log("  npx ts-node scripts/scrape-driving-schools.ts --all");
  }

  await prisma.$disconnect();
  console.log("\n✅ Done! Go to /admin/scraped-listings to review and approve.");
}

main().catch(console.error);