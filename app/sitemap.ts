// app/sitemap.ts
// Async sitemap — fetches live trainer IDs from DB
// Submits to Google Search Console after deploy:
// https://learndrive.in/sitemap.xml

import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://learndrive.in";

// ─── All your existing blog slugs (kept exactly as-is) ───────────────────────
const BLOG_SLUGS = [
  "how-to-get-driving-licence-india",
  "best-driving-schools-bangalore",
  "rto-test-tips-tricks-pass-first-time",
  "learner-licence-documents-checklist",
  "car-vs-bike-licence-difference",
  "driving-tips-beginners-india",
  "how-to-choose-driving-trainer",
  "traffic-rules-india-every-driver-must-know",
  "automatic-vs-manual-car-india",
  "how-to-ride-motorcycle-beginners-india",
  "suv-driving-tips-india",
  "electric-vehicle-licence-india",
  "mcwg-vs-mcwog-licence-india",
  "how-to-book-rto-slot-online-india",
  "driving-licence-renewal-india-2025",
  "lost-driving-licence-duplicate-dl-india",
  "rto-documents-complete-checklist-2025",
  "international-driving-permit-india",
  "women-driving-guide-india",
  "best-time-place-learn-driving-women-india",
  "solo-road-trip-women-india-guide",
  "car-safety-features-women-india",
  "driving-in-delhi-guide-2025",
  "best-driving-schools-delhi-2025",
  "driving-in-mumbai-guide-2025",
  "best-driving-schools-mumbai-2025",
  "driving-in-pune-guide-2025",
  "driving-in-hyderabad-guide-2025",
  "best-driving-schools-jaipur",
  "best-driving-schools-surat",
  "best-driving-schools-nagpur",
  "best-driving-schools-lucknow",
  "best-driving-schools-kochi",
  "best-driving-schools-chandigarh",
  "best-driving-schools-indore",
  "best-driving-schools-coimbatore",
  "best-driving-schools-nashik",
  "best-driving-schools-vadodara",
  "best-driving-schools-dehradun",
  "best-driving-schools-mysuru",
  "best-driving-schools-bhopal",
  "best-driving-schools-ranchi",
  "best-driving-schools-visakhapatnam",
  "rto-guide-pune",
  "rto-guide-ahmedabad",
  "rto-guide-jaipur-rto",
  "rto-guide-surat-rto",
  "rto-guide-lucknow-rto",
  "rto-guide-kochi-rto",
  "rto-guide-chandigarh-rto",
  "rto-guide-indore-rto",
  "rto-guide-nagpur-rto",
  "rto-guide-coimbatore-rto",
  "renew-driving-licence-india",
  "apply-learner-licence-online",
  "change-address-driving-licence",
  "add-vehicle-class-driving-licence",
  "driving-licence-lost-duplicate",
  "how-to-pass-rto-driving-test",
  "how-to-read-road-signs-india",
  "highway-driving-tips-india",
  "night-driving-tips-india",
  "monsoon-driving-tips-india",
  "parallel-parking-tips",
  "driving-licence-international",
  "check-driving-licence-status",
  "vehicle-fitness-certificate-india",
  "rc-transfer-process-india",
  "maruti-vs-honda-learner-car",
  "manual-vs-automatic-licence",
  "online-vs-offline-driving-school",
  "bike-vs-car-licence-process",
  "private-vs-government-driving-school",
  "delhi-vs-mumbai-rto-process",
  "third-party-vs-comprehensive-insurance",
  "geared-vs-gearless-bike",
  "learner-licence-vs-permanent-licence",
  "diesel-vs-petrol-car-learning",
  "best-driving-schools-noida",
  "best-driving-schools-gurugram",
  "best-driving-schools-patna",
  "best-driving-schools-amritsar",
  "best-driving-schools-gwalior",
  "best-driving-schools-jodhpur",
  "best-driving-schools-madurai",
  "best-driving-schools-raipur",
  "best-driving-schools-guwahati",
  "best-driving-schools-aurangabad",
  "rto-guide-noida",
  "rto-guide-patna",
  "rto-guide-amritsar",
  "rto-guide-gwalior",
  "rto-guide-raipur",
  "defensive-driving-techniques",
  "distracted-driving-dangers",
  "road-rage-tips-india",
  "speed-limit-india-guide",
  "overtaking-rules-india",
  "seat-belt-law-india",
  "drunk-driving-law-india",
  "lane-driving-rules-india",
  "child-safety-car-india",
  "tyre-maintenance-tips",
  "car-breakdown-tips-india",
  "parking-rules-india",
  "fatigue-driving-tips",
  "ev-driving-tips-india",
  "fuel-efficient-driving",
  "car-insurance-guide-india",
  "car-insurance-claim-process",
  "two-wheeler-insurance-india",
  "car-insurance-renewal-tips",
  "no-claim-bonus-explained",
  "zero-depreciation-car-insurance",
  "cheapest-car-insurance-india",
  "car-insurance-new-drivers",
  "bike-vs-car-insurance-india",
  "vehicle-insurance-lapse-india",
  "driving-licence-status-sms-check",
  "rto-challan-check-online",
  "petrol-car-clutch-tips",
  "driving-test-documents-checklist",
  "best-time-to-drive-indian-cities",
  "roundabout-rules-india",
  "driving-licence-verification-online",
  "best-driving-schools-hyderabad",
  "best-driving-schools-kolkata",
  "rto-guide-hyderabad",
];

// ─── City slugs — NOW as dedicated landing pages (not query params) ───────────
// These match app/driving-schools-in-[city]/page.tsx
const CITY_SLUGS = [
  "delhi", "mumbai", "bangalore", "hyderabad", "chennai", "pune",
  "kolkata", "jaipur", "ahmedabad", "surat", "lucknow", "chandigarh",
  "bhopal", "indore", "nagpur", "patna", "coimbatore", "kochi",
  "visakhapatnam", "noida", "gurgaon", "vadodara", "rajkot", "faridabad",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                    priority: 1.0, changeFrequency: "weekly",  lastModified: now },
    { url: `${BASE}/trainers`,            priority: 0.9, changeFrequency: "daily",   lastModified: now },
    { url: `${BASE}/trainers/register`,   priority: 0.8, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/rto-test`,            priority: 0.8, changeFrequency: "weekly",  lastModified: now },
    { url: `${BASE}/rto-test/practice`,   priority: 0.8, changeFrequency: "weekly",  lastModified: now },
    { url: `${BASE}/rto-test/mock`,       priority: 0.7, changeFrequency: "weekly",  lastModified: now },
    { url: `${BASE}/blog`,                priority: 0.9, changeFrequency: "daily",   lastModified: now },
    { url: `${BASE}/rto-finder`,          priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/dl-expiry`,           priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/dl-assistance`,       priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/refund`,              priority: 0.3, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/remove-listing`,      priority: 0.3, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/privacy`,             priority: 0.3, changeFrequency: "yearly",  lastModified: now },
    { url: `${BASE}/terms`,               priority: 0.3, changeFrequency: "yearly",  lastModified: now },
    { url: `${BASE}/help`,                priority: 0.5, changeFrequency: "monthly", lastModified: now },
  ];

  // ── City landing pages — high priority, rank for generic searches ──────────
  // e.g. "driving school in Delhi" → learndrive.in/driving-schools-in-delhi
  const cityPages: MetadataRoute.Sitemap = CITY_SLUGS.map((city) => ({
    url:             `${BASE}/driving-schools-in-${city}`,
    priority:        0.9,
    changeFrequency: "daily" as const,
    lastModified:    now,
  }));

  // ── Blog pages ────────────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url:             `${BASE}/blog/${slug}`,
    priority:        0.8,
    changeFrequency: "monthly" as const,
    lastModified:    now,
  }));

  // ── Individual trainer pages — fetched live from DB ───────────────────────
  // This is the key one — every approved trainer gets their own sitemap entry
  let trainerPages: MetadataRoute.Sitemap = [];
  try {
    const trainers = await prisma.trainer.findMany({
      where:   { status: "APPROVED" },
      select: { id: true },
      orderBy: { createdAt: "desc" },
    });
    trainerPages = trainers.map((t) => ({
      url:             `${BASE}/trainers/${t.id}`,
      priority:        0.85,
      changeFrequency: "weekly" as const,
      lastModified: now,
    }));
  } catch (e) {
    console.error("[sitemap] Failed to fetch trainers:", e);
  }

  return [...staticPages, ...cityPages, ...blogPages, ...trainerPages];
}