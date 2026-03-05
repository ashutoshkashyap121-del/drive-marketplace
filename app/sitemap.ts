import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://learndrive.in", changeFrequency: "weekly", priority: 1 },
    { url: "https://learndrive.in/trainers", changeFrequency: "daily", priority: 0.9 },
    { url: "https://learndrive.in/trainers/register", changeFrequency: "monthly", priority: 0.7 },
    { url: "https://learndrive.in/terms", changeFrequency: "monthly", priority: 0.3 },
    { url: "https://learndrive.in/privacy", changeFrequency: "monthly", priority: 0.3 },
  ];
}