import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

// All supported cities
const CITY_META: Record<string, { display: string; state: string; description: string }> = {
  "delhi":         { display: "Delhi",         state: "Delhi",             description: "Delhi NCR's top driving schools" },
  "mumbai":        { display: "Mumbai",         state: "Maharashtra",       description: "Mumbai's best motor training schools" },
  "bangalore":     { display: "Bangalore",      state: "Karnataka",         description: "Bangalore's top driving institutes" },
  "hyderabad":     { display: "Hyderabad",      state: "Telangana",         description: "Hyderabad's best driving schools" },
  "chennai":       { display: "Chennai",        state: "Tamil Nadu",        description: "Chennai's top driving academies" },
  "pune":          { display: "Pune",           state: "Maharashtra",       description: "Pune's best motor training schools" },
  "kolkata":       { display: "Kolkata",        state: "West Bengal",       description: "Kolkata's top driving institutes" },
  "jaipur":        { display: "Jaipur",         state: "Rajasthan",         description: "Jaipur's best driving schools" },
  "ahmedabad":     { display: "Ahmedabad",      state: "Gujarat",           description: "Ahmedabad's top driving schools" },
  "surat":         { display: "Surat",          state: "Gujarat",           description: "Surat's best driving institutes" },
  "lucknow":       { display: "Lucknow",        state: "Uttar Pradesh",     description: "Lucknow's top driving schools" },
  "chandigarh":    { display: "Chandigarh",     state: "Punjab",            description: "Chandigarh's best driving schools" },
  "bhopal":        { display: "Bhopal",         state: "Madhya Pradesh",    description: "Bhopal's top motor training schools" },
  "indore":        { display: "Indore",         state: "Madhya Pradesh",    description: "Indore's best driving institutes" },
  "nagpur":        { display: "Nagpur",         state: "Maharashtra",       description: "Nagpur's top driving schools" },
  "patna":         { display: "Patna",          state: "Bihar",             description: "Patna's best driving schools" },
  "coimbatore":    { display: "Coimbatore",     state: "Tamil Nadu",        description: "Coimbatore's top driving schools" },
  "kochi":         { display: "Kochi",          state: "Kerala",            description: "Kochi's best driving institutes" },
  "visakhapatnam": { display: "Visakhapatnam",  state: "Andhra Pradesh",    description: "Vizag's top driving schools" },
  "noida":         { display: "Noida",          state: "Uttar Pradesh",     description: "Noida's best driving schools" },
  "gurgaon":       { display: "Gurgaon",        state: "Haryana",           description: "Gurgaon's top driving institutes" },
  "vadodara":      { display: "Vadodara",        state: "Gujarat",           description: "Vadodara's best driving schools" },
  "rajkot":        { display: "Rajkot",          state: "Gujarat",           description: "Rajkot's top driving schools" },
  "faridabad":     { display: "Faridabad",       state: "Haryana",           description: "Faridabad's best driving schools" },
};

interface Props {
  params: { city: string };
}

export async function generateStaticParams() {
  return Object.keys(CITY_META).map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = CITY_META[params.city.toLowerCase()];
  if (!meta) return { title: "Not Found" };

  const title       = `Best Driving Schools in ${meta.display} — Book Online | LearnDrive`;
  const description = `Find and book the best driving schools in ${meta.display}, ${meta.state}. Compare prices, ratings and reviews. Get your driving licence with certified instructors. Starting from ₹5,500.`;

  return {
    title,
    description,
    keywords: [
      `driving school in ${meta.display}`,
      `driving classes in ${meta.display}`,
      `learn driving ${meta.display}`,
      `driving licence ${meta.display}`,
      `best driving school ${meta.display}`,
      `motor training school ${meta.display}`,
      `driving instructor ${meta.display}`,
      `RTO test ${meta.display}`,
      `DL training ${meta.display}`,
      `${meta.display} driving school fees`,
    ].join(", "),
    openGraph: {
      title,
      description,
      url:      `https://learndrive.in/driving-schools-in-${params.city}`,
      siteName: "LearnDrive",
      locale:   "en_IN",
      type:     "website",
    },
    alternates: {
      canonical: `https://learndrive.in/driving-schools-in-${params.city}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CityLandingPage({ params }: Props) {
  const citySlug = params.city.toLowerCase();
  const meta     = CITY_META[citySlug];
  if (!meta) notFound();

  // Fetch approved trainers in this city
  const trainers = await prisma.trainer.findMany({
    where: {
      city:   { equals: meta.display, mode: "insensitive" },
      status: "APPROVED",
    },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    select: {
      id:           true,
      name:         true,
      city:         true,
      experience:   true,
      rating:       true,
      basePrice:    true,
      packagesJson: true,
      adminNotes:   true,
      languages:    true,
      vehicleTypes: true,
    },
  });

  // JSON-LD for the city page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    "name":     `Driving Schools in ${meta.display}`,
    "url":      `https://learndrive.in/driving-schools-in-${citySlug}`,
    "numberOfItems": trainers.length,
    "itemListElement": trainers.map((t, i) => ({
      "@type":    "ListItem",
      "position": i + 1,
      "item": {
        "@type":    "DrivingSchool",
        "name":     t.name,
        "url":      `https://learndrive.in/trainers/${t.id}`,
        "address": {
          "@type":           "PostalAddress",
          "addressLocality": t.city,
          "addressCountry":  "IN",
        },
        ...(t.rating ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": t.rating.toFixed(1), "bestRating": "5" } } : {}),
      },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type":    "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",                        "item": "https://learndrive.in" },
      { "@type": "ListItem", "position": 2, "name": `Driving Schools in ${meta.display}`, "item": `https://learndrive.in/driving-schools-in-${citySlug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

        {/* Hero */}
        <div style={{ background: "#1a1a2e", color: "white", padding: "48px 24px 40px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            {/* Breadcrumb */}
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 16 }}>
              <Link href="/" style={{ color: "#F59E0B", textDecoration: "none" }}>LearnDrive</Link>
              {" › "}
              <span>Driving Schools in {meta.display}</span>
            </p>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, margin: "0 0 12px" }}>
              Best Driving Schools in {meta.display}
            </h1>
            <p style={{ color: "#94A3B8", fontSize: 15, margin: 0, lineHeight: 1.7 }}>
              {trainers.length > 0
                ? `${trainers.length} verified driving school${trainers.length > 1 ? "s" : ""} in ${meta.display}, ${meta.state}. Compare prices, check ratings and book instantly online.`
                : `Browse and book driving schools in ${meta.display}, ${meta.state}. Get your driving licence with certified instructors.`}
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>

          {/* Stats bar */}
          {trainers.length > 0 && (
            <div style={{ display: "flex", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
              {[
                { label: "Schools listed",      value: trainers.length },
                { label: "Avg. rating",          value: (trainers.reduce((s, t) => s + (t.rating ?? 0), 0) / trainers.length).toFixed(1) + " ★" },
                { label: "Starting price",       value: "₹5,500" },
                { label: "Booking confirmation", value: "< 2 hrs" },
              ].map((s) => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "14px 20px", minWidth: 130 }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Trainer cards */}
          {trainers.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🚗</div>
              <h2 style={{ fontFamily: "'Sora', sans-serif", color: "#1a1a2e", marginBottom: 8 }}>Coming Soon to {meta.display}</h2>
              <p style={{ color: "#666", fontSize: 14 }}>We're onboarding driving schools in {meta.display}. Check back soon!</p>
              <Link href="/" style={{ display: "inline-block", marginTop: 16, background: "#F59E0B", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                Browse Other Cities →
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {trainers.map((trainer) => {
                let startingPrice = trainer.basePrice ?? 5500;
                let pkgName       = "DL Package";
                let isUnverified  = false;
                let photoUrl      = "";
                try {
                  const pkgs = JSON.parse(trainer.packagesJson ?? "[]");
                  if (pkgs.length > 0) { startingPrice = pkgs[0].price; pkgName = pkgs[0].name; }
                  const meta2 = JSON.parse(trainer.adminNotes ?? "{}");
                  isUnverified = meta2.isUnverified ?? false;
                  photoUrl     = meta2.photoUrl ?? "";
                } catch {}

                return (
                  <div key={trainer.id} style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>

                    {/* Photo */}
                    {photoUrl ? (
                      <img src={photoUrl} alt={trainer.name} style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 64, height: 64, borderRadius: 12, background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🚗</div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                        <div>
                          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 4px" }}>
                            {trainer.name}
                          </h2>
                          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#666", flexWrap: "wrap" }}>
                            <span>📍 {trainer.city}</span>
                            <span>🎓 {trainer.experience}+ yrs experience</span>
                            {trainer.rating ? <span>⭐ {trainer.rating.toFixed(1)}</span> : null}
                          </div>
                          {isUnverified && (
                            <span style={{ display: "inline-block", marginTop: 6, fontSize: 11, background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 100, padding: "2px 8px", color: "#C2410C", fontWeight: 600 }}>
                              ⏳ Listing pending verification
                            </span>
                          )}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>
                            ₹{startingPrice.toLocaleString("en-IN")}
                          </div>
                          <div style={{ fontSize: 11, color: "#aaa" }}>{pkgName}</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                        {trainer.languages?.slice(0, 4).map((l) => (
                          <span key={l} style={{ fontSize: 11, background: "#F1F5F9", color: "#475569", borderRadius: 100, padding: "3px 10px", border: "1px solid #E2E8F0" }}>{l}</span>
                        ))}
                      </div>

                      <Link href={`/trainers/${trainer.id}`}
                        style={{ display: "inline-block", marginTop: 14, background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "white", padding: "10px 20px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                        View & Book →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SEO text block — helps Google understand the page */}
          <div style={{ marginTop: 48, background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px 32px" }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, color: "#0F172A", marginBottom: 12 }}>
              How to Get a Driving Licence in {meta.display}
            </h2>
            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.9, marginBottom: 12 }}>
              Getting a driving licence in {meta.display}, {meta.state} involves two steps — first obtaining a Learning Licence (LL) from your local RTO, followed by a Driving Licence (DL) test after 30 days of practice. Most driving schools in {meta.display} offer combined LL+DL packages to handle the entire process.
            </p>
            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.9, marginBottom: 12 }}>
              The average cost of a DL package at a driving school in {meta.display} ranges from ₹4,500 to ₹7,000 depending on the area, vehicle type (manual or automatic), and duration of training. On LearnDrive, all listed schools offer transparent pricing with no hidden charges.
            </p>
            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.9 }}>
              LearnDrive lists the best motor training schools in {meta.display} with verified ratings from Google. You can compare schools, check fees, and book your first session online in under 2 minutes.
            </p>
          </div>

          {/* Links to other cities */}
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, color: "#555", marginBottom: 14 }}>Driving Schools in Other Cities</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(CITY_META)
                .filter(([slug]) => slug !== citySlug)
                .slice(0, 12)
                .map(([slug, m]) => (
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