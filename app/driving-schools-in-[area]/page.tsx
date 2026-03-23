import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

interface LocalityData {
  [slug: string]: { city: string; trainers: number[]; displayName: string };
}

function getLocalityData(): LocalityData {
  try {
    const filePath = path.join(process.cwd(), "public", "locality-data.json");
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return {};
  }
}

interface Props {
  params: Promise<{ area: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  const localities = getLocalityData();
  const data = localities[area];
  if (!data) return { title: "Not Found" };

  const title = `Driving Schools in ${data.displayName}, ${data.city} — Book Online | LearnDrive`;
  const description = `Find and book verified driving schools in ${data.displayName}, ${data.city}. Compare prices and ratings. Starting from ₹5,500.`;

  return {
    title,
    description,
    keywords: `driving school ${data.displayName}, driving classes ${data.displayName} ${data.city}, learn driving ${data.displayName}, driving school near ${data.displayName}`,
    alternates: { canonical: `https://learndrive.in/driving-schools-in-${area}` },
    openGraph: {
      title,
      description,
      url: `https://learndrive.in/driving-schools-in-${area}`,
      siteName: "LearnDrive",
      locale: "en_IN",
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocalityPage({ params }: Props) {
  const { area } = await params;
  const localities = getLocalityData();
  const localityData = localities[area];

  if (!localityData) notFound();

  const trainers = await prisma.trainer.findMany({
    where: { id: { in: localityData.trainers }, status: "APPROVED" },
    orderBy: [{ rating: "desc" }],
    select: { id: true, name: true, city: true, experience: true, rating: true, basePrice: true, packagesJson: true, adminNotes: true },
  });

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
            Learn<span style={{ color: "#F59E0B" }}>Drive</span>
          </Link>
          <Link href={`/driving-schools-in-${localityData.city.toLowerCase()}`} style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>
            All Schools in {localityData.city} →
          </Link>
        </div>
      </nav>

      <div style={{ background: "#1a1a2e", padding: "40px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 13, color: "#aaa", marginBottom: 12 }}>
            <Link href="/" style={{ color: "#F59E0B", textDecoration: "none" }}>LearnDrive</Link>
            {" › "}
            <Link href={`/driving-schools-in-${localityData.city.toLowerCase()}`} style={{ color: "#F59E0B", textDecoration: "none" }}>
              {localityData.city}
            </Link>
            {" › "}
            {localityData.displayName}
          </p>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.5rem,4vw,2rem)", fontWeight: 800, color: "#fff", marginBottom: 10 }}>
            Driving Schools in {localityData.displayName}, {localityData.city}
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 14 }}>
            {trainers.length} verified school{trainers.length !== 1 ? "s" : ""} near {localityData.displayName} · Compare prices and book instantly.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 24px" }}>
        {trainers.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "48px 24px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", color: "#1a1a2e", marginBottom: 8 }}>No schools found in {localityData.displayName}</h2>
            <Link href={`/driving-schools-in-${localityData.city.toLowerCase()}`}
              style={{ display: "inline-block", marginTop: 16, background: "#F59E0B", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
              See All Schools in {localityData.city} →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
            {trainers.map((trainer) => {
              let startingPrice = trainer.basePrice ?? 5500;
              let photoUrl = "";
              let isUnverified = false;
              try {
                const pkgs = JSON.parse(trainer.packagesJson ?? "[]");
                if (pkgs.length > 0) startingPrice = pkgs[0].price;
                const m = JSON.parse(trainer.adminNotes ?? "{}");
                photoUrl = m.photoUrl ?? "";
                isUnverified = m.isUnverified ?? false;
              } catch {}

              return (
                <div key={trainer.id} style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "20px 24px", display: "flex", gap: 16 }}>
                  {photoUrl ? (
                    <img src={photoUrl} alt={trainer.name} style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 64, height: 64, borderRadius: 12, background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 4px" }}>{trainer.name}</h2>
                        <div style={{ fontSize: 12, color: "#666" }}>
                          {localityData.displayName}, {trainer.city} · {trainer.experience}+ yrs {trainer.rating ? `· ⭐ ${trainer.rating.toFixed(1)}` : ""}
                        </div>
                        {isUnverified && (
                          <span style={{ display: "inline-block", marginTop: 4, fontSize: 11, background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 100, padding: "2px 8px", color: "#C2410C" }}>
                            ⏳ Pending verification
                          </span>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>₹{startingPrice.toLocaleString("en-IN")}</div>
                        <div style={{ fontSize: 11, color: "#aaa" }}>DL Package</div>
                      </div>
                    </div>
                    <Link href={`/trainers/${trainer.id}`} style={{ display: "inline-block", marginTop: 12, background: "#F59E0B", color: "white", padding: "9px 18px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                      View & Book →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px 28px", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, color: "#0F172A", marginBottom: 10 }}>Driving Schools Near {localityData.displayName}</h2>
          <p style={{ color: "#555", fontSize: 14, lineHeight: 1.9 }}>
            LearnDrive lists driving schools in {localityData.displayName} and nearby areas of {localityData.city}. Compare trainers, ratings, and packages with full transparency.
          </p>
        </div>
      </div>
    </main>
  );
}
