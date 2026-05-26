import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

interface Props {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return Object.keys(CITY_META).map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const meta = CITY_META[city?.toLowerCase()];
  if (!meta) return { title: "Not Found" };

  const title       = `Driving School Fees in ${meta.display} 2026 — Compare All Prices | LearnDrive`;
  const description = `Exact driving school fees in ${meta.display}. Compare DL package prices, LL training costs and per-class rates at verified schools in ${meta.display}, ${meta.state}. Starting from ₹3,500. No advance payment needed.`;

  return {
    title,
    description,
    keywords: `driving school fees ${meta.display}, driving school charges ${meta.display}, DL package price ${meta.display}, driving class cost ${meta.display}, driving licence fees ${meta.display} 2026`,
    alternates: { canonical: `https://learndrive.in/driving-school-fees-in-${city}` },
    openGraph: { title, description, url: `https://learndrive.in/driving-school-fees-in-${city}`, siteName: "LearnDrive", locale: "en_IN", type: "website" },
    robots: { index: true, follow: true },
  };
}

export default async function FeesPage({ params }: Props) {
  const { city } = await params;
  const citySlug  = (city ?? "").toLowerCase();
  const meta      = CITY_META[citySlug];
  if (!meta) notFound();

  const trainers = await prisma.trainer.findMany({
    where:   { city: { equals: meta.display, mode: "insensitive" }, status: "APPROVED" },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    select:  { id: true, name: true, rating: true, basePrice: true, packagesJson: true, adminNotes: true, experience: true },
  });

  // Parse package data
  const schoolsWithPrices = trainers.map((t) => {
    let packages: any[] = [];
    let isUnverified = false;
    let photoUrl = "";
    try {
      packages = JSON.parse(t.packagesJson ?? "[]");
      const m  = JSON.parse(t.adminNotes ?? "{}");
      isUnverified = m.isUnverified ?? false;
      photoUrl     = m.photoUrl ?? "";
    } catch {}
    const lowestPrice  = packages.length > 0 ? Math.min(...packages.map((p: any) => p.price)) : (t.basePrice ?? 5500);
    const highestPrice = packages.length > 0 ? Math.max(...packages.map((p: any) => p.price)) : lowestPrice;
    return { ...t, packages, lowestPrice, highestPrice, isUnverified, photoUrl };
  });

  const avgPrice   = schoolsWithPrices.length > 0
    ? Math.round(schoolsWithPrices.reduce((s, t) => s + t.lowestPrice, 0) / schoolsWithPrices.length)
    : 5500;
  const minPrice   = schoolsWithPrices.length > 0 ? Math.min(...schoolsWithPrices.map(t => t.lowestPrice)) : 5500;
  const maxPrice   = schoolsWithPrices.length > 0 ? Math.max(...schoolsWithPrices.map(t => t.lowestPrice)) : 8000;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    "name":     `Driving School Fees in ${meta.display}`,
    "url":      `https://learndrive.in/driving-school-fees-in-${citySlug}`,
    "numberOfItems": trainers.length,
    "itemListElement": schoolsWithPrices.map((t, i) => ({
      "@type": "ListItem", "position": i + 1,
      "item": {
        "@type": "DrivingSchool", "name": t.name,
        "url":   `https://learndrive.in/trainers/${t.id}`,
        "priceRange": `₹${t.lowestPrice.toLocaleString("en-IN")}`,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

        <nav style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ textDecoration: "none", fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
              Learn<span style={{ color: "#F59E0B" }}>Drive</span>
            </Link>
            <Link href={`/driving-schools-in-${citySlug}`} style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>
              All Schools in {meta.display} →
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "40px 24px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 12 }}>
              <Link href="/" style={{ color: "#F59E0B", textDecoration: "none" }}>LearnDrive</Link>
              {" › "}
              <Link href={`/driving-schools-in-${citySlug}`} style={{ color: "#F59E0B", textDecoration: "none" }}>
                Schools in {meta.display}
              </Link>
              {" › Fees"}
            </p>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.5rem,4vw,2rem)", fontWeight: 800, color: "#fff", marginBottom: 10 }}>
              Driving School Fees in {meta.display} — 2026
            </h1>
            <p style={{ color: "#94A3B8", fontSize: 15 }}>
              Compare DL package prices at {trainers.length} verified driving schools in {meta.display}, {meta.state}.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>

          {/* Summary stats */}
          {schoolsWithPrices.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12, marginBottom: 28 }}>
              {[
                { label: "Average DL price",  value: `₹${avgPrice.toLocaleString("en-IN")}` },
                { label: "Lowest price",       value: `₹${minPrice.toLocaleString("en-IN")}` },
                { label: "Highest price",      value: `₹${maxPrice.toLocaleString("en-IN")}` },
                { label: "Schools listed",     value: `${trainers.length}` },
              ].map((s) => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "16px 20px" }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#F59E0B" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Comparison table */}
          {schoolsWithPrices.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🚗</div>
              <h2 style={{ fontFamily: "'Sora',sans-serif", color: "#1a1a2e", marginBottom: 8 }}>Coming Soon to {meta.display}</h2>
              <p style={{ color: "#666", fontSize: 14 }}>We're onboarding driving schools in {meta.display}.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", background: "#0B1437", padding: "14px 20px", gap: 8 }}>
                  {["Driving School", "Rating", "Experience", "DL Package", "Book"].map((h) => (
                    <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 }}>{h}</div>
                  ))}
                </div>
                {schoolsWithPrices.map((t, i) => (
                  <div key={t.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "16px 20px", gap: 8, borderBottom: i < schoolsWithPrices.length - 1 ? "1px solid #F1F5F9" : "none", alignItems: "center", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 14 }}>{t.name}</div>
                      {t.isUnverified && (
                        <span style={{ fontSize: 10, background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 100, padding: "1px 7px", color: "#C2410C" }}>
                          ⏳ Pending verification
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: t.rating ? "#0F172A" : "#94A3B8", fontWeight: t.rating ? 600 : 400 }}>
                      {t.rating ? `⭐ ${t.rating.toFixed(1)}` : "—"}
                    </div>
                    <div style={{ fontSize: 13, color: "#475569" }}>{t.experience}+ yrs</div>
                    <div>
                      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 800, color: "#F59E0B" }}>
                        ₹{t.lowestPrice.toLocaleString("en-IN")}
                      </div>
                      {t.highestPrice > t.lowestPrice && (
                        <div style={{ fontSize: 10, color: "#94A3B8" }}>up to ₹{t.highestPrice.toLocaleString("en-IN")}</div>
                      )}
                    </div>
                    <Link href={`/trainers/${t.id}`} style={{ background: "#F59E0B", color: "#0F172A", textDecoration: "none", padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontSize: 12, display: "inline-block" }}>
                      Book →
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* SEO content */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px 32px", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, color: "#0F172A", marginBottom: 16 }}>
              Driving School Fees in {meta.display} — What to Expect
            </h2>
            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.9, marginBottom: 12 }}>
              The cost of a driving licence package in {meta.display}, {meta.state} typically ranges from ₹4,500 to ₹8,000 depending on the school, location and duration of training. Most schools offer a standard DL package covering 20-30 days of training with 45-minute sessions.
            </p>
            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.9, marginBottom: 12 }}>
              On LearnDrive, all listed schools show their exact fees upfront with no hidden charges. The price you see includes the platform fee — you pay once and the school handles your complete training.
            </p>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, color: "#0F172A", marginBottom: 10, marginTop: 16 }}>
              What's typically included in a DL package in {meta.display}:
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Daily driving practice sessions (30-45 minutes per day)",
                "City road and highway driving experience",
                "RTO test preparation and practice",
                "Guidance on required documents for DL application",
                "Pickup from your home or office (most schools)",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: 10, fontSize: 14, color: "#475569" }}>
                  <span style={{ color: "#16A34A", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Other cities */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 15, color: "#555", marginBottom: 12 }}>Driving School Fees in Other Cities</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(CITY_META).filter(([slug]) => slug !== citySlug).slice(0, 12).map(([slug, m]) => (
                <Link key={slug} href={`/driving-school-fees-in-${slug}`}
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