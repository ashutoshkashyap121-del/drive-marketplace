"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type VehicleType = "CAR" | "BIKE_GEARED" | "BIKE_NON_GEARED";

interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  pincode: string;
  serviceArea: string[];
  vehicleTypes: VehicleType[];
  yearsExp: string;
  pricePerHour: string;
  languages: string[];
  licenseNo: string;
  agreedToTerms: boolean;
}

const CITIES = [
  "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
  "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
  "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Aurangabad",
  "Dhanbad", "Amritsar", "Allahabad", "Ranchi", "Howrah", "Coimbatore",
  "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur",
  "Kota", "Chandigarh", "Guwahati", "Solapur", "Hubli", "Mysuru",
  "Tiruchirappalli", "Dehradun", "Kochi", "Noida", "Gurugram",
  "Navi Mumbai", "Pimpri-Chinchwad", "Kalyan", "Vasai-Virar",
];

const VEHICLE_OPTIONS: { value: VehicleType; label: string; icon: string; desc: string }[] = [
  { value: "CAR", label: "Car", icon: "🚗", desc: "Manual & automatic" },
  { value: "BIKE_GEARED", label: "Geared Bike", icon: "🏍️", desc: "Motorcycles" },
  { value: "BIKE_NON_GEARED", label: "Scooter", icon: "🛵", desc: "Non-geared / automatic" },
];

const LANGUAGES = ["Hindi", "English", "Marathi", "Kannada", "Tamil", "Telugu", "Bengali", "Gujarati", "Punjabi"];

const STEPS = [
  { id: 1, label: "You", icon: "👤" },
  { id: 2, label: "Location", icon: "📍" },
  { id: 3, label: "Teaching", icon: "🎓" },
  { id: 4, label: "Confirm", icon: "✅" },
];

const INITIAL_DATA: FormData = {
  name: "", phone: "", email: "",
  city: "", pincode: "", serviceArea: [],
  vehicleTypes: [], yearsExp: "", pricePerHour: "", languages: [],
  licenseNo: "", agreedToTerms: false,
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><span>⚠</span>{msg}</p>;
}

function validateStep(step: number, data: FormData): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {};

  if (step === 1) {
    if (!data.name.trim() || data.name.length < 2) errors.name = "Full name required";
    if (!data.phone || !/^[6-9]\d{9}$/.test(data.phone)) errors.phone = "Valid 10-digit mobile required";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email";
  }

  if (step === 2) {
    if (!data.city) errors.city = "Select your city";
    if (!data.pincode || !/^\d{6}$/.test(data.pincode)) errors.pincode = "Enter your 6-digit home pincode";
    if (data.serviceArea.length === 0) errors.serviceArea = "Add at least one service pincode";
  }

  if (step === 3) {
    if (data.vehicleTypes.length === 0) errors.vehicleTypes = "Select at least one vehicle type";
    if (!data.yearsExp || isNaN(Number(data.yearsExp)) || Number(data.yearsExp) < 1)
      errors.yearsExp = "Enter years of experience";
    if (data.languages.length === 0) errors.languages = "Select at least one language";
    const price = Number(data.pricePerHour);
    if (!data.pricePerHour || isNaN(price) || price < 200 || price > 5000)
      errors.pricePerHour = "Price must be between ₹200 and ₹5,000";
  }

  if (step === 4) {
    if (!data.licenseNo || data.licenseNo.length < 10) errors.licenseNo = "Enter your DL number";
    if (!data.agreedToTerms) errors.agreedToTerms = "Please agree to continue";
  }

  return errors;
}

export default function TrainerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeError, setPincodeError] = useState("");

  const onChange = useCallback((key: keyof FormData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const toggleVehicle = (v: VehicleType) => {
    const current = data.vehicleTypes;
    onChange("vehicleTypes", current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
  };

  const toggleLang = (l: string) => {
    const current = data.languages;
    onChange("languages", current.includes(l) ? current.filter((x) => x !== l) : [...current, l]);
  };

  const addPincode = () => {
    const p = pincodeInput.trim();
    if (!/^\d{6}$/.test(p)) { setPincodeError("Enter a valid 6-digit pincode"); return; }
    if (data.serviceArea.includes(p)) { setPincodeError("Pincode already added"); return; }
    if (data.serviceArea.length >= 10) { setPincodeError("Maximum 10 pincodes allowed"); return; }
    onChange("serviceArea", [...data.serviceArea, p]);
    setPincodeInput("");
    setPincodeError("");
  };

  const removePincode = (p: string) => {
    onChange("serviceArea", data.serviceArea.filter((x) => x !== p));
  };

  const goNext = () => {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setErrors({});
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(4, data);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/trainers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email || undefined,
          mobile: data.phone,
          bio: "",
          city: data.city,
          pincode: data.pincode,
          serviceArea: data.serviceArea,
          vehicleTypes: data.vehicleTypes,
          experience: Number(data.yearsExp),
          languages: data.languages,
          basePrice: Number(data.pricePerHour),
          licenseNumber: data.licenseNo,
          documents: {},
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const progress = (step / STEPS.length) * 100;

  // ── Success Screen ──
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1a1a2e 100%)" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
            style={{ background: "rgba(251,191,36,0.15)", border: "2px solid rgba(251,191,36,0.4)" }}>
            🎉
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">You're registered!</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Thanks, <span className="text-amber-300 font-semibold">{data.name}</span>!
            Our team will call you on{" "}
            <span className="text-amber-300 font-mono">+91 {data.phone}</span>{" "}
            within <strong className="text-white">24 hours</strong>.
          </p>
          <div className="rounded-2xl p-5 mb-8 text-left space-y-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <span className="text-amber-400 font-bold">✓</span>Application received
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="text-slate-600">○</span>Our team calls you within 24 hours
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="text-slate-600">○</span>Quick document check via WhatsApp
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="text-slate-600">○</span>Profile goes live — students start booking!
            </div>
          </div>
          <button onClick={() => router.push("/")}
            className="px-8 py-3 bg-amber-400 hover:bg-amber-300 font-bold rounded-xl transition-colors"
            style={{ color: "#0f172a" }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ── Main Form ──
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1a1a2e 100%)" }}>

      <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between"
        style={{ background: "rgba(10,22,40,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => router.push("/")}
          className="flex items-center gap-2 text-white hover:text-amber-300 transition-colors">
          <span className="text-xl">←</span>
          <span className="hidden sm:block text-sm font-medium">LearnDrive</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Step {step} of {STEPS.length}</span>
          <span className="text-xs font-semibold text-amber-400">{STEPS[step - 1].label}</span>
        </div>
      </header>

      <div className="h-0.5 bg-slate-800">
        <div className="h-full bg-amber-400 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div className="max-w-xl mx-auto px-4 py-10">

        {/* Step indicators */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                step > s.id ? "bg-amber-400" : step === s.id ? "bg-amber-400/20 border-2 border-amber-400 text-amber-400" : "bg-slate-800 border border-slate-600 text-slate-500"
              }`} style={{ color: step > s.id ? "#0f172a" : undefined }}>
                {step > s.id ? "✓" : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${step > s.id ? "bg-amber-400" : "bg-slate-700"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mb-8">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">Trainer Registration</p>
          <h1 className="text-3xl font-bold text-white leading-tight">
            {step === 1 && "Let's start with you"}
            {step === 2 && "Where do you teach?"}
            {step === 3 && "What do you teach?"}
            {step === 4 && "Almost done!"}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {step === 1 && "Just your name and number — takes 30 seconds"}
            {step === 2 && "Your city and pincodes you cover — so students find you"}
            {step === 3 && "Vehicle types, experience, and your pricing"}
            {step === 4 && "One last thing and you're in"}
          </p>
        </div>

        <div className="rounded-2xl p-6 sm:p-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Full Name <span className="text-amber-400">*</span></label>
                <input type="text" value={data.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Rajesh Kumar"
                  className="w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  style={{ background: "rgba(15,23,42,0.8)" }} />
                <FieldError msg={errors.name} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Mobile Number <span className="text-amber-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">+91</span>
                  <input type="tel" value={data.phone} onChange={(e) => onChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210" maxLength={10}
                    className="w-full border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    style={{ background: "rgba(15,23,42,0.8)" }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">We'll call you on this number within 24 hours</p>
                <FieldError msg={errors.phone} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email <span className="text-slate-500 font-normal">(optional)</span></label>
                <input type="email" value={data.email} onChange={(e) => onChange("email", e.target.value)} placeholder="rajesh@example.com"
                  className="w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                  style={{ background: "rgba(15,23,42,0.8)" }} />
                <FieldError msg={errors.email} />
              </div>
              <div className="rounded-xl p-4 border border-amber-400/15 mt-2" style={{ background: "rgba(251,191,36,0.04)" }}>
                <p className="text-sm font-semibold text-amber-300 mb-2">Why join LearnDrive?</p>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <p>✅ Get 10–15 extra students per month</p>
                  <p>✅ You keep 85% of every booking</p>
                  <p>✅ No monthly fee, no joining fee</p>
                  <p>✅ Students come to you — no marketing needed</p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="space-y-6">
              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Your City <span className="text-amber-400">*</span></label>
                <input type="text" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Search city..."
                  className="w-full border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all mb-2 text-sm"
                  style={{ background: "rgba(15,23,42,0.8)" }} />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {filteredCities.map((city) => (
                    <button key={city} type="button" onClick={() => onChange("city", city)}
                      className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        data.city === city ? "border-amber-400 bg-amber-400/10 text-amber-300" : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                      }`} style={{ background: data.city === city ? "rgba(251,191,36,0.1)" : "rgba(15,23,42,0.6)" }}>
                      {data.city === city && <span className="text-amber-400 mr-1">✓</span>}{city}
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.city} />
              </div>

              {/* Home pincode */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Your Home Pincode <span className="text-amber-400">*</span>
                </label>
                <input type="text" value={data.pincode}
                  onChange={(e) => onChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="e.g. 110045" maxLength={6} inputMode="numeric"
                  className="w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-mono"
                  style={{ background: "rgba(15,23,42,0.8)" }} />
                <p className="mt-1 text-xs text-slate-500">The pincode of the area where you are based</p>
                <FieldError msg={errors.pincode} />
              </div>

              {/* Service pincodes */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">
                  Pincodes You Serve <span className="text-amber-400">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Add all pincodes you can travel to for training. Students search by pincode — more pincodes = more visibility.
                </p>
                <div className="flex gap-2">
                  <input type="text" value={pincodeInput}
                    onChange={(e) => { setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6)); setPincodeError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && addPincode()}
                    placeholder="110001" maxLength={6} inputMode="numeric"
                    className="flex-1 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all font-mono text-sm"
                    style={{ background: "rgba(15,23,42,0.8)" }} />
                  <button type="button" onClick={addPincode}
                    className="px-5 py-3 bg-amber-400 hover:bg-amber-300 font-bold rounded-xl text-sm transition-all flex-shrink-0"
                    style={{ color: "#0f172a" }}>
                    + Add
                  </button>
                </div>
                {pincodeError && <p className="mt-1 text-xs text-red-400">⚠ {pincodeError}</p>}

                {data.serviceArea.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {data.serviceArea.map((p) => (
                      <span key={p} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-medium"
                        style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: "#fcd34d" }}>
                        📍 {p}
                        <button type="button" onClick={() => removePincode(p)}
                          className="text-slate-400 hover:text-red-400 transition-colors ml-0.5 text-xs">✕</button>
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-2 text-xs text-slate-600">{data.serviceArea.length}/10 pincodes added</p>
                <FieldError msg={errors.serviceArea} />
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Vehicle Types You Train <span className="text-amber-400">*</span></label>
                <div className="grid grid-cols-1 gap-3">
                  {VEHICLE_OPTIONS.map((v) => {
                    const selected = data.vehicleTypes.includes(v.value);
                    return (
                      <button key={v.value} type="button" onClick={() => toggleVehicle(v.value)}
                        className={`flex items-center gap-4 px-4 py-4 rounded-xl border text-left transition-all ${selected ? "border-amber-400 bg-amber-400/10" : "border-slate-600 hover:border-slate-500"}`}
                        style={{ background: selected ? "rgba(251,191,36,0.1)" : "rgba(15,23,42,0.8)" }}>
                        <span className="text-2xl">{v.icon}</span>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${selected ? "text-amber-300" : "text-slate-200"}`}>{v.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{v.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selected ? "border-amber-400 bg-amber-400" : "border-slate-600"}`}>
                          {selected && <span className="text-xs font-bold" style={{ color: "#0f172a" }}>✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <FieldError msg={errors.vehicleTypes} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Years Experience <span className="text-amber-400">*</span></label>
                  <input type="number" value={data.yearsExp} onChange={(e) => onChange("yearsExp", e.target.value)} placeholder="5" min="1"
                    className="w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                    style={{ background: "rgba(15,23,42,0.8)" }} />
                  <FieldError msg={errors.yearsExp} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Price per Hour <span className="text-amber-400">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
                    <input type="number" value={data.pricePerHour} onChange={(e) => onChange("pricePerHour", e.target.value)} placeholder="500" min={200} max={5000}
                      className="w-full border border-slate-600 rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                      style={{ background: "rgba(15,23,42,0.8)" }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">₹200 – ₹5,000</p>
                  <FieldError msg={errors.pricePerHour} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Teaching Languages <span className="text-amber-400">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => {
                    const selected = data.languages.includes(lang);
                    return (
                      <button key={lang} type="button" onClick={() => toggleLang(lang)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${selected ? "border-amber-400 bg-amber-400/10 text-amber-300" : "border-slate-600 text-slate-400 hover:border-slate-500"}`}
                        style={{ background: selected ? "rgba(251,191,36,0.1)" : "transparent" }}>
                        {selected && "✓ "}{lang}
                      </button>
                    );
                  })}
                </div>
                <FieldError msg={errors.languages} />
              </div>
            </div>
          )}

          {/* ── STEP 4 ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="rounded-xl p-4 border border-blue-500/20 text-sm text-blue-300"
                style={{ background: "rgba(59,130,246,0.07)" }}>
                🔒 Your DL number is for verification only. Never shared publicly.
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Driving Licence Number <span className="text-amber-400">*</span></label>
                <input type="text" value={data.licenseNo} onChange={(e) => onChange("licenseNo", e.target.value.toUpperCase())} placeholder="DL0120230001234"
                  className="w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-mono"
                  style={{ background: "rgba(15,23,42,0.8)" }} />
                <p className="mt-1 text-xs text-slate-500">Must cover the vehicle types you selected</p>
                <FieldError msg={errors.licenseNo} />
              </div>

              <div className="rounded-xl p-4 border border-slate-700 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Summary</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-slate-500">Name</span><span className="text-slate-200 font-medium">{data.name}</span>
                  <span className="text-slate-500">Phone</span><span className="text-slate-200 font-mono">+91 {data.phone}</span>
                  <span className="text-slate-500">City</span><span className="text-slate-200">{data.city}</span>
                  <span className="text-slate-500">Pincodes</span><span className="text-slate-200 font-mono text-xs">{data.serviceArea.join(", ")}</span>
                  <span className="text-slate-500">Vehicles</span><span className="text-slate-200">{data.vehicleTypes.join(", ")}</span>
                  <span className="text-slate-500">Experience</span><span className="text-slate-200">{data.yearsExp} years</span>
                  <span className="text-slate-500">Price</span><span className="text-slate-200">₹{data.pricePerHour}/hr</span>
                </div>
              </div>

              <button type="button" onClick={() => onChange("agreedToTerms", !data.agreedToTerms)}
                className="flex items-start gap-3 group w-full text-left">
                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.agreedToTerms ? "border-amber-400 bg-amber-400" : "border-slate-500 group-hover:border-slate-400"}`}>
                  {data.agreedToTerms && <span className="text-xs font-bold" style={{ color: "#0f172a" }}>✓</span>}
                </div>
                <span className="text-sm text-slate-300 leading-relaxed">
                  I confirm all information is accurate. I agree to LearnDrive's{" "}
                  <a href="/terms" target="_blank" className="text-amber-400 underline">Terms</a> and{" "}
                  <a href="/privacy" target="_blank" className="text-amber-400 underline">Privacy Policy</a>.
                </span>
              </button>
              <FieldError msg={errors.agreedToTerms} />

              <div className="rounded-xl p-4 border border-amber-400/15" style={{ background: "rgba(251,191,36,0.04)" }}>
                <p className="text-sm font-semibold text-amber-300 mb-2">📞 What happens next?</p>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <p>1. Our team calls you within 24 hours</p>
                  <p>2. Quick document check via WhatsApp</p>
                  <p>3. Profile goes live — students start finding you!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {submitError && (
          <div className="mt-4 rounded-xl px-4 py-3 text-sm text-red-300"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            ⚠ {submitError}
          </div>
        )}

        <div className="flex items-center justify-between mt-6 gap-4">
          {step > 1 ? (
            <button type="button" onClick={goBack}
              className="px-6 py-3 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-xl text-sm font-medium transition-all">
              ← Back
            </button>
          ) : <div />}

          {step < STEPS.length ? (
            <button type="button" onClick={goNext}
              className="flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 font-bold rounded-xl transition-all text-sm"
              style={{ color: "#0f172a" }}>
              Continue →
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed font-bold rounded-xl transition-all text-sm"
              style={{ color: "#0f172a" }}>
              {isSubmitting ? (
                <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Submitting...</>
              ) : "Submit Application ✓"}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">🔒 Your data is secure and never shared publicly</p>
      </div>
    </div>
  );
}