"use client";
// app/trainers/register/page.tsx

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type VehicleType = "CAR" | "BIKE_GEARED" | "BIKE_NON_GEARED";

interface TrainerPackage {
  id: string;
  name: string;
  price: number | "";
  days: number | "";
  sessionLength: string;
  distancePerDay: string;
  includes: string;
  trackFeePerVehicle: number | "";
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  pincode: string;
  serviceArea: string[];
  vehicleTypes: VehicleType[];
  yearsExp: string;
  languages: string[];
  licenseNo: string;
  agreedToTerms: boolean;
  packages: TrainerPackage[];
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

const PACKAGE_TEMPLATES = [
  {
    name: "LL Package",
    days: 20,
    sessionLength: "30 min/day",
    distancePerDay: "5 km",
    includes: "Learner Licence training, RTO slot booking help, driving practice",
  },
  {
    name: "DL Package",
    days: 30,
    sessionLength: "45 min/day",
    distancePerDay: "10 km",
    includes: "Full driving licence training, RTO test preparation, road confidence",
  },
  {
    name: "LL + DL Package",
    days: 45,
    sessionLength: "45 min/day",
    distancePerDay: "10 km",
    includes: "Complete LL + DL training, all RTO formalities, end-to-end support",
  },
  {
    name: "Per Session",
    days: 1,
    sessionLength: "1 hour",
    distancePerDay: "",
    includes: "Single session, flexible scheduling",
  },
];

const STEPS = [
  { id: 1, label: "You", icon: "👤" },
  { id: 2, label: "Location", icon: "📍" },
  { id: 3, label: "Teaching", icon: "🎓" },
  { id: 4, label: "Confirm", icon: "✅" },
];

function makePackage(template?: typeof PACKAGE_TEMPLATES[0]): TrainerPackage {
  return {
    id: Math.random().toString(36).slice(2),
    name: template?.name || "",
    price: "",
    days: template?.days || "",
    sessionLength: template?.sessionLength || "",
    distancePerDay: template?.distancePerDay || "",
    includes: template?.includes || "",
    trackFeePerVehicle: "",
  };
}

const INITIAL_DATA: FormData = {
  name: "", phone: "", email: "",
  city: "", pincode: "", serviceArea: [],
  vehicleTypes: [], yearsExp: "", languages: [],
  licenseNo: "", agreedToTerms: false,
  packages: [makePackage(PACKAGE_TEMPLATES[0])],
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><span>⚠</span>{msg}</p>;
}

function validateStep(step: number, data: FormData): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};

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
    if (data.packages.length === 0) errors.packages = "Add at least one package";
    const invalidPkg = data.packages.find(p => !p.name || !p.price || Number(p.price) < 100);
    if (invalidPkg) errors.packages = "Each package needs a name and price (min ₹100)";
  }

  if (step === 4) {
    if (!data.licenseNo.trim()) errors.licenseNo = "Licence number required";
    if (!data.agreedToTerms) errors.agreedToTerms = "Please agree to the terms";
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
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

  const removePincode = (p: string) => onChange("serviceArea", data.serviceArea.filter((x) => x !== p));

  // Package helpers
  const addPackage = (template?: typeof PACKAGE_TEMPLATES[0]) => {
    if (data.packages.length >= 4) return;
    onChange("packages", [...data.packages, makePackage(template)]);
  };

  const removePackage = (id: string) => {
    if (data.packages.length <= 1) return;
    onChange("packages", data.packages.filter(p => p.id !== id));
  };

  const updatePackage = (id: string, field: keyof TrainerPackage, value: any) => {
    onChange("packages", data.packages.map(p => p.id === id ? { ...p, [field]: value } : p));
    setErrors(prev => ({ ...prev, packages: undefined }));
  };

  const applyTemplate = (pkgId: string, template: typeof PACKAGE_TEMPLATES[0]) => {
    onChange("packages", data.packages.map(p =>
      p.id === pkgId ? { ...p, name: template.name, days: template.days, sessionLength: template.sessionLength, distancePerDay: template.distancePerDay, includes: template.includes } : p
    ));
  };

  const goNext = () => {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setErrors({});
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => { setStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleSubmit = async () => {
    const stepErrors = validateStep(4, data);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      // Use first package price as basePrice for backward compat
      const basePrice = data.packages[0]?.price ? Number(data.packages[0].price) : undefined;

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
          basePrice,
          packagesJson: JSON.stringify(data.packages),
          licenseNumber: data.licenseNo,
          documents: {},
        }),
      });

      const json = await res.json();
      if (!res.ok) { setSubmitError(json.error || "Something went wrong. Please try again."); return; }
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCities = CITIES.filter((c) => c.toLowerCase().includes(citySearch.toLowerCase()));
  const progress = (step / STEPS.length) * 100;

  const inputCls = "w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all";
  const inputBg = { background: "rgba(15,23,42,0.8)" };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1a1a2e 100%)" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
            style={{ background: "rgba(251,191,36,0.15)", border: "2px solid rgba(251,191,36,0.4)" }}>🎉</div>
          <h1 className="text-3xl font-bold text-white mb-3">You&apos;re registered!</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Thanks, <span className="text-amber-300 font-semibold">{data.name}</span>!
            Our team will call you on{" "}
            <span className="text-amber-300 font-mono">+91 {data.phone}</span>{" "}
            within <strong className="text-white">24 hours</strong>.
          </p>
          <div className="rounded-2xl p-5 mb-8 text-left space-y-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3 text-sm text-slate-300"><span className="text-amber-400 font-bold">✓</span>Application received</div>
            <div className="flex items-center gap-3 text-sm text-slate-400"><span className="text-slate-600">○</span>Our team calls you within 24 hours</div>
            <div className="flex items-center gap-3 text-sm text-slate-400"><span className="text-slate-600">○</span>Quick document check via WhatsApp</div>
            <div className="flex items-center gap-3 text-sm text-slate-400"><span className="text-slate-600">○</span>Profile goes live — students start booking!</div>
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

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1a1a2e 100%)" }}>

      <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between"
        style={{ background: "rgba(10,22,40,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-white hover:text-amber-300 transition-colors">
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
            {step === 3 && "Vehicle types, experience, and your packages"}
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
                  className={inputCls} style={inputBg} />
                <FieldError msg={errors.name} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Mobile Number <span className="text-amber-400">*</span></label>
                <input type="tel" value={data.phone} onChange={(e) => onChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210" maxLength={10} inputMode="numeric" className={inputCls} style={inputBg} />
                <FieldError msg={errors.phone} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email <span className="text-slate-500 font-normal">(optional)</span></label>
                <input type="email" value={data.email} onChange={(e) => onChange("email", e.target.value)}
                  placeholder="you@example.com" className={inputCls} style={inputBg} />
                <FieldError msg={errors.email} />
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Your City <span className="text-amber-400">*</span></label>
                <input type="text" value={citySearch} onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Search your city..." className={inputCls} style={inputBg} />
                {citySearch && (
                  <div className="mt-2 rounded-xl border border-slate-600 overflow-hidden max-h-40 overflow-y-auto" style={{ background: "#0d1f38" }}>
                    {filteredCities.slice(0, 8).map((c) => (
                      <button key={c} type="button" onClick={() => { onChange("city", c); setCitySearch(c); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-amber-400/10 ${data.city === c ? "text-amber-400 font-semibold" : "text-slate-300"}`}>
                        {c}
                      </button>
                    ))}
                    {filteredCities.length === 0 && <p className="px-4 py-3 text-sm text-slate-500">No city found</p>}
                  </div>
                )}
                <FieldError msg={errors.city} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Your Home Pincode <span className="text-amber-400">*</span></label>
                <input type="text" value={data.pincode} onChange={(e) => onChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="110001" maxLength={6} inputMode="numeric" className={inputCls} style={inputBg} />
                <FieldError msg={errors.pincode} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Service Area Pincodes <span className="text-amber-400">*</span></label>
                <p className="text-xs text-slate-500 mb-2">Add pincodes where you pick up students</p>
                <div className="flex gap-2">
                  <input type="text" value={pincodeInput} onChange={(e) => { setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6)); setPincodeError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && addPincode()} placeholder="Enter pincode"
                    maxLength={6} inputMode="numeric" className={`${inputCls} flex-1`} style={inputBg} />
                  <button type="button" onClick={addPincode}
                    className="px-4 py-3 bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 font-bold rounded-xl transition-colors text-sm border border-amber-400/30">
                    + Add
                  </button>
                </div>
                {pincodeError && <p className="mt-1 text-xs text-red-400">⚠ {pincodeError}</p>}
                {data.serviceArea.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {data.serviceArea.map((p) => (
                      <span key={p} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-amber-300"
                        style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)" }}>
                        {p}
                        <button type="button" onClick={() => removePincode(p)} className="text-slate-400 hover:text-red-400 transition-colors ml-1">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <FieldError msg={errors.serviceArea} />
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="space-y-7">

              {/* Vehicle types */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Vehicle Types You Teach <span className="text-amber-400">*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {VEHICLE_OPTIONS.map((v) => (
                    <button key={v.value} type="button" onClick={() => toggleVehicle(v.value)}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all text-center ${
                        data.vehicleTypes.includes(v.value)
                          ? "border-amber-400 bg-amber-400/10 text-white"
                          : "border-slate-600 hover:border-slate-500 text-slate-400"
                      }`}>
                      <span className="text-2xl">{v.icon}</span>
                      <span className="text-xs font-semibold">{v.label}</span>
                      <span className="text-xs text-slate-500">{v.desc}</span>
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.vehicleTypes} />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Years of Teaching Experience <span className="text-amber-400">*</span></label>
                <input type="number" value={data.yearsExp} onChange={(e) => onChange("yearsExp", e.target.value)}
                  placeholder="e.g. 5" min="1" max="50" className={inputCls} style={inputBg} />
                <FieldError msg={errors.yearsExp} />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Languages You Teach In</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((l) => (
                    <button key={l} type="button" onClick={() => toggleLang(l)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        data.languages.includes(l)
                          ? "border-amber-400 bg-amber-400/10 text-amber-300"
                          : "border-slate-600 text-slate-400 hover:border-slate-500"
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── PACKAGES ── */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-slate-300">
                    Your Packages & Pricing <span className="text-amber-400">*</span>
                  </label>
                  <span className="text-xs text-slate-500">{data.packages.length}/4 packages</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Add the packages you offer — students will see these and choose what fits them</p>

                <div className="space-y-4">
                  {data.packages.map((pkg, idx) => (
                    <div key={pkg.id} className="rounded-xl p-4 space-y-3"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Package {idx + 1}</span>
                        {data.packages.length > 1 && (
                          <button type="button" onClick={() => removePackage(pkg.id)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
                        )}
                      </div>

                      {/* Quick-fill templates */}
                      <div>
                        <p className="text-xs text-slate-500 mb-2">Quick fill:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {PACKAGE_TEMPLATES.map(t => (
                            <button key={t.name} type="button" onClick={() => applyTemplate(pkg.id, t)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                                pkg.name === t.name
                                  ? "border-amber-400/60 text-amber-300 bg-amber-400/10"
                                  : "border-slate-600 text-slate-400 hover:border-slate-500"
                              }`}>
                              {t.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Package name */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Package Name *</label>
                          <input type="text" value={pkg.name}
                            onChange={(e) => updatePackage(pkg.id, "name", e.target.value)}
                            placeholder="e.g. LL Package" className={`${inputCls} text-sm py-2.5`} style={inputBg} />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Price (₹) *</label>
                          <input type="number" value={pkg.price}
                            onChange={(e) => updatePackage(pkg.id, "price", e.target.value ? Number(e.target.value) : "")}
                            placeholder="e.g. 5500" min="100"
                            className={`${inputCls} text-sm py-2.5`} style={inputBg} />
                        </div>
                      </div>

                      {/* Duration + session */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Duration (days)</label>
                          <input type="number" value={pkg.days}
                            onChange={(e) => updatePackage(pkg.id, "days", e.target.value ? Number(e.target.value) : "")}
                            placeholder="20" min="1"
                            className={`${inputCls} text-sm py-2.5`} style={inputBg} />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Session length</label>
                          <input type="text" value={pkg.sessionLength}
                            onChange={(e) => updatePackage(pkg.id, "sessionLength", e.target.value)}
                            placeholder="30 min/day"
                            className={`${inputCls} text-sm py-2.5`} style={inputBg} />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Distance/day</label>
                          <input type="text" value={pkg.distancePerDay}
                            onChange={(e) => updatePackage(pkg.id, "distancePerDay", e.target.value)}
                            placeholder="5 km"
                            className={`${inputCls} text-sm py-2.5`} style={inputBg} />
                        </div>
                      </div>

                      {/* Includes */}
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">What&apos;s included</label>
                        <input type="text" value={pkg.includes}
                          onChange={(e) => updatePackage(pkg.id, "includes", e.target.value)}
                          placeholder="e.g. LL training, RTO slot booking, road confidence"
                          className={`${inputCls} text-sm py-2.5`} style={inputBg} />
                      </div>

                      {/* Track fee */}
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Track / Test day fee per vehicle (₹) <span className="text-slate-600">optional</span></label>
                        <input type="number" value={pkg.trackFeePerVehicle}
                          onChange={(e) => updatePackage(pkg.id, "trackFeePerVehicle", e.target.value ? Number(e.target.value) : "")}
                          placeholder="e.g. 150"
                          className={`${inputCls} text-sm py-2.5`} style={inputBg} />
                        <p className="text-xs text-slate-600 mt-1">This is extra — shown separately so students know upfront</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add package button */}
                {data.packages.length < 4 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PACKAGE_TEMPLATES.filter(t => !data.packages.find(p => p.name === t.name)).map(t => (
                      <button key={t.name} type="button" onClick={() => addPackage(t)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 transition-colors">
                        + Add {t.name}
                      </button>
                    ))}
                    <button type="button" onClick={() => addPackage()}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 border border-slate-600 hover:border-slate-500 transition-colors">
                      + Custom Package
                    </button>
                  </div>
                )}

                <FieldError msg={errors.packages} />
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
                <input type="text" value={data.licenseNo} onChange={(e) => onChange("licenseNo", e.target.value.toUpperCase())}
                  placeholder="DL0120230001234" className={`${inputCls} font-mono`} style={inputBg} />
                <p className="mt-1 text-xs text-slate-500">Must cover the vehicle types you selected</p>
                <FieldError msg={errors.licenseNo} />
              </div>

              {/* Summary */}
              <div className="rounded-xl p-4 border border-slate-700 space-y-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Summary</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-slate-500">Name</span><span className="text-slate-200 font-medium">{data.name}</span>
                  <span className="text-slate-500">Phone</span><span className="text-slate-200 font-mono">+91 {data.phone}</span>
                  <span className="text-slate-500">City</span><span className="text-slate-200">{data.city}</span>
                  <span className="text-slate-500">Vehicles</span><span className="text-slate-200">{data.vehicleTypes.join(", ")}</span>
                  <span className="text-slate-500">Experience</span><span className="text-slate-200">{data.yearsExp} years</span>
                </div>
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Packages</p>
                  {data.packages.map(pkg => (
                    <div key={pkg.id} className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{pkg.name}</span>
                      <span className="text-amber-300 font-semibold">₹{Number(pkg.price).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" onClick={() => onChange("agreedToTerms", !data.agreedToTerms)}
                className="flex items-start gap-3 group w-full text-left">
                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.agreedToTerms ? "border-amber-400 bg-amber-400" : "border-slate-500 group-hover:border-slate-400"}`}>
                  {data.agreedToTerms && <span className="text-xs font-bold" style={{ color: "#0f172a" }}>✓</span>}
                </div>
                <span className="text-sm text-slate-300 leading-relaxed">
                  I confirm all information is accurate. I agree to LearnDrive&apos;s{" "}
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