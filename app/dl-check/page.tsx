"use client";

import { useState } from "react";
import Link from "next/link";

export default function DLCheckPage() {
  const [dlNumber, setDlNumber] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");

  function handleCheck() {
    if (!dlNumber.trim()) {
      setError("Please enter your DL number");
      return;
    }
    if (!dob) {
      setError("Please enter your date of birth");
      return;
    }
    setError("");
    window.open("https://sarathi.parivahan.gov.in/sarathiservice/dlSearchGrid.do", "_blank");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
            Learn<span style={{ color: "#F59E0B" }}>Drive</span>
          </Link>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/rc-check" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>RC Check</Link>
            <Link href="/challan-check" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>Challan</Link>
          </div>
        </div>
      </nav>

      <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "48px 24px 56px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}></div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800, color: "#fff", marginBottom: 12 }}>
            Free Driving Licence Check
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 15, marginBottom: 32 }}>
            Check your driving licence validity, expiry date and vehicle classes authorised — instantly from the government Sarathi database.
          </p>

          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "24px", maxWidth: 440, margin: "0 auto" }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 6, textAlign: "left", fontWeight: 600 }}>
                DRIVING LICENCE NUMBER
              </label>
              <input
                type="text"
                value={dlNumber}
                onChange={(e) => {
                  setDlNumber(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="e.g. DL0120190012345"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 10,
                  border: "none",
                  fontSize: 14,
                  fontFamily: "monospace",
                  outline: "none",
                  letterSpacing: 1,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12, color: "#94A3B8", marginBottom: 6, textAlign: "left", fontWeight: 600 }}>
                DATE OF BIRTH
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  setError("");
                }}
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 10,
                  border: "none",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {error && (
              <p style={{ color: "#FCA5A5", fontSize: 12, marginBottom: 10, textAlign: "left" }}>
                ⚠ {error}
              </p>
            )}
            <button
              onClick={handleCheck}
              style={{
                width: "100%",
                background: "#F59E0B",
                color: "#0F172A",
                border: "none",
                borderRadius: 10,
                padding: "14px",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "'Sora',sans-serif",
              }}
            >
              Check DL Status →
            </button>
            <p style={{ color: "#475569", fontSize: 11, marginTop: 10 }}>Opens official Sarathi government portal · 100% free</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px 28px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, marginBottom: 36 }}>Driving licence check includes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {[
              "✅ DL validity & expiry date",
              "Vehicle classes authorised",
              "Issue date & issuing RTO",
              "Renewal due date",
              "Address on record",
              "DL status (active/suspended)",
            ].map((item) => (
              <div key={item} style={{ fontSize: 13, color: "#475569" }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 16, padding: "18px 22px", marginBottom: 20 }}>
          <p style={{ fontWeight: 700, color: "#92400E", fontSize: 14, marginBottom: 8 }}>How to read your DL number</p>
          <p style={{ color: "#92400E", fontSize: 13, lineHeight: 1.7 }}>
            It follows State code + RTO code + Year + Sequence — e.g. <strong>DL0120190012345</strong>. Keep it handy for instant verification.
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px 28px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, marginBottom: 16 }}>How it works</h2>
          {[
            "Enter your DL number and date of birth above.",
            "Click Check DL Status → which opens the Sarathi portal in a new tab.",
            "Re-enter your details on the government page and pass the captcha.",
            "View your DL validity, vehicle classes, and renewal details instantly.",
          ].map((step, index) => (
            <div key={step} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#0F172A" }}>
                {(index + 1).toString().padStart(2, "0")}
              </div>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{step}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", borderRadius: 20, padding: "36px 28px", marginBottom: 24, color: "#fff" }}>
          <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>Need a trainer near you?</p>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.4rem,3vw,2rem)", marginBottom: 12 }}>Book a verified driving school</h3>
          <p style={{ color: "#cbd5e1", fontSize: 13, marginBottom: 16 }}>1,000+ verified schools · dual-control cars · transparent pricing from ₹5,500.</p>
          <Link href="/trainers" style={{ background: "#F59E0B", color: "#0F172A", padding: "12px 20px", borderRadius: 12, fontWeight: 800, textDecoration: "none", fontSize: 13 }}>
            Find Trainers →
          </Link>
        </div>
      </div>
    </main>
  );
}
