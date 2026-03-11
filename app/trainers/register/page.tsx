"use client";
// app/trainers/register/page.tsx

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type VehicleType = "CAR" | "BIKE_GEARED" | "BIKE_NON_GEARED";
type TrainerTypeVal = "INDEPENDENT" | "DRIVING_SCHOOL";

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
  trainerType: TrainerTypeVal;
  name: string;           // individual
  schoolName: string;     // school
  schoolLicenceNo: string;// school DS licence e.g. RTO/BNG(N)/DS/3/97-98
  ownerName: string;      // school owner
  phone: string;
  email: string;
  licenseNo: string;      // personal DL (required for individual, optional for school)
  city: string;
  pincode: string;
  serviceArea: string[];
  vehicleTypes: VehicleType[];
  yearsExp: string;
  languages: string[];
  hasOwnTrack: boolean;
  packages: TrainerPackage[];
  agreedToTerms: boolean;
}

const CITIES = [
  "Delhi NCR","Mumbai","Bangalore","Hyderabad","Chennai","Kolkata","Pune",
  "Jaipur","Surat","Lucknow","Kanpur","Nagpur","Indore","Thane",
  "Bhopal","Visakhapatnam","Patna","Vadodara","Ghaziabad","Ludhiana",
  "Agra","Nashik","Faridabad","Meerut","Rajkot","Varanasi","Aurangabad",
  "Dhanbad","Amritsar","Allahabad","Ranchi","Howrah","Coimbatore",
  "Jabalpur","Gwalior","Vijayawada","Jodhpur","Madurai","Raipur",
  "Kota","Chandigarh","Guwahati","Solapur","Hubli","Mysuru",
  "Tiruchirappalli","Dehradun","Kochi","Noida","Gurugram",
  "Navi Mumbai","Pimpri-Chinchwad","Kalyan","Vasai-Virar",
];

const VEHICLE_OPTIONS = [
  { value: "CAR" as VehicleType, label: "Car", icon: "🚗", desc: "Manual & automatic" },
  { value: "BIKE_GEARED" as VehicleType, label: "Geared Bike", icon: "🏍️", desc: "Motorcycles" },
  { value: "BIKE_NON_GEARED" as VehicleType, label: "Scooter", icon: "🛵", desc: "Non-geared / automatic" },
];

const LANGUAGES = ["Hindi","English","Marathi","Kannada","Tamil","Telugu","Bengali","Gujarati","Punjabi"];

const PACKAGE_TEMPLATES = [
  { name: "LL Package", days: 20, sessionLength: "30 min/day", distancePerDay: "5 km", includes: "Learner Licence training, RTO slot booking help, driving practice" },
  { name: "DL Package", days: 30, sessionLength: "45 min/day", distancePerDay: "10 km", includes: "Full driving licence training, RTO test preparation, road confidence" },
  { name: "LL + DL Package", days: 45, sessionLength: "45 min/day", distancePerDay: "10 km", includes: "Complete LL + DL training, all RTO formalities, end-to-end support" },
  { name: "Per Session", days: 1, sessionLength: "1 hour", distancePerDay: "", includes: "Single session, flexible scheduling" },
];

const STEPS = [
  { id: 1, label: "You", icon: "👤" },
  { id: 2, label: "Location", icon: "📍" },
  { id: 3, label: "Teaching", icon: "🎓" },
  { id: 4, label: "Confirm", icon: "✅" },
];

function makePkg(t?: typeof PACKAGE_TEMPLATES[0]): TrainerPackage {
  return { id: Math.random().toString(36).slice(2), name: t?.name||"", price:"", days: t?.days||"", sessionLength: t?.sessionLength||"", distancePerDay: t?.distancePerDay||"", includes: t?.includes||"", trackFeePerVehicle:"" };
}

const INITIAL: FormData = {
  trainerType: "INDEPENDENT",
  name:"", schoolName:"", schoolLicenceNo:"", ownerName:"",
  phone:"", email:"", licenseNo:"",
  city:"", pincode:"", serviceArea:[],
  vehicleTypes:[], yearsExp:"", languages:[],
  hasOwnTrack: false,
  packages:[makePkg(PACKAGE_TEMPLATES[0])],
  agreedToTerms: false,
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">⚠ {msg}</p>;
}

function validate(step: number, d: FormData): Record<string, string> {
  const e: Record<string,string> = {};
  const school = d.trainerType === "DRIVING_SCHOOL";
  if (step === 1) {
    if (school) {
      if (!d.schoolName.trim()) e.schoolName = "School name required";
      if (!d.ownerName.trim()) e.ownerName = "Owner name required";
      if (!d.schoolLicenceNo.trim()) e.schoolLicenceNo = "Driving school licence number required";
    } else {
      if (!d.name.trim() || d.name.length < 2) e.name = "Full name required";
    }
    if (!d.phone || !/^[6-9]\d{9}$/.test(d.phone)) e.phone = "Valid 10-digit mobile required";
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Enter a valid email";
  }
  if (step === 2) {
    if (!d.city) e.city = "Select your city";
    if (!d.pincode || !/^\d{6}$/.test(d.pincode)) e.pincode = "Enter 6-digit pincode";
    if (d.serviceArea.length === 0) e.serviceArea = "Add at least one service pincode";
  }
  if (step === 3) {
    if (d.vehicleTypes.length === 0) e.vehicleTypes = "Select at least one vehicle type";
    if (!d.yearsExp || isNaN(Number(d.yearsExp)) || Number(d.yearsExp) < 1) e.yearsExp = "Enter years of experience";
    if (d.packages.length === 0) e.packages = "Add at least one package";
    if (d.packages.find(p => !p.name || !p.price || Number(p.price) < 100)) e.packages = "Each package needs a name and price (min ₹100)";
  }
  if (step === 4) {
    if (!school && !d.licenseNo.trim()) e.licenseNo = "Driving licence number required";
    if (!d.agreedToTerms) e.agreedToTerms = "Please agree to the terms";
  }
  return e;
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [done, setDone] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [pcInput, setPcInput] = useState("");
  const [pcErr, setPcErr] = useState("");

  const school = data.trainerType === "DRIVING_SCHOOL";

  const set = useCallback((k: keyof FormData, v: any) => {
    setData(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: undefined as any }));
  }, []);

  const toggleV = (v: VehicleType) => set("vehicleTypes", data.vehicleTypes.includes(v) ? data.vehicleTypes.filter(x=>x!==v) : [...data.vehicleTypes, v]);
  const toggleL = (l: string) => set("languages", data.languages.includes(l) ? data.languages.filter(x=>x!==l) : [...data.languages, l]);

  const addPc = () => {
    const p = pcInput.trim();
    if (!/^\d{6}$/.test(p)) { setPcErr("Enter a valid 6-digit pincode"); return; }
    if (data.serviceArea.includes(p)) { setPcErr("Already added"); return; }
    if (data.serviceArea.length >= 10) { setPcErr("Max 10 pincodes"); return; }
    set("serviceArea", [...data.serviceArea, p]);
    setPcInput(""); setPcErr("");
  };

  const addPkg = (t?: typeof PACKAGE_TEMPLATES[0]) => { if (data.packages.length < 4) set("packages", [...data.packages, makePkg(t)]); };
  const rmPkg = (id: string) => { if (data.packages.length > 1) set("packages", data.packages.filter(p=>p.id!==id)); };
  const updPkg = (id: string, f: keyof TrainerPackage, v: any) => {
    set("packages", data.packages.map(p => p.id===id ? {...p,[f]:v} : p));
    setErrors(p=>({...p, packages: undefined as any}));
  };
  const applyTmpl = (id: string, t: typeof PACKAGE_TEMPLATES[0]) =>
    set("packages", data.packages.map(p => p.id===id ? {...p, name:t.name, days:t.days, sessionLength:t.sessionLength, distancePerDay:t.distancePerDay, includes:t.includes} : p));

  const next = () => {
    const e = validate(step, data);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setStep(s=>s+1); window.scrollTo({top:0,behavior:"smooth"});
  };
  const back = () => { setStep(s=>s-1); window.scrollTo({top:0,behavior:"smooth"}); };

  const submit = async () => {
    const e = validate(4, data);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true); setSubmitErr("");
    try {
      const displayName = school ? data.schoolName : data.name;
      const res = await fetch("/api/trainers/register", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          name: displayName,
          email: data.email || undefined,
          mobile: data.phone,
          bio: school ? `Owned by ${data.ownerName}` : "",
          city: data.city,
          pincode: data.pincode,
          serviceArea: data.serviceArea,
          vehicleTypes: data.vehicleTypes,
          experience: Number(data.yearsExp),
          languages: data.languages,
          basePrice: data.packages[0]?.price ? Number(data.packages[0].price) : undefined,
          packagesJson: JSON.stringify(data.packages),
          licenseNumber: school ? (data.schoolLicenceNo || data.licenseNo) : data.licenseNo,
          trainerType: data.trainerType,
          adminNotes: school
            ? `DS Licence: ${data.schoolLicenceNo} | Owner: ${data.ownerName} | Personal DL: ${data.licenseNo||"N/A"} | Own track: ${data.hasOwnTrack?"Yes":"No"}`
            : undefined,
          documents: {},
        }),
      });
      const json = await res.json();
      if (!res.ok) { setSubmitErr(json.error || "Something went wrong."); return; }
      setDone(true);
    } catch { setSubmitErr("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inp = "w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-sm";
  const bg = { background:"rgba(15,23,42,0.8)" };
  const prog = (step / STEPS.length) * 100;

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"linear-gradient(135deg,#0a1628 0%,#0f2040 50%,#1a1a2e 100%)"}}>
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl" style={{background:"rgba(251,191,36,0.15)",border:"2px solid rgba(251,191,36,0.4)"}}>🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">{school ? "School registered!" : "You're registered!"}</h1>
        <p className="text-slate-400 mb-8">Thanks, <span className="text-amber-300 font-semibold">{school ? data.ownerName : data.name}</span>! We'll call <span className="text-amber-300 font-mono">+91 {data.phone}</span> within 24 hours.</p>
        <button onClick={()=>router.push("/")} className="px-8 py-3 bg-amber-400 hover:bg-amber-300 font-bold rounded-xl" style={{color:"#0f172a"}}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(135deg,#0a1628 0%,#0f2040 50%,#1a1a2e 100%)"}}>
      <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between" style={{background:"rgba(10,22,40,0.9)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <button onClick={()=>router.push("/")} className="flex items-center gap-2 text-white hover:text-amber-300 transition-colors">
          <span className="text-xl">←</span><span className="hidden sm:block text-sm font-medium">LearnDrive</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Step {step} of {STEPS.length}</span>
          <span className="text-xs font-semibold text-amber-400">{STEPS[step-1].label}</span>
        </div>
      </header>
      <div className="h-0.5 bg-slate-800"><div className="h-full bg-amber-400 transition-all duration-500" style={{width:`${prog}%`}}/></div>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Step indicators */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s,i)=>(
            <div key={s.id} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all flex-shrink-0 ${step>s.id?"bg-amber-400":step===s.id?"bg-amber-400/20 border-2 border-amber-400 text-amber-400":"bg-slate-800 border border-slate-600 text-slate-500"}`}
                style={{color:step>s.id?"#0f172a":undefined}}>
                {step>s.id?"✓":s.id}
              </div>
              {i<STEPS.length-1&&<div className={`flex-1 h-0.5 mx-1 transition-all ${step>s.id?"bg-amber-400":"bg-slate-700"}`}/>}
            </div>
          ))}
        </div>

        <div className="mb-8">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">{school?"Driving School":"Trainer"} Registration</p>
          <h1 className="text-3xl font-bold text-white leading-tight">
            {step===1&&(school?"About your school":"Let's start with you")}
            {step===2&&"Where do you teach?"}
            {step===3&&"What do you teach?"}
            {step===4&&"Almost done!"}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {step===1&&(school?"School details and owner contact":"Just your name and number — takes 30 seconds")}
            {step===2&&"Your city and the pincodes you cover"}
            {step===3&&"Vehicle types, experience, and your packages"}
            {step===4&&"Licence verification and confirmation"}
          </p>
        </div>

        <div className="rounded-2xl p-6 sm:p-8" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",backdropFilter:"blur(8px)"}}>

          {/* ── STEP 1 ── */}
          {step===1&&(
            <div className="space-y-5">
              {/* TYPE TOGGLE */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">I am a... <span className="text-amber-400">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    {v:"INDEPENDENT" as TrainerTypeVal, icon:"🧑‍🏫", title:"Individual Trainer", sub:"You teach on your own"},
                    {v:"DRIVING_SCHOOL" as TrainerTypeVal, icon:"🏫", title:"Driving School", sub:"RTO-registered school"},
                  ]).map(opt=>(
                    <button key={opt.v} type="button" onClick={()=>set("trainerType",opt.v)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${data.trainerType===opt.v?"border-amber-400 bg-amber-400/10":"border-slate-600 hover:border-slate-500"}`}>
                      <span className="text-3xl">{opt.icon}</span>
                      <span className="text-sm font-bold text-white">{opt.title}</span>
                      <span className="text-xs text-slate-400">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {school ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">School Name <span className="text-amber-400">*</span></label>
                    <input type="text" value={data.schoolName} onChange={e=>set("schoolName",e.target.value)} placeholder="e.g. Sharma Motor Driving School" className={inp} style={bg}/>
                    <FieldError msg={errors.schoolName}/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Driving School Licence No. <span className="text-amber-400">*</span></label>
                    <input type="text" value={data.schoolLicenceNo} onChange={e=>set("schoolLicenceNo",e.target.value.toUpperCase())}
                      placeholder="RTO/BNG(N)/DS/3/97-98" className={`${inp} font-mono`} style={bg}/>
                    <p className="mt-1 text-xs text-slate-500">Format: RTO/[city code]/DS/[number]/[year] — as shown on your RTO certificate</p>
                    <FieldError msg={errors.schoolLicenceNo}/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">Owner / Contact Person Name <span className="text-amber-400">*</span></label>
                    <input type="text" value={data.ownerName} onChange={e=>set("ownerName",e.target.value)} placeholder="e.g. Rajesh Sharma" className={inp} style={bg}/>
                    <FieldError msg={errors.ownerName}/>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Full Name <span className="text-amber-400">*</span></label>
                  <input type="text" value={data.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Rajesh Kumar" className={inp} style={bg}/>
                  <FieldError msg={errors.name}/>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">{school?"Contact Number":"Mobile Number"} <span className="text-amber-400">*</span></label>
                <input type="tel" value={data.phone} onChange={e=>set("phone",e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="9876543210" maxLength={10} inputMode="numeric" className={inp} style={bg}/>
                <FieldError msg={errors.phone}/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email <span className="text-slate-500 font-normal">(optional)</span></label>
                <input type="email" value={data.email} onChange={e=>set("email",e.target.value)} placeholder="you@example.com" className={inp} style={bg}/>
                <FieldError msg={errors.email}/>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step===2&&(
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">City <span className="text-amber-400">*</span></label>
                <input type="text" value={citySearch} onChange={e=>setCitySearch(e.target.value)} placeholder="Search city..." className={inp} style={bg}/>
                {citySearch&&(
                  <div className="mt-2 rounded-xl border border-slate-600 overflow-hidden max-h-40 overflow-y-auto" style={{background:"#0d1f38"}}>
                    {CITIES.filter(c=>c.toLowerCase().includes(citySearch.toLowerCase())).slice(0,8).map(c=>(
                      <button key={c} type="button" onClick={()=>{set("city",c);setCitySearch(c);}}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-amber-400/10 ${data.city===c?"text-amber-400 font-semibold":"text-slate-300"}`}>{c}</button>
                    ))}
                  </div>
                )}
                <FieldError msg={errors.city}/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">{school?"School Pincode":"Home Pincode"} <span className="text-amber-400">*</span></label>
                <input type="text" value={data.pincode} onChange={e=>set("pincode",e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="560032" maxLength={6} inputMode="numeric" className={inp} style={bg}/>
                <FieldError msg={errors.pincode}/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Service Area Pincodes <span className="text-amber-400">*</span></label>
                <p className="text-xs text-slate-500 mb-2">Pincodes where you pick up / accept students</p>
                <div className="flex gap-2">
                  <input type="text" value={pcInput} onChange={e=>{setPcInput(e.target.value.replace(/\D/g,"").slice(0,6));setPcErr("");}}
                    onKeyDown={e=>e.key==="Enter"&&addPc()} placeholder="Enter pincode" maxLength={6} inputMode="numeric" className={`${inp} flex-1`} style={bg}/>
                  <button type="button" onClick={addPc} className="px-4 py-3 bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 font-bold rounded-xl text-sm border border-amber-400/30">+ Add</button>
                </div>
                {pcErr&&<p className="mt-1 text-xs text-red-400">⚠ {pcErr}</p>}
                {data.serviceArea.length>0&&(
                  <div className="flex flex-wrap gap-2 mt-3">
                    {data.serviceArea.map(p=>(
                      <span key={p} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-amber-300"
                        style={{background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.25)"}}>
                        {p}<button type="button" onClick={()=>set("serviceArea",data.serviceArea.filter(x=>x!==p))} className="text-slate-400 hover:text-red-400 ml-1">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <FieldError msg={errors.serviceArea}/>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step===3&&(
            <div className="space-y-7">
              {/* Vehicles */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Vehicle Types <span className="text-amber-400">*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {VEHICLE_OPTIONS.map(v=>(
                    <button key={v.value} type="button" onClick={()=>toggleV(v.value)}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all ${data.vehicleTypes.includes(v.value)?"border-amber-400 bg-amber-400/10 text-white":"border-slate-600 hover:border-slate-500 text-slate-400"}`}>
                      <span className="text-2xl">{v.icon}</span>
                      <span className="text-xs font-semibold">{v.label}</span>
                      <span className="text-xs text-slate-500">{v.desc}</span>
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.vehicleTypes}/>
              </div>

              {/* Own track — schools only */}
              {school&&(
                <button type="button" onClick={()=>set("hasOwnTrack",!data.hasOwnTrack)} className="flex items-start gap-3 w-full text-left group">
                  <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.hasOwnTrack?"border-amber-400 bg-amber-400":"border-slate-500 group-hover:border-slate-400"}`}>
                    {data.hasOwnTrack&&<span className="text-xs font-bold" style={{color:"#0f172a"}}>✓</span>}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-300">We have our own driving track / test ground</span>
                    <p className="text-xs text-slate-500 mt-0.5">Students practice and take the final RTO test at your premises</p>
                  </div>
                </button>
              )}

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">{school?"Years School Has Been Operating":"Years of Teaching Experience"} <span className="text-amber-400">*</span></label>
                <input type="number" value={data.yearsExp} onChange={e=>set("yearsExp",e.target.value)} placeholder="e.g. 27" min="1" className={inp} style={bg}/>
                <FieldError msg={errors.yearsExp}/>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Languages of Instruction</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(l=>(
                    <button key={l} type="button" onClick={()=>toggleL(l)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${data.languages.includes(l)?"border-amber-400 bg-amber-400/10 text-amber-300":"border-slate-600 text-slate-400 hover:border-slate-500"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Packages */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-slate-300">Packages & Pricing <span className="text-amber-400">*</span></label>
                  <span className="text-xs text-slate-500">{data.packages.length}/4</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">Add all packages you offer — students will see and choose</p>
                <div className="space-y-4">
                  {data.packages.map((pkg,idx)=>(
                    <div key={pkg.id} className="rounded-xl p-4 space-y-3" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Package {idx+1}</span>
                        {data.packages.length>1&&<button type="button" onClick={()=>rmPkg(pkg.id)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
                      </div>
                      {/* Templates */}
                      <div>
                        <p className="text-xs text-slate-500 mb-1.5">Quick fill:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {PACKAGE_TEMPLATES.map(t=>(
                            <button key={t.name} type="button" onClick={()=>applyTmpl(pkg.id,t)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${pkg.name===t.name?"border-amber-400/60 text-amber-300 bg-amber-400/10":"border-slate-600 text-slate-400 hover:border-slate-500"}`}>
                              {t.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Package Name *</label>
                          <input type="text" value={pkg.name} onChange={e=>updPkg(pkg.id,"name",e.target.value)} placeholder="LL Package" className={`${inp} py-2.5`} style={bg}/>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Price (₹) *</label>
                          <input type="number" value={pkg.price} onChange={e=>updPkg(pkg.id,"price",e.target.value?Number(e.target.value):"")} placeholder="5500" min="100" className={`${inp} py-2.5`} style={bg}/>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Days</label>
                          <input type="number" value={pkg.days} onChange={e=>updPkg(pkg.id,"days",e.target.value?Number(e.target.value):"")} placeholder="20" min="1" className={`${inp} py-2.5`} style={bg}/>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Session</label>
                          <input type="text" value={pkg.sessionLength} onChange={e=>updPkg(pkg.id,"sessionLength",e.target.value)} placeholder="30 min/day" className={`${inp} py-2.5`} style={bg}/>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">Dist/day</label>
                          <input type="text" value={pkg.distancePerDay} onChange={e=>updPkg(pkg.id,"distancePerDay",e.target.value)} placeholder="5 km" className={`${inp} py-2.5`} style={bg}/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">What&apos;s included</label>
                        <input type="text" value={pkg.includes} onChange={e=>updPkg(pkg.id,"includes",e.target.value)} placeholder="LL training, RTO slot help, road practice" className={`${inp} py-2.5`} style={bg}/>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Track / Test day fee per vehicle (₹) <span className="text-slate-600">optional</span></label>
                        <input type="number" value={pkg.trackFeePerVehicle} onChange={e=>updPkg(pkg.id,"trackFeePerVehicle",e.target.value?Number(e.target.value):"")} placeholder="150" className={`${inp} py-2.5`} style={bg}/>
                        <p className="text-xs text-slate-600 mt-1">Shown separately to students — paid on test day only</p>
                      </div>
                    </div>
                  ))}
                </div>
                {data.packages.length<4&&(
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PACKAGE_TEMPLATES.filter(t=>!data.packages.find(p=>p.name===t.name)).map(t=>(
                      <button key={t.name} type="button" onClick={()=>addPkg(t)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-400 border border-amber-400/30 hover:bg-amber-400/10">
                        + Add {t.name}
                      </button>
                    ))}
                    <button type="button" onClick={()=>addPkg()} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 border border-slate-600 hover:border-slate-500">
                      + Custom Package
                    </button>
                  </div>
                )}
                <FieldError msg={errors.packages}/>
              </div>
            </div>
          )}

          {/* ── STEP 4 ── */}
          {step===4&&(
            <div className="space-y-5">
              {school&&(
                <div className="rounded-xl p-4 border border-green-500/20 text-sm text-green-300" style={{background:"rgba(34,197,94,0.07)"}}>
                  ✅ DS Licence on record: <span className="font-mono font-bold">{data.schoolLicenceNo}</span>
                </div>
              )}
              <div className="rounded-xl p-4 border border-blue-500/20 text-sm text-blue-300" style={{background:"rgba(59,130,246,0.07)"}}>
                🔒 {school?"Owner's personal DL is optional but helps speed up verification.":"Your DL number is for verification only. Never shared publicly."}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  {school?"Owner's Personal Driving Licence":"Driving Licence Number"}{" "}
                  {school?<span className="text-slate-500 font-normal">(optional)</span>:<span className="text-amber-400">*</span>}
                </label>
                <input type="text" value={data.licenseNo} onChange={e=>set("licenseNo",e.target.value.toUpperCase())}
                  placeholder={school?"KA01XXXXXXXXXX (optional)":"KA01XXXXXXXXXX"} className={`${inp} font-mono`} style={bg}/>
                <FieldError msg={errors.licenseNo}/>
              </div>

              {/* Summary */}
              <div className="rounded-xl p-4 border border-slate-700 space-y-3" style={{background:"rgba(255,255,255,0.02)"}}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Summary</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-slate-500">Type</span><span className="text-amber-300 font-semibold">{school?"🏫 Driving School":"🧑‍🏫 Individual Trainer"}</span>
                  {school?(
                    <>
                      <span className="text-slate-500">School</span><span className="text-slate-200">{data.schoolName}</span>
                      <span className="text-slate-500">DS Licence</span><span className="text-slate-200 font-mono text-xs">{data.schoolLicenceNo}</span>
                      <span className="text-slate-500">Owner</span><span className="text-slate-200">{data.ownerName}</span>
                    </>
                  ):(
                    <><span className="text-slate-500">Name</span><span className="text-slate-200">{data.name}</span></>
                  )}
                  <span className="text-slate-500">Phone</span><span className="text-slate-200 font-mono">+91 {data.phone}</span>
                  <span className="text-slate-500">City</span><span className="text-slate-200">{data.city}</span>
                  <span className="text-slate-500">Vehicles</span><span className="text-slate-200">{data.vehicleTypes.join(", ")}</span>
                  <span className="text-slate-500">Experience</span><span className="text-slate-200">{data.yearsExp} yrs</span>
                  {school&&data.hasOwnTrack&&<><span className="text-slate-500">Track</span><span className="text-green-400">✓ Own track</span></>}
                </div>
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Packages</p>
                  {data.packages.map(p=>(
                    <div key={p.id} className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{p.name}</span>
                      <span className="text-amber-300 font-semibold">₹{Number(p.price).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" onClick={()=>set("agreedToTerms",!data.agreedToTerms)} className="flex items-start gap-3 group w-full text-left">
                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.agreedToTerms?"border-amber-400 bg-amber-400":"border-slate-500 group-hover:border-slate-400"}`}>
                  {data.agreedToTerms&&<span className="text-xs font-bold" style={{color:"#0f172a"}}>✓</span>}
                </div>
                <span className="text-sm text-slate-300 leading-relaxed">
                  I confirm all information is accurate. I agree to LearnDrive&apos;s{" "}
                  <a href="/terms" target="_blank" className="text-amber-400 underline">Terms</a> and{" "}
                  <a href="/privacy" target="_blank" className="text-amber-400 underline">Privacy Policy</a>.
                </span>
              </button>
              <FieldError msg={errors.agreedToTerms}/>

              <div className="rounded-xl p-4 border border-amber-400/15" style={{background:"rgba(251,191,36,0.04)"}}>
                <p className="text-sm font-semibold text-amber-300 mb-2">📞 What happens next?</p>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <p>1. Our team calls you within 24 hours</p>
                  <p>2. Quick document check via WhatsApp</p>
                  <p>3. {school?"School profile":"Profile"} goes live — students start finding you!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {submitErr&&<div className="mt-4 rounded-xl px-4 py-3 text-sm text-red-300" style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)"}}>⚠ {submitErr}</div>}

        <div className="flex items-center justify-between mt-6 gap-4">
          {step>1?<button type="button" onClick={back} className="px-6 py-3 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-xl text-sm font-medium transition-all">← Back</button>:<div/>}
          {step<STEPS.length?(
            <button type="button" onClick={next} className="flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 font-bold rounded-xl text-sm" style={{color:"#0f172a"}}>Continue →</button>
          ):(
            <button type="button" onClick={submit} disabled={submitting} className="flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 font-bold rounded-xl text-sm" style={{color:"#0f172a"}}>
              {submitting?<><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>Submitting...</>:"Submit Application ✓"}
            </button>
          )}
        </div>
        <p className="text-center text-xs text-slate-600 mt-8">🔒 Your data is secure and never shared publicly</p>
      </div>
    </div>
  );
}