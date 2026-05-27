"use client";

import { useState } from "react";
import Link from "next/link";

const SERVICE_FEE = 49;

type Step = "form" | "done";

export default function ChallanPayPage() {
  const [name, setName]                   = useState("");
  const [phone, setPhone]                 = useState("");
  const [vehicleNo, setVehicleNo]         = useState("");
  const [challanAmount, setChallanAmount] = useState("");
  const [error, setError]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [step, setStep]                   = useState<Step>("form");
  const [refCode, setRefCode]             = useState("");

  const amt = parseFloat(challanAmount) || 0;
  const total = amt > 0 ? amt + SERVICE_FEE : 0;

  async function handlePay() {
    if (!name.trim() || name.trim().length < 2) { setError("Enter your full name"); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { setError("Enter a valid 10-digit mobile number"); return; }
    const cleaned = vehicleNo.trim().toUpperCase().replace(/\s/g, "");
    if (!cleaned || cleaned.length < 6) { setError("Enter a valid vehicle registration number"); return; }
    if (!amt || amt < 100) { setError("Challan amount must be at least ₹100"); return; }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/challan/pay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleNo: cleaned, challanAmount: amt, name: name.trim(), phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.orderId) { setError(data.error || "Order creation failed. Try again."); setLoading(false); return; }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.totalAmount * 100,
        currency: "INR",
        name: "LearnDrive",
        description: `Challan payment for ${cleaned} + ₹49 service fee`,
        order_id: data.orderId,
        prefill: { name: name.trim(), contact: phone },
        theme: { color: "#1a2540" },
        handler: async (response: any) => {
          try {
            const vRes = await fetch("/api/challan/pay-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                vehicleNo: cleaned,
                challanAmount: amt,
                name: name.trim(),
                phone,
              }),
            });
            const vData = await vRes.json();
            if (vData.success) {
              setRefCode(vData.refCode);
              setStep("done");
            } else {
              setError(vData.error || "Payment verification failed. Contact support.");
            }
          } catch {
            setError("Verification failed. Contact support at +91 87008 96528.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Nav */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
            Learn<span style={{ color: "#F59E0B" }}>Drive</span>
          </Link>
          <Link href="/challan-check" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>← Check challans free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "40px 24px 52px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>⚡</div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.5rem,4vw,2rem)", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            Pay Your Traffic Challan
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 6 }}>
            We pay your challan on Parivahan within 4 hours — so you don't have to deal with the portal.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: 99, padding: "6px 16px" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>Just ₹49 service fee · Paid within 4 hrs · SMS confirmation</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 24px" }}>

        {step === "form" && (
          <>
            {/* How it works */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { icon: "📝", title: "Fill details", desc: "Vehicle no + challan amount" },
                { icon: "💳", title: "Pay securely", desc: "Challan + ₹49 service fee" },
                { icon: "✅", title: "We clear it", desc: "Challan paid within 4 hrs" },
              ].map((s) => (
                <div key={s.title} style={{ background: "#fff", borderRadius: 14, padding: "16px 12px", textAlign: "center", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Form card */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px" }}>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", marginBottom: 20 }}>
                Challan details
              </h2>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748B", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Your Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="Full name as on driving licence"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748B", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Mobile Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748B", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Vehicle Registration Number *</label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => { setVehicleNo(e.target.value.toUpperCase()); setError(""); }}
                  placeholder="e.g. DL01AB1234"
                  maxLength={12}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 15, fontFamily: "monospace", letterSpacing: 2, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748B", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Challan Amount (₹) *
                  <span style={{ color: "#94A3B8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}> — from Parivahan portal</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#64748B", fontWeight: 600 }}>₹</span>
                  <input
                    type="number"
                    value={challanAmount}
                    onChange={(e) => { setChallanAmount(e.target.value); setError(""); }}
                    placeholder="e.g. 1000"
                    min={100}
                    style={{ width: "100%", padding: "12px 14px 12px 28px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Fee breakdown */}
              {amt >= 100 && (
                <div style={{ background: "#F8F7F4", borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748B", marginBottom: 6 }}>
                    <span>Challan amount</span><span>₹{amt.toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748B", marginBottom: 8 }}>
                    <span>LearnDrive service fee</span><span>₹{SERVICE_FEE}</span>
                  </div>
                  <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                    <span>Total to pay</span><span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}

              {error && <p style={{ color: "#EF4444", fontSize: 12, marginBottom: 12 }}>⚠ {error}</p>}

              <button
                onClick={handlePay}
                disabled={loading}
                style={{ width: "100%", background: "#1a2540", color: "#fff", border: "none", borderRadius: 10, padding: "15px", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Sora',sans-serif", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Processing..." : total > 0 ? `Pay ₹${total.toLocaleString("en-IN")} Securely →` : "Pay Securely →"}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12 }}>
                <span style={{ fontSize: 12 }}>🔒</span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>Secured by Razorpay · UPI, Cards, Net Banking accepted</span>
              </div>

              <p style={{ fontSize: 11, color: "#CBD5E1", marginTop: 14, lineHeight: 1.6, textAlign: "center" }}>
                We pay your challan on Parivahan.gov.in on your behalf within 4 hours of payment. If we're unable to clear it, you get a full refund including the service fee.
              </p>
            </div>

            {/* Trust strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 16 }}>
              {[
                { icon: "⏱️", label: "4-hr turnaround" },
                { icon: "📱", label: "SMS confirmation" },
                { icon: "↩️", label: "Full refund if failed" },
              ].map((t) => (
                <div key={t.label} style={{ background: "#fff", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>{t.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === "done" && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "32px 28px", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
              Payment received!
            </h2>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 16, lineHeight: 1.7 }}>
              We've received your payment and will clear the challan for{" "}
              <strong style={{ fontFamily: "monospace" }}>{vehicleNo.trim().toUpperCase()}</strong> within{" "}
              <strong>4 hours</strong>. You'll get an SMS confirmation once done.
            </p>

            {refCode && (
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "14px", marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>Your reference number</p>
                <p style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, color: "#16A34A", margin: 0, letterSpacing: 2 }}>{refCode}</p>
                <p style={{ fontSize: 11, color: "#64748B", margin: "6px 0 0" }}>Save this for tracking. Questions? WhatsApp +91 87008 96528</p>
              </div>
            )}

            {/* Insurance upsell */}
            <div style={{ background: "linear-gradient(135deg, #7F1D1D, #B91C1C)", borderRadius: 16, padding: "20px", marginBottom: 12, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🛡️</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#FCA5A5", textTransform: "uppercase", letterSpacing: "1px" }}>Don't forget</span>
              </div>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>Is your vehicle insurance valid?</p>
              <p style={{ fontSize: 12, color: "#FECACA", margin: "0 0 12px" }}>Expired insurance = ₹2,000 fine. Check your policy in 2 minutes, free.</p>
              <a href="/go/insurance?src=challan-pay-success" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", background: "#fff", color: "#B91C1C", padding: "8px 16px", borderRadius: 8, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
                Check / Renew Insurance →
              </a>
            </div>

            {/* DL Assistance upsell */}
            <div style={{ background: "linear-gradient(135deg, #1a2540, #2d3f6b)", borderRadius: 16, padding: "20px", marginBottom: 20, textAlign: "left" }}>
              <p style={{ fontSize: 10, color: "#F59E0B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Avoid your next challan</p>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>Renew your Driving Licence — ₹499</p>
              <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 12px" }}>AI fills your Sarathi form + books RTO slot. All inclusive.</p>
              <Link href="/dl-assistance" style={{ display: "inline-block", background: "#F59E0B", color: "#1a2540", padding: "8px 16px", borderRadius: 8, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
                Get DL Assistance →
              </Link>
            </div>

            <button
              onClick={() => { setStep("form"); setName(""); setPhone(""); setVehicleNo(""); setChallanAmount(""); setRefCode(""); }}
              style={{ background: "none", border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "11px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#64748B" }}
            >
              Pay another challan
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
