"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface TrainerPackage {
  id: string;
  name: string;
  price: number;
  days: number;
  sessionLength: string;
  distancePerDay: string;
  includes: string;
  trackFeePerVehicle?: number;
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

export default function TrainerPage() {
  const params = useParams();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<TrainerPackage | null>(null);
  const [bookingType, setBookingType] = useState<"trial" | "package">("trial");

  useEffect(() => {
    fetch(`/api/trainers/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        const t = d.trainer ?? d;
        setTrainer(t);
        setLoading(false);
        // Auto-select first package
        if (t.packagesJson) {
          try {
            const pkgs: TrainerPackage[] = JSON.parse(t.packagesJson);
            if (pkgs.length > 0) setSelectedPkg(pkgs[0]);
          } catch {}
        }
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4" }}>
      <div style={{ textAlign: "center", color: "#64748B" }}>Loading trainer...</div>
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

  // Parse packages
  let packages: TrainerPackage[] = [];
  if (trainer.packagesJson) {
    try { packages = JSON.parse(trainer.packagesJson); } catch {}
  }

  // Fallback if no packages — build one from basePrice
  const fallbackPrice = trainer.basePrice || trainer.price || 500;
  if (packages.length === 0) {
    packages = [
      { id: "trial", name: "Trial Session", price: 299, days: 1, sessionLength: "1 hour", distancePerDay: "", includes: "Single session, no commitment", trackFeePerVehicle: undefined },
      { id: "session", name: "Per Session", price: fallbackPrice, days: 1, sessionLength: "1 hour", distancePerDay: "", includes: "Flexible, book as many as you need", trackFeePerVehicle: undefined },
    ];
  }

  const trialPrice = 299;

  // Header display price
  const headerPrice = bookingType === "trial" ? trialPrice : (selectedPkg?.price ?? 0);
  const headerLabel = bookingType === "trial" ? "trial class" : selectedPkg?.name ?? "";

  // Book URLs — pass everything in URL so book page never crashes
  const makeBookUrl = (price: number, pkgName: string, type: "trial" | "package") =>
    `/trainers/${trainer.id}/book?type=${type}&price=${price}&sessions=1&pkgName=${encodeURIComponent(pkgName)}&trainerName=${encodeURIComponent(trainer.name)}&trainerCity=${encodeURIComponent(trainer.city)}`;

  const trialBookUrl = makeBookUrl(trialPrice, "Trial Class", "trial");
  const packageBookUrl = selectedPkg ? makeBookUrl(selectedPkg.price, selectedPkg.name, "package") : "#";

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .pkg-card { transition: all 0.15s; cursor: pointer; border-radius: 14px; border: 2px solid #E2E8F0; background: white; padding: 16px; }
        .pkg-card:hover { border-color: #F59E0B; }
        .pkg-card.selected { border-color: #F59E0B; background: #FFFBEB; }
        .tab-btn { padding: 10px 20px; border-radius: 10px; border: none; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s; flex: 1; }
        .tab-btn.active { background: #F59E0B; color: #1a2540; }
        .tab-btn.inactive { background: #F1F5F9; color: #64748B; }
        @media (max-width: 480px) {
          .trainer-header { flex-direction: column !important; }
          .price-display { text-align: left !important; margin-top: 8px; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", height: 56, gap: 12 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Sora', sans-serif", color: "#0F172A", fontSize: 18, fontWeight: 800 }}>
              Learn<span style={{ color: "#F59E0B" }}>Drive</span>
            </span>
          </Link>
          <div style={{ flex: 1 }} />
          <Link href="/" style={{ color: "#64748B", textDecoration: "none", fontSize: 14 }}>← All Trainers</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 5% 60px" }}>

        {/* Header card — dynamic price */}
        <div style={{ background: "linear-gradient(145deg, #0B1437 0%, #1A2B5F 100%)", borderRadius: 20, padding: 28, marginBottom: 20 }}>
          <div className="trainer-header" style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
              🧑‍🏫
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 8, color: "#FFFFFF" }}>
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
                {vehicles.map((v) => (
                  <span key={v} style={{ background: "rgba(96,165,250,0.15)", color: "#93C5FD", borderRadius: 99, padding: "3px 12px", fontSize: 13 }}>
                    {v === "CAR" ? "🚗 Car" : v === "BIKE_GEARED" ? "🏍️ Bike" : "🛵 Scooter"}
                  </span>
                ))}
              </div>
              {langs.length > 0 && (
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 8 }}>
                  Speaks: {langs.join(", ")}
                </p>
              )}
            </div>
            {/* Dynamic price */}
            <div className="price-display" style={{ textAlign: "right", minWidth: 110 }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, color: "#F59E0B" }}>
                ₹{headerPrice.toLocaleString("en-IN")}
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>{headerLabel}</div>
            </div>
          </div>
        </div>

        {/* About */}
        {bio && (
          <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 10 }}>About</h2>
            <p style={{ color: "#64748B", lineHeight: 1.7 }}>{bio}</p>
          </div>
        )}

        {/* What's included */}
        <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>What&apos;s included in all packages</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {["Dual-control car", "RTO test prep", "Flexible timings", "Pickup from your location"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#374151" }}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Booking section */}
        <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 28 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 20, color: "#0F172A" }}>
            Book your sessions
          </h2>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "#F1F5F9", borderRadius: 12, padding: 4 }}>
            <button className={`tab-btn ${bookingType === "trial" ? "active" : "inactive"}`} onClick={() => setBookingType("trial")}>
              Trial Class — ₹299
            </button>
            <button className={`tab-btn ${bookingType === "package" ? "active" : "inactive"}`} onClick={() => setBookingType("package")}>
              Book a Package
            </button>
          </div>

          {bookingType === "trial" ? (
            <>
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ fontWeight: 700, color: "#166534", marginBottom: 4, fontSize: 15 }}>✅ Try before you commit</div>
                <p style={{ color: "#166534", fontSize: 14, lineHeight: 1.6 }}>
                  A 1-hour trial class with {trainer.name} at just ₹299. If you like it, book a full package. No pressure.
                </p>
              </div>

              <div style={{ background: "#FEF9EC", border: "1px solid #FDE68A", borderRadius: 12, padding: 14, marginBottom: 20 }}>
                <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
                  💡 After your trial, you can pick any of {trainer.name}&apos;s packages below that fit your schedule and budget.
                </p>
              </div>

              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#64748B", marginBottom: 8 }}>
                  <span>Trial class (1 hour)</span><span>₹299</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#64748B", marginBottom: 8 }}>
                  <span>Platform fee</span><span style={{ color: "#16A34A" }}>Included</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#0F172A", borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
                  <span>Total payable</span><span style={{ color: "#F59E0B" }}>₹299</span>
                </div>
              </div>

              <Link href={trialBookUrl}
                style={{ display: "block", textAlign: "center", background: "#F59E0B", color: "#fff", padding: "14px", borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 20px rgba(245,158,11,0.35)" }}>
                Book Trial Class — ₹299 →
              </Link>
            </>
          ) : (
            <>
              {/* Package cards */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12 }}>
                  Choose a package:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`pkg-card ${selectedPkg?.id === pkg.id ? "selected" : ""}`}
                      onClick={() => setSelectedPkg(pkg)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selectedPkg?.id === pkg.id ? "#F59E0B" : "#CBD5E1"}`,
                            background: selectedPkg?.id === pkg.id ? "#F59E0B" : "white",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                          }}>
                            {selectedPkg?.id === pkg.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                          </div>
                          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15, color: "#0F172A" }}>
                            {pkg.name}
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>
                            ₹{pkg.price.toLocaleString("en-IN")}
                          </div>
                          {pkg.days > 1 && (
                            <div style={{ fontSize: 11, color: "#94A3B8" }}>
                              ₹{Math.round(pkg.price / pkg.days).toLocaleString("en-IN")}/day
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Package details */}
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
                        {pkg.days > 1 && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748B" }}>
                            <span>📅</span> {pkg.days} days
                          </div>
                        )}
                        {pkg.sessionLength && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748B" }}>
                            <span>⏱</span> {pkg.sessionLength}
                          </div>
                        )}
                        {pkg.distancePerDay && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748B" }}>
                            <span>📍</span> {pkg.distancePerDay}/day
                          </div>
                        )}
                      </div>

                      {pkg.includes && (
                        <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
                          ✓ {pkg.includes}
                        </p>
                      )}

                      {pkg.trackFeePerVehicle && (
                        <div style={{ marginTop: 8, padding: "6px 10px", background: "#FEF9EC", borderRadius: 8, fontSize: 12, color: "#92400E" }}>
                          ⚠ Track/test day fee: ₹{pkg.trackFeePerVehicle}/vehicle (charged separately on test day)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              {selectedPkg && (
                <>
                  <div style={{ background: "#FEF9EC", border: "1px solid #FDE68A", borderRadius: 12, padding: 14, marginBottom: 20 }}>
                    <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
                      💡 <strong>{selectedPkg.name}</strong> — {selectedPkg.days > 1 ? `${selectedPkg.days} days of training` : "flexible sessions"}{selectedPkg.sessionLength ? `, ${selectedPkg.sessionLength}` : ""}{selectedPkg.distancePerDay ? `, ${selectedPkg.distancePerDay} per day` : ""}.
                    </p>
                  </div>

                  <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#64748B", marginBottom: 8 }}>
                      <span>{selectedPkg.name}</span>
                      <span>₹{selectedPkg.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#64748B", marginBottom: 8 }}>
                      <span>Platform fee</span><span style={{ color: "#16A34A" }}>Included</span>
                    </div>
                    {selectedPkg.trackFeePerVehicle && (
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#92400E", marginBottom: 8 }}>
                        <span>Track fee (on test day)</span>
                        <span>₹{selectedPkg.trackFeePerVehicle}/vehicle</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#0F172A", borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
                      <span>Total payable now</span>
                      <span style={{ color: "#F59E0B" }}>₹{selectedPkg.price.toLocaleString("en-IN")}</span>
                    </div>
                    {selectedPkg.trackFeePerVehicle && (
                      <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>
                        Track fee paid separately on test day
                      </p>
                    )}
                  </div>

                  <Link href={packageBookUrl}
                    style={{ display: "block", textAlign: "center", background: "#F59E0B", color: "#fff", padding: "14px", borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 20px rgba(245,158,11,0.35)" }}>
                    Book {selectedPkg.name} — ₹{selectedPkg.price.toLocaleString("en-IN")} →
                  </Link>
                </>
              )}
            </>
          )}

          <p style={{ color: "#94A3B8", fontSize: 12, textAlign: "center", marginTop: 10 }}>
            Free cancellation · Secure payment via Razorpay
          </p>
        </div>
      </div>
    </main>
  );
}