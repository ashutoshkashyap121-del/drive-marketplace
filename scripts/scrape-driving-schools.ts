/**
 * LearnDrive — PAN India Driving School Scraper
 * Uses Google Places API (New) — Text Search
 *
 * Run: npx tsx scripts/scrape-driving-schools.ts --city=Mumbai
 * Or:  npx tsx scripts/scrape-driving-schools.ts --all
 */

import { PrismaClient } from "@prisma/client";
import * as https from "https";
import { buildServiceArea, getBasePincode } from "@/lib/scraped-service-area";

const prisma = new PrismaClient();
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
// Price logic: flat ₹5500 base + 10% platform fee = ₹6050 total shown to customer
const BASE_PRICE    = 5500;
const PLATFORM_FEE_PCT = 0.10;

// ─── Cities ───────────────────────────────────────────────────────────────────

const CITIES = [
  { name: "Delhi",         lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai",        lat: 19.0760, lng: 72.8777 },
  { name: "Bangalore",     lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad",     lat: 17.3850, lng: 78.4867 },
  { name: "Chennai",       lat: 13.0827, lng: 80.2707 },
  { name: "Pune",          lat: 18.5204, lng: 73.8567 },
  { name: "Kolkata",       lat: 22.5726, lng: 88.3639 },
  { name: "Jaipur",        lat: 26.9124, lng: 75.7873 },
  { name: "Ahmedabad",     lat: 23.0225, lng: 72.5714 },
  { name: "Surat",         lat: 21.1702, lng: 72.8311 },
  { name: "Lucknow",       lat: 26.8467, lng: 80.9462 },
  { name: "Chandigarh",    lat: 30.7333, lng: 76.7794 },
  { name: "Bhopal",        lat: 23.2599, lng: 77.4126 },
  { name: "Indore",        lat: 22.7196, lng: 75.8577 },
  { name: "Nagpur",        lat: 21.1458, lng: 79.0882 },
  { name: "Patna",         lat: 25.5941, lng: 85.1376 },
  { name: "Coimbatore",    lat: 11.0168, lng: 76.9558 },
  { name: "Kochi",         lat:  9.9312, lng: 76.2673 },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
  { name: "Noida",         lat: 28.5355, lng: 77.3910 },
  { name: "Gurgaon",       lat: 28.4595, lng: 77.0266 },
  { name: "Vadodara",      lat: 22.3072, lng: 73.1812 },
  { name: "Rajkot",        lat: 22.3039, lng: 70.8022 },
  { name: "Faridabad",     lat: 28.4089, lng: 77.3178 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function postJson(url: string, body: object, headers: Record<string, string>): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
        ...headers,
      },
    };

    const req = https.request(options, (res) => {
      let result = "";
      res.on("data", (chunk) => (result += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(result)); }
        catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function estimatePackagePrice(): number {
  // Always flat ₹5500 base for all scraped listings
  return BASE_PRICE;
}

function buildPackagesJson(basePrice: number) {
  const platformFee = Math.round(basePrice * PLATFORM_FEE_PCT);
  const totalPrice  = basePrice + platformFee;
  return JSON.stringify([
    {
      id:           "pkg_dl",
      name:         "DL Package",
      price:        totalPrice,   // what customer pays (base + 10% fee)
      basePrice,                  // trainer payout
      platformFee,                // platform cut
      includes:     "Driving lessons in city & highway traffic, RTO road test preparation",
      hasVariants:  false,
    },
  ]);
}

// ─── Places API (New) — Text Search ──────────────────────────────────────────

async function searchDrivingSchools(city: { name: string; lat: number; lng: number }) {
  console.log(`\n📍 Scraping ${city.name}...`);

  const results: any[] = [];
  let nextPageToken: string | undefined;

  do {
    const body: any = {
      textQuery: `driving school in ${city.name} India`,
      locationBias: {
        circle: {
          center: { latitude: city.lat, longitude: city.lng },
          radius: 15000.0,
        },
      },
      maxResultCount: 20,
    };

    if (nextPageToken) body.pageToken = nextPageToken;

    const data = await postJson(
      "https://places.googleapis.com/v1/places:searchText",
      body,
      {
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        // Request only the fields we need — reduces cost
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.photos,nextPageToken",
      }
    );

    if (data.error) {
      console.error(`  ❌ API error: ${data.error.message}`);
      break;
    }

    for (const place of (data.places ?? [])) results.push(place);
    nextPageToken = data.nextPageToken;

    if (nextPageToken) await sleep(2000);

  } while (nextPageToken);

  console.log(`  ✅ Found ${results.length} places`);
  return results;
}

// ─── Save to DB ───────────────────────────────────────────────────────────────

async function saveScrapedTrainer(place: any, city: string) {
  const rating      = place.rating ?? 4.0;
  const reviewCount = place.userRatingCount ?? 0;
  const name        = place.displayName?.text ?? place.displayName ?? "Unknown School";
  const address     = place.formattedAddress ?? "";
  const website     = place.websiteUri ?? null;

  // Phone: strip country code to get 10-digit mobile
  const rawPhone = (place.nationalPhoneNumber ?? "").replace(/\D/g, "");
  const mobile   = rawPhone.length >= 10 ? rawPhone.slice(-10) : "0000000000";

  // Skip duplicates
  const existing = await prisma.trainer.findFirst({ where: { name, city } });
  if (existing) {
    console.log(`  ⏩ Skip (exists): ${name}`);
    return;
  }

  const estimatedPrice = estimatePackagePrice();

  // Photo URL from Places API (New)
  const photoName = place.photos?.[0]?.name;
  const photoUrl  = photoName
    ? `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${GOOGLE_PLACES_API_KEY}`
    : null;
  const adminMeta = {
    source: "scraped_gmb",
    placeId: place.id,
    address,
    website,
    reviewCount,
    photoUrl,
    scrapedAt: new Date().toISOString(),
    isUnverified: true,
  };
  const basePincode = getBasePincode({
    pincode: null,
    adminNotes: JSON.stringify(adminMeta),
  });
  const serviceArea = basePincode
    ? buildServiceArea({ city, basePincode })
    : [];

  try {
    await prisma.trainer.create({
      data: {
        name,
        city,
        mobile,
        trainerType:   "DRIVING_SCHOOL",
        vehicleTypes:  ["CAR"],
        languages:     ["Hindi", "English"],
        experience:    5,
        licenseNumber: "SCRAPED",
        rating,
        packagesJson:  buildPackagesJson(estimatedPrice),
        basePrice:     estimatedPrice,
        status:        "PENDING",
        pincode:       basePincode,
        serviceArea,
        adminNotes:    JSON.stringify(adminMeta),
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
      await saveScrapedTrainer(place, city.name);
      await sleep(200);
    } catch (err: any) {
      console.error(`  ❌ Error processing place: ${err.message}`);
    }
  }
}

async function main() {
  const args     = process.argv.slice(2);
  const cityFlag = args.find((a) => a.startsWith("--city="))?.split("=")[1];
  const allFlag  = args.includes("--all");

  if (!GOOGLE_PLACES_API_KEY) {
    console.error("❌ GOOGLE_PLACES_API_KEY not set in .env.local");
    process.exit(1);
  }

  if (allFlag) {
    console.log(`🚀 Scraping all ${CITIES.length} cities PAN India...`);
    for (const city of CITIES) await scrapeCity(city);
  } else if (cityFlag) {
    const city = CITIES.find((c) => c.name.toLowerCase() === cityFlag.toLowerCase());
    if (!city) {
      console.error(`❌ City not found. Options: ${CITIES.map((c) => c.name).join(", ")}`);
      process.exit(1);
    }
    await scrapeCity(city);
  } else {
    console.log("Usage:");
    console.log("  npx tsx scripts/scrape-driving-schools.ts --city=Mumbai");
    console.log("  npx tsx scripts/scrape-driving-schools.ts --all");
  }

  await prisma.$disconnect();
  console.log("\n✅ Done! Go to /admin/scraped-listings to review.");
}

main().catch(console.error);
