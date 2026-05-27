"use client";

import { useState } from "react";
import Link from "next/link";

const SERVICE_FEE = 49;

type Step = "form" | "lookup" | "done";

// Decode state from Indian vehicle number prefix
const STATE_CODES: Record<string, string> = {
  AN:"Andaman & Nicobar",AP:"Andhra Pradesh",AR:"Arunachal Pradesh",AS:"Assam",
  BR:"Bihar",CG:"Chhattisgarh",CH:"Chandigarh",DD:"Daman & Diu",DL:"Delhi",
  DN:"Dadra & Nagar Haveli",GA:"Goa",GJ:"Gujarat",HP:"Himachal Pradesh",
  HR:"Haryana",JH:"Jharkhand",JK:"Jammu & Kashmir",KA:"Karnataka",KL:"Kerala",
  LA:"Ladakh",LD:"Lakshadweep",MH:"Maharashtra",ML:"Meghalaya",MN:"Manipur",
  MP:"Madhya Pradesh",MZ:"Mizoram",NL:"Nagaland",OD:"Odisha",PB:"Punjab",
  PY:"Puducherry",RJ:"Rajasthan",SK:"Sikkim",TN:"Tamil Nadu",TR:"Tripura",
  TS:"Telangana",UK:"Uttarakhand",UP:"Uttar Pradesh",WB:"West Bengal",
};

function decodeVehicle(vehicleNo: string): { state: string; valid: boolean } {
  const cleaned = vehicleNo.trim().toUpperCase().replace(/\s/g, "");
  if (cleaned.length < 4) return { state: "", valid: false };
  const code = cleaned.slice(0, 2);
  const state = STATE_CODES[code] || "";
  const valid = cleaned.length >= 6;
  return { state, valid };
}

const COMMON_FINES = [
  { icon: "📵", label: "Mobile while driving", fine: "₹1,000–5,000" },
  { icon: "🪑", label: "Seatbelt violation",   fine: "₹1,000" },
  { icon: "🚦", label: "Signal jumping",        fine: "₹1,000–5,000" },
  { icon: "⚡", label: "Overspeeding",          fine: "₹1,000–2,000" },
  { icon: "🛑", label: "Parking violation",     fine: "₹500–2,000" },
  { icon: "📄", label: "No RC / DL",            fine: "₹2,000–10,000" },
];

export default function ChallanCheckPage() {
  const [step, setStep]                   = useState<Step>("form");
  const [vehicleNo, setVehicleNo]         = useState("");
  const [name, setName]                   = useState("");
  const [phone, setPhone]                 = useState("");
  const [challanAmount, setChallanAmount] = useState("");
  const [error, setError]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [refCode, setRefCode]             = useState("");
  const [checking, setChecking]           = useState(false);

  const amt   = parseFloat(challanAmount) || 0;
  const total = amt >= 100 ? amt + SERVICE_FEE : 0;
  const decoded = decodeVehicle(vehicleNo);

  function handleCheckChallan() {
    const cleaned = vehicleNo.trim().toUpperCase().replace(/\s/g, "");
    if (!cleaned || cleaned.length < 6) {
      setError("Enter a valid vehicle registration number (e.g. DL01AB1234)");
      return;
    }
    setError("");
    setChecking(true);
    // Open Parivahan in background, show guided step
    window.open("https://echallan.parivahan.gov.in/index/accused-challan", "_blank");
    setTimeout(() => { setChecking(false); setStep("lookup"); }, 1200);
  }

  async function handlePay() {
    const cleaned = vehicleNo.trim().toUpperCase().replace(/\s/g, "");
    if (!cleaned || cleaned.length < 6) { setError("Enter a valid vehicle registration number"); return; }
    if (!name.trim() || name.trim().length < 2) { setError("Enter your full name"); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { setError("Enter a valid 10-digit mobile number"); return; }
    if (!amt || amt < 100) { setError("Enter the challan amount (minimum ₹100)"); return; }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/challan/pay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleNo: cleaned, challanAmount: amt, name: name.trim(), phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.orderId) {
        setError(data.error || "Order creation failed. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.totalAmount * 100,
        currency: "INR",
        name: "LearnDrive",
        description: `Challan for ${cleaned} + ₹${SERVICE_FEE} service fee`,
        order_id: data.orderId,
        prefill: { name: name.trim(), contact: phone },
        theme: { color: "#1a2540" },
        handler: async (response: any) => {
          try {
            const vRes = await fetch("/api/challan/pay-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, vehicleNo: cleaned, challanAmount: amt, name: name.trim(), phone }),
            });
            const vData = await vRes.json();
            if (vData.success) {
              setRefCode(vData.refCode);
              setStep("done");
            } else {
              setError(vData.error || "Verification failed. Contact support.");
            }
          } catch {
            setError("Verification failed. Contact support at +91 87008 96528.");
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
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
        <div style={{ maxWidth: 720, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
            Learn<span style={{ color: "#F59E0B" }}>Drive</span>
          </Link>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/dl-check"          style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>DL Check</Link>
            <Link href="/rto-test/practice" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>RTO Test</Link>
            <Link href="/dl-assistance"     style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>DL Help</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "44px 24px 52px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>🚦</div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,4vw,2.1rem)", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            Pay Your Traffic Challan
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 0 }}>
            Check your fine on Parivahan, then pay right here. We clear it within 4 hours.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 20px 48px" }}>

        {/* ── STEP 1: Vehicle number entry ── */}
        {step === "form" && (
          <>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px" }}>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>Enter your vehicle number</h2>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>We'll look up pending challans and let you pay right here.</p>

              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748B", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Vehicle Registration Number *
                </label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => { setVehicleNo(e.target.value.toUpperCase()); setError(""); }}
                  placeholder="e.g. DL01AB1234"
                  maxLength={12}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 16, fontFamily: "monospace", letterSpacing: 3, outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Live vehicle decode */}
              {decoded.state && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "8px 12px", marginBottom: 16 }}>
                  <span style={{ fontSize: 14 }}>✅</span>
                  <span style={{ fontSize: 13, color: "#166534", fontWeight: 600 }}>
                    Vehicle registered in <strong>{decoded.state}</strong>
                  </span>
                </div>
              )}
              {vehicleNo.length >= 2 && !decoded.state && (
                <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 12px", marginBottom: 16 }}>
                  <span style={{ fontSize: 12, color: "#92400E" }}>⚠ Unrecognised state code — double-check your vehicle number</span>
                </div>
              )}

              {error && <p style={{ color: "#EF4444", fontSize: 12, marginBottom: 12 }}>⚠ {error}</p>}

              <button
                onClick={handleCheckChallan}
                disabled={checking}
                style={{ width: "100%", background: "#F59E0B", color: "#0F172A", border: "none", borderRadius: 10, padding: "15px", fontWeight: 800, fontSize: 15, cursor: checking ? "not-allowed" : "pointer", fontFamily: "'Sora',sans-serif", opacity: checking ? 0.8 : 1 }}
              >
                {checking ? "🔍 Checking challans…" : "Check Challans →"}
              </button>
              <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 8, textAlign: "center" }}>Free to check · Pay only if you want us to clear it</p>
            </div>

          </>
        )}

        {/* ── STEP 2: Lookup result + payment form ── */}
        {step === "lookup" && (
          <>
            {/* Result banner */}
            <div style={{ background: "#fff", borderRadius: 20, border: "2px solid #1a2540", padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🚗</div>
                <div>
                  <p style={{ fontFamily: "monospace", fontSize: 17, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: 2 }}>{vehicleNo.trim().toUpperCase()}</p>
                  {decoded.state && <p style={{ fontSize: 12, color: "#64748B", margin: "3px 0 0" }}>Registered in {decoded.state}</p>}
                </div>
                <button onClick={() => { setStep("form"); setVehicleNo(""); setChallanAmount(""); setError(""); }}
                  style={{ marginLeft: "auto", background: "none", border: "1px solid #E2E8F0", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "#64748B", cursor: "pointer" }}>
                  Change
                </button>
              </div>
            </div>

            {/* Parivahan notice */}
            <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20 }}>📋</span>
                <div>
                  <p style={{ fontWeight: 700, color: "#92400E", fontSize: 13, margin: "0 0 4px" }}>Challan details opened on Parivahan</p>
                  <p style={{ color: "#78350F", fontSize: 12, margin: "0 0 10px", lineHeight: 1.6 }}>
                    A Parivahan tab opened in the background. Note the challan amount shown there, then enter it below to pay right here — without going back to the government site.
                  </p>
                  <a href="https://echallan.parivahan.gov.in/index/accused-challan" target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, color: "#B45309", fontWeight: 700, textDecoration: "underline" }}>
                    Open Parivahan again ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Payment form */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px" }}>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 800, color: "#0F172A", marginBottom: 20 }}>Pay your challan here</h2>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748B", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Your Name *</label>
                <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="Full name"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748B", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Mobile Number *</label>
                <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                  placeholder="10-digit number" inputMode="numeric" maxLength={10}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 11, color: "#64748B", marginBottom: 5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Challan Amount * <span style={{ color: "#94A3B8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— from Parivahan</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748B", fontWeight: 600 }}>₹</span>
                  <input type="number" value={challanAmount} onChange={(e) => { setChallanAmount(e.target.value); setError(""); }}
                    placeholder="e.g. 1000" min={100}
                    style={{ width: "100%", padding: "12px 14px 12px 28px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
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
                    <span>Total</span><span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}

              {error && <p style={{ color: "#EF4444", fontSize: 12, marginBottom: 12 }}>⚠ {error}</p>}

              <button onClick={handlePay} disabled={loading}
                style={{ width: "100%", background: "#1a2540", color: "#fff", border: "none", borderRadius: 10, padding: "15px", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Sora',sans-serif", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Processing..." : total > 0 ? `Pay ₹${total.toLocaleString("en-IN")} →` : "Pay Securely →"}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10 }}>
                <span style={{ fontSize: 11 }}>🔒</span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>Secured by Razorpay · UPI · Cards · Net Banking</span>
              </div>
              <p style={{ fontSize: 11, color: "#CBD5E1", marginTop: 12, lineHeight: 1.6, textAlign: "center" }}>
                We pay your challan on Parivahan.gov.in within 4 hours. Full refund if we can't clear it.
              </p>
            </div>

            {/* Trust strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 16 }}>
              {[
                { icon: "⏱️", label: "4-hr turnaround" },
                { icon: "📱", label: "SMS when done" },
                { icon: "↩️", label: "Full refund if failed" },
              ].map((t) => (
                <div key={t.label} style={{ background: "#fff", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>{t.label}</div>
                </div>
              ))}
            </div>

            {/* Common fines */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px", marginTop: 20 }}>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>Common traffic fines</h2>
              <p style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>Motor Vehicles Act 2019</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                {COMMON_FINES.map((c) => (
                  <div key={c.label} style={{ background: "#F8F7F4", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>{c.label}</div>
                      <div style={{ fontSize: 11, color: "#EF4444", fontWeight: 700, marginTop: 2 }}>{c.fine}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DL Assistance CTA */}
            <div style={{ background: "linear-gradient(135deg, #1a2540, #2d3f6b)", borderRadius: 20, padding: "24px", marginTop: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Prevent future challans</p>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
                Is your Driving Licence valid?
              </h3>
              <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 14 }}>AI fills your Sarathi form + books RTO slot. ₹499 all inclusive.</p>
              <Link href="/dl-assistance" style={{ display: "inline-block", background: "#F59E0B", color: "#1a2540", padding: "10px 18px", borderRadius: 8, fontWeight: 800, fontSize: 13, textDecoration: "none" }}>
                Get DL Assistance — ₹499 →
              </Link>
            </div>
          </>
        )}

        {/* ── SUCCESS STEP ── */}
        {step === "done" && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "32px 28px", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
              Payment received!
            </h2>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20, lineHeight: 1.7 }}>
              We'll clear the challan for{" "}
              <strong style={{ fontFamily: "monospace" }}>{vehicleNo.trim().toUpperCase()}</strong>{" "}
              on Parivahan within <strong>4 hours</strong>. You'll get an SMS confirmation once done.
            </p>

            {refCode && (
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "16px", marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>Reference number</p>
                <p style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 800, color: "#16A34A", margin: 0, letterSpacing: 3 }}>{refCode}</p>
                <p style={{ fontSize: 11, color: "#64748B", margin: "6px 0 0" }}>WhatsApp us at +91 87008 96528 with this if you have questions</p>
              </div>
            )}

            {/* Insurance upsell */}
            <div style={{ background: "linear-gradient(135deg, #7F1D1D, #B91C1C)", borderRadius: 16, padding: "20px", marginBottom: 12, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🛡️</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#FCA5A5", textTransform: "uppercase", letterSpacing: "1px" }}>Important</span>
              </div>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>Is your vehicle insurance still valid?</p>
              <p style={{ fontSize: 12, color: "#FECACA", margin: "0 0 12px" }}>Driving without insurance = ₹2,000 fine. Check in 2 minutes, free.</p>
              <a href="/go/insurance?src=challan-success" target="_blank" rel="noopener noreferrer"
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
              onClick={() => { setStep("form"); setVehicleNo(""); setName(""); setPhone(""); setChallanAmount(""); setRefCode(""); }}
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
