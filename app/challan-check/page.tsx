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
  { icon: "🪑", label: "Seatbelt violation",   fine: "₹1,000" },
  { icon: "🚦", label: "Signal jumping",        fine: "₹1,000–5,000" },
  { icon: "⚡", label: "Overspeeding",          fine: "₹1,000–2,000" },
  { icon: "🛑", label: "Parking violation",     fine: "₹500–2,000" },
  { icon: "📄", label: "No RC / DL",            fine: "₹2,000–10,000" },
];

type Step = "check" | "claim" | "done";

export default function ChallanCheckPage() {
  // Check form
  const [vehicleNo, setVehicleNo]   = useState("");
  const [state, setState]           = useState("");
  const [checkError, setCheckError] = useState("");
  const [step, setStep]             = useState<Step>("check");

  // Claim form
  const [phone, setPhone]           = useState("");
  const [upiId, setUpiId]           = useState("");
  const [claimError, setClaimError] = useState("");
  const [claiming, setClaiming]     = useState(false);
  const [promoCode, setPromoCode]   = useState("");

  function handleCheck() {
    const cleaned = vehicleNo.trim().toUpperCase().replace(/\s/g, "");
    if (!cleaned || cleaned.length < 6) {
      setCheckError("Enter a valid vehicle registration number (e.g. DL01AB1234)");
      return;
    }
    setCheckError("");
    window.open("https://echallan.parivahan.gov.in/index/accused-challan", "_blank");
    setStep("claim");
  }

  async function handleClaim() {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setClaimError("Enter a valid 10-digit mobile number");
      return;
    }
    const cleaned = vehicleNo.trim().toUpperCase().replace(/\s/g, "");
    if (!cleaned || cleaned.length < 4) {
      setClaimError("Vehicle number is required");
      return;
    }
    setClaimError("");
    setClaiming(true);

    try {
      const res = await fetch("/api/challan/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, vehicleNo: cleaned, upiId: upiId.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        setClaimError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setPromoCode(data.promoCode);
      setStep("done");
    } catch {
      setClaimError("Network error. Please try again.");
    } finally {
      setClaiming(false);
    }
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
            <Link href="/dl-check"        style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>DL Check</Link>
            <Link href="/rc-check"        style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>RC Check</Link>
            <Link href="/rto-test/practice" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>RTO Test</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "48px 24px 56px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚦</div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            Free Traffic Challan Check
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 15, marginBottom: 8 }}>
            Check pending e-challans from the official Parivahan portal — 100% free.
          </p>

          {/* Cashback pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.4)", borderRadius: 99, padding: "6px 16px", marginBottom: 28 }}>
            <span style={{ fontSize: 14 }}>🎁</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#34D399" }}>Pay your challan and get ₹100 cashback — no booking required</span>
          </div>

          {/* ── STEP 1: Check form ── */}
          {step === "check" && (
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "24px", maxWidth: 440, margin: "0 auto" }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, color: "#94A3B8", marginBottom: 6, textAlign: "left", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Vehicle Registration Number
                </label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => { setVehicleNo(e.target.value.toUpperCase()); setCheckError(""); }}
                  placeholder="e.g. DL01AB1234"
                  maxLength={12}
                  style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: "none", fontSize: 15, fontFamily: "monospace", outline: "none", letterSpacing: 2, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 11, color: "#94A3B8", marginBottom: 6, textAlign: "left", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  State (optional)
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: "none", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                >
                  <option value="">Select your state</option>
                  {COMMON_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {checkError && <p style={{ color: "#FCA5A5", fontSize: 12, marginBottom: 10, textAlign: "left" }}>⚠ {checkError}</p>}
              <button
                onClick={handleCheck}
                style={{ width: "100%", background: "#F59E0B", color: "#0F172A", border: "none", borderRadius: 10, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}
              >
                Check Challans on Parivahan →
              </button>
              <p style={{ color: "#475569", fontSize: 11, marginTop: 10 }}>Opens official government portal in a new tab · 100% free</p>
            </div>
          )}

          {/* ── STEP 2: Claim form ── */}
          {step === "claim" && (
            <div style={{ background: "white", borderRadius: 16, padding: "28px", maxWidth: 440, margin: "0 auto", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>🎁</span>
                <div>
                  <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Paid your challan?</p>
                  <p style={{ fontSize: 12, color: "#64748B", margin: "2px 0 0" }}>Claim your ₹100 cashback — sent to your UPI within 24 hrs</p>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748B", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Mobile Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setClaimError(""); }}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748B", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  UPI ID <span style={{ color: "#94A3B8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional — if blank, we send to your mobile number)</span>
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi or leave blank"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ background: "#F8F7F4", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#64748B" }}>
                Vehicle: <strong style={{ color: "#0F172A", fontFamily: "monospace" }}>{vehicleNo.toUpperCase()}</strong> — our team verifies the challan was paid before releasing the cashback.
              </div>

              {claimError && <p style={{ color: "#EF4444", fontSize: 12, marginBottom: 10 }}>⚠ {claimError}</p>}

              <button
                onClick={handleClaim}
                disabled={claiming}
                style={{ width: "100%", background: "#16A34A", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontWeight: 800, fontSize: 15, cursor: claiming ? "not-allowed" : "pointer", fontFamily: "'Sora',sans-serif", opacity: claiming ? 0.7 : 1 }}
              >
                {claiming ? "Submitting..." : "Claim ₹100 Cashback →"}
              </button>

              <button
                onClick={() => setStep("check")}
                style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}
              >
                ← Check another vehicle
              </button>
            </div>
          )}

          {/* ── STEP 3: Done ── */}
          {step === "done" && (
            <div style={{ background: "white", borderRadius: 16, padding: "28px", maxWidth: 440, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>Cashback claim submitted!</h2>
              <p style={{ fontSize: 14, color: "#64748B", marginBottom: 16, lineHeight: 1.7 }}>
                We've sent a confirmation SMS to your mobile. Our team will verify your challan payment and transfer <strong>₹100 to your UPI within 24 hours</strong>.
              </p>
              {promoCode && (
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "14px", marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>Your claim reference</p>
                  <p style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 800, color: "#16A34A", margin: 0, letterSpacing: 2 }}>{promoCode}</p>
                </div>
              )}
              <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 20 }}>
                Questions? WhatsApp us at +91 87008 96528
              </p>
              <button onClick={() => { setStep("check"); setVehicleNo(""); setPhone(""); setUpiId(""); }}
                style={{ background: "#F59E0B", color: "#0F172A", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
                Check Another Vehicle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Below fold */}
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "32px 24px" }}>

        {/* How cashback works */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px 28px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.1rem", fontWeight: 800, marginBottom: 20, color: "#0F172A" }}>How the ₹100 cashback works</h2>
          {[
            { icon: "🔍", title: "Check your challan", desc: "Enter vehicle number above — opens the official Parivahan e-Challan portal." },
            { icon: "💳", title: "Pay your challan", desc: "Pay directly on Parivahan. We don't handle your payment — it goes straight to the government." },
            { icon: "📝", title: "Claim cashback here", desc: "Come back and submit your mobile number + UPI ID. Takes 30 seconds." },
            { icon: "💸", title: "Get ₹100 in 24 hours", desc: "We verify the challan is cleared and transfer ₹100 to your UPI — no booking required." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < 3 ? 16 : 0, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 14, margin: "0 0 3px" }}>{s.title}</p>
                <p style={{ color: "#64748B", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* DL Assistance cross-sell */}
        <div style={{ background: "linear-gradient(135deg, #1a2540, #2d3f6b)", borderRadius: 20, padding: "24px 28px", marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>Also from LearnDrive</p>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>
            Get your Driving Licence — without the RTO confusion
          </h3>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16, lineHeight: 1.7 }}>
            AI fills your Sarathi form, books your RTO slot, sends reminders till test day. ₹499 all inclusive.
          </p>
          <Link href="/dl-assistance" style={{ display: "inline-block", background: "#F59E0B", color: "#1a2540", padding: "11px 20px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
            Get DL Assistance — ₹499 →
          </Link>
        </div>

        {/* Common fines */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px 28px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.05rem", fontWeight: 800, marginBottom: 6, color: "#0F172A" }}>Common traffic violations & fines</h2>
          <p style={{ fontSize: 12, color: "#64748B", marginBottom: 18 }}>Motor Vehicles Act 2019 revised penalties</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {CHALLAN_TYPES.map((c) => (
              <div key={c.label} style={{ background: "#F8F7F4", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: "#EF4444", fontWeight: 700, marginTop: 2 }}>{c.fine}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trainer CTA */}
        <div style={{ background: "linear-gradient(135deg, #0B1437, #1A2B5F)", borderRadius: 20, padding: "24px 28px", color: "#fff" }}>
          <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>Prevent future fines</p>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.05rem", fontWeight: 800, marginBottom: 8, lineHeight: 1.3 }}>Book a verified driving school — from ₹3,500</h3>
          <p style={{ color: "#CBD5E1", fontSize: 13, marginBottom: 16 }}>Better skills = fewer challans. 1,000+ verified schools across India.</p>
          <Link href="/trainers" style={{ background: "#F59E0B", color: "#0B1437", padding: "11px 20px", borderRadius: 10, fontWeight: 800, textDecoration: "none", fontSize: 13, display: "inline-block" }}>
            Find Trainers Near Me →
          </Link>
        </div>

      </div>
    </main>
  );
}
