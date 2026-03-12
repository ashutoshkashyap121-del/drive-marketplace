"use client";
// app/hire-driver/onboard/page.tsx

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const CITIES = [
  "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Jaipur", "Ahmedabad", "Surat", "Lucknow", "Chandigarh",
  "Noida", "Gurugram", "Navi Mumbai", "Thane", "Kochi", "Indore",
];

const TRIP_TYPES = [
  "Outstation / Long Drive",
  "Full Day City Driving",
  "Wedding / Events",
  "Airport Transfers",
  "Corporate Travel",
  "Night Duty",
];

const LANGUAGES = ["Hindi", "English", "Marathi", "Kannada", "Tamil", "Telugu", "Bengali", "Gujarati", "Punjabi"];

interface FormData {
  name: string;
  mobile: string;
  email: string;
  city: string;
  pincode: string;
  licenseNo: string;
  licenseType: string;
  yearsExp: string;
  tripTypes: string[];
  languages: string[];
  hasOwnCar: boolean;
  carModel: string;
  availability: string[];
  about: string;
  agreedToTerms: boolean;
}

interface Errors {
  name?: string;
  mobile?: string;
  city?: string;
  pincode?: string;
  licenseNo?: string;
  licenseType?: string;
  yearsExp?: string;
  tripTypes?: string;
  agreedToTerms?: string;
}

const INITIAL: FormData = {
  name: "", mobile: "", email: "", city: "", pincode: "",
  licenseNo: "", licenseType: "", yearsExp: "",
  tripTypes: [], languages: [],
  hasOwnCar: false, carModel: "",
  availability: [], about: "", agreedToTerms: false,
};

const AVAILABILITY_OPTS = ["Weekday mornings", "Weekday evenings", "Weekends", "Full time", "Night shifts", "On-call"];

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-red-400">⚠ {msg}</p>;
}

export default function DriverOnboardPage() {
  const router = useRouter();
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
    if (!data.name.trim() || data.name.length < 2) e.name = "Full name required";
    if (!/^[6-9]\d{9}$/.test(data.mobile)) e.mobile = "Valid 10-digit mobile required";
    if (!data.city) e.city = "Select your city";
    if (!data.pincode || !/^\d{6}$/.test(data.pincode)) e.pincode = "Enter 6-digit pincode";
    if (!data.licenseNo.trim()) e.licenseNo = "DL number required";
    if (!data.licenseType) e.licenseType = "Select licence type";
    if (!data.yearsExp || isNaN(Number(data.yearsExp)) || Number(data.yearsExp) < 1) e.yearsExp = "Enter years of experience";
    if (data.tripTypes.length === 0) e.tripTypes = "Select at least one trip type";
    if (!data.agreedToTerms) e.agreedToTerms = "Please agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true); setSubmitErr("");
    try {
      const res = await fetch("/api/hire-driver/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setSubmitErr(json.error || "Something went wrong."); return; }
      setDone(true);
    } catch { setSubmitErr("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inp = "w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-sm";
  const bg = { background: "rgba(15,23,42,0.8)" };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f2040 50%,#1a1a2e 100%)" }}>
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl" style={{ background: "rgba(251,191,36,0.15)", border: "2px solid rgba(251,191,36,0.4)" }}>🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">Application Submitted!</h1>
        <p className="text-slate-400 mb-4">We'll call <span className="text-amber-300 font-mono">+91 {data.mobile}</span> within 24 hours for verification.</p>
        <div className="rounded-xl p-4 mb-8 text-left" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <p className="text-sm text-amber-300 font-semibold mb-2">What happens next:</p>
          <div className="space-y-2 text-sm text-slate-300">
            <p>📞 Our team calls to verify your details</p>
            <p>🪪 We check your DL on Sarathi portal</p>
            <p>✅ You get approved and listed as a driver</p>
            <p>💰 Earn ₹1,700–2,125/day (85% of booking)</p>
          </div>
        </div>
        <button onClick={() => router.push("/")} className="px-8 py-3 bg-amber-400 hover:bg-amber-300 font-bold rounded-xl" style={{ color: "#0f172a" }}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f2040 50%,#1a1a2e 100%)" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between" style={{ background: "rgba(10,22,40,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => router.push("/hire-driver")} className="flex items-center gap-2 text-white hover:text-amber-300 transition-colors">
          <span className="text-xl">←</span>
          <span className="hidden sm:block text-sm font-medium">LearnDrive Drivers</span>
        </button>
        <span className="text-xs font-semibold text-amber-400">Driver Application</span>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-8">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">Join LearnDrive Drivers</p>
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">Earn ₹30,000–60,000/month</h1>
          <p className="text-slate-400 text-sm">Drive customers in their own cars. Flexible hours. Weekly payouts. You keep 85% of every booking.</p>
        </div>

        {/* Earnings banner */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { v: "85%", l: "You keep" },
            { v: "₹1,700+", l: "Per day avg" },
            { v: "24hr", l: "Payout cycle" },
          ].map(s => (
            <div key={s.l} className="rounded-xl p-3 text-center" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <p className="text-amber-400 font-bold text-lg" style={{ fontFamily: "'Sora',sans-serif" }}>{s.v}</p>
              <p className="text-slate-400 text-xs">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6 sm:p-8 space-y-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>

          {/* Personal */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest">Personal Details</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Full Name *</label>
              <input type="text" value={data.name} onChange={e => set("name", e.target.value)} placeholder="Raju Sharma" className={inp} style={bg} />
              <FieldError msg={errors.name} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Mobile *</label>
                <input type="tel" value={data.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" maxLength={10} inputMode="numeric" className={inp} style={bg} />
                <FieldError msg={errors.mobile} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email <span className="text-slate-500 font-normal">(optional)</span></label>
                <input type="email" value={data.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" className={inp} style={bg} />
              </div>
            </div>

            {/* City */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">City *</label>
              <input type="text" value={citySearch} onChange={e => setCitySearch(e.target.value)} placeholder="Search city..." className={inp} style={bg} />
              {citySearch && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-slate-600 overflow-hidden max-h-40 overflow-y-auto z-10" style={{ background: "#0d1f38" }}>
                  {CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).map(c => (
                    <button key={c} type="button" onClick={() => { set("city", c); setCitySearch(c); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-amber-400/10 ${data.city === c ? "text-amber-400 font-semibold" : "text-slate-300"}`}>{c}</button>
                  ))}
                </div>
              )}
              <FieldError msg={errors.city} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Home Pincode *</label>
              <input type="text" value={data.pincode} onChange={e => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="110001" maxLength={6} inputMode="numeric" className={inp} style={bg} />
              <FieldError msg={errors.pincode} />
            </div>
          </div>

          {/* Licence */}
          <div className="space-y-4 pt-4 border-t border-slate-700/50">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest">Driving Licence</h2>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">DL Number *</label>
              <input type="text" value={data.licenseNo} onChange={e => set("licenseNo", e.target.value.toUpperCase())} placeholder="DL01XXXXXXXXXX" className={`${inp} font-mono`} style={bg} />
              <FieldError msg={errors.licenseNo} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Licence Type *</label>
              <div className="grid grid-cols-3 gap-2">
                {["LMV", "LMV + HMV", "HMV"].map(lt => (
                  <button key={lt} type="button" onClick={() => set("licenseType", lt)}
                    className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${data.licenseType === lt ? "border-amber-400 bg-amber-400/10 text-amber-300" : "border-slate-600 text-slate-400"}`}>
                    {lt}
                  </button>
                ))}
              </div>
              <FieldError msg={errors.licenseType} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Years of Driving Experience *</label>
              <input type="number" value={data.yearsExp} onChange={e => set("yearsExp", e.target.value)} placeholder="e.g. 8" min="1" className={inp} style={bg} />
              <FieldError msg={errors.yearsExp} />
            </div>
          </div>

          {/* Trip types */}
          <div className="space-y-3 pt-4 border-t border-slate-700/50">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest">Trip Types You Can Handle *</h2>
            <div className="flex flex-wrap gap-2">
              {TRIP_TYPES.map(t => (
                <button key={t} type="button" onClick={() => toggle("tripTypes", t)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${data.tripTypes.includes(t) ? "border-amber-400 bg-amber-400/10 text-amber-300" : "border-slate-600 text-slate-400"}`}>
                  {t}
                </button>
              ))}
            </div>
            <FieldError msg={errors.tripTypes} />
          </div>

          {/* Languages */}
          <div className="space-y-3 pt-4 border-t border-slate-700/50">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(l => (
                <button key={l} type="button" onClick={() => toggle("languages", l)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${data.languages.includes(l) ? "border-amber-400 bg-amber-400/10 text-amber-300" : "border-slate-600 text-slate-400"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3 pt-4 border-t border-slate-700/50">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest">Availability</h2>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_OPTS.map(a => (
                <button key={a} type="button" onClick={() => toggle("availability", a)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${data.availability.includes(a) ? "border-amber-400 bg-amber-400/10 text-amber-300" : "border-slate-600 text-slate-400"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Own car */}
          <div className="pt-4 border-t border-slate-700/50 space-y-3">
            <button type="button" onClick={() => set("hasOwnCar", !data.hasOwnCar)} className="flex items-start gap-3 w-full text-left">
              <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.hasOwnCar ? "border-amber-400 bg-amber-400" : "border-slate-500"}`}>
                {data.hasOwnCar && <span className="text-xs font-bold" style={{ color: "#0f172a" }}>✓</span>}
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-300">I have my own car (optional for more trips)</span>
                <p className="text-xs text-slate-500 mt-0.5">Customers without a car can also book you with your vehicle</p>
              </div>
            </button>
            {data.hasOwnCar && (
              <input type="text" value={data.carModel} onChange={e => set("carModel", e.target.value)} placeholder="e.g. Maruti Swift 2020, White" className={inp} style={bg} />
            )}
          </div>

          {/* About */}
          <div className="pt-4 border-t border-slate-700/50">
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">About You <span className="text-slate-500 font-normal">(optional)</span></label>
            <input type="text" value={data.about} onChange={e => set("about", e.target.value)} placeholder="e.g. 10 years experience, familiar with Delhi-Jaipur-Agra routes" className={inp} style={bg} />
          </div>

          {/* Terms */}
          <div className="pt-4 border-t border-slate-700/50">
            <button type="button" onClick={() => set("agreedToTerms", !data.agreedToTerms)} className="flex items-start gap-3 w-full text-left">
              <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.agreedToTerms ? "border-amber-400 bg-amber-400" : "border-slate-500"}`}>
                {data.agreedToTerms && <span className="text-xs font-bold" style={{ color: "#0f172a" }}>✓</span>}
              </div>
              <span className="text-sm text-slate-300 leading-relaxed">
                I confirm my details are accurate and I have a valid driving licence. I agree to LearnDrive's{" "}
                <a href="/terms" target="_blank" className="text-amber-400 underline">Driver Terms</a> and{" "}
                <a href="/privacy" target="_blank" className="text-amber-400 underline">Privacy Policy</a>.
              </span>
            </button>
            <FieldError msg={errors.agreedToTerms} />
          </div>
        </div>

        {submitErr && (
          <div className="mt-4 rounded-xl px-4 py-3 text-sm text-red-300" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>⚠ {submitErr}</div>
        )}

        <button type="button" onClick={submit} disabled={submitting}
          className="w-full mt-6 py-4 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
          style={{ background: submitting ? "#94A3B8" : "linear-gradient(135deg,#F59E0B,#D97706)", color: "#0f172a", fontFamily: "'Sora',sans-serif", fontSize: "1rem", border: "none", cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.4)" }}>
          {submitting ? <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Submitting...</> : "Submit Driver Application ✓"}
        </button>
        <p className="text-center text-xs text-slate-600 mt-6">🔒 Your data is secure · Verification call within 24 hours</p>
      </div>
    </div>
  );
}