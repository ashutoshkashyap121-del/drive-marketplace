"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RefundPage() {
  const router = useRouter();
  const [step, setStep]       = useState<"form" | "confirm" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState<any>(null);

  const [bookingId, setBookingId] = useState("");
  const [mobile, setMobile]       = useState("");
  const [reason, setReason]       = useState("");
  const [bookingInfo, setBookingInfo] = useState<any>(null);

  // Step 1 — look up booking
  async function lookupBooking() {
    setError("");
    setLoading(true);
    try {
      const res  = await fetch(`/api/refunds?bookingId=${bookingId}&mobile=${mobile}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Booking not found"); setLoading(false); return; }
      if (!data.eligibleForRefund) {
        setError("This booking is not eligible for a refund. " +
          (data.status === "COMPLETED" ? "Completed sessions cannot be refunded." :
           data.paymentStatus === "REFUNDED" ? "This booking has already been refunded." : ""));
        setLoading(false);
        return;
      }
      setBookingInfo(data);
      setStep("confirm");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  // Step 2 — confirm and submit refund
  async function submitRefund() {
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/refunds", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ bookingId: Number(bookingId), mobile, reason }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Refund failed"); setLoading(false); return; }
      setResult(data);
      setStep("done");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      <div style={{ width: "100%", maxWidth: 460 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>💰</div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
            Request a Refund
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.88rem", marginTop: 8 }}>
            Full refund if your booking wasn't confirmed within 4 hours
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E2E8F0", padding: "32px" }}>

          {/* ── STEP 1: Form ── */}
          {step === "form" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Booking ID</label>
                <input
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="e.g. 42"
                  style={inputStyle}
                />
                <p style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: 4 }}>
                  Found in your booking confirmation SMS/WhatsApp
                </p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Mobile Number</label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  style={inputStyle}
                />
              </div>

              {error && <p style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: 12 }}>{error}</p>}

              <button
                onClick={lookupBooking}
                disabled={loading || !bookingId || !mobile}
                style={{ ...btnStyle, opacity: (!bookingId || !mobile) ? 0.5 : 1 }}
              >
                {loading ? "Looking up..." : "Find My Booking →"}
              </button>
            </>
          )}

          {/* ── STEP 2: Confirm ── */}
          {step === "confirm" && bookingInfo && (
            <>
              <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "16px", marginBottom: 20, border: "1px solid #E2E8F0" }}>
                <p style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>Booking Found</p>
                <p style={{ margin: "4px 0", fontWeight: 600, color: "#0F172A" }}>Booking #{bookingInfo.bookingId}</p>
                <p style={{ margin: "4px 0", color: "#555", fontSize: "0.88rem" }}>
                  Amount: <strong style={{ color: "#F59E0B" }}>₹{bookingInfo.amount?.toLocaleString("en-IN")}</strong>
                </p>
                <p style={{ margin: "4px 0", color: "#555", fontSize: "0.88rem" }}>Status: {bookingInfo.status}</p>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Reason for refund (optional)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Booking was not confirmed, trainer didn't call..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" as any }}
                />
              </div>

              <div style={{ background: "#FEF3C7", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: "0.82rem", color: "#92400E" }}>
                ⚠️ This will cancel your booking and initiate a full refund of{" "}
                <strong>₹{bookingInfo.amount?.toLocaleString("en-IN")}</strong>.
                Refunds take 5–7 business days.
              </div>

              {error && <p style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: 12 }}>{error}</p>}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setStep("form")}
                  style={{ flex: 1, padding: "12px", background: "transparent", border: "1.5px solid #E2E8F0", borderRadius: 12, color: "#64748B", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem" }}
                >
                  Back
                </button>
                <button
                  onClick={submitRefund}
                  disabled={loading}
                  style={{ flex: 2, padding: "12px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 12, fontFamily: "'Sora', sans-serif", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
                >
                  {loading ? "Processing..." : "Confirm Refund"}
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Done ── */}
          {step === "done" && result && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>✅</div>
              <h2 style={{ fontFamily: "'Sora', sans-serif", color: "#0F172A", marginBottom: 8 }}>
                Refund {result.manualRefund ? "Request Received" : "Initiated!"}
              </h2>
              <p style={{ color: "#555", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: 20 }}>
                {result.message}
              </p>
              {result.refundId && (
                <div style={{ background: "#F0FDF4", borderRadius: 12, padding: "12px", marginBottom: 20, fontSize: "0.82rem", color: "#166534" }}>
                  Refund ID: <strong>{result.refundId}</strong>
                </div>
              )}
              <button
                onClick={() => router.push("/")}
                style={btnStyle}
              >
                Back to Home
              </button>
            </div>
          )}
        </div>

        {/* Policy note */}
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94A3B8", marginTop: 16 }}>
          Questions? Call <a href="tel:+918700896528" style={{ color: "#F59E0B" }}>+91 87008 96528</a> or email{" "}
          <a href="mailto:support@learndrive.in" style={{ color: "#F59E0B" }}>support@learndrive.in</a>
        </p>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.82rem", fontWeight: 600,
  color: "#374151", marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", border: "1.5px solid #E2E8F0",
  borderRadius: 10, fontSize: "0.9rem", color: "#0F172A",
  outline: "none", boxSizing: "border-box" as any, background: "#F8FAFC",
};

const btnStyle: React.CSSProperties = {
  width: "100%", padding: "14px",
  background: "linear-gradient(135deg, #F59E0B, #D97706)",
  color: "#fff", border: "none", borderRadius: 12,
  fontFamily: "'Sora', sans-serif", fontSize: "0.95rem",
  fontWeight: 700, cursor: "pointer",
};