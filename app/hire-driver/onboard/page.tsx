"use client";
// app/hire-driver/onboard/page.tsx

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Translations ─────────────────────────────────────────────────────────────

const T = {
  en: {
    back: "← LearnDrive Drivers",
    pageTitle: "Driver Application",
    heroTag: "Join LearnDrive Drivers",
    heroTitle: "Earn ₹30,000–60,000/month",
    heroDesc: "Drive customers in their own cars. Flexible hours. Weekly payouts. You keep 85% of every booking.",
    stats: [{ v: "85%", l: "You keep" }, { v: "₹1,700+", l: "Per day avg" }, { v: "24hr", l: "Payout cycle" }],
    sectionPersonal: "Personal Details",
    fullName: "Full Name *",
    namePlaceholder: "Raju Sharma",
    mobile: "Mobile *",
    mobilePlaceholder: "9876543210",
    email: "Email",
    emailPlaceholder: "you@example.com",
    optional: "(optional)",
    city: "City *",
    searchCity: "Search city...",
    pincode: "Home Pincode *",
    pincodePlaceholder: "110001",
    sectionLicence: "Driving Licence",
    dlNumber: "DL Number *",
    dlPlaceholder: "DL01XXXXXXXXXX",
    licenceType: "Licence Type *",
    licenceTypes: ["LMV", "LMV + HMV", "HMV"],
    yearsExp: "Years of Driving Experience *",
    yearsExpPlaceholder: "e.g. 8",
    sectionTripTypes: "Trip Types You Can Handle *",
    tripTypes: ["Outstation / Long Drive", "Full Day City Driving", "Wedding / Events", "Airport Transfers", "Corporate Travel", "Night Duty"],
    sectionLanguages: "Languages",
    languages: ["Hindi", "English", "Marathi", "Kannada", "Tamil", "Telugu", "Bengali", "Gujarati", "Punjabi"],
    sectionAvailability: "Availability",
    availability: ["Weekday mornings", "Weekday evenings", "Weekends", "Full time", "Night shifts", "On-call"],
    ownCar: "I have my own car (optional for more trips)",
    ownCarDesc: "Customers without a car can also book you with your vehicle",
    carModelPlaceholder: "e.g. Maruti Swift 2020, White",
    about: "About You",
    aboutPlaceholder: "e.g. 10 years experience, familiar with Delhi-Jaipur-Agra routes",
    termsText: "I confirm my details are accurate and I have a valid driving licence. I agree to LearnDrive's",
    termsLink: "Driver Terms",
    privacyLink: "Privacy Policy",
    submit: "Submit Driver Application ✓",
    submitting: "Submitting...",
    successTitle: "Application Submitted!",
    successMsg: "We'll call you within 24 hours for verification.",
    nextSteps: "What happens next:",
    steps: ["📞 Our team calls to verify your details", "🪪 We check your DL on Sarathi portal", "✅ You get approved and listed as a driver", "💰 Earn ₹1,700–2,125/day (85% of booking)"],
    backHome: "Back to Home",
    errors: {
      name: "Full name required",
      mobile: "Valid 10-digit mobile required",
      city: "Select your city",
      pincode: "Enter 6-digit pincode",
      licenseNo: "DL number required",
      licenseType: "Select licence type",
      yearsExp: "Enter years of experience",
      tripTypes: "Select at least one trip type",
      terms: "Please agree to the terms",
    },
  },
  hi: {
    back: "← LearnDrive ड्राइवर्स",
    pageTitle: "ड्राइवर आवेदन",
    heroTag: "LearnDrive ड्राइवर्स से जुड़ें",
    heroTitle: "₹30,000–60,000/माह कमाएं",
    heroDesc: "ग्राहकों की अपनी कार में ड्राइव करें। लचीले घंटे। साप्ताहिक भुगतान। हर बुकिंग का 85% आप रखें।",
    stats: [{ v: "85%", l: "आप रखते हैं" }, { v: "₹1,700+", l: "प्रतिदिन औसत" }, { v: "24 घंटे", l: "भुगतान चक्र" }],
    sectionPersonal: "व्यक्तिगत विवरण",
    fullName: "पूरा नाम *",
    namePlaceholder: "राजू शर्मा",
    mobile: "मोबाइल *",
    mobilePlaceholder: "9876543210",
    email: "ईमेल",
    emailPlaceholder: "you@example.com",
    optional: "(वैकल्पिक)",
    city: "शहर *",
    searchCity: "शहर खोजें...",
    pincode: "घर का पिनकोड *",
    pincodePlaceholder: "110001",
    sectionLicence: "ड्राइविंग लाइसेंस",
    dlNumber: "DL नंबर *",
    dlPlaceholder: "DL01XXXXXXXXXX",
    licenceType: "लाइसेंस प्रकार *",
    licenceTypes: ["LMV", "LMV + HMV", "HMV"],
    yearsExp: "ड्राइविंग अनुभव (वर्षों में) *",
    yearsExpPlaceholder: "जैसे 8",
    sectionTripTypes: "आप किस प्रकार की यात्रा कर सकते हैं? *",
    tripTypes: ["बाहरी / लंबी ड्राइव", "पूरे दिन शहर में ड्राइविंग", "शादी / कार्यक्रम", "एयरपोर्ट ट्रांसफर", "कॉर्पोरेट यात्रा", "रात की ड्यूटी"],
    sectionLanguages: "भाषाएं",
    languages: ["हिंदी", "अंग्रेज़ी", "मराठी", "कन्नड़", "तमिल", "तेलुगु", "बंगाली", "गुजराती", "पंजाबी"],
    sectionAvailability: "उपलब्धता",
    availability: ["सप्ताह के दिन सुबह", "सप्ताह के दिन शाम", "सप्ताहांत", "पूर्णकालिक", "रात की पाली", "मांग पर"],
    ownCar: "मेरे पास अपनी कार है (अधिक यात्राओं के लिए वैकल्पिक)",
    ownCarDesc: "बिना कार वाले ग्राहक भी आपकी कार से बुकिंग कर सकते हैं",
    carModelPlaceholder: "जैसे मारुति स्विफ्ट 2020, सफेद",
    about: "अपने बारे में",
    aboutPlaceholder: "जैसे 10 साल का अनुभव, दिल्ली-जयपुर-आगरा रूट से परिचित",
    termsText: "मैं पुष्टि करता/करती हूं कि मेरे विवरण सटीक हैं और मेरे पास वैध ड्राइविंग लाइसेंस है। मैं LearnDrive की",
    termsLink: "ड्राइवर शर्तों",
    privacyLink: "गोपनीयता नीति",
    submit: "ड्राइवर आवेदन सबमिट करें ✓",
    submitting: "सबमिट हो रहा है...",
    successTitle: "आवेदन सबमिट हुआ!",
    successMsg: "हम सत्यापन के लिए 24 घंटे के भीतर कॉल करेंगे।",
    nextSteps: "आगे क्या होगा:",
    steps: ["📞 हमारी टीम आपके विवरण सत्यापित करने के लिए कॉल करेगी", "🪪 हम सारथी पोर्टल पर आपका DL जांचेंगे", "✅ आप अप्रूव होकर ड्राइवर के रूप में लिस्ट होंगे", "💰 ₹1,700–2,125/दिन कमाएं (बुकिंग का 85%)"],
    backHome: "होम पर वापस जाएं",
    errors: {
      name: "पूरा नाम आवश्यक है",
      mobile: "वैध 10 अंकों का मोबाइल नंबर आवश्यक है",
      city: "शहर चुनें",
      pincode: "6 अंकों का पिनकोड दर्ज करें",
      licenseNo: "DL नंबर आवश्यक है",
      licenseType: "लाइसेंस प्रकार चुनें",
      yearsExp: "अनुभव के वर्ष दर्ज करें",
      tripTypes: "कम से कम एक यात्रा प्रकार चुनें",
      terms: "कृपया शर्तों से सहमत हों",
    },
  },
};

const CITIES = ["Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Surat", "Lucknow", "Chandigarh", "Noida", "Gurugram", "Navi Mumbai", "Thane", "Kochi", "Indore"];

interface FormData {
  name: string; mobile: string; email: string; city: string; pincode: string;
  licenseNo: string; licenseType: string; yearsExp: string;
  tripTypes: string[]; languages: string[]; availability: string[];
  hasOwnCar: boolean; carModel: string; about: string; agreedToTerms: boolean;
}
interface Errors { name?: string; mobile?: string; city?: string; pincode?: string; licenseNo?: string; licenseType?: string; yearsExp?: string; tripTypes?: string; agreedToTerms?: string; }

const INITIAL: FormData = { name: "", mobile: "", email: "", city: "", pincode: "", licenseNo: "", licenseType: "", yearsExp: "", tripTypes: [], languages: [], availability: [], hasOwnCar: false, carModel: "", about: "", agreedToTerms: false };

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p style={{ marginTop: 6, fontSize: "0.75rem", color: "#F87171" }}>⚠ {msg}</p>;
}

export default function DriverOnboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "hi">("en");
  const t = T[lang];
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [done, setDone] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const set = useCallback((k: keyof FormData, v: any) => {
    setData(p => ({ ...p, [k]: v }));
    setErrors(p => { const n = { ...p }; delete (n as any)[k]; return n; });
  }, []);

  const toggle = (k: "tripTypes" | "languages" | "availability", v: string) => {
    const arr = data[k] as string[];
    set(k, arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!data.name.trim() || data.name.length < 2) e.name = t.errors.name;
    if (!/^[6-9]\d{9}$/.test(data.mobile)) e.mobile = t.errors.mobile;
    if (!data.city) e.city = t.errors.city;
    if (!data.pincode || !/^\d{6}$/.test(data.pincode)) e.pincode = t.errors.pincode;
    if (!data.licenseNo.trim()) e.licenseNo = t.errors.licenseNo;
    if (!data.licenseType) e.licenseType = t.errors.licenseType;
    if (!data.yearsExp || isNaN(Number(data.yearsExp)) || Number(data.yearsExp) < 1) e.yearsExp = t.errors.yearsExp;
    if (data.tripTypes.length === 0) e.tripTypes = t.errors.tripTypes;
    if (!data.agreedToTerms) e.agreedToTerms = t.errors.terms;
    setErrors(e); return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true); setSubmitErr("");
    try {
      const res = await fetch("/api/hire-driver/onboard", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) { setSubmitErr(json.error || "Something went wrong."); return; }
      setDone(true);
    } catch { setSubmitErr("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inp = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all";
  const inpStyle = { background: "rgba(15,23,42,0.8)", border: "1px solid #334155", borderRadius: 12, width: "100%", padding: "12px 16px", color: "#fff", fontSize: "0.9rem", outline: "none" };
  const chipActive = { border: "1px solid #F59E0B", background: "rgba(245,158,11,0.1)", color: "#FCD34D", padding: "8px 14px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" };
  const chipInactive = { border: "1px solid #334155", background: "transparent", color: "#94A3B8", padding: "8px 14px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" };

  if (done) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px", background: "linear-gradient(135deg,#0a1628 0%,#0f2040 50%,#1a1a2e 100%)" }}>
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(251,191,36,0.15)", border: "2px solid rgba(251,191,36,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 36 }}>🎉</div>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#FFFFFF", marginBottom: 12 }}>{t.successTitle}</h1>
        <p style={{ color: "#94A3B8", marginBottom: 24 }}>{t.successMsg}</p>
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 14, padding: "16px 20px", marginBottom: 32, textAlign: "left" }}>
          <p style={{ color: "#FCD34D", fontWeight: 700, fontSize: "0.85rem", marginBottom: 12 }}>{t.nextSteps}</p>
          {t.steps.map((s, i) => <p key={i} style={{ color: "#CBD5E1", fontSize: "0.85rem", marginBottom: 8 }}>{s}</p>)}
        </div>
        <button onClick={() => router.push("/")} style={{ background: "#F59E0B", color: "#0F172A", border: "none", borderRadius: 12, padding: "12px 32px", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora',sans-serif" }}>{t.backHome}</button>
      </div>
    </div>
  );

  const section = (title: string) => (
    <h2 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>{title}</h2>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a1628 0%,#0f2040 50%,#1a1a2e 100%)", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, padding: "0 5%", background: "rgba(10,22,40,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", alignItems: "center", height: 56, justifyContent: "space-between" }}>
          <button onClick={() => router.push("/hire-driver")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", cursor: "pointer" }}>{t.back}</button>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", borderRadius: 999, padding: 3 }}>
            {(["en", "hi"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                style={{ padding: "5px 16px", borderRadius: 999, border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem", background: lang === l ? "#F59E0B" : "transparent", color: lang === l ? "#0F172A" : "rgba(255,255,255,0.5)", transition: "all 0.15s" }}>
                {l === "en" ? "EN" : "हि"}
              </button>
            ))}
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F59E0B" }}>{t.pageTitle}</span>
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 5% 80px" }}>

        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: "#F59E0B", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{t.heroTag}</p>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: 10 }}>{t.heroTitle}</h1>
          <p style={{ color: "#94A3B8", fontSize: "0.9rem", lineHeight: 1.6 }}>{t.heroDesc}</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
          {t.stats.map(s => (
            <div key={s.l} style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#F59E0B" }}>{s.v}</p>
              <p style={{ color: "#94A3B8", fontSize: "0.72rem", marginTop: 2 }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 24px" }}>

          {/* Personal */}
          <h2 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>{t.sectionPersonal}</h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#CBD5E1", marginBottom: 8 }}>{t.fullName}</label>
            <input type="text" value={data.name} onChange={e => set("name", e.target.value)} placeholder={t.namePlaceholder} style={inpStyle} />
            <FieldError msg={errors.name} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#CBD5E1", marginBottom: 8 }}>{t.mobile}</label>
              <input type="tel" value={data.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder={t.mobilePlaceholder} maxLength={10} inputMode="numeric" style={inpStyle} />
              <FieldError msg={errors.mobile} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#CBD5E1", marginBottom: 8 }}>{t.email} <span style={{ color: "#475569", fontWeight: 400 }}>{t.optional}</span></label>
              <input type="email" value={data.email} onChange={e => set("email", e.target.value)} placeholder={t.emailPlaceholder} style={inpStyle} />
            </div>
          </div>

          <div style={{ marginBottom: 16, position: "relative" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#CBD5E1", marginBottom: 8 }}>{t.city}</label>
            <input type="text" value={citySearch} onChange={e => setCitySearch(e.target.value)} placeholder={t.searchCity} style={inpStyle} />
            {citySearch && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#0d1f38", border: "1px solid #334155", borderRadius: 12, zIndex: 10, maxHeight: 180, overflowY: "auto" }}>
                {CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).map(c => (
                  <button key={c} type="button" onClick={() => { set("city", c); setCitySearch(c); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", fontSize: "0.88rem", color: data.city === c ? "#F59E0B" : "#CBD5E1", background: "none", border: "none", cursor: "pointer" }}>
                    {c}
                  </button>
                ))}
              </div>
            )}
            <FieldError msg={errors.city} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#CBD5E1", marginBottom: 8 }}>{t.pincode}</label>
            <input type="text" value={data.pincode} onChange={e => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder={t.pincodePlaceholder} maxLength={6} inputMode="numeric" style={inpStyle} />
            <FieldError msg={errors.pincode} />
          </div>

          {section(t.sectionLicence)}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#CBD5E1", marginBottom: 8 }}>{t.dlNumber}</label>
            <input type="text" value={data.licenseNo} onChange={e => set("licenseNo", e.target.value.toUpperCase())} placeholder={t.dlPlaceholder} style={{ ...inpStyle, fontFamily: "monospace" }} />
            <FieldError msg={errors.licenseNo} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#CBD5E1", marginBottom: 10 }}>{t.licenceType}</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {t.licenceTypes.map(lt => (
                <button key={lt} type="button" onClick={() => set("licenseType", lt)} style={data.licenseType === lt ? chipActive : chipInactive}>{lt}</button>
              ))}
            </div>
            <FieldError msg={errors.licenseType} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#CBD5E1", marginBottom: 8 }}>{t.yearsExp}</label>
            <input type="number" value={data.yearsExp} onChange={e => set("yearsExp", e.target.value)} placeholder={t.yearsExpPlaceholder} min="1" style={inpStyle} />
            <FieldError msg={errors.yearsExp} />
          </div>

          {section(t.sectionTripTypes)}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {t.tripTypes.map((tp, i) => {
              // Match against English keys for DB storage
              const enKey = T.en.tripTypes[i];
              return (
                <button key={tp} type="button" onClick={() => toggle("tripTypes", enKey)} style={data.tripTypes.includes(enKey) ? chipActive : chipInactive}>{tp}</button>
              );
            })}
          </div>
          <FieldError msg={errors.tripTypes} />

          {section(t.sectionLanguages)}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {t.languages.map((l, i) => {
              const enKey = T.en.languages[i];
              return (
                <button key={l} type="button" onClick={() => toggle("languages", enKey)} style={data.languages.includes(enKey) ? chipActive : chipInactive}>{l}</button>
              );
            })}
          </div>

          {section(t.sectionAvailability)}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {t.availability.map((a, i) => {
              const enKey = T.en.availability[i];
              return (
                <button key={a} type="button" onClick={() => toggle("availability", enKey)} style={data.availability.includes(enKey) ? chipActive : chipInactive}>{a}</button>
              );
            })}
          </div>

          {/* Own car */}
          <div style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: data.hasOwnCar ? 12 : 24 }}>
            <button type="button" onClick={() => set("hasOwnCar", !data.hasOwnCar)} style={{ display: "flex", alignItems: "flex-start", gap: 12, width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
              <div style={{ marginTop: 2, width: 20, height: 20, borderRadius: 6, border: `2px solid ${data.hasOwnCar ? "#F59E0B" : "#475569"}`, background: data.hasOwnCar ? "#F59E0B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {data.hasOwnCar && <span style={{ color: "#0F172A", fontWeight: 800, fontSize: "0.7rem" }}>✓</span>}
              </div>
              <div>
                <p style={{ color: "#CBD5E1", fontSize: "0.88rem", fontWeight: 600, marginBottom: 2 }}>{t.ownCar}</p>
                <p style={{ color: "#64748B", fontSize: "0.78rem" }}>{t.ownCarDesc}</p>
              </div>
            </button>
          </div>
          {data.hasOwnCar && (
            <div style={{ marginBottom: 24 }}>
              <input type="text" value={data.carModel} onChange={e => set("carModel", e.target.value)} placeholder={t.carModelPlaceholder} style={inpStyle} />
            </div>
          )}

          {/* About */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#CBD5E1", marginBottom: 8 }}>{t.about} <span style={{ color: "#475569", fontWeight: 400 }}>{t.optional}</span></label>
            <input type="text" value={data.about} onChange={e => set("about", e.target.value)} placeholder={t.aboutPlaceholder} style={inpStyle} />
          </div>

          {/* Terms */}
          <div style={{ paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button type="button" onClick={() => set("agreedToTerms", !data.agreedToTerms)} style={{ display: "flex", alignItems: "flex-start", gap: 12, width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
              <div style={{ marginTop: 2, width: 20, height: 20, borderRadius: 6, border: `2px solid ${data.agreedToTerms ? "#F59E0B" : "#475569"}`, background: data.agreedToTerms ? "#F59E0B" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {data.agreedToTerms && <span style={{ color: "#0F172A", fontWeight: 800, fontSize: "0.7rem" }}>✓</span>}
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.83rem", lineHeight: 1.6, margin: 0 }}>
                {t.termsText}{" "}
                <a href="/terms" target="_blank" style={{ color: "#F59E0B" }}>{t.termsLink}</a> &{" "}
                <a href="/privacy" target="_blank" style={{ color: "#F59E0B" }}>{t.privacyLink}</a>.
              </p>
            </button>
            <FieldError msg={errors.agreedToTerms} />
          </div>
        </div>

        {submitErr && (
          <div style={{ marginTop: 16, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "12px 16px", color: "#F87171", fontSize: "0.85rem" }}>⚠ {submitErr}</div>
        )}

        <button type="button" onClick={submit} disabled={submitting}
          style={{ width: "100%", marginTop: 24, padding: "16px", background: submitting ? "#475569" : "linear-gradient(135deg,#F59E0B,#D97706)", color: "#0F172A", fontFamily: "'Sora',sans-serif", fontSize: "1rem", fontWeight: 800, border: "none", borderRadius: 14, cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.4)" }}>
          {submitting ? t.submitting : t.submit}
        </button>
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#475569", marginTop: 16 }}>🔒 {lang === "en" ? "Your data is secure · Verification call within 24 hours" : "आपका डेटा सुरक्षित है · 24 घंटे में सत्यापन कॉल"}</p>
      </div>
    </div>
  );
}