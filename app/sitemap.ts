import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { blogPosts } from "@/lib/blog-data";

const BASE = "https://learndrive.in";

const CITY_SLUGS = [
  "delhi","mumbai","bangalore","hyderabad","chennai","pune","kolkata","jaipur","ahmedabad","surat",
  "lucknow","chandigarh","bhopal","indore","nagpur","patna","coimbatore","kochi","visakhapatnam",
  "noida","gurgaon","vadodara","rajkot","faridabad",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                           priority: 1.0, changeFrequency: "weekly",  lastModified: now },
    { url: `${BASE}/trainers`,                   priority: 0.9, changeFrequency: "daily",   lastModified: now },
    { url: `${BASE}/trainers/register`,          priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/rto-test`,                   priority: 0.8, changeFrequency: "weekly",  lastModified: now },
    { url: `${BASE}/rto-test/practice`,          priority: 0.8, changeFrequency: "weekly",  lastModified: now },
    { url: `${BASE}/rto-test/mock`,              priority: 0.7, changeFrequency: "weekly",  lastModified: now },
    { url: `${BASE}/blog`,                       priority: 0.9, changeFrequency: "daily",   lastModified: now },
    { url: `${BASE}/rto-finder`,                 priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/dl-expiry`,                  priority: 0.7, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/dl-assistance`,              priority: 0.9, changeFrequency: "monthly", lastModified: now },
    // ── New LLM SEO landing pages ──
    { url: `${BASE}/list-your-driving-school`,   priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/how-it-works-for-trainers`,  priority: 0.9, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/hire-a-driver`,              priority: 0.9, changeFrequency: "monthly", lastModified: now },
    // ── Utility ──
    { url: `${BASE}/about`,                      priority: 0.4, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/careers`,                    priority: 0.4, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/contact`,                    priority: 0.4, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/refund`,                     priority: 0.3, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/track-refund`,               priority: 0.3, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/remove-listing`,             priority: 0.3, changeFrequency: "monthly", lastModified: now },
    { url: `${BASE}/privacy`,                    priority: 0.3, changeFrequency: "yearly",  lastModified: now },
    { url: `${BASE}/terms`,                      priority: 0.3, changeFrequency: "yearly",  lastModified: now },
    { url: `${BASE}/help`,                       priority: 0.5, changeFrequency: "monthly", lastModified: now },
  ];

  // ── City landing pages ────────────────────────────────────────────────────
  const cityPages: MetadataRoute.Sitemap = CITY_SLUGS.map((city) => ({
    url:             `${BASE}/driving-schools-in-${city}`,
    priority:        0.9,
    changeFrequency: "daily" as const,
    lastModified:    now,
  }));

  // ── Blog pages ────────────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url:             `${BASE}/blog/${post.slug}`,
    priority:        0.8,
    changeFrequency: "monthly" as const,
    lastModified:    now,
  }));

  // ── Trainer pages — live from DB ──────────────────────────────────────────
  let trainerPages: MetadataRoute.Sitemap = [];
  try {
    const trainers = await prisma.trainer.findMany({
      where:   { status: "APPROVED" },
      select:  { id: true },
      orderBy: { createdAt: "desc" },
    });
    trainerPages = trainers.map((t) => ({
      url:             `${BASE}/trainers/${t.id}`,
      priority:        0.85,
      changeFrequency: "weekly" as const,
      lastModified:    now,
    }));
  } catch (e) {
    console.error("[sitemap] Failed to fetch trainers:", e);
  }

  return [...staticPages, ...cityPages, ...blogPages, ...trainerPages];
}
