"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessClient() {
  const params = useSearchParams();
  const router = useRouter();
  const bookingId = params.get("id");
  const trainerName = params.get("trainer");
  const isUnverified = params.get("unverified") === "true"; // ← scraped school flag

  // Fire Meta Pixel Purchase event on booking success
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase", {
        currency: "INR",
        content_name: "Driving Session",
        content_category: "Education",
      });
    }
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: "20px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      <div style={{ width: "100%", maxWidth: 460 }}>

        {/* Main card */}
        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E2E8F0", padding: "40px 32px", textAlign: "center", marginBottom: 16 }}>

          {/* Icon — different for unverified */}
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: isUnverified ? "#FFF7ED" : "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 20px" }}>
            {isUnverified ? "📋" : "🎉"}
          </div>

          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", marginBottom: 10 }}>
            {isUnverified ? "Booking Received!" : "Booking Confirmed!"}
          </h1>

          <p style={{ fontSize: "0.92rem", color: "#64748B", lineHeight: 1.7, marginBottom: 24 }}>
            {isUnverified ? (
              <>
                Your payment is confirmed. Our team is coordinating with{" "}
                <strong style={{ color: "#0F172A" }}>{trainerName || "the driving school"}</strong>{" "}
                and will call you within <strong style={{ color: "#0F172A" }}>2 hours</strong> to confirm your session.
              </>
            ) : (
              <>
                Your session with <strong style={{ color: "#0F172A" }}>{trainerName || "your trainer"}</strong> has been booked and payment received. You'll be contacted on your mobile to confirm timing.
              </>
            )}
          </p>

          {/* Booking ID */}
          {bookingId && (
            <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "14px 20px", marginBottom: 24, border: "1px solid #E2E8F0" }}>
              <p style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, marginBottom: 4 }}>Booking Reference</p>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#F59E0B", margin: 0 }}>#{bookingId}</p>
              <p style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: 4 }}>Save this for cancellations or support</p>
            </div>
          )}

          {/* What happens next — different steps for unverified */}
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "16px 20px", textAlign: "left", marginBottom: 24 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>What happens next?</p>
            {(isUnverified ? [
              "Payment confirmed — your booking is locked in",
              "LearnDrive team calls you within 2 hours to confirm details",
              "We coordinate with the school and share your session schedule 🚗",
            ] : [
              "Payment confirmed — your booking is locked in",
              "Trainer will call you to confirm session time & location",
              "Show up at your pickup address on the booked date 🚗",
            ]).map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 2 ? 10 : 0, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "#F59E0B", fontSize: "0.85rem", flexShrink: 0 }}>{i + 1}.</span>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151", lineHeight: 1.6 }}>{step}</p>
              </div>
            ))}
          </div>

          {/* Urgent call notice — only for unverified */}
          {isUnverified && (
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 14, padding: "14px 20px", marginBottom: 24, textAlign: "left" }}>
              <p style={{ fontSize: "0.82rem", color: "#166534", margin: 0, lineHeight: 1.7 }}>
                📞 <strong>Keep your phone reachable.</strong> Our team will call from{" "}
                <strong>+91 87008 96528</strong> to confirm your booking within 2 hours.
              </p>
            </div>
          )}

          {/* Buttons */}
          <button onClick={() => router.push("/trainers")}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#fff", fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", fontWeight: 700, border: "none", borderRadius: 12, cursor: "pointer", marginBottom: 10 }}>
            Book Another Session →
          </button>

          <button onClick={() => router.push("/")}
            style={{ width: "100%", padding: "12px", background: "transparent", color: "#64748B", fontFamily: "'Sora', sans-serif", fontSize: "0.88rem", fontWeight: 600, border: "1.5px solid #E2E8F0", borderRadius: 12, cursor: "pointer" }}>
            Back to Home
          </button>
        </div>

        {/* DL Assistance cross-sell */}
        <div style={{ background: "linear-gradient(135deg, #1a2540, #2d3f6b)", borderRadius: 20, padding: "24px", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12 }}>
            <span style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, border: "1px solid rgba(245,158,11,0.3)" }}>Also from LearnDrive</span>
          </div>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>
            Need help getting your Driving Licence?
          </h3>
          <p style={{ fontSize: "0.82rem", color: "#94A3B8", marginBottom: 16, lineHeight: 1.6 }}>
            Our AI fills your Sarathi form, books your RTO slot, and sends reminders till test day. ₹499 — all inclusive.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {["✅ Form filled in 30 min", "📅 RTO slot booked", "📋 Document checklist", "🔔 Test-day reminders"].map((item) => (
              <span key={item} style={{ fontSize: "0.72rem", color: "#CBD5E1" }}>{item}</span>
            ))}
          </div>
          <button onClick={() => router.push("/dl-assistance")}
            style={{ width: "100%", padding: "13px", background: "#F59E0B", color: "#1a2540", fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", fontWeight: 800, border: "none", borderRadius: 12, cursor: "pointer" }}>
            Get DL Assistance — ₹499 →
          </button>
        </div>

        {/* Cancel / Help links */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "16px 20px" }}>
          <p style={{ fontSize: "0.78rem", color: "#94A3B8", textAlign: "center", marginBottom: 12 }}>Need help with this booking?</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {bookingId && (
              <a href="/cancel"
                style={{ padding: "8px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 100, fontSize: "0.78rem", fontWeight: 600, color: "#DC2626", textDecoration: "none" }}>
                ❌ Cancel Booking
              </a>
            )}
            <a href="/refund"
              style={{ padding: "8px 16px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 100, fontSize: "0.78rem", fontWeight: 600, color: "#475569", textDecoration: "none" }}>
              💰 Refund Policy
            </a>
            <a href="/help"
              style={{ padding: "8px 16px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 100, fontSize: "0.78rem", fontWeight: 600, color: "#475569", textDecoration: "none" }}>
              ❓ Help & FAQ
            </a>
          </div>
        </div>

        {/* Support note */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginBottom: 6 }}>Need help?</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:support@learndrive.in" style={{ fontSize: "0.78rem", color: "#F59E0B", textDecoration: "none", fontWeight: 600 }}>
              📧 support@learndrive.in
            </a>
            <a href="tel:+918700896528" style={{ fontSize: "0.78rem", color: "#94A3B8", textDecoration: "none", fontWeight: 600 }}>
              📞 +91 87008 96528
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}