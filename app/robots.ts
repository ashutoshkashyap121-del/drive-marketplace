import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/book/", "/success/", "/cancel/", "/track-refund/", "/review/"],
      },
    ],
    sitemap: "https://learndrive.in/sitemap.xml",
    host: "https://learndrive.in",
  };
}
