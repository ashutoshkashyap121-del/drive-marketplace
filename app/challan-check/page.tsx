"use client";

import { useState } from "react";
import Link from "next/link";

const COMMON_STATES = [
  "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh",
  "Rajasthan", "Gujarat", "Haryana", "Punjab", "Telangana",
  "West Bengal", "Madhya Pradesh", "Bihar", "Odisha", "Kerala",
  "Andhra Pradesh", "Jharkhand", "Assam", "Himachal Pradesh", "Uttarakhand",
  "Chandigarh", "Goa",
];

const CHALLAN_TYPES = [
  { icon: "📵", label: "Mobile while driving", fine: "₹1,000–5,000" },
  { icon: "🪑", label: "Seatbelt violation", fine: "₹1,000" },
  { icon: "🚦", label: "Signal jumping", fine: "₹1,000–5,000" },
  { icon: "⚡", label: "Overspeeding", fine: "₹1,000–2,000" },
  { icon: "🛑", label: "Parking violation", fine: "₹500–2,000" },
  { icon: "📄", label: "No RC / DL", fine: "₹2,000–10,000" },
];

export default function ChallanCheckPage() {
  const [vehicleNo, setVehicleNo] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  function handleCheck() {
    const cleaned = vehicleNo.trim().toUpperCase().replace(/\s/g, "");
    if (!cleaned || cleaned.length < 6) {
      setError("Enter a valid vehicle registration number");
      return;
    }
    setError("");
    setChecked(true);
    window.open("https://echallan.parivahan.gov.in/index/accused-challan", "_blank");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
            Learn<span style={{ color: "#F59E0B" }}>Drive</span>
          </Link>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/dl-check" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>DL Check</Link>
            <Link href="/rc-check" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>RC Check</Link>
            <Link href="/rto-test/practice" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>RTO Test</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "48px 24px 56px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚦</div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800, color: "#fff", marginBottom: 12 }}>
            Free Traffic Challan Check
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 15, marginBottom: 32 }}>
            Check pending e-challans for any vehicle number instantly — directly from the official Parivahan database. 100% free.
          </p>

          {/* Form */}
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "24px", maxWidth: 440, margin: "0 auto" }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 6, textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Vehicle Registration Number
              </label>
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => { setVehicleNo(e.target.value.toUpperCase()); setError(""); setChecked(false); }}
                placeholder="e.g. DL01AB1234"
                maxLength={12}
                style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: "none", fontSize: 15, fontFamily: "monospace", outline: "none", letterSpacing: 2, boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 6, textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                State (optional)
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: "none", fontSize: 14, fontFamily: "inherit", outline: "none", color: state ? "#0F172A" : "#94A3B8", boxSizing: "border-box" }}
              >
                <option value="">Select your state</option>
                {COMMON_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {error && <p style={{ color: "#FCA5A5", fontSize: 12, marginBottom: 10, textAlign: "left" }}>⚠ {error}</p>}
            <button
              onClick={handleCheck}
              style={{ width: "100%", background: "#F59E0B", color: "#0F172A", border: "none", borderRadius: 10, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}
            >
              Check Challans →
            </button>
            <p style={{ color: "#475569", fontSize: 11, marginTop: 10 }}>Opens official Parivahan e-Challan portal · 100% free</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "32px 24px" }}>

        {/* Cashback offer — shows after user clicks Check */}
        {checked && (
          <div style={{ background: "linear-gradient(135deg, #064E3B, #065F46)", borderRadius: 20, padding: "24px 28px", marginBottom: 24, border: "1px solid rgba(52,211,153,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>🎁</span>
              <div>
                <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>Got a challan? Get ₹200 cashback!</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "2px 0 0" }}>Book your first driving lesson this week</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 16 }}>
              Knowing the traffic rules prevents future fines. Book a verified driving school and use code <strong style={{ color: "#34D399", letterSpacing: 1 }}>CHALLAN200</strong> to get ₹200 off your first lesson.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/trainers" style={{ background: "#34D399", color: "#064E3B", padding: "11px 20px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none", display: "inline-block" }}>
                Find a Trainer Near Me →
              </Link>
              <button
                onClick={() => { navigator.clipboard?.writeText("CHALLAN200"); }}
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "11px 16px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}
              >
                Copy Code
              </button>
            </div>
          </div>
        )}

        {/* DL Assistance upsell */}
        <div style={{ background: "linear-gradient(135deg, #1a2540, #2d3f6b)", borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Also from LearnDrive</p>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>
            Get your Driving Licence the right way
          </h3>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16, lineHeight: 1.7 }}>
            Our AI fills your Sarathi form, books your RTO slot, and sends reminders till test day. Avoid the RTO confusion for just ₹499.
          </p>
          <Link href="/dl-assistance" style={{ display: "inline-block", background: "#F59E0B", color: "#1a2540", padding: "11px 20px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
            Get DL Assistance — ₹499 →
          </Link>
        </div>

        {/* Common challan types */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px 28px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.15rem", fontWeight: 800, marginBottom: 6, color: "#0F172A" }}>Common traffic violations & fines</h2>
          <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Motor Vehicles Act 2019 revised penalties</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {CHALLAN_TYPES.map((c) => (
              <div key={c.label} style={{ background: "#F8F7F4", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: "#EF4444", fontWeight: 700, marginTop: 2 }}>{c.fine}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to check */}
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 16, padding: "18px 22px", marginBottom: 20 }}>
          <p style={{ fontWeight: 700, color: "#92400E", fontSize: 14, marginBottom: 10 }}>How to check your challan</p>
          {[
            "Enter your vehicle registration number above (e.g. DL01AB1234).",
            "Click 'Check Challans' — this opens the official Parivahan e-Challan portal.",
            "Enter your vehicle number on the government page and complete the captcha.",
            "View all pending challans, their dates, violations, and outstanding fines.",
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#0F172A", flexShrink: 0, marginTop: 1 }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        {/* Trainer booking CTA */}
        <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", borderRadius: 20, padding: "28px", color: "#fff", marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>Improve your driving skills</p>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.1rem", fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>Book a verified driving school near you</h3>
          <p style={{ color: "#CBD5E1", fontSize: 13, marginBottom: 16 }}>1,000+ verified schools · dual-control cars · from ₹3,500</p>
          <Link href="/trainers" style={{ background: "#F59E0B", color: "#0B1437", padding: "11px 20px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 13, display: "inline-block" }}>
            Find Trainers →
          </Link>
        </div>

      </div>
    </main>
  );
}
