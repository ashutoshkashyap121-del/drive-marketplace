"use client";
// app/trainers/[id]/page.tsx

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VehicleVariant {
  model: string;
  price: number;
  priceAC?: number;
}

interface TrainerPackage {
  id?: string;
  name: string;
  price: number;
  priceMax?: number;
  days?: number;
  sessionLength?: string;
  distancePerDay?: string;
  includes?: string | string[];
  trackFeePerVehicle?: number;
  acSurcharge?: number;
  vehicleModels?: string;
  variants?: VehicleVariant[];
}

interface Trainer {
  id: number;
  name: string;
  city: string;
  basePrice: number | null;
  price?: number | null;
  packagesJson?: string | null;
  experience: number;
  languages: string[];
  vehicleTypes: string[];
  rating?: number;
  about?: string;
  bio?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeFees(price: number) {
  const platformFee = price >= 2000 ? 500 : Math.round(price * 0.1);
  const trainerPayout = price - platformFee;
  return { platformFee, trainerPayout };
}

function formatIncludes(includes?: string | string[]): string {
  if (!includes) return "";
  if (Array.isArray(includes)) return includes.join(" · ");
  return includes;
}

function parsePackages(raw?: string | null): TrainerPackage[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrainerPage() {
  const params = useParams();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    fetch(`/api/trainers/${params.id}`)
      .then(r => r.json())
      .then(d => {
        const t = d.trainer ?? d;
        setTrainer(t);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4" }}>
      <div style={{ color: "#64748B" }}>Loading...</div>
    </div>
  );

  if (!trainer) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#64748B", marginBottom: 16 }}>Trainer not found.</p>
        <Link href="/" style={{ color: "#F59E0B", fontWeight: 700 }}>← Back to Home</Link>
      </div>
    </div>
  );

  const vehicles: string[] = Array.isArray(trainer.vehicleTypes) ? trainer.vehicleTypes : [];
  const langs: string[] = Array.isArray(trainer.languages) ? trainer.languages : [];
  const bio = trainer.bio || trainer.about || null;

  let packages: TrainerPackage[] = parsePackages(trainer.packagesJson);
  const fallbackPrice = trainer.basePrice || trainer.price || 0;
  if (packages.length === 0 && fallbackPrice > 0) {
    packages = [{
      name: "Training Package",
      price: fallbackPrice,
      includes: "Book now to confirm your slot — trainer will share full schedule on WhatsApp within 2 hours",
    }];
  }

  const selectedPkg = packages[selectedIdx] ?? null;
  const { platformFee, trainerPayout } = selectedPkg
    ? computeFees(selectedPkg.price)
    : { platformFee: 0, trainerPayout: 0 };

  const makeBookUrl = (price: number, pkgName: string) =>
    `/trainers/${trainer.id}/book?price=${price}&pkgName=${encodeURIComponent(pkgName)}&trainerName=${encodeURIComponent(trainer.name)}&trainerCity=${encodeURIComponent(trainer.city)}`;

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .pkg-card { transition: all 0.15s; cursor: pointer; border-radius: 14px; border: 2px solid #E2E8F0; background: white; padding: 16px; margin-bottom: 12px; }
        .pkg-card:hover { border-color: #F59E0B; }
        .pkg-card.selected { border-color: #F59E0B; background: #FFFBEB; }
        .fee-row { display: flex; justify-content: space-between; font-size: 14px; color: #64748B; margin-bottom: 8px; }
        .fee-row.total { font-size: 16px; font-weight: 800; color: #0F172A; border-top: 1px solid #F1F5F9; padding-top: 12px; margin-top: 4px; }
        .fee-row.trainer-cut { color: #16A34A; font-size: 13px; }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", height: 56, gap: 12 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Sora',sans-serif", color: "#0F172A", fontSize: 18, fontWeight: 800 }}>
              Learn<span style={{ color: "#F59E0B" }}>Drive</span>
            </span>
          </Link>
          <div style={{ flex: 1 }} />
          <Link href="/" style={{ color: "#64748B", textDecoration: "none", fontSize: 14 }}>← All Trainers</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 5% 60px" }}>

        {/* ── Header card ── */}
        <div style={{ background: "linear-gradient(145deg,#0B1437 0%,#1A2B5F 100%)", borderRadius: 20, padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
              🧑‍🏫
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 8, color: "#FFFFFF" }}>
                {trainer.name}
              </h1>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 99, padding: "3px 12px", fontSize: 13 }}>
                  📍 {trainer.city}
                </span>
                {trainer.experience > 0 && (
                  <span style={{ background: "rgba(245,158,11,0.2)", color: "#FCD34D", borderRadius: 99, padding: "3px 12px", fontSize: 13, fontWeight: 600 }}>
                    {trainer.experience} yrs exp
                  </span>
                )}
                {trainer.rating && trainer.rating > 0 ? (
                  <span style={{ background: "rgba(34,197,94,0.2)", color: "#86efac", borderRadius: 99, padding: "3px 12px", fontSize: 13, fontWeight: 600 }}>
                    ⭐ {trainer.rating.toFixed(1)}
                  </span>
                ) : null}
                {vehicles.map(v => (
                  <span key={v} style={{ background: "rgba(96,165,250,0.15)", color: "#93C5FD", borderRadius: 99, padding: "3px 12px", fontSize: 13 }}>
                    {v === "CAR" ? "🚗 Car" : v === "BIKE_GEARED" ? "🏍️ Bike" : "🛵 Scooter"}
                  </span>
                ))}
              </div>
              {langs.length > 0 && (
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 8 }}>
                  🗣 {langs.join(" · ")}
                </p>
              )}
            </div>

            {selectedPkg && (
              <div style={{ textAlign: "right", minWidth: 120 }}>
                {selectedPkg.priceMax ? (
                  <>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>
                      ₹{selectedPkg.price.toLocaleString("en-IN")}–{selectedPkg.priceMax.toLocaleString("en-IN")}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>starting price</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 800, color: "#F59E0B" }}>
                      ₹{selectedPkg.price.toLocaleString("en-IN")}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>
                      {selectedPkg.name}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── About ── */}
        {bio && (
          <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 10 }}>About</h2>
            <p style={{ color: "#64748B", lineHeight: 1.7 }}>{bio}</p>
          </div>
        )}

        {/* ── What's included ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>What&apos;s included</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {["Pickup from your area", "RTO test preparation", "Flexible timings", "Experienced instructor"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#374151" }}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── Package selection ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 28, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 6, color: "#0F172A" }}>
            Choose a package
          </h2>
          <p style={{ color: "#94A3B8", fontSize: 13, marginBottom: 20 }}>
            Select a training package that suits your needs
          </p>

          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`pkg-card ${selectedIdx === idx ? "selected" : ""}`}
              onClick={() => setSelectedIdx(idx)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    border: `2px solid ${selectedIdx === idx ? "#F59E0B" : "#CBD5E1"}`,
                    background: selectedIdx === idx ? "#F59E0B" : "white",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    {selectedIdx === idx && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                  </div>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: "#0F172A" }}>
                    {pkg.name}
                  </span>
                </div>

                <div style={{ textAlign: "right" }}>
                  {pkg.priceMax ? (
                    <>
                      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 17, fontWeight: 800, color: "#F59E0B" }}>
                        ₹{pkg.price.toLocaleString("en-IN")} – ₹{pkg.priceMax.toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>depends on vehicle</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>
                        ₹{pkg.price.toLocaleString("en-IN")}
                      </div>
                      {pkg.days && pkg.days > 1 && (
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>
                          ₹{Math.round(pkg.price / pkg.days).toLocaleString("en-IN")}/day
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: pkg.includes ? 8 : 0 }}>
                {pkg.days && pkg.days > 1 && (
                  <span style={{ fontSize: 12, color: "#64748B" }}>📅 {pkg.days} days</span>
                )}
                {pkg.sessionLength && (
                  <span style={{ fontSize: 12, color: "#64748B" }}>⏱ {pkg.sessionLength}</span>
                )}
                {pkg.distancePerDay && (
                  <span style={{ fontSize: 12, color: "#64748B" }}>📍 {pkg.distancePerDay}/day</span>
                )}
              </div>

              {pkg.vehicleModels && (
                <p style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>🚗 {pkg.vehicleModels}</p>
              )}

              {pkg.variants && pkg.variants.length > 0 && (
                <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", border: "1px solid #E2E8F0" }}>
                  {pkg.variants.map((v, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", background: i % 2 === 0 ? "#F8FAFC" : "white", fontSize: 13 }}>
                      <span style={{ color: "#374151" }}>{v.model}</span>
                      <div style={{ display: "flex", gap: 12 }}>
                        <span style={{ color: "#F59E0B", fontWeight: 700 }}>₹{v.price.toLocaleString("en-IN")}</span>
                        {v.priceAC && <span style={{ color: "#94A3B8", fontSize: 12 }}>AC ₹{v.priceAC.toLocaleString("en-IN")}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pkg.includes && (
                <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, marginTop: 8 }}>
                  ✓ {formatIncludes(pkg.includes)}
                </p>
              )}

              {pkg.acSurcharge && (
                <div style={{ marginTop: 8, padding: "5px 10px", background: "#EFF6FF", borderRadius: 6, fontSize: 12, color: "#1E40AF" }}>
                  ❄ AC vehicle: +₹{pkg.acSurcharge.toLocaleString("en-IN")} extra
                </div>
              )}

              {pkg.trackFeePerVehicle && (
                <div style={{ marginTop: 6, padding: "5px 10px", background: "#FEF9EC", borderRadius: 6, fontSize: 12, color: "#92400E" }}>
                  ⚠ Track/test day fee: ₹{pkg.trackFeePerVehicle}/vehicle (separate on test day)
                </div>
              )}
            </div>
          ))}

          {/* ── Price breakdown ── */}
          {selectedPkg && (
            <>
              <div style={{ marginTop: 20, padding: 16, background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                  Price breakdown
                </p>
                <div className="fee-row">
                  <span>{selectedPkg.name}</span>
                  <span>₹{selectedPkg.price.toLocaleString("en-IN")}</span>
                </div>
                <div className="fee-row trainer-cut">
                  <span>↳ Goes to trainer</span>
                  <span>₹{trainerPayout.toLocaleString("en-IN")}</span>
                </div>
                <div className="fee-row trainer-cut" style={{ color: "#64748B" }}>
                  <span>↳ Platform fee (LearnDrive)</span>
                  <span>₹{platformFee.toLocaleString("en-IN")}</span>
                </div>
                {selectedPkg.trackFeePerVehicle && (
                  <div className="fee-row" style={{ color: "#92400E" }}>
                    <span>Track fee (test day, per vehicle)</span>
                    <span>₹{selectedPkg.trackFeePerVehicle}</span>
                  </div>
                )}
                <div className="fee-row total">
                  <span>Total payable now</span>
                  <span style={{ color: "#F59E0B" }}>₹{selectedPkg.price.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Link
                href={makeBookUrl(selectedPkg.price, selectedPkg.name)}
                style={{ display: "block", textAlign: "center", background: "#F59E0B", color: "#fff", padding: "14px", borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 20px rgba(245,158,11,0.35)", marginTop: 16 }}
              >
                Book {selectedPkg.name} — ₹{selectedPkg.price.toLocaleString("en-IN")} →
              </Link>
            </>
          )}

          <p style={{ color: "#94A3B8", fontSize: 12, textAlign: "center", marginTop: 10 }}>
            Free cancellation · Secure payment via Razorpay
          </p>
        </div>

        {/* ── HIRE A DRIVER BANNER ── */}
        <div style={{ background: "linear-gradient(145deg,#0B1437 0%,#1A2B5F 100%)", borderRadius: 18, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 4 }}>Not learning — just need to get somewhere?</p>
            <h3 style={{ fontFamily: "'Sora',sans-serif", color: "#FFFFFF", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              Hire a Driver for Your Car
            </h3>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>
              Outstation trips, weddings, airport drops. Verified drivers. From ₹800/trip.
            </p>
          </div>
          <Link
            href="/hire-driver"
            style={{ background: "#F59E0B", color: "#0B1437", textDecoration: "none", padding: "11px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" as const, flexShrink: 0 }}
          >
            🚗 Hire a Driver →
          </Link>
        </div>

      </div>
    </main>
  );
}