"use client";
// components/TrainersClient.tsx  (or wherever this lives in your project)

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Vehicle = {
  type: "CAR" | "BIKE";
  dualControl: boolean;
  insured: boolean;
};

interface TrainerPackage {
  id: string;
  name: string;
  price: number;
  priceMax?: number;
  days?: number;
  sessionLength?: string;
  distancePerDay?: string;
  includes?: string;
  trackFeePerVehicle?: number;
  acSurcharge?: number;
  vehicleModels?: string;
}

type Trainer = {
  id: number;
  name: string;
  city: string;
  experience: number;
  trainerType: "INDEPENDENT" | "DRIVING_SCHOOL";
  rating: number | null;
  basePrice: number | null;
  packagesJson: string | null;
  languages: string[];
  verifiedSchool: boolean;
  vehicles: Vehicle[];
};

const CITIES = [
  "Delhi", "Noida", "Gurugram", "Faridabad", "Ghaziabad",
  "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Jaipur",
];

function parsePackages(json: string | null): TrainerPackage[] {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

// Quick summary line for a package — shown collapsed
function pkgSummary(pkg: TrainerPackage): string {
  const parts: string[] = [];
  if (pkg.days && pkg.days > 1) parts.push(`${pkg.days} days`);
  if (pkg.sessionLength) parts.push(pkg.sessionLength);
  if (pkg.distancePerDay) parts.push(`${pkg.distancePerDay}/day`);
  return parts.join(" · ");
}

export default function TrainersClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [vehicle, setVehicle] = useState(searchParams.get("vehicle") || "");
  const [pincode, setPincode] = useState(searchParams.get("pincode") || "");
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [fallbackPincode, setFallbackPincode] = useState("");
  const [requestedPincode, setRequestedPincode] = useState("");
  const [wlName, setWlName] = useState("");
  const [wlPhone, setWlPhone] = useState("");
  const [wlEmail, setWlEmail] = useState("");
  const [wlSubmitting, setWlSubmitting] = useState(false);
  const [wlSuccess, setWlSuccess] = useState(false);
  const [wlError, setWlError] = useState("");

  async function submitWaitlist() {
    setWlError("");
    setWlSuccess(false);

    if (!city) {
      setWlError("Please select city first.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(wlPhone)) {
      setWlError("Enter a valid 10-digit mobile number.");
      return;
    }

    setWlSubmitting(true);
    try {
      const res = await fetch("/api/waitlist/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: wlName.trim(),
          phone: wlPhone.trim(),
          email: wlEmail.trim(),
          city: pincode.length === 6 ? `${city} (${pincode})` : city,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWlError(data?.error ?? "Could not submit request. Try again.");
        setWlSubmitting(false);
        return;
      }

      setWlSuccess(true);
      setWlName("");
      setWlPhone("");
      setWlEmail("");
    } catch {
      setWlError("Could not submit request. Try again.");
    }
    setWlSubmitting(false);
  }

  useEffect(() => {
    if (!city || !vehicle) {
      setFallbackPincode("");
      setRequestedPincode("");
      return;
    }
    if (pincode.length > 0 && pincode.length < 6) {
      setTrainers([]);
      setSearched(false);
      setFallbackPincode("");
      setRequestedPincode("");
      return;
    }

    setLoading(true);
    setSearched(true);
    setFallbackPincode("");
    setRequestedPincode("");

    const url = `/api/trainers?city=${encodeURIComponent(city)}&vehicle=${vehicle}${
      pincode.length === 6 ? `&pincode=${pincode}` : ""
    }`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.trainers ?? []);
        setTrainers(list);
        setFallbackPincode(!Array.isArray(data) && data.fallbackUsed ? (data.fallbackPincode ?? "") : "");
        setRequestedPincode(!Array.isArray(data) && data.fallbackUsed ? (data.requestedPincode ?? "") : "");
        setLoading(false);
      })
      .catch(() => {
        setTrainers([]);
        setFallbackPincode("");
        setRequestedPincode("");
        setLoading(false);
      });
  }, [city, vehicle, pincode]);

  return (
    <main style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; }

        .top-bar { background: linear-gradient(135deg,#0B1437 0%,#1A2B5F 100%); padding: 20px 5%; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .brand { font-family: 'Sora',sans-serif; font-weight: 800; font-size: 1.3rem; color: #fff; text-decoration: none; }
        .brand span { color: #F59E0B; }

        .filter-bar { background: #FFFFFF; border-bottom: 1px solid #E2E8F0; padding: 16px 5%; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .filter-label { font-size: 0.8rem; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; }
        .filter-select { padding: 9px 14px; border: 2px solid #E2E8F0; border-radius: 10px; font-size: 0.88rem; font-family: inherit; color: #0F172A; background: #F8FAFC; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748B' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 30px; }
        .filter-select:focus { outline: none; border-color: #F59E0B; }

        .pincode-input { padding: 9px 14px; border: 2px solid #E2E8F0; border-radius: 10px; font-size: 0.88rem; font-family: inherit; color: #0F172A; background: #F8FAFC; width: 150px; transition: border-color 0.2s; }
        .pincode-input:focus { outline: none; border-color: #F59E0B; }
        .pincode-input::placeholder { color: #CBD5E1; }

        .vehicle-toggle { display: flex; gap: 8px; }
        .vbtn { padding: 9px 18px; border-radius: 10px; border: 2px solid #E2E8F0; background: #F8FAFC; font-family: inherit; font-size: 0.88rem; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.15s; }
        .vbtn.active { border-color: #F59E0B; background: #FFFBEB; color: #92400E; }

        .result-meta { font-size: 0.85rem; color: #64748B; margin-left: auto; }
        .cards-area { padding: 28px 5%; max-width: 900px; margin: 0 auto; }

        /* Card */
        .trainer-card { background: #FFFFFF; border-radius: 18px; border: 1px solid #E2E8F0; margin-bottom: 16px; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
        .trainer-card:hover { border-color: #F59E0B; box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
        .card-top { padding: 24px; display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: start; }

        .trainer-name { font-family: 'Sora',sans-serif; font-size: 1.1rem; font-weight: 700; color: #0F172A; margin-bottom: 6px; }

        .badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
        .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 100px; }
        .badge-green { background: #DCFCE7; color: #166534; }
        .badge-blue { background: #DBEAFE; color: #1E40AF; }
        .badge-amber { background: #FEF3C7; color: #92400E; }
        .badge-gray { background: #F1F5F9; color: #475569; }

        .trainer-meta { font-size: 0.85rem; color: #64748B; display: flex; gap: 16px; flex-wrap: wrap; }
        .meta-item { display: flex; align-items: center; gap: 5px; }

        /* Package pills on collapsed card */
        .pkg-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
        .pkg-pill { font-size: 0.75rem; font-weight: 600; padding: 4px 12px; border-radius: 99px; background: #F1F5F9; color: #374151; border: 1px solid #E2E8F0; }
        .pkg-pill-price { color: #D97706; font-weight: 700; }

        /* Expand toggle */
        .expand-btn { display: flex; align-items: center; gap: 4px; margin-top: 10px; font-size: 0.78rem; font-weight: 600; color: #F59E0B; background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; }
        .expand-btn:hover { color: #D97706; }

        /* Expanded package drawer */
        .pkg-drawer { border-top: 1px solid #F1F5F9; background: #FAFBFF; padding: 20px 24px; }
        .pkg-drawer-title { font-size: 0.78rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 14px; }

        .pkg-row { border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; background: white; display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: start; }
        .pkg-name { font-family: 'Sora',sans-serif; font-size: 0.9rem; font-weight: 700; color: #0F172A; margin-bottom: 6px; }
        .pkg-meta { display: flex; gap: 14px; flex-wrap: wrap; font-size: 0.78rem; color: #64748B; margin-bottom: 6px; }
        .pkg-meta-item { display: flex; align-items: center; gap: 4px; }
        .pkg-includes { font-size: 0.78rem; color: #64748B; line-height: 1.5; }
        .pkg-includes::before { content: "✓ "; color: #16A34A; font-weight: 700; }
        .pkg-surcharge { font-size: 0.72rem; color: #92400E; background: #FEF9EC; border-radius: 6px; padding: 3px 8px; margin-top: 6px; display: inline-block; }
        .pkg-price-col { text-align: right; }
        .pkg-price { font-family: 'Sora',sans-serif; font-size: 1.15rem; font-weight: 800; color: #F59E0B; }
        .pkg-per-day { font-size: 0.7rem; color: #94A3B8; margin-top: 2px; }
        .book-pkg-btn { margin-top: 8px; display: block; background: #F59E0B; color: white; font-size: 0.78rem; font-weight: 700; padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer; white-space: nowrap; font-family: inherit; }
        .book-pkg-btn:hover { background: #D97706; }

        /* Right col price block (collapsed) */
        .price-block { text-align: right; }
        .price-amount { font-family: 'Sora',sans-serif; font-size: 1.4rem; font-weight: 800; color: #0F172A; }
        .price-note { font-size: 0.72rem; color: #94A3B8; margin-bottom: 12px; }
        .book-btn { display: block; background: linear-gradient(135deg,#F59E0B,#D97706); color: #FFFFFF; font-family: 'Sora',sans-serif; font-size: 0.88rem; font-weight: 700; padding: 11px 22px; border-radius: 10px; border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; box-shadow: 0 3px 12px rgba(245,158,11,0.35); }
        .book-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(245,158,11,0.45); }

        .empty-state { text-align: center; padding: 64px 20px; color: #94A3B8; }
        .empty-icon { font-size: 3rem; margin-bottom: 16px; }
        .empty-title { font-family: 'Sora',sans-serif; font-size: 1.1rem; font-weight: 700; color: #475569; margin-bottom: 8px; }
        .waitlist-card { margin: 18px auto 0; max-width: 520px; text-align: left; background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 18px; }
        .waitlist-title { font-family: 'Sora',sans-serif; color: #0F172A; font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; }
        .waitlist-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
        .waitlist-input { width: 100%; padding: 10px 12px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 0.86rem; color: #0F172A; background: #F8FAFC; font-family: inherit; }
        .waitlist-input:focus { outline: none; border-color: #F59E0B; }
        .waitlist-btn { margin-top: 12px; width: 100%; border: 0; border-radius: 10px; padding: 11px 14px; background: linear-gradient(135deg,#F59E0B,#D97706); color: #fff; font-family: 'Sora',sans-serif; font-size: 0.86rem; font-weight: 700; cursor: pointer; }
        .waitlist-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .waitlist-msg { margin-top: 8px; font-size: 0.8rem; }

        .skeleton { background: linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 18px; height: 140px; margin-bottom: 16px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 520px) {
          .card-top { grid-template-columns: 1fr; }
          .price-block { text-align: left; display: flex; align-items: center; gap: 16px; }
          .price-note { margin-bottom: 0; }
          .waitlist-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Top nav */}
      <div className="top-bar">
        <a href="/" className="brand">Learn<span>Drive</span></a>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>
          {searched && !loading ? `${trainers.length} trainer${trainers.length !== 1 ? "s" : ""} found` : "Find your trainer"}
        </span>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <span className="filter-label">Showing:</span>
        <select className="filter-select" value={city} onChange={e => setCity(e.target.value)}>
          <option value="">Select city</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="vehicle-toggle">
          <button className={`vbtn ${vehicle === "CAR" ? "active" : ""}`} onClick={() => setVehicle("CAR")}>🚗 Car</button>
          <button className={`vbtn ${vehicle === "BIKE" ? "active" : ""}`} onClick={() => setVehicle("BIKE")}>🏍️ Bike</button>
        </div>

        <input
          className="pincode-input" type="text" inputMode="numeric"
          placeholder="📍 Pincode (optional)" value={pincode} maxLength={6}
          onChange={e => setPincode(e.target.value.replace(/\D/g, ""))}
        />
        <span style={{ fontSize: "0.76rem", color: "#94A3B8" }}>
          Enter 6-digit pincode to show only nearby trainers
        </span>

        {pincode.length === 6 && (
          <button onClick={() => setPincode("")}
            style={{ padding: "6px 12px", borderRadius: 100, border: "none", background: "#FEF3C7", color: "#92400E", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
            {pincode} ✕
          </button>
        )}

        {searched && !loading && (
          <span className="result-meta">{trainers.length} result{trainers.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Cards */}
      <div className="cards-area">
        {!!fallbackPincode && (
          <div
            style={{
              marginBottom: 14,
              background: "#FEF3C7",
              border: "1px solid #FDE68A",
              color: "#92400E",
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: "0.84rem",
              fontWeight: 600,
            }}
          >
            No trainers found in pincode {requestedPincode}. Showing nearest available pincode: {fallbackPincode}.
          </div>
        )}

        {!city || !vehicle ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Select a city and vehicle type above</div>
            <p style={{ fontSize: "0.88rem" }}>to see available verified trainers near you</p>
          </div>
        ) : loading ? (
          <><div className="skeleton" /><div className="skeleton" style={{ opacity: 0.7 }} /><div className="skeleton" style={{ opacity: 0.4 }} /></>
        ) : trainers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">😕</div>
            <div className="empty-title">No trainers found{pincode.length === 6 ? ` in pincode ${pincode}` : ` in ${city}`}</div>
            <p style={{ fontSize: "0.88rem" }}>
              {pincode.length === 6 ? "No match in this pincode right now. Submit your request and we will notify you first." : "We're onboarding trainers fast. Submit your request and we'll notify you when available."}
            </p>

            <div className="waitlist-card">
              <div className="waitlist-title">
                Coming to {city}{pincode.length === 6 ? ` (${pincode})` : ""} soon
              </div>
              <p style={{ margin: 0, color: "#64748B", fontSize: "0.82rem" }}>
                Share your details to get notified as soon as trainers are available.
              </p>

              <div className="waitlist-row">
                <input
                  className="waitlist-input"
                  placeholder="Your name (optional)"
                  value={wlName}
                  onChange={(e) => setWlName(e.target.value)}
                />
                <input
                  className="waitlist-input"
                  placeholder="10-digit mobile *"
                  maxLength={10}
                  value={wlPhone}
                  onChange={(e) => setWlPhone(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              <input
                className="waitlist-input"
                placeholder="Email (optional)"
                value={wlEmail}
                onChange={(e) => setWlEmail(e.target.value)}
                style={{ marginTop: 10 }}
              />

              <button
                className="waitlist-btn"
                onClick={submitWaitlist}
                disabled={wlSubmitting || !/^[6-9]\d{9}$/.test(wlPhone)}
              >
                {wlSubmitting ? "Submitting..." : "Notify Me"}
              </button>

              {wlError && <div className="waitlist-msg" style={{ color: "#dc2626" }}>{wlError}</div>}
              {wlSuccess && <div className="waitlist-msg" style={{ color: "#166534" }}>Request submitted. We'll contact you soon.</div>}
            </div>
          </div>
        ) : (
          (() => {
            // Price-tier classification across results
            const allPrices = trainers
              .map(t => { const p = parsePackages(t.packagesJson); return p[0]?.price ?? t.basePrice ?? 0; })
              .filter(p => p > 0)
              .sort((a, b) => a - b);
            const p33 = allPrices[Math.floor(allPrices.length * 0.33)] ?? 0;
            const p66 = allPrices[Math.floor(allPrices.length * 0.66)] ?? 0;
            const minPrice = allPrices[0] ?? 0;
            const maxPrice = allPrices[allPrices.length - 1] ?? 0;

            const priceTier = (price: number) => {
              if (allPrices.length < 3) return null;
              if (price <= p33) return { label: "Budget-friendly", color: "#16A34A", bg: "#DCFCE7" };
              if (price <= p66) return { label: "Standard", color: "#1D4ED8", bg: "#DBEAFE" };
              return { label: "Premium", color: "#9333EA", bg: "#F3E8FF" };
            };

            const DL_ASSIST_CARD = (
              <div key="dl-assist-cta" style={{ background: "linear-gradient(135deg, #1a2540, #2d3f6b)", borderRadius: 18, padding: "24px", marginBottom: 16, border: "1px solid rgba(245,158,11,0.2)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "1px" }}>Also from LearnDrive</span>
                    <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 800, color: "#fff", margin: "6px 0 8px", lineHeight: 1.4 }}>
                      Need help getting your Driving Licence too?
                    </h3>
                    <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                      Our AI fills your Sarathi form, books your RTO slot, and sends reminders till test day. ₹499 — all inclusive.
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#F59E0B" }}>₹499</div>
                    <a href="/dl-assistance" style={{ background: "#F59E0B", color: "#1a2540", padding: "9px 18px", borderRadius: 10, fontWeight: 800, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
                      Get DL Help →
                    </a>
                  </div>
                </div>
              </div>
            );

            const cards = trainers.map((trainer, index) => {
            const hasVehicle = trainer.vehicles?.find(v => v.type === vehicle);
            const isDualControl = hasVehicle?.dualControl;
            const isInsured = hasVehicle?.insured;
            const packages = parsePackages(trainer.packagesJson);
            const isExpanded = expandedId === trainer.id;
            const langs: string[] = Array.isArray(trainer.languages) ? trainer.languages : [];

            // Display price: first package price or basePrice
            const displayPrice = packages[0]?.price ?? trainer.basePrice ?? 0;
            const displayLabel = packages.length > 0
              ? (packages.length === 1 ? packages[0].name : `from ${packages[0].name}`)
              : "starting price";
            const tier = priceTier(displayPrice);

            return (
              <div key={trainer.id} className="trainer-card">
                {/* ── Collapsed top section ── */}
                <div className="card-top">
                  <div>
                    <div className="trainer-name">{trainer.name}</div>

                    <div className="badge-row">
                      <span className="badge badge-green">✓ RTO Verified</span>
                      {trainer.trainerType === "DRIVING_SCHOOL" && (
                        <span className="badge badge-blue">🏫 Driving School</span>
                      )}
                      {isDualControl && <span className="badge badge-amber">🔧 Dual Control</span>}
                      {isInsured && <span className="badge badge-gray">🛡️ Insured</span>}
                    </div>

                    <div className="trainer-meta">
                      <span className="meta-item">📍 {trainer.city}</span>
                      <span className="meta-item">⏱ {trainer.experience} yr{trainer.experience !== 1 ? "s" : ""} exp</span>
                      {trainer.rating && trainer.rating > 0
                        ? <span className="meta-item" style={{ color: "#F59E0B", fontWeight: 700 }}>★ {trainer.rating.toFixed(1)}</span>
                        : <span className="meta-item" style={{ color: "#CBD5E1" }}>No rating yet</span>
                      }
                      {langs.length > 0 && (
                        <span className="meta-item">🗣 {langs.join(", ")}</span>
                      )}
                    </div>

                    {/* Package pills — show all package names + prices at a glance */}
                    {packages.length > 0 && (
                      <div className="pkg-pills">
                        {packages.map(pkg => (
                          <span key={pkg.id} className="pkg-pill">
                            {pkg.name}
                            {" — "}
                            <span className="pkg-pill-price">
                              ₹{pkg.price.toLocaleString("en-IN")}
                              {pkg.priceMax ? `–₹${pkg.priceMax.toLocaleString("en-IN")}` : ""}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Expand toggle */}
                    {packages.length > 0 && (
                      <button
                        className="expand-btn"
                        onClick={() => setExpandedId(isExpanded ? null : trainer.id)}
                      >
                        {isExpanded ? "▲ Hide package details" : "▼ See package details"}
                      </button>
                    )}
                  </div>

                  {/* Right: price + CTA */}
                  <div className="price-block">
                    {tier && (
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: tier.bg, color: tier.color, marginBottom: 4, display: "inline-block" }}>
                        {tier.label}
                      </div>
                    )}
                    <div className="price-amount">
                      ₹{displayPrice.toLocaleString("en-IN")}
                    </div>
                    <div className="price-note">{displayLabel}{packages.length > 1 ? ` · ${packages.length} options` : ""}</div>
                    <button className="book-btn" onClick={() => router.push(`/trainers/${trainer.id}`)}>
                      View & Book →
                    </button>
                  </div>
                </div>

                {/* ── Expanded package drawer ── */}
                {isExpanded && packages.length > 0 && (
                  <div className="pkg-drawer">
                    <div className="pkg-drawer-title">Packages offered</div>
                    {packages.map(pkg => {
                      const summary = pkgSummary(pkg);
                      const perDay = pkg.days && pkg.days > 1 ? Math.round(pkg.price / pkg.days) : null;
                      return (
                        <div key={pkg.id} className="pkg-row">
                          <div>
                            <div className="pkg-name">{pkg.name}</div>

                            {/* Key stats row */}
                            {summary && (
                              <div className="pkg-meta">
                                {pkg.days && pkg.days > 1 && (
                                  <span className="pkg-meta-item">📅 {pkg.days} days</span>
                                )}
                                {pkg.sessionLength && (
                                  <span className="pkg-meta-item">⏱ {pkg.sessionLength}</span>
                                )}
                                {pkg.distancePerDay && (
                                  <span className="pkg-meta-item">📍 {pkg.distancePerDay}/day</span>
                                )}
                              </div>
                            )}

                            {/* Vehicle models */}
                            {pkg.vehicleModels && (
                              <p style={{ fontSize: "0.78rem", color: "#64748B", marginBottom: 4 }}>
                                🚗 {pkg.vehicleModels}
                              </p>
                            )}

                            {/* What's included */}
                            {pkg.includes && (
                              <p className="pkg-includes">{pkg.includes}</p>
                            )}

                            {/* Surcharges */}
                            {pkg.acSurcharge && (
                              <span className="pkg-surcharge">❄ AC vehicle: +₹{pkg.acSurcharge.toLocaleString("en-IN")}</span>
                            )}
                            {pkg.trackFeePerVehicle && (
                              <span className="pkg-surcharge" style={{ marginLeft: 6 }}>⚠ Track fee: ₹{pkg.trackFeePerVehicle}/vehicle on test day</span>
                            )}
                          </div>

                          {/* Price + book */}
                          <div className="pkg-price-col">
                            <div className="pkg-price">
                              ₹{pkg.price.toLocaleString("en-IN")}
                              {pkg.priceMax ? `–${pkg.priceMax.toLocaleString("en-IN")}` : ""}
                            </div>
                            {perDay && (
                              <div className="pkg-per-day">₹{perDay.toLocaleString("en-IN")}/day</div>
                            )}
                            <button
                              className="book-pkg-btn"
                              onClick={() => router.push(
                                `/trainers/${trainer.id}/book?price=${pkg.price}&pkgName=${encodeURIComponent(pkg.name)}&trainerName=${encodeURIComponent(trainer.name)}&trainerCity=${encodeURIComponent(trainer.city)}`
                              )}
                            >
                              Book this →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
            }); // end trainers.map

            // Insert DL Assist card after 3rd trainer (or at end if fewer)
            const insertAt = Math.min(3, cards.length);
            const result = [...cards.slice(0, insertAt), DL_ASSIST_CARD, ...cards.slice(insertAt)];

            return (
              <>
                {/* Market rate banner */}
                {minPrice > 0 && maxPrice > minPrice && (
                  <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#92400E", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>💡</span>
                    <span><strong>{city}</strong> packages range from <strong>₹{minPrice.toLocaleString("en-IN")}</strong> to <strong>₹{maxPrice.toLocaleString("en-IN")}</strong> — cards are tagged Budget / Standard / Premium to help you compare.</span>
                  </div>
                )}
                {result}
              </>
            );
          })()
        )}
      </div>
    </main>
  );
}
