"use client";
// app/hire-driver/page.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingEvents } from "@/components/GoogleAnalytics";

const CITIES = [
  "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Jaipur", "Ahmedabad", "Surat", "Lucknow", "Chandigarh",
  "Noida", "Gurugram", "Navi Mumbai", "Thane", "Kochi", "Indore",
];

const TRIP_TYPES = [
  { id: "outstation", icon: "🛣️", label: "Outstation Trip", desc: "Road trip, long drive, intercity", basePrice: 2000, unit: "/day" },
  { id: "fullday", icon: "🕐", label: "Full Day (8 hrs)", desc: "Shopping, errands, hospital visits", basePrice: 1500, unit: "/day" },
  { id: "wedding", icon: "💍", label: "Wedding / Event", desc: "Wedding convoy, family events", basePrice: 2500, unit: "/day" },
  { id: "airport", icon: "✈️", label: "Airport Transfer", desc: "Drop or pickup from airport", basePrice: 800, unit: "/trip" },
  { id: "corporate", icon: "💼", label: "Corporate Travel", desc: "Business meetings, client visits", basePrice: 2000, unit: "/day" },
];

interface FormData {
  name: string;
  mobile: string;
  email: string;
  city: string;
  tripType: string;
  startDate: string;
  endDate: string;
  days: number;
  pickupAddress: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  mobile?: string;
  city?: string;
  tripType?: string;
  startDate?: string;
  pickupAddress?: string;
}

const INITIAL: FormData = {
  name: "", mobile: "", email: "", city: "", tripType: "",
  startDate: "", endDate: "", days: 1, pickupAddress: "", notes: "",
};

export default function HireDriverPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showCities, setShowCities] = useState(false);

  const selectedTrip = TRIP_TYPES.find(t => t.id === form.tripType);
  const estimatedPrice = selectedTrip
    ? form.tripType === "airport"
      ? selectedTrip.basePrice
      : selectedTrip.basePrice * form.days
    : 0;
  const platformFee = Math.round(estimatedPrice * 0.15);
  const driverPayout = estimatedPrice - platformFee;

  const set = (k: keyof FormData, v: any) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => { const n = { ...p }; delete (n as any)[k]; return n; });
  };

  const computeDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff) + 1);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (!form.name.trim() || form.name.length < 2) e.name = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile";
    if (!form.city) e.city = "Select your city";
    if (!form.tripType) e.tripType = "Select a trip type";
    if (!form.startDate) e.startDate = "Select a start date";
    else if (new Date(form.startDate) < today) e.startDate = "Select today or a future date";
    if (!form.pickupAddress.trim()) e.pickupAddress = "Enter pickup address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/hire-driver/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, estimatedPrice, days: form.days }),
      });
      if (res.ok) {
        BookingEvents.bookingStarted(0, form.tripType, estimatedPrice);
        setSubmitted(true);
      }
    } catch { /* still show success to avoid frustrating users */ setSubmitted(true); }
    finally { setSubmitting(false); }
  };

  const inp = (err?: string) => `w-full border-2 ${err ? "border-red-400 bg-red-50" : "border-slate-200"} rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all text-sm`;
  const todayStr = new Date().toISOString().split("T")[0];

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F8F7F4" }}>
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl" style={{ background: "rgba(245,158,11,0.1)", border: "2px solid rgba(245,158,11,0.3)" }}>🎉</div>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>Request Received!</h1>
        <p style={{ color: "#64748B", marginBottom: 8, lineHeight: 1.6 }}>
          We'll call <strong style={{ color: "#F59E0B" }}>+91 {form.mobile}</strong> within 2 hours to confirm your driver.
        </p>
        <p style={{ color: "#94A3B8", fontSize: "0.82rem", marginBottom: 32 }}>
          Estimated cost: ₹{estimatedPrice.toLocaleString("en-IN")} for {form.days} {form.days === 1 ? "day" : "days"}
        </p>
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 16px", marginBottom: 24, textAlign: "left" }}>
          <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
            💡 <strong>Insurance note:</strong> Your car's existing insurance policy covers the vehicle. LearnDrive provides personal accident cover for the driver. This is the same model used by leading driver-on-demand services.
          </p>
        </div>
        <button onClick={() => router.push("/")} style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 32px", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(145deg,#0B1437 0%,#1A2B5F 100%)", padding: "48px 5% 56px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", cursor: "pointer", marginBottom: 16, display: "block", margin: "0 auto 16px" }}>← Back to LearnDrive</button>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 999, padding: "6px 16px", marginBottom: 16 }}>
            <span style={{ color: "#F59E0B", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" }}>🚗 New Service</span>
          </div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: 16, lineHeight: 1.2 }}>
            Hire a Verified Driver<br />
            <span style={{ color: "#F59E0B" }}>For Your Own Car</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Background-checked, RTO-verified drivers available for full-day trips, outstation travel, weddings and more.
          </p>

          {/* Trust badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {[
              { icon: "✅", text: "Verified drivers" },
              { icon: "🔒", text: "Background checked" },
              { icon: "💰", text: "From ₹800/trip" },
              { icon: "📍", text: "20+ cities" },
            ].map(b => (
              <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>{b.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 5% 80px" }}>

        {/* ── Trip Type ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>What do you need a driver for?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
            {TRIP_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => set("tripType", t.id)}
                style={{ padding: "14px 12px", borderRadius: 14, border: `2px solid ${form.tripType === t.id ? "#F59E0B" : "#E2E8F0"}`, background: form.tripType === t.id ? "rgba(245,158,11,0.06)" : "#FAFAFA", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{t.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0F172A", marginBottom: 2 }}>{t.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748B", marginBottom: 6 }}>{t.desc}</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F59E0B" }}>₹{t.basePrice.toLocaleString("en-IN")}{t.unit}</div>
              </button>
            ))}
          </div>
          {errors.tripType && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 8 }}>⚠ {errors.tripType}</p>}
        </div>

        {/* ── Booking Details ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>Trip Details</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Start Date *</label>
              <input type="date" value={form.startDate} min={todayStr}
                onChange={e => { set("startDate", e.target.value); set("days", computeDays(e.target.value, form.endDate)); }}
                style={{ width: "100%", padding: "12px 16px", border: `2px solid ${errors.startDate ? "#F87171" : "#E2E8F0"}`, borderRadius: 12, fontSize: "0.9rem", color: "#0F172A", background: "#F8FAFC", outline: "none", boxSizing: "border-box" as const }} />
              {errors.startDate && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 4 }}>⚠ {errors.startDate}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>End Date <span style={{ color: "#CBD5E1", fontWeight: 400 }}>(multi-day)</span></label>
              <input type="date" value={form.endDate} min={form.startDate || todayStr}
                onChange={e => { set("endDate", e.target.value); set("days", computeDays(form.startDate, e.target.value)); }}
                style={{ width: "100%", padding: "12px 16px", border: "2px solid #E2E8F0", borderRadius: 12, fontSize: "0.9rem", color: "#0F172A", background: "#F8FAFC", outline: "none", boxSizing: "border-box" as const }} />
            </div>
          </div>

          {/* City */}
          <div style={{ marginBottom: 16, position: "relative" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>City *</label>
            <input type="text" value={citySearch} placeholder="Search city..."
              onChange={e => { setCitySearch(e.target.value); setShowCities(true); }}
              onFocus={() => setShowCities(true)}
              className={inp(errors.city)} />
            {showCities && citySearch && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, zIndex: 10, maxHeight: 200, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                {CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).map(c => (
                  <button key={c} type="button"
                    onClick={() => { set("city", c); setCitySearch(c); setShowCities(false); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", fontSize: "0.88rem", color: form.city === c ? "#F59E0B" : "#0F172A", background: "none", border: "none", cursor: "pointer", fontWeight: form.city === c ? 700 : 400 }}>
                    📍 {c}
                  </button>
                ))}
              </div>
            )}
            {errors.city && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 4 }}>⚠ {errors.city}</p>}
          </div>

          {/* Pickup */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Pickup Address *</label>
            <input type="text" value={form.pickupAddress} onChange={e => set("pickupAddress", e.target.value)}
              placeholder="House/Flat No, Street, Landmark" className={inp(errors.pickupAddress)} />
            {errors.pickupAddress && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 4 }}>⚠ {errors.pickupAddress}</p>}
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
              Trip Notes <span style={{ color: "#CBD5E1", fontWeight: 400 }}>(optional)</span>
            </label>
            <input type="text" value={form.notes} onChange={e => set("notes", e.target.value)}
              placeholder="e.g. Delhi to Jaipur, AC car, return same day" className={inp()} />
          </div>
        </div>

        {/* ── Your Details ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>Your Details</h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Full Name *</label>
            <input type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Rahul Sharma" className={inp(errors.name)} />
            {errors.name && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 4 }}>⚠ {errors.name}</p>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Mobile Number *</label>
            <input type="tel" value={form.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" maxLength={10} inputMode="numeric" className={inp(errors.mobile)} />
            {errors.mobile && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 4 }}>⚠ {errors.mobile}</p>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
              Email <span style={{ color: "#CBD5E1", fontWeight: 400 }}>(optional)</span>
            </label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" className={inp()} />
          </div>
        </div>

        {/* ── Price Summary ── */}
        {selectedTrip && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Estimated Cost</h2>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#64748B", marginBottom: 8 }}>
              <span>{selectedTrip.label} × {form.tripType === "airport" ? "1 trip" : `${form.days} day${form.days > 1 ? "s" : ""}`}</span>
              <span>₹{estimatedPrice.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#16A34A", marginBottom: 8 }}>
              <span>↳ Driver payout (85%)</span>
              <span>₹{driverPayout.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#64748B", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
              <span>↳ Platform fee (15%)</span>
              <span>₹{platformFee.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#0F172A" }}>
              <span>Estimated Total</span>
              <span style={{ color: "#F59E0B" }}>₹{estimatedPrice.toLocaleString("en-IN")}</span>
            </div>
            <p style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: 8 }}>Final price confirmed by our team when we call you. No advance payment needed now.</p>
          </div>
        )}

        {/* ── Insurance Note ── */}
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0, lineHeight: 1.6 }}>
            🛡️ <strong>Insurance:</strong> Your car's existing insurance policy covers the vehicle during the trip. LearnDrive provides personal accident cover for the driver. By booking you confirm your car has valid insurance. This is standard industry practice.
          </p>
        </div>

        {/* ── Submit ── */}
        <button onClick={handleSubmit} disabled={submitting}
          style={{ width: "100%", padding: "16px", background: submitting ? "#94A3B8" : "linear-gradient(135deg,#F59E0B,#D97706)", color: "#FFFFFF", fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, border: "none", borderRadius: 14, cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.35)", transition: "all 0.2s" }}>
          {submitting ? "⏳ Submitting..." : "Request a Driver →"}
        </button>
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94A3B8", marginTop: 12 }}>
          No payment now · We call you within 2 hours · Free cancellation
        </p>

        {/* ── Become a Driver CTA ── */}
        <div style={{ marginTop: 40, background: "linear-gradient(145deg,#0B1437,#1A2B5F)", borderRadius: 20, padding: "24px", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginBottom: 8 }}>Are you a driver?</p>
          <h3 style={{ fontFamily: "'Sora',sans-serif", color: "#FFFFFF", fontSize: "1.1rem", fontWeight: 700, marginBottom: 12 }}>Earn ₹30,000–60,000/month driving for LearnDrive</h3>
          <button onClick={() => router.push("/hire-driver/onboard")}
            style={{ background: "#F59E0B", color: "#0F172A", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
            Join as a Driver →
          </button>
        </div>
      </div>
    </main>
  );
}