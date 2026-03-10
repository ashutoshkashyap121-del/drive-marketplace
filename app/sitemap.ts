import { MetadataRoute } from "next";

const BASE = "https://learndrive.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: `${BASE}/`, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE}/trainers`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${BASE}/trainers/register`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/rto-test`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE}/rto-test/practice`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE}/rto-test/mock`, priority: 0.7, changeFrequency: "weekly" as const },
    { url: `${BASE}/blog`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${BASE}/rto-finder`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/dl-expiry`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/privacy`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE}/terms`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE}/help`, priority: 0.5, changeFrequency: "monthly" as const },
  ];

  const cities = [
    "delhi", "mumbai", "bangalore", "hyderabad", "chennai", "kolkata", "pune",
    "jaipur", "surat", "lucknow", "nagpur", "indore", "bhopal", "patna",
    "vadodara", "ghaziabad", "agra", "nashik", "faridabad", "meerut",
    "rajkot", "varanasi", "amritsar", "ranchi", "coimbatore", "chandigarh",
    "dehradun", "kochi", "noida", "gurugram",
  ];

  const cityPages = cities.map((city) => ({
    url: `${BASE}/trainers?city=${city}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));

  return [
    ...staticPages,
    ...cityPages,
  ].map((page) => ({
    ...page,
    lastModified: new Date(),
  }));
}