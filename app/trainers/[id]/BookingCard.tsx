"use client";

import { useState } from "react";
import Link from "next/link";

const PLATFORM_FEE_PERCENT = 0.15; // 15% platform fee absorbed in price shown

interface Props {
  trainerId: number;
  trainerName: string;
  basePrice: number;
}

export default function TrainerBookingCard({ trainerId, trainerName, basePrice }: Props) {
  const [sessions, setSessions] = useState(1);

  const sessionTotal = basePrice * sessions;
  const platformFee = Math.round(sessionTotal * PLATFORM_FEE_PERCENT);
  const trainerEarns = sessionTotal - platformFee;
  const totalPayable = sessionTotal; // Customer pays basePrice × sessions, platform fee is already included

  const isRecommended = sessions >= 7;
  const savings = sessions >= 10 ? Math.round(sessionTotal * 0.05) : 0; // 5% discount for 10+ sessions

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 28 }}>
      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 6, color: "#0F172A" }}>
        Book Sessions with {trainerName}
      </h2>
      <p style={{ color: "#64748B", marginBottom: 24, fontSize: 14 }}>
        Choose how many sessions you want. Pay securely online.
      </p>

      {/* Session selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <label style={{ fontWeight: 600, fontSize: 15, color: "#0F172A" }}>Number of Sessions</label>
          {isRecommended && (
            <span style={{ background: "#dcfce7", color: "#166534", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>
              ✓ Recommended
            </span>
          )}
        </div>

        {/* Quick select buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {[1, 7, 10, 15, 20].map((n) => (
            <button
              key={n}
              onClick={() => setSessions(n)}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: sessions === n ? "2px solid #F59E0B" : "1.5px solid #E2E8F0",
                background: sessions === n ? "#FEF3C7" : "white",
                color: sessions === n ? "#92400E" : "#64748B",
                fontWeight: sessions === n ? 700 : 500,
                fontSize: 14,
                cursor: "pointer",
                position: "relative",
              }}
            >
              {n}
              {n === 7 && <span style={{ display: "block", fontSize: 10, color: "#16a34a", fontWeight: 700 }}>min rec.</span>}
              {n === 10 && <span style={{ display: "block", fontSize: 10, color: "#2563eb", fontWeight: 700 }}>5% off</span>}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setSessions(Math.max(1, sessions - 1))}
            style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #E2E8F0", background: "white", fontSize: 18, cursor: "pointer", color: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}
          >−</button>
          <input
            type="number"
            min={1}
            max={30}
            value={sessions}
            onChange={(e) => setSessions(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
            style={{ width: 60, textAlign: "center", padding: "8px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 16, fontWeight: 700, color: "#0F172A" }}
          />
          <button
            onClick={() => setSessions(Math.min(30, sessions + 1))}
            style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #E2E8F0", background: "white", fontSize: 18, cursor: "pointer", color: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}
          >+</button>
          <span style={{ color: "#64748B", fontSize: 14 }}>sessions</span>
        </div>
      </div>

      {/* Price breakdown */}
      <div style={{ background: "#F8F7F4", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#64748B" }}>
          <span>₹{basePrice.toLocaleString("en-IN")} × {sessions} session{sessions > 1 ? "s" : ""}</span>
          <span>₹{sessionTotal.toLocaleString("en-IN")}</span>
        </div>
        {savings > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#16a34a", fontWeight: 600 }}>
            <span>🎉 10+ sessions discount (5%)</span>
            <span>−₹{savings.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#64748B" }}>
          <span>Platform fee (included)</span>
          <span style={{ color: "#16a34a" }}>₹0 extra</span>
        </div>
        <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 10, marginTop: 4, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, color: "#0F172A" }}>
          <span>Total Payable</span>
          <span style={{ color: "#F59E0B" }}>₹{(totalPayable - savings).toLocaleString("en-IN")}</span>
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
          Platform fee is included in the session price. No hidden charges.
        </p>
      </div>

      {!isRecommended && sessions < 7 && (
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#c2410c" }}>
          💡 Most learners need 7+ sessions to pass the RTO test. Consider booking more sessions for better results.
        </div>
      )}

      {/* Book button */}
      <Link
        href={`/trainers/${trainerId}/book?sessions=${sessions}`}
        style={{
          display: "block",
          textAlign: "center",
          background: "#F59E0B",
          color: "#FFFFFF",
          padding: "15px 40px",
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 16,
          textDecoration: "none",
          boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
          marginBottom: 12,
        }}
      >
        Book {sessions} Session{sessions > 1 ? "s" : ""} — ₹{(totalPayable - savings).toLocaleString("en-IN")} →
      </Link>

      <p style={{ color: "#94A3B8", fontSize: 13, textAlign: "center" }}>
        Free cancellation · Secure payment via Razorpay
      </p>
    </div>
  );
}