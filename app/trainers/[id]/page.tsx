"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Trainer {
  id: number;
  name: string;
  city: string;
  basePrice: number;
  experience: number;
  languages: string[];
  vehicleTypes: string[];
  rating?: number;
  about?: string;
}

const PLATFORM_FEE_PCT = 0.15;
const TRIAL_SESSIONS = 1;
const RECOMMENDED_SESSIONS = 7;
const SESSION_OPTIONS = [1, 5, 7, 10, 15, 20];

export default function TrainerPage() {
  const params = useParams();
  const router = useRouter();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState(RECOMMENDED_SESSIONS);
  const [bookingType, setBookingType] = useState<"trial" | "package">("trial");

  useEffect(() => {
    fetch(`/api/trainers/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setTrainer(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center", color: "#64748B" }}>Loading trainer...</div>
    </div>
  );

  if (!trainer) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#64748B", marginBottom: 16 }}>Trainer not found.</p>
        <Link href="/" style={{ color: "#F59E0B", fontWeight: 700 }}>← Back to Home</Link>
      </div>
    </div>
  );

  // Safety checks for arrays
  const vehicles: string[] = Array.isArray(trainer.vehicleTypes) ? trainer.vehicleTypes : [];
  const langs: string[] = Array.isArray(trainer.languages) ? trainer.languages : [];

  // FIX: Added safety fallback (?? 0) for basePrice to prevent .toLocaleString() errors
  const trialPrice = 299;
  const sessionPrice = trainer.basePrice ?? 0; 
  const packageSessions = sessions;
  const packageSubtotal = sessionPrice * packageSessions;
  const packageTotal = packageSubtotal; 

  const trialTotal = trialPrice;

  // Discount for packages
  const discount = packageSessions >= 10 ? 15 : packageSessions >= 7 ? 10 : packageSessions >= 5 ? 5 : 0;
  const discountedTotal = bookingType === "package" ? Math.round(packageTotal * (1 - discount / 100)) : trialTotal;

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .session-btn { transition: all 0.15s; cursor: pointer; border: 2px solid #E2E8F0; background: white; border-radius: 10px; padding: 10px 16px; font-size: 14px; font-weight: 600; color: #374151; }
        .session-btn:hover { border-color: #F59E0B; color: #B45309; }
        .session-btn.active { border-color: #F59E0B; background: #FEF3C7; color: #B45309; }
        .tab-btn { padding: 10px 20px; border-radius: 10px; border: none; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s; }
        .tab-btn.active { background: #F59E0B; color: #1a2540; }
        .tab-btn.inactive { background: #F1F5F9; color: #64748B; }
        @media (max-width: 480px) {
          .trainer-header { flex-direction: column !important; }
          .price-display { text-align: left !important; margin-top: 8px; }
        }
      `}</style>

      <nav style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", height: 56, gap: 12 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Sora', sans-serif", color: "#0F172A", fontSize: 18, fontWeight: 800 }}>Learn<span style={{ color: "#F59E0B" }}>Drive</span></span>
          </Link>
          <div style={{ flex: 1 }} />
          <Link href="/trainers" style={{ color: "#64748B", textDecoration: "none", fontSize: 14 }}>← All Trainers</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 5% 60px" }}>
        {/* Header card */}
        <div style={{ background: "linear-gradient(145deg, #0B1437 0%, #1A2B5F 100%)", borderRadius: 20, padding: 28, marginBottom: 20 }}>
          <div className="trainer-header" style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🧑‍🏫</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 8, color: "#FFFFFF" }}>{trainer.name}</h1>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 99, padding: "3px 12px", fontSize: 13 }}>📍 {trainer.city}</span>
                {trainer.experience > 0 && (
                  <span style={{ background: "rgba(245,158,11,0.2)", color: "#FCD34D", borderRadius: 99, padding: "3px 12px", fontSize: 13, fontWeight: 600 }}>{trainer.experience} yrs exp</span>
                )}
                {vehicles.map((v) => (
                  <span key={v} style={{ background: "rgba(96,165,250,0.15)", color: "#93C5FD", borderRadius: 99, padding: "3px 12px", fontSize: 13 }}>{v}</span>
                ))}
              </div>
              {langs.length > 0 && <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 8 }}>Speaks: {langs.join(", ")}</p>}
            </div>
            <div className="price-display" style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 800, color: "#F59E0B" }}>
                ₹{(sessionPrice ?? 0).toLocaleString("en-IN")}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>per session</div>
            </div>
          </div>
        </div>

        {/* About */}
        {trainer.about && (
          <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 10 }}>About</h2>
            <p style={{ color: "#64748B", lineHeight: 1.7 }}>{trainer.about}</p>
          </div>
        )}

        {/* What's included */}
        <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>What&apos;s included</h2>
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
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 20, color: "#0F172A" }}>Book your sessions</h2>

          {/* Trial / Package tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "#F1F5F9", borderRadius: 12, padding: 4 }}>
            <button className={`tab-btn ${bookingType === "trial" ? "active" : "inactive"}`} style={{ flex: 1 }} onClick={() => setBookingType("trial")}>
              Trial Class — ₹299
            </button>
            <button className={`tab-btn ${bookingType === "package" ? "active" : "inactive"}`} style={{ flex: 1 }} onClick={() => setBookingType("package")}>
              Book Package
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

              {/* Pricing breakdown Trial */}
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#64748B", marginBottom: 8 }}>
                  <span>Trial class (1 session)</span>
                  <span>₹299</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#0F172A", borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
                  <span>Total payable</span>
                  <span style={{ color: "#F59E0B" }}>₹299</span>
                </div>
              </div>

              <Link href={`/trainers/${trainer.id}/book?sessions=1&type=trial&price=299`}
                style={{ display: "block", textAlign: "center", background: "#F59E0B", color: "#fff", padding: "14px", borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 20px rgba(245,158,11,0.35)" }}>
                Book Trial Class — ₹299 →
              </Link>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 10 }}>
                  How many sessions? <span style={{ color: "#F59E0B", fontWeight: 700 }}>⭐ 7 recommended</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {SESSION_OPTIONS.map((n) => (
                    <button key={n} className={`session-btn ${sessions === n ? "active" : ""}`} onClick={() => setSessions(n)}>
                      {n} {n === RECOMMENDED_SESSIONS ? "⭐" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {discount > 0 && (
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#166534", fontWeight: 600 }}>
                  🎉 {discount}% package discount applied — you save ₹{(packageTotal - discountedTotal).toLocaleString("en-IN")}
                </div>
              )}

              {/* Pricing breakdown Package */}
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#64748B", marginBottom: 8 }}>
                  <span>{sessions} sessions × ₹{(sessionPrice ?? 0).toLocaleString("en-IN")}</span>
                  <span>₹{(packageSubtotal ?? 0).toLocaleString("en-IN")}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#16A34A", marginBottom: 8 }}>
                    <span>Package discount ({discount}%)</span>
                    <span>−₹{(packageTotal - discountedTotal).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#0F172A", borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
                  <span>Total payable</span>
                  <span style={{ color: "#F59E0B" }}>₹{(discountedTotal ?? 0).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Link href={`/trainers/${trainer.id}/book?sessions=${sessions}&type=package&price=${discountedTotal}`}
                style={{ display: "block", textAlign: "center", background: "#F59E0B", color: "#fff", padding: "14px", borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 20px rgba(245,158,11,0.35)" }}>
                Book {sessions} Sessions — ₹{(discountedTotal ?? 0).toLocaleString("en-IN")} →
              </Link>
            </>
          )}
          <p style={{ color: "#94A3B8", fontSize: 12, textAlign: "center", marginTop: 10 }}>Free cancellation · Secure payment via Razorpay</p>
        </div>
      </div>
    </main>
  );
}