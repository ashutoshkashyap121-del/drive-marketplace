"use client";
// app/hire-driver/page.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingEvents } from "@/components/GoogleAnalytics";

// ─── Translations ─────────────────────────────────────────────────────────────

const T = {
  en: {
    badge: "🚗 New Service",
    hero: "Hire a Verified Driver",
    heroSub: "For Your Own Car",
    heroDesc: "Background-checked, RTO-verified drivers available for full-day trips, outstation travel, weddings and more.",
    trust: ["✅ Verified drivers", "🔒 Background checked", "💰 From ₹800/trip", "📍 20+ cities"],
    tripTypeTitle: "What do you need a driver for?",
    tripTypes: [
      { id: "outstation", icon: "🛣️", label: "Outstation Trip", desc: "Road trip, long drive, intercity", basePrice: 2000, unit: "/day" },
      { id: "fullday", icon: "🕐", label: "Full Day (8 hrs)", desc: "Shopping, errands, hospital visits", basePrice: 1500, unit: "/day" },
      { id: "wedding", icon: "💍", label: "Wedding / Event", desc: "Wedding convoy, family events", basePrice: 2500, unit: "/day" },
      { id: "airport", icon: "✈️", label: "Airport Transfer", desc: "Drop or pickup from airport", basePrice: 800, unit: "/trip" },
      { id: "corporate", icon: "💼", label: "Corporate Travel", desc: "Business meetings, client visits", basePrice: 2000, unit: "/day" },
    ],
    tripDetails: "Trip Details",
    startDate: "Start Date *",
    endDate: "End Date (multi-day)",
    city: "City *",
    searchCity: "Search city...",
    pickupAddress: "Pickup Address *",
    pickupPlaceholder: "House/Flat No, Street, Landmark",
    notes: "Trip Notes (optional)",
    notesPlaceholder: "e.g. Delhi to Jaipur, AC car, return same day",
    yourDetails: "Your Details",
    fullName: "Full Name *",
    namePlaceholder: "Rahul Sharma",
    mobile: "Mobile Number *",
    mobilePlaceholder: "9876543210",
    email: "Email",
    emailPlaceholder: "you@example.com",
    optional: "(optional)",
    estimatedCost: "Estimated Cost",
    driverPayout: "Driver payout (85%)",
    platformFee: "Platform fee (15%)",
    estimatedTotal: "Estimated Total",
    priceNote: "Final price confirmed by our team when we call you. No advance payment needed now.",
    insuranceNote: "🛡️ Insurance: Your car's existing insurance policy covers the vehicle during the trip. LearnDrive provides personal accident cover for the driver. By booking you confirm your car has valid insurance.",
    submit: "Request a Driver →",
    submitting: "⏳ Submitting...",
    bottomNote: "No payment now · We call you within 2 hours · Free cancellation",
    successTitle: "Request Received!",
    successMsg: "We'll call you within 2 hours to confirm your driver.",
    successEst: "Estimated cost",
    successDays: "days",
    backHome: "Back to Home",
    becomeDriver: "Are you a driver?",
    becomeDriverTitle: "Earn ₹30,000–60,000/month driving for LearnDrive",
    joinDriver: "Join as a Driver →",
    errors: {
      name: "Enter your full name",
      mobile: "Enter a valid 10-digit mobile",
      city: "Select your city",
      tripType: "Select a trip type",
      startDate: "Select a start date",
      startDatePast: "Select today or a future date",
      pickup: "Enter pickup address",
    },
  },
  hi: {
    badge: "🚗 नई सेवा",
    hero: "सत्यापित ड्राइवर किराए पर लें",
    heroSub: "अपनी खुद की कार के लिए",
    heroDesc: "बैकग्राउंड-चेक्ड, RTO-सत्यापित ड्राइवर उपलब्ध — पूरे दिन की यात्रा, बाहरी सफ़र, शादी और अधिक के लिए।",
    trust: ["✅ सत्यापित ड्राइवर", "🔒 बैकग्राउंड चेक्ड", "💰 ₹800/यात्रा से शुरू", "📍 20+ शहर"],
    tripTypeTitle: "आपको ड्राइवर की क्यों जरूरत है?",
    tripTypes: [
      { id: "outstation", icon: "🛣️", label: "बाहरी यात्रा", desc: "रोड ट्रिप, लंबी ड्राइव, अंतरशहर", basePrice: 2000, unit: "/दिन" },
      { id: "fullday", icon: "🕐", label: "पूरा दिन (8 घंटे)", desc: "शॉपिंग, काम, अस्पताल", basePrice: 1500, unit: "/दिन" },
      { id: "wedding", icon: "💍", label: "शादी / कार्यक्रम", desc: "शादी काफिला, पारिवारिक कार्यक्रम", basePrice: 2500, unit: "/दिन" },
      { id: "airport", icon: "✈️", label: "एयरपोर्ट ट्रांसफर", desc: "एयरपोर्ट छोड़ना या लेना", basePrice: 800, unit: "/यात्रा" },
      { id: "corporate", icon: "💼", label: "कॉर्पोरेट यात्रा", desc: "बिज़नेस मीटिंग, क्लाइंट विज़िट", basePrice: 2000, unit: "/दिन" },
    ],
    tripDetails: "यात्रा विवरण",
    startDate: "शुरुआत की तारीख *",
    endDate: "समाप्ति तारीख (बहु-दिन)",
    city: "शहर *",
    searchCity: "शहर खोजें...",
    pickupAddress: "पिकअप पता *",
    pickupPlaceholder: "मकान/फ्लैट नं., सड़क, लैंडमार्क",
    notes: "यात्रा नोट्स (वैकल्पिक)",
    notesPlaceholder: "जैसे दिल्ली से जयपुर, AC कार, उसी दिन वापसी",
    yourDetails: "आपका विवरण",
    fullName: "पूरा नाम *",
    namePlaceholder: "राहुल शर्मा",
    mobile: "मोबाइल नंबर *",
    mobilePlaceholder: "9876543210",
    email: "ईमेल",
    emailPlaceholder: "you@example.com",
    optional: "(वैकल्पिक)",
    estimatedCost: "अनुमानित लागत",
    driverPayout: "ड्राइवर को (85%)",
    platformFee: "प्लेटफ़ॉर्म शुल्क (15%)",
    estimatedTotal: "अनुमानित कुल",
    priceNote: "हमारी टीम कॉल करने पर अंतिम कीमत बताएगी। अभी कोई अग्रिम भुगतान नहीं।",
    insuranceNote: "🛡️ बीमा: यात्रा के दौरान आपकी कार का मौजूदा बीमा लागू रहेगा। LearnDrive ड्राइवर के लिए व्यक्तिगत दुर्घटना कवर देता है। बुकिंग करके आप पुष्टि करते हैं कि आपकी कार का वैध बीमा है।",
    submit: "ड्राइवर का अनुरोध करें →",
    submitting: "⏳ सबमिट हो रहा है...",
    bottomNote: "अभी भुगतान नहीं · 2 घंटे में कॉल · मुफ़्त रद्दीकरण",
    successTitle: "अनुरोध प्राप्त हुआ!",
    successMsg: "हम आपके ड्राइवर की पुष्टि के लिए 2 घंटे में कॉल करेंगे।",
    successEst: "अनुमानित लागत",
    successDays: "दिन",
    backHome: "होम पर वापस जाएं",
    becomeDriver: "क्या आप ड्राइवर हैं?",
    becomeDriverTitle: "LearnDrive के साथ ₹30,000–60,000/माह कमाएं",
    joinDriver: "ड्राइवर के रूप में जुड़ें →",
    errors: {
      name: "अपना पूरा नाम दर्ज करें",
      mobile: "वैध 10 अंकों का मोबाइल नंबर दर्ज करें",
      city: "शहर चुनें",
      tripType: "यात्रा प्रकार चुनें",
      startDate: "शुरुआत की तारीख चुनें",
      startDatePast: "आज या भविष्य की तारीख चुनें",
      pickup: "पिकअप पता दर्ज करें",
    },
  },
};

const CITIES = [
  "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Jaipur", "Ahmedabad", "Surat",
  "Lucknow", "Chandigarh", "Noida", "Gurugram", "Navi Mumbai",
  "Thane", "Kochi", "Indore",
];

interface FormData {
  name: string; mobile: string; email: string; city: string;
  tripType: string; startDate: string; endDate: string;
  days: number; pickupAddress: string; notes: string;
}
interface FormErrors { name?: string; mobile?: string; city?: string; tripType?: string; startDate?: string; pickupAddress?: string; }

const INITIAL: FormData = { name: "", mobile: "", email: "", city: "", tripType: "", startDate: "", endDate: "", days: 1, pickupAddress: "", notes: "" };

export default function HireDriverPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "hi">("en");
  const t = T[lang];
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showCities, setShowCities] = useState(false);

  const selectedTrip = t.tripTypes.find(tp => tp.id === form.tripType);
  const estimatedPrice = selectedTrip ? (form.tripType === "airport" ? selectedTrip.basePrice : selectedTrip.basePrice * form.days) : 0;
  const platformFee = Math.round(estimatedPrice * 0.15);
  const driverPayout = estimatedPrice - platformFee;

  const set = (k: keyof FormData, v: any) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => { const n = { ...p }; delete (n as any)[k]; return n; }); };

  const computeDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff) + 1);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (!form.name.trim() || form.name.length < 2) e.name = t.errors.name;
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = t.errors.mobile;
    if (!form.city) e.city = t.errors.city;
    if (!form.tripType) e.tripType = t.errors.tripType;
    if (!form.startDate) e.startDate = t.errors.startDate;
    else if (new Date(form.startDate) < today) e.startDate = t.errors.startDatePast;
    if (!form.pickupAddress.trim()) e.pickupAddress = t.errors.pickup;
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await fetch("/api/hire-driver/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, estimatedPrice, days: form.days }) });
      BookingEvents.bookingStarted(0, form.tripType, estimatedPrice);
      setSubmitted(true);
    } catch { setSubmitted(true); }
    finally { setSubmitting(false); }
  };

  const inp = (err?: string) => `w-full border-2 ${err ? "border-red-400 bg-red-50" : "border-slate-200"} rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all text-sm`;
  const todayStr = new Date().toISOString().split("T")[0];

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#F8F7F4" }}>
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl" style={{ background: "rgba(245,158,11,0.1)" }}>🎉</div>
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>{t.successTitle}</h1>
        <p style={{ color: "#64748B", marginBottom: 8 }}>{t.successMsg}</p>
        <p style={{ color: "#94A3B8", fontSize: "0.82rem", marginBottom: 32 }}>
          {t.successEst}: ₹{estimatedPrice.toLocaleString("en-IN")} — {form.days} {t.successDays}
        </p>
        <button onClick={() => router.push("/")} style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 32px", fontWeight: 700, cursor: "pointer" }}>
          {t.backHome}
        </button>
      </div>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(145deg,#0B1437 0%,#1A2B5F 100%)", padding: "48px 5% 56px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", cursor: "pointer", marginBottom: 16, display: "block", margin: "0 auto 16px" }}>← Back</button>

          {/* Lang toggle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: 4, display: "flex", gap: 2 }}>
              {(["en", "hi"] as const).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  style={{ padding: "6px 20px", borderRadius: 999, border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", background: lang === l ? "#F59E0B" : "transparent", color: lang === l ? "#0F172A" : "rgba(255,255,255,0.6)", transition: "all 0.15s" }}>
                  {l === "en" ? "English" : "हिंदी"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 999, padding: "6px 16px", marginBottom: 16 }}>
            <span style={{ color: "#F59E0B", fontSize: "0.78rem", fontWeight: 700 }}>{t.badge}</span>
          </div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: 8, lineHeight: 1.2 }}>
            {t.hero}<br /><span style={{ color: "#F59E0B" }}>{t.heroSub}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>{t.heroDesc}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {t.trust.map(b => <span key={b} style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>{b}</span>)}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 5% 80px" }}>

        {/* Trip Type */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>{t.tripTypeTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 12 }}>
            {t.tripTypes.map(tp => (
              <button key={tp.id} type="button" onClick={() => set("tripType", tp.id)}
                style={{ padding: "14px 12px", borderRadius: 14, border: `2px solid ${form.tripType === tp.id ? "#F59E0B" : "#E2E8F0"}`, background: form.tripType === tp.id ? "rgba(245,158,11,0.06)" : "#FAFAFA", cursor: "pointer", textAlign: "left" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{tp.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0F172A", marginBottom: 2 }}>{tp.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748B", marginBottom: 6 }}>{tp.desc}</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#F59E0B" }}>₹{tp.basePrice.toLocaleString("en-IN")}{tp.unit}</div>
              </button>
            ))}
          </div>
          {errors.tripType && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 8 }}>⚠ {errors.tripType}</p>}
        </div>

        {/* Trip Details */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>{t.tripDetails}</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{t.startDate}</label>
              <input type="date" value={form.startDate} min={todayStr}
                onChange={e => { set("startDate", e.target.value); set("days", computeDays(e.target.value, form.endDate)); }}
                style={{ width: "100%", padding: "12px 16px", border: `2px solid ${errors.startDate ? "#F87171" : "#E2E8F0"}`, borderRadius: 12, fontSize: "0.9rem", color: "#0F172A", background: "#F8FAFC", outline: "none", boxSizing: "border-box" as const }} />
              {errors.startDate && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 4 }}>⚠ {errors.startDate}</p>}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{t.endDate}</label>
              <input type="date" value={form.endDate} min={form.startDate || todayStr}
                onChange={e => { set("endDate", e.target.value); set("days", computeDays(form.startDate, e.target.value)); }}
                style={{ width: "100%", padding: "12px 16px", border: "2px solid #E2E8F0", borderRadius: 12, fontSize: "0.9rem", color: "#0F172A", background: "#F8FAFC", outline: "none", boxSizing: "border-box" as const }} />
            </div>
          </div>

          <div style={{ marginBottom: 16, position: "relative" }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{t.city}</label>
            <input type="text" value={citySearch} placeholder={t.searchCity}
              onChange={e => { setCitySearch(e.target.value); setShowCities(true); }}
              onFocus={() => setShowCities(true)}
              className={inp(errors.city)} />
            {showCities && citySearch && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, zIndex: 10, maxHeight: 200, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                {CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).map(c => (
                  <button key={c} type="button" onClick={() => { set("city", c); setCitySearch(c); setShowCities(false); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", fontSize: "0.88rem", color: form.city === c ? "#F59E0B" : "#0F172A", background: "none", border: "none", cursor: "pointer" }}>
                    📍 {c}
                  </button>
                ))}
              </div>
            )}
            {errors.city && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 4 }}>⚠ {errors.city}</p>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{t.pickupAddress}</label>
            <input type="text" value={form.pickupAddress} onChange={e => set("pickupAddress", e.target.value)} placeholder={t.pickupPlaceholder} className={inp(errors.pickupAddress)} />
            {errors.pickupAddress && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 4 }}>⚠ {errors.pickupAddress}</p>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{t.notes}</label>
            <input type="text" value={form.notes} onChange={e => set("notes", e.target.value)} placeholder={t.notesPlaceholder} className={inp()} />
          </div>
        </div>

        {/* Your Details */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>{t.yourDetails}</h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{t.fullName}</label>
            <input type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder={t.namePlaceholder} className={inp(errors.name)} />
            {errors.name && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 4 }}>⚠ {errors.name}</p>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{t.mobile}</label>
            <input type="tel" value={form.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder={t.mobilePlaceholder} maxLength={10} inputMode="numeric" className={inp(errors.mobile)} />
            {errors.mobile && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 4 }}>⚠ {errors.mobile}</p>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{t.email} <span style={{ color: "#CBD5E1", fontWeight: 400, textTransform: "none" }}>{t.optional}</span></label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder={t.emailPlaceholder} className={inp()} />
          </div>
        </div>

        {/* Price Summary */}
        {selectedTrip && (
          <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>{t.estimatedCost}</h2>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#64748B", marginBottom: 8 }}>
              <span>{selectedTrip.label} × {form.tripType === "airport" ? "1" : form.days}</span>
              <span>₹{estimatedPrice.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#16A34A", marginBottom: 8 }}>
              <span>↳ {t.driverPayout}</span><span>₹{driverPayout.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#64748B", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
              <span>↳ {t.platformFee}</span><span>₹{platformFee.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#0F172A" }}>
              <span>{t.estimatedTotal}</span><span style={{ color: "#F59E0B" }}>₹{estimatedPrice.toLocaleString("en-IN")}</span>
            </div>
            <p style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: 8 }}>{t.priceNote}</p>
          </div>
        )}

        {/* Insurance */}
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
          <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0, lineHeight: 1.6 }}>{t.insuranceNote}</p>
        </div>

        <button onClick={handleSubmit} disabled={submitting}
          style={{ width: "100%", padding: "16px", background: submitting ? "#94A3B8" : "linear-gradient(135deg,#F59E0B,#D97706)", color: "#FFFFFF", fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 700, border: "none", borderRadius: 14, cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.35)" }}>
          {submitting ? t.submitting : t.submit}
        </button>
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94A3B8", marginTop: 12 }}>{t.bottomNote}</p>

        <div style={{ marginTop: 40, background: "linear-gradient(145deg,#0B1437,#1A2B5F)", borderRadius: 20, padding: "24px", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginBottom: 8 }}>{t.becomeDriver}</p>
          <h3 style={{ fontFamily: "'Sora',sans-serif", color: "#FFFFFF", fontSize: "1.1rem", fontWeight: 700, marginBottom: 12 }}>{t.becomeDriverTitle}</h3>
          <button onClick={() => router.push("/hire-driver/onboard")}
            style={{ background: "#F59E0B", color: "#0F172A", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
            {t.joinDriver}
          </button>
        </div>
      </div>
    </main>
  );
}