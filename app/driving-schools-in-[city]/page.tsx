import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

const CITY_META: Record<string, { display: string; state: string }> = {
  "delhi":         { display: "Delhi",        state: "Delhi" },
  "mumbai":        { display: "Mumbai",        state: "Maharashtra" },
  "bangalore":     { display: "Bangalore",     state: "Karnataka" },
  "hyderabad":     { display: "Hyderabad",     state: "Telangana" },
  "chennai":       { display: "Chennai",       state: "Tamil Nadu" },
  "pune":          { display: "Pune",          state: "Maharashtra" },
  "kolkata":       { display: "Kolkata",       state: "West Bengal" },
  "jaipur":        { display: "Jaipur",        state: "Rajasthan" },
  "ahmedabad":     { display: "Ahmedabad",     state: "Gujarat" },
  "surat":         { display: "Surat",         state: "Gujarat" },
  "lucknow":       { display: "Lucknow",       state: "Uttar Pradesh" },
  "chandigarh":    { display: "Chandigarh",    state: "Punjab" },
  "bhopal":        { display: "Bhopal",        state: "Madhya Pradesh" },
  "indore":        { display: "Indore",        state: "Madhya Pradesh" },
  "nagpur":        { display: "Nagpur",        state: "Maharashtra" },
  "patna":         { display: "Patna",         state: "Bihar" },
  "coimbatore":    { display: "Coimbatore",    state: "Tamil Nadu" },
  "kochi":         { display: "Kochi",         state: "Kerala" },
  "visakhapatnam": { display: "Visakhapatnam", state: "Andhra Pradesh" },
  "noida":         { display: "Noida",         state: "Uttar Pradesh" },
  "gurgaon":       { display: "Gurgaon",       state: "Haryana" },
  "vadodara":      { display: "Vadodara",      state: "Gujarat" },
  "rajkot":        { display: "Rajkot",        state: "Gujarat" },
  "faridabad":     { display: "Faridabad",     state: "Haryana" },
};

export function generateStaticParams() {
  return Object.keys(CITY_META).map((city) => ({ city }));
}

interface Props {
  params: { city: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const citySlug = (params.city ?? "").toLowerCase();
  const meta = CITY_META[citySlug];
  if (!meta) return { title: "Not Found" };

  const title       = `Best Driving Schools in ${meta.display} — Book Online | LearnDrive`;
  const description = `Find and book the best driving schools in ${meta.display}, ${meta.state}. Compare prices, ratings and reviews. Starting from ₹5,500.`;

  return {
    title,
    description,
    keywords: [
      `driving school in ${meta.display}`,
      `driving classes ${meta.display}`,
      `learn driving ${meta.display}`,
      `driving licence ${meta.display}`,
      `motor training school ${meta.display}`,
    ].join(", "),
    openGraph: {
      title,
      description,
      url:      `https://learndrive.in/driving-schools-in-${citySlug}`,
      siteName: "LearnDrive",
      locale:   "en_IN",
      type:     "website",
    },
    alternates: { canonical: `https://learndrive.in/driving-schools-in-${citySlug}` },
    robots: { index: true, follow: true },
  };
}

export default async function CityLandingPage({ params }: Props) {
  const citySlug = (params.city ?? "").toLowerCase();
  const meta = CITY_META[citySlug];

  if (!meta) notFound();

  const trainers = await prisma.trainer.findMany({
    where: { city: { equals: meta.display, mode: "insensitive" }, status: "APPROVED" },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    select: {
      id: true, name: true, city: true, experience: true, rating: true,
      basePrice: true, packagesJson: true, adminNotes: true, languages: true,
    },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    "name":     `Driving Schools in ${meta.display}`,
    "url":      `https://learndrive.in/driving-schools-in-${citySlug}`,
    "numberOfItems": trainers.length,
    "itemListElement": trainers.map((t, i) => ({
      "@type": "ListItem", "position": i + 1,
      "item": {
        "@type": "DrivingSchool", "name": t.name,
        "url":   `https://learndrive.in/trainers/${t.id}`,
        "address": { "@type": "PostalAddress", "addressLocality": t.city, "addressCountry": "IN" },
        ...(t.rating ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": t.rating.toFixed(1), "bestRating": "5" } } : {}),
      },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",                                       "item": "https://learndrive.in" },
      { "@type": "ListItem", "position": 2, "name": `Driving Schools in ${meta.display}`, "item": `https://learndrive.in/driving-schools-in-${citySlug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

        {/* Nav */}
        <nav style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ textDecoration: "none", fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
              Learn<span style={{ color: "#F59E0B" }}>Drive</span>
            </Link>
            <Link href="/trainers/register" style={{ background: "#F59E0B", color: "#0F172A", textDecoration: "none", padding: "9px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13 }}>
              List Your School Free →
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ background: "#1a1a2e", color: "white", padding: "48px 24px 40px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 16 }}>
              <Link href="/" style={{ color: "#F59E0B", textDecoration: "none" }}>LearnDrive</Link> › Driving Schools in {meta.display}
            </p>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, margin: "0 0 12px" }}>
              Best Driving Schools in {meta.display}
            </h1>
            <p style={{ color: "#94A3B8", fontSize: 15, margin: 0 }}>
              {trainers.length > 0
                ? `${trainers.length} verified driving school${trainers.length > 1 ? "s" : ""} in ${meta.display}, ${meta.state}. Compare prices and book instantly.`
                : `Browse driving schools in ${meta.display}, ${meta.state}.`}
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>

          {/* Trainer cards */}
          {trainers.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🚗</div>
              <h2 style={{ fontFamily: "'Sora', sans-serif", color: "#1a1a2e", marginBottom: 8 }}>Coming Soon to {meta.display}</h2>
              <p style={{ color: "#666", fontSize: 14 }}>We're onboarding driving schools in {meta.display}. Check back soon!</p>
              <Link href="/trainers" style={{ display: "inline-block", marginTop: 16, background: "#F59E0B", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                Browse All Cities →
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {trainers.map((trainer) => {
                let startingPrice = trainer.basePrice ?? 5500;
                let photoUrl = "";
                let isUnverified = false;
                try {
                  const pkgs = JSON.parse(trainer.packagesJson ?? "[]");
                  if (pkgs.length > 0) startingPrice = pkgs[0].price;
                  const m = JSON.parse(trainer.adminNotes ?? "{}");
                  photoUrl     = m.photoUrl    ?? "";
                  isUnverified = m.isUnverified ?? false;
                } catch {}

                return (
                  <div key={trainer.id} style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "20px 24px", display: "flex", gap: 16 }}>
                    {photoUrl
                      ? <img src={photoUrl} alt={trainer.name} style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                      : <div style={{ width: 64, height: 64, borderRadius: 12, background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🚗</div>
                    }
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 4px" }}>{trainer.name}</h2>
                          <div style={{ fontSize: 12, color: "#666" }}>
                            📍 {trainer.city} · 🎓 {trainer.experience}+ yrs {trainer.rating ? `· ⭐ ${trainer.rating.toFixed(1)}` : ""}
                          </div>
                          {isUnverified && (
                            <span style={{ display: "inline-block", marginTop: 4, fontSize: 11, background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 100, padding: "2px 8px", color: "#C2410C" }}>
                              ⏳ Pending verification
                            </span>
                          )}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>₹{startingPrice.toLocaleString("en-IN")}</div>
                          <div style={{ fontSize: 11, color: "#aaa" }}>DL Package</div>
                        </div>
                      </div>
                      <Link href={`/trainers/${trainer.id}`}
                        style={{ display: "inline-block", marginTop: 12, background: "#F59E0B", color: "white", padding: "9px 18px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                        View & Book →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SEO text */}
          <div style={{ marginTop: 40, background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px 32px" }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, color: "#0F172A", marginBottom: 12 }}>
              How to Get a Driving Licence in {meta.display}
            </h2>
            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.9, marginBottom: 12 }}>
              Getting a driving licence in {meta.display}, {meta.state} involves obtaining a Learning Licence (LL) from your local RTO, followed by a Driving Licence (DL) test after 30 days of practice.
              The average cost of a DL package in {meta.display} ranges from ₹4,500 to ₹7,000. On LearnDrive, all listed schools offer transparent pricing with no hidden charges.
            </p>
            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.9 }}>
              LearnDrive lists verified driving schools in {meta.display} with ratings from Google. Compare schools, check fees, and book your first session online in under 2 minutes.
            </p>
          </div>

          {/* Other cities */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, color: "#555", marginBottom: 12 }}>Driving Schools in Other Cities</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(CITY_META).filter(([slug]) => slug !== citySlug).slice(0, 12).map(([slug, m]) => (
                <Link key={slug} href={`/driving-schools-in-${slug}`}
                  style={{ fontSize: 13, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 100, padding: "6px 14px", textDecoration: "none", color: "#475569" }}>
                  {m.display}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}