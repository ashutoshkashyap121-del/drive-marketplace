"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();
  const [step, setStep] = useState<"lookup" | "confirm" | "done">("lookup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [form, setForm] = useState({ bookingId: "", mobile: "" });

  const handleLookup = async () => {
    if (!form.bookingId || !form.mobile) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings/lookup?id=${form.bookingId}&mobile=${form.mobile}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Booking not found"); setLoading(false); return; }
      setBooking(data.booking);
      setStep("confirm");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id, mobile: form.mobile }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Cancellation failed"); setLoading(false); return; }
      setStep("done");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px",
    border: "2px solid #E2E8F0", borderRadius: 12,
    fontSize: "0.92rem", fontFamily: "inherit",
    color: "#0F172A", background: "#F8FAFC",
    outline: "none", boxSizing: "border-box" as const,
  };

  const sessionDate = booking ? new Date(booking.bookingDate) : null;
  const hoursUntil = sessionDate ? (sessionDate.getTime() - Date.now()) / (1000 * 60 * 60) : 0;
  const refundPercent = hoursUntil >= 24 ? 100 : hoursUntil > 0 ? 50 : 0;
  const refundAmount = booking ? Math.round((booking.amount * refundPercent) / 100) : 0;

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0B1437, #1A2B5F)", padding: "24px 5%" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", cursor: "pointer", marginBottom: 8, padding: 0 }}>← Back</button>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>Cancel Booking</h1>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 5% 80px" }}>

        {/* Step 1: Lookup */}
        {step === "lookup" && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 28 }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>Find your booking</h2>
            <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: 24 }}>Enter your booking ID and mobile number to continue.</p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Booking ID *</label>
              <input style={inputStyle} type="text" placeholder="e.g. 42" value={form.bookingId}
                onChange={(e) => setForm({ ...form, bookingId: e.target.value.replace(/\D/g, "") })}
                inputMode="numeric" />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Registered Mobile *</label>
              <input style={inputStyle} type="tel" placeholder="9876543210" maxLength={10}
                value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })}
                inputMode="numeric" />
            </div>

            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 10, padding: "10px 14px", fontSize: "0.85rem", marginBottom: 16 }}>⚠ {error}</div>}

            <button onClick={handleLookup} disabled={loading}
              style={{ width: "100%", padding: 14, background: loading ? "#94A3B8" : "linear-gradient(135deg, #F59E0B, #D97706)", color: "#fff", fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", fontWeight: 700, border: "none", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Looking up..." : "Find Booking →"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94A3B8", marginTop: 14 }}>
              Your booking ID is in your confirmation email or SMS.
            </p>
          </div>
        )}

        {/* Step 2: Confirm cancellation */}
        {step === "confirm" && booking && (
          <div>
            {/* Booking summary */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, marginBottom: 16 }}>
              <p style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, marginBottom: 4 }}>Booking #{booking.id}</p>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>{booking.trainerName}</h2>
              <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: 16 }}>
                📅 {new Date(booking.bookingDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748B" }}>Amount paid</span>
                <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "#0F172A" }}>₹{booking.amount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Refund summary */}
            <div style={{
              background: refundPercent === 100 ? "#F0FDF4" : refundPercent === 50 ? "#FFFBEB" : "#FEF2F2",
              border: `1px solid ${refundPercent === 100 ? "#BBF7D0" : refundPercent === 50 ? "#FDE68A" : "#FECACA"}`,
              borderRadius: 16, padding: 20, marginBottom: 20,
            }}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#0F172A", marginBottom: 8 }}>
                {refundPercent === 100 ? "✅ You'll get a full refund" : refundPercent === 50 ? "⚠️ You'll get a 50% refund" : "❌ No refund applicable"}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#374151", marginBottom: 0 }}>
                {refundPercent === 100
                  ? `₹${refundAmount.toLocaleString("en-IN")} will be refunded to your original payment method within 5–7 business days.`
                  : refundPercent === 50
                  ? `₹${refundAmount.toLocaleString("en-IN")} will be refunded. Same-day cancellations are eligible for 50% only.`
                  : "Your session has already passed or no refund is applicable."}
              </p>
            </div>

            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 10, padding: "10px 14px", fontSize: "0.85rem", marginBottom: 16 }}>⚠ {error}</div>}

            <button onClick={handleCancel} disabled={loading || refundPercent === 0}
              style={{ width: "100%", padding: 14, background: loading ? "#94A3B8" : "#EF4444", color: "#fff", fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", fontWeight: 700, border: "none", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer", marginBottom: 12 }}>
              {loading ? "Cancelling..." : `Confirm Cancellation & Refund ₹${refundAmount.toLocaleString("en-IN")}`}
            </button>

            <button onClick={() => setStep("lookup")}
              style={{ width: "100%", padding: 12, background: "transparent", color: "#64748B", fontFamily: "'Sora', sans-serif", fontSize: "0.88rem", fontWeight: 600, border: "1.5px solid #E2E8F0", borderRadius: 12, cursor: "pointer" }}>
              ← Go Back
            </button>
          </div>
        )}

        {/* Step 3: Done */}
        {step === "done" && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>Booking Cancelled</h2>
            <p style={{ fontSize: "0.9rem", color: "#64748B", marginBottom: 8, lineHeight: 1.6 }}>
              Your refund of <strong>₹{refundAmount.toLocaleString("en-IN")}</strong> has been initiated.
            </p>
            <p style={{ fontSize: "0.82rem", color: "#94A3B8", marginBottom: 32 }}>
              It will appear in your account within 5–7 business days.
            </p>
            <button onClick={() => router.push("/trainers")}
              style={{ padding: "13px 28px", background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.95rem", border: "none", borderRadius: 12, cursor: "pointer" }}>
              Book Another Session →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}