"use client";

import { useState } from "react";

export default function RemoveListingPage() {
  const [step, setStep]       = useState<"form" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [name, setName]       = useState("");
  const [mobile, setMobile]   = useState("");
  const [city, setCity]       = useState("");
  const [reason, setReason]   = useState("");

  async function submit() {
    if (!name || !mobile) { setError("Name and mobile are required"); return; }
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/remove-listing", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, mobile, city, reason }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); setLoading(false); return; }
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

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>🏫</div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>
            Remove Your Listing
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.85rem", marginTop: 8, lineHeight: 1.6 }}>
            If you found your driving school listed on LearnDrive without your consent,
            fill this form and we'll remove it within 24 hours.
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E2E8F0", padding: "32px" }}>

          {step === "form" ? (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>School / Business Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. New India Motor Driving School" style={inputStyle} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Registered Mobile Number *</label>
                <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile" maxLength={10} style={inputStyle} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" style={inputStyle} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Reason (optional)</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. We did not authorize this listing..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" as any }}
                />
              </div>

              {error && <p style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: 12 }}>{error}</p>}

              <button onClick={submit} disabled={loading} style={btnStyle}>
                {loading ? "Submitting..." : "Submit Removal Request"}
              </button>

              <p style={{ fontSize: "0.75rem", color: "#94A3B8", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
                Your listing will be suspended immediately and removed within 24 hours.
                Any pending bookings will be automatically refunded to customers.
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>✅</div>
              <h2 style={{ fontFamily: "'Sora', sans-serif", color: "#0F172A" }}>Request Received</h2>
              <p style={{ color: "#555", fontSize: "0.88rem", lineHeight: 1.7 }}>
                Your listing for <strong>{name}</strong> will be removed within 24 hours.
                Any active bookings will be automatically cancelled and refunded.
              </p>
              <p style={{ color: "#888", fontSize: "0.82rem", marginTop: 16 }}>
                Questions? Email <a href="mailto:remove@learndrive.in" style={{ color: "#F59E0B" }}>remove@learndrive.in</a>
              </p>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94A3B8", marginTop: 16 }}>
          Alternatively email us at{" "}
          <a href="mailto:remove@learndrive.in" style={{ color: "#F59E0B" }}>remove@learndrive.in</a>
        </p>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", border: "1.5px solid #E2E8F0",
  borderRadius: 10, fontSize: "0.9rem", color: "#0F172A",
  outline: "none", boxSizing: "border-box" as any, background: "#F8FAFC",
};
const btnStyle: React.CSSProperties = {
  width: "100%", padding: "14px", background: "#1a1a2e",
  color: "#fff", border: "none", borderRadius: 12,
  fontFamily: "'Sora', sans-serif", fontSize: "0.95rem",
  fontWeight: 700, cursor: "pointer",
};