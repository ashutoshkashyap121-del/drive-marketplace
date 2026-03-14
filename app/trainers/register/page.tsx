"use client";
// app/trainers/register/page.tsx

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrainerEvents } from "@/components/GoogleAnalytics";

type VehicleType = "CAR" | "BIKE_GEARED" | "BIKE_NON_GEARED";
type TrainerTypeVal = "INDEPENDENT" | "DRIVING_SCHOOL";
type LicenceFormat = "RTO_STANDARD" | "MS_FORM" | "OTHER";

interface VehicleVariant { model: string; price: number | ""; priceAC: number | ""; }
interface TrainerPackage {
  id: string; name: string; price: number | ""; priceMax: number | "";
  days: number | ""; sessionLength: string; distancePerDay: string;
  includes: string; trackFeePerVehicle: number | ""; acSurcharge: number | "";
  vehicleModels: string; hasVariants: boolean; variants: VehicleVariant[];
}
interface FormData {
  trainerType: TrainerTypeVal; name: string; schoolName: string;
  licenceFormat: LicenceFormat; schoolLicenceNo: string; msFormNo: string;
  msRTO: string; ownerName: string; phone: string; email: string;
  licenseNo: string; city: string; pincode: string; serviceArea: string[];
  vehicleTypes: VehicleType[]; yearsExp: string; languages: string[];
  hasOwnTrack: boolean; packages: TrainerPackage[]; agreedToTerms: boolean;
}

// ─── Translations ──────────────────────────────────────────────────────────────
const T = {
  en: {
    stepLabels: ["You", "Location", "Teaching", "Confirm"],
    stepHeadings: {
      1: { ind: "Let's start with you", ds: "About your school" },
      2: "Where do you teach?",
      3: "What do you teach?",
      4: "Almost done!",
    },
    regBadge: { ind: "Trainer Registration", ds: "Driving School Registration" },
    trainerTypeLabel: "I am a...",
    trainerTypes: [
      { v: "INDEPENDENT" as TrainerTypeVal, icon: "🧑‍🏫", title: "Individual Trainer", sub: "You teach on your own" },
      { v: "DRIVING_SCHOOL" as TrainerTypeVal, icon: "🏫", title: "Driving School", sub: "RTO-registered school" },
    ],
    schoolName: "School Name", schoolNamePh: "Metro Motor Training School",
    regFormat: "School Registration Format",
    regFormats: [
      { v: "RTO_STANDARD" as LicenceFormat, label: "RTO Standard", eg: "RTO/BNG(N)/DS/3/97-98" },
      { v: "MS_FORM" as LicenceFormat, label: "MS Form No.", eg: "Maharashtra format" },
      { v: "OTHER" as LicenceFormat, label: "Other / Unknown", eg: "I'll check later" },
    ],
    rtoStdPh: "RTO/BNG(N)/DS/3/97-98", rtoStdHint: "Format: RTO/[city]/DS/[number]/[year]",
    msFormLabel: "MS Form Number", msFormPh: "e.g. 382",
    msFormHint: "The number on your Maharashtra driving school certificate",
    msRTOLabel: "Issuing RTO", msRTOPh: "e.g. RTO Mumbai West",
    msNote: "💡 Maharashtra driving schools are issued M S Form No. certificates by their local RTO under Rule 25 of CMV Rules.",
    otherPh: "Enter whatever is on your registration certificate",
    ownerName: "Owner / Contact Person", ownerPh: "Owner's name",
    fullName: "Full Name", fullNamePh: "Rajesh Kumar",
    contactNum: "Contact Number", mobileNum: "Mobile Number", mobilePh: "9876543210",
    email: "Email", emailPh: "you@example.com", optional: "(optional)",
    city: "City", cityPh: "Search city...",
    homePincode: "Home Pincode", schoolPincode: "School Pincode", pincodePh: "400049",
    serviceArea: "Service Area Pincodes",
    serviceAreaHint: "Pincodes where you pick up students",
    addPincode: "+ Add", enterPincode: "Enter pincode",
    vehicleTypes: "Vehicle Types",
    vehicleOptions: [
      { value: "CAR" as VehicleType, label: "Car", icon: "🚗" },
      { value: "BIKE_GEARED" as VehicleType, label: "Geared Bike", icon: "🏍️" },
      { value: "BIKE_NON_GEARED" as VehicleType, label: "Scooter", icon: "🛵" },
    ],
    ownTrack: "We have our own driving track / test ground",
    ownTrackSub: "Students can take the final RTO test at your premises",
    yearsExpInd: "Years of Teaching Experience", yearsExpDs: "Years School Has Been Operating", yearsExpPh: "e.g. 27",
    languages: "Languages of Instruction",
    langOptions: ["Hindi", "English", "Marathi", "Kannada", "Tamil", "Telugu", "Bengali", "Gujarati", "Punjabi"],
    packagesLabel: "Packages & Pricing",
    packagesHint: 'For schools with vehicle-model pricing (like Wagon R ₹3000, Swift ₹3500), enable "Per vehicle model" inside a package.',
    templateLabels: ["LL Package", "DL Package", "LL + DL Package", "Per Session"],
    packageN: "Package", pkgName: "Package Name *", pkgNamePh: "LL Package",
    startPrice: "Starting Price ₹ *", maxPrice: "Max Price ₹", maxPriceHint: "if range",
    days: "Days", session: "Session", distPerDay: "Distance/day",
    acSurcharge: "AC surcharge ₹",
    vehicleModels: "Vehicle models covered", vehicleModelsPh: "e.g. Wagon R, Swift, Xcent, Brezza",
    whatsIncluded: "What's included", whatsIncludedPh: "Training + RTO help + pickup",
    trackFee: "Track / Test day fee per vehicle ₹",
    perVehicleModel: "Price varies by vehicle model (e.g. Wagon R ₹3000, Brezza ₹5000)",
    vehicleModel: "Vehicle Model", nonAC: "Non-AC ₹", AC: "AC ₹",
    addVehicleModel: "+ Add vehicle model",
    remove: "Remove",
    addPackages: ["+ Add LL Package", "+ Add DL Package", "+ Add LL + DL Package", "+ Add Per Session"],
    addCustomPkg: "+ Custom Package",
    ownerDL: "Owner's Personal DL", trainerDL: "Driving Licence Number",
    dlPh: "KA01XXXXXXXXXX", dlOptional: "(optional)",
    summary: "Summary",
    summaryLabels: { type: "Type", school: "School", reg: "Registration", owner: "Owner", name: "Name", phone: "Phone", city: "City", languages: "Languages", packages: "Packages" },
    summaryTypes: { ds: "🏫 Driving School", ind: "🧑‍🏫 Individual Trainer" },
    termsText: "I confirm all information is accurate. I agree to LearnDrive's",
    termsLink: "Terms", privacyLink: "Privacy Policy", termsAnd: "and",
    continue: "Continue →", back: "← Back",
    submit: "Submit Application ✓", submitting: "Submitting...",
    successInd: "You're registered!", successDs: "School registered!",
    successMsg: "We'll call", successMsgPost: "within 24 hours.",
    goHome: "Back to Home",
    secureNote: "🔒 Your data is secure and never shared publicly",
    stepOf: "Step", of: "of",
    errors: {
      schoolName: "School name required", ownerName: "Owner name required",
      schoolLicenceNo: "Licence number required", msFormNo: "MS Form No. required",
      name: "Full name required", phone: "Valid 10-digit mobile required",
      email: "Enter a valid email", city: "Select your city",
      pincode: "Enter 6-digit pincode", serviceArea: "Add at least one service pincode",
      vehicleTypes: "Select at least one vehicle type", yearsExp: "Enter years of experience",
      packages: "Add at least one package",
      packagesBad: "Each package needs a name and at least a starting price",
      licenseNo: "DL number required", agreedToTerms: "Please agree to the terms",
      pcInvalid: "Enter a valid 6-digit pincode", pcDuplicate: "Already added", pcMax: "Max 10 pincodes",
    },
  },
  hi: {
    stepLabels: ["आप", "स्थान", "शिक्षण", "पुष्टि"],
    stepHeadings: {
      1: { ind: "आपके बारे में बताएं", ds: "आपके स्कूल के बारे में" },
      2: "आप कहाँ पढ़ाते हैं?",
      3: "आप क्या पढ़ाते हैं?",
      4: "लगभग हो गया!",
    },
    regBadge: { ind: "ट्रेनर पंजीकरण", ds: "ड्राइविंग स्कूल पंजीकरण" },
    trainerTypeLabel: "मैं हूँ...",
    trainerTypes: [
      { v: "INDEPENDENT" as TrainerTypeVal, icon: "🧑‍🏫", title: "व्यक्तिगत ट्रेनर", sub: "आप खुद पढ़ाते हैं" },
      { v: "DRIVING_SCHOOL" as TrainerTypeVal, icon: "🏫", title: "ड्राइविंग स्कूल", sub: "RTO-पंजीकृत स्कूल" },
    ],
    schoolName: "स्कूल का नाम", schoolNamePh: "मेट्रो मोटर ट्रेनिंग स्कूल",
    regFormat: "स्कूल पंजीकरण प्रारूप",
    regFormats: [
      { v: "RTO_STANDARD" as LicenceFormat, label: "RTO स्टैंडर्ड", eg: "RTO/BNG(N)/DS/3/97-98" },
      { v: "MS_FORM" as LicenceFormat, label: "MS फॉर्म नं.", eg: "महाराष्ट्र प्रारूप" },
      { v: "OTHER" as LicenceFormat, label: "अन्य / पता नहीं", eg: "बाद में देखूंगा" },
    ],
    rtoStdPh: "RTO/BNG(N)/DS/3/97-98", rtoStdHint: "प्रारूप: RTO/[शहर]/DS/[नंबर]/[वर्ष]",
    msFormLabel: "MS फॉर्म नंबर", msFormPh: "जैसे 382",
    msFormHint: "आपके महाराष्ट्र ड्राइविंग स्कूल प्रमाणपत्र पर दिया नंबर",
    msRTOLabel: "जारीकर्ता RTO", msRTOPh: "जैसे RTO Mumbai West",
    msNote: "💡 महाराष्ट्र ड्राइविंग स्कूलों को CMV नियम 25 के तहत स्थानीय RTO द्वारा M S Form No. प्रमाणपत्र जारी किए जाते हैं।",
    otherPh: "अपने पंजीकरण प्रमाणपत्र पर जो लिखा हो वह दर्ज करें",
    ownerName: "मालिक / संपर्क व्यक्ति", ownerPh: "मालिक का नाम",
    fullName: "पूरा नाम", fullNamePh: "राजेश कुमार",
    contactNum: "संपर्क नंबर", mobileNum: "मोबाइल नंबर", mobilePh: "9876543210",
    email: "ईमेल", emailPh: "you@example.com", optional: "(वैकल्पिक)",
    city: "शहर", cityPh: "शहर खोजें...",
    homePincode: "घर का पिनकोड", schoolPincode: "स्कूल का पिनकोड", pincodePh: "400049",
    serviceArea: "सेवा क्षेत्र पिनकोड",
    serviceAreaHint: "जिन पिनकोड में आप छात्रों को पिकअप करते हैं",
    addPincode: "+ जोड़ें", enterPincode: "पिनकोड दर्ज करें",
    vehicleTypes: "वाहन प्रकार",
    vehicleOptions: [
      { value: "CAR" as VehicleType, label: "कार", icon: "🚗" },
      { value: "BIKE_GEARED" as VehicleType, label: "गियर बाइक", icon: "🏍️" },
      { value: "BIKE_NON_GEARED" as VehicleType, label: "स्कूटर", icon: "🛵" },
    ],
    ownTrack: "हमारे पास अपना ड्राइविंग ट्रैक / टेस्ट ग्राउंड है",
    ownTrackSub: "छात्र आपके परिसर में अंतिम RTO टेस्ट दे सकते हैं",
    yearsExpInd: "पढ़ाने के अनुभव के वर्ष", yearsExpDs: "स्कूल संचालन के वर्ष", yearsExpPh: "जैसे 27",
    languages: "शिक्षण की भाषाएं",
    langOptions: ["हिंदी", "अंग्रेज़ी", "मराठी", "कन्नड़", "तमिल", "तेलुगु", "बंगाली", "गुजराती", "पंजाबी"],
    packagesLabel: "पैकेज और मूल्य",
    packagesHint: 'वाहन-मॉडल के अनुसार मूल्य निर्धारण के लिए (जैसे Wagon R ₹3000, Swift ₹3500), पैकेज के अंदर "प्रति वाहन मॉडल" सक्षम करें।',
    templateLabels: ["LL पैकेज", "DL पैकेज", "LL + DL पैकेज", "प्रति सत्र"],
    packageN: "पैकेज", pkgName: "पैकेज का नाम *", pkgNamePh: "LL पैकेज",
    startPrice: "शुरुआती कीमत ₹ *", maxPrice: "अधिकतम ₹", maxPriceHint: "यदि रेंज",
    days: "दिन", session: "सत्र", distPerDay: "प्रति दिन दूरी",
    acSurcharge: "AC अधिभार ₹",
    vehicleModels: "शामिल वाहन मॉडल", vehicleModelsPh: "जैसे Wagon R, Swift, Xcent, Brezza",
    whatsIncluded: "क्या शामिल है", whatsIncludedPh: "ट्रेनिंग + RTO सहायता + पिकअप",
    trackFee: "ट्रैक / टेस्ट दिन शुल्क प्रति वाहन ₹",
    perVehicleModel: "वाहन मॉडल के अनुसार कीमत (जैसे Wagon R ₹3000, Brezza ₹5000)",
    vehicleModel: "वाहन मॉडल", nonAC: "नॉन-AC ₹", AC: "AC ₹",
    addVehicleModel: "+ वाहन मॉडल जोड़ें",
    remove: "हटाएं",
    addPackages: ["+ LL पैकेज जोड़ें", "+ DL पैकेज जोड़ें", "+ LL + DL पैकेज जोड़ें", "+ प्रति सत्र जोड़ें"],
    addCustomPkg: "+ कस्टम पैकेज",
    ownerDL: "मालिक का व्यक्तिगत DL", trainerDL: "ड्राइविंग लाइसेंस नंबर",
    dlPh: "KA01XXXXXXXXXX", dlOptional: "(वैकल्पिक)",
    summary: "सारांश",
    summaryLabels: { type: "प्रकार", school: "स्कूल", reg: "पंजीकरण", owner: "मालिक", name: "नाम", phone: "फोन", city: "शहर", languages: "भाषाएं", packages: "पैकेज" },
    summaryTypes: { ds: "🏫 ड्राइविंग स्कूल", ind: "🧑‍🏫 व्यक्तिगत ट्रेनर" },
    termsText: "मैं पुष्टि करता/करती हूं कि सभी जानकारी सटीक है। मैं LearnDrive की",
    termsLink: "शर्तों", privacyLink: "गोपनीयता नीति", termsAnd: "और",
    continue: "आगे बढ़ें →", back: "← वापस",
    submit: "आवेदन सबमिट करें ✓", submitting: "सबमिट हो रहा है...",
    successInd: "आप पंजीकृत हो गए!", successDs: "स्कूल पंजीकृत हुआ!",
    successMsg: "हम", successMsgPost: "पर 24 घंटे में कॉल करेंगे।",
    goHome: "होम पर वापस जाएं",
    secureNote: "🔒 आपका डेटा सुरक्षित है और सार्वजनिक नहीं किया जाता",
    stepOf: "चरण", of: "में से",
    errors: {
      schoolName: "स्कूल का नाम आवश्यक है", ownerName: "मालिक का नाम आवश्यक है",
      schoolLicenceNo: "लाइसेंस नंबर आवश्यक है", msFormNo: "MS Form No. आवश्यक है",
      name: "पूरा नाम आवश्यक है", phone: "वैध 10 अंकों का मोबाइल नंबर आवश्यक है",
      email: "वैध ईमेल दर्ज करें", city: "शहर चुनें",
      pincode: "6 अंकों का पिनकोड दर्ज करें", serviceArea: "कम से कम एक सेवा पिनकोड जोड़ें",
      vehicleTypes: "कम से कम एक वाहन प्रकार चुनें", yearsExp: "अनुभव के वर्ष दर्ज करें",
      packages: "कम से कम एक पैकेज जोड़ें",
      packagesBad: "प्रत्येक पैकेज में नाम और कम से कम एक शुरुआती कीमत होनी चाहिए",
      licenseNo: "DL नंबर आवश्यक है", agreedToTerms: "कृपया शर्तों से सहमत हों",
      pcInvalid: "वैध 6 अंकों का पिनकोड दर्ज करें", pcDuplicate: "पहले से जोड़ा जा चुका है", pcMax: "अधिकतम 10 पिनकोड",
    },
  },
};

// English language keys (always stored in DB regardless of UI language)
const LANG_EN_KEYS = ["Hindi","English","Marathi","Kannada","Tamil","Telugu","Bengali","Gujarati","Punjabi"];

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

const PACKAGE_TEMPLATES = [
  { name: "LL Package", days: 20, sessionLength: "30 min/day", distancePerDay: "5 km", includes: "Learner Licence training, RTO slot booking, driving practice" },
  { name: "DL Package", days: 30, sessionLength: "45 min/day", distancePerDay: "10 km", includes: "Full DL training, RTO test preparation, road confidence" },
  { name: "LL + DL Package", days: 45, sessionLength: "45 min/day", distancePerDay: "10 km", includes: "Complete LL + DL training, all RTO formalities" },
  { name: "Per Session", days: 1, sessionLength: "1 hour", distancePerDay: "", includes: "Single session, flexible scheduling" },
];

function makePkg(tmpl?: typeof PACKAGE_TEMPLATES[0]): TrainerPackage {
  return { id: Math.random().toString(36).slice(2), name: tmpl?.name || "", price: "", priceMax: "", days: tmpl?.days || "", sessionLength: tmpl?.sessionLength || "", distancePerDay: tmpl?.distancePerDay || "", includes: tmpl?.includes || "", trackFeePerVehicle: "", acSurcharge: "", vehicleModels: "", hasVariants: false, variants: [] };
}
function makeVariant(): VehicleVariant { return { model: "", price: "", priceAC: "" }; }

const INITIAL: FormData = {
  trainerType: "INDEPENDENT", name: "", schoolName: "", licenceFormat: "RTO_STANDARD",
  schoolLicenceNo: "", msFormNo: "", msRTO: "", ownerName: "", phone: "", email: "",
  licenseNo: "", city: "", pincode: "", serviceArea: [], vehicleTypes: [], yearsExp: "",
  languages: [], hasOwnTrack: false, packages: [makePkg(PACKAGE_TEMPLATES[0])], agreedToTerms: false,
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-red-400">⚠ {msg}</p>;
}

function buildLicenceNo(d: FormData): string {
  if (d.trainerType === "INDEPENDENT") return d.licenseNo;
  if (d.licenceFormat === "RTO_STANDARD") return d.schoolLicenceNo;
  if (d.licenceFormat === "MS_FORM") return `MS Form No. ${d.msFormNo}${d.msRTO ? ` (${d.msRTO})` : ""}`;
  return d.schoolLicenceNo || d.licenseNo;
}

export default function RegisterPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "hi">("en");
  const t = T[lang];
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [done, setDone] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [pcInput, setPcInput] = useState("");
  const [pcErr, setPcErr] = useState("");

  const school = data.trainerType === "DRIVING_SCHOOL";

  useEffect(() => { TrainerEvents.stepStarted(1, "You"); }, []);

  const set = useCallback((k: keyof FormData, v: any) => {
    setData(p => ({ ...p, [k]: v }));
    setErrors(p => { const n = { ...p }; delete n[k]; return n; });
  }, []);

  const toggleV = (v: VehicleType) => set("vehicleTypes", data.vehicleTypes.includes(v) ? data.vehicleTypes.filter(x => x !== v) : [...data.vehicleTypes, v]);
  const toggleL = (enKey: string) => set("languages", data.languages.includes(enKey) ? data.languages.filter(x => x !== enKey) : [...data.languages, enKey]);

  const addPc = () => {
    const p = pcInput.trim();
    if (!/^\d{6}$/.test(p)) { setPcErr(t.errors.pcInvalid); return; }
    if (data.serviceArea.includes(p)) { setPcErr(t.errors.pcDuplicate); return; }
    if (data.serviceArea.length >= 10) { setPcErr(t.errors.pcMax); return; }
    set("serviceArea", [...data.serviceArea, p]);
    setPcInput(""); setPcErr("");
  };

  const addPkg = (tmpl?: typeof PACKAGE_TEMPLATES[0]) => { if (data.packages.length < 6) set("packages", [...data.packages, makePkg(tmpl)]); };
  const rmPkg = (id: string) => { if (data.packages.length > 1) set("packages", data.packages.filter(p => p.id !== id)); };
  const updPkg = (id: string, f: keyof TrainerPackage, v: any) => {
    set("packages", data.packages.map(p => p.id === id ? { ...p, [f]: v } : p));
    setErrors(prev => { const n = { ...prev }; delete n.packages; return n; });
  };
  const applyTmpl = (id: string, tmpl: typeof PACKAGE_TEMPLATES[0]) =>
    set("packages", data.packages.map(p => p.id === id ? { ...p, name: tmpl.name, days: tmpl.days, sessionLength: tmpl.sessionLength, distancePerDay: tmpl.distancePerDay, includes: tmpl.includes } : p));
  const addVariant = (pkgId: string) => set("packages", data.packages.map(p => p.id === pkgId ? { ...p, variants: [...p.variants, makeVariant()] } : p));
  const rmVariant = (pkgId: string, idx: number) => set("packages", data.packages.map(p => p.id === pkgId ? { ...p, variants: p.variants.filter((_, i) => i !== idx) } : p));
  const updVariant = (pkgId: string, idx: number, f: keyof VehicleVariant, v: any) => set("packages", data.packages.map(p => p.id === pkgId ? { ...p, variants: p.variants.map((vr, i) => i === idx ? { ...vr, [f]: v } : vr) } : p));

  const runValidation = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (school) {
        if (!data.schoolName.trim()) e.schoolName = t.errors.schoolName;
        if (!data.ownerName.trim()) e.ownerName = t.errors.ownerName;
        if (data.licenceFormat === "RTO_STANDARD" && !data.schoolLicenceNo.trim()) e.schoolLicenceNo = t.errors.schoolLicenceNo;
        if (data.licenceFormat === "MS_FORM" && !data.msFormNo.trim()) e.msFormNo = t.errors.msFormNo;
      } else {
        if (!data.name.trim() || data.name.length < 2) e.name = t.errors.name;
      }
      if (!data.phone || !/^[6-9]\d{9}$/.test(data.phone)) e.phone = t.errors.phone;
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = t.errors.email;
    }
    if (s === 2) {
      if (!data.city) e.city = t.errors.city;
      if (!data.pincode || !/^\d{6}$/.test(data.pincode)) e.pincode = t.errors.pincode;
      if (data.serviceArea.length === 0) e.serviceArea = t.errors.serviceArea;
    }
    if (s === 3) {
      if (data.vehicleTypes.length === 0) e.vehicleTypes = t.errors.vehicleTypes;
      if (!data.yearsExp || isNaN(Number(data.yearsExp)) || Number(data.yearsExp) < 1) e.yearsExp = t.errors.yearsExp;
      if (data.packages.length === 0) e.packages = t.errors.packages;
      const bad = data.packages.find(p => !p.name || (!p.price && !p.priceMax));
      if (bad) e.packages = t.errors.packagesBad;
    }
    if (s === 4) {
      if (!school && !data.licenseNo.trim()) e.licenseNo = t.errors.licenseNo;
      if (!data.agreedToTerms) e.agreedToTerms = t.errors.agreedToTerms;
    }
    return e;
  };

  const next = () => {
    const e = runValidation(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    TrainerEvents.stepStarted(step + 1, t.stepLabels[step] ?? "");
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const submit = async () => {
    const e = runValidation(4);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true); setSubmitErr("");
    try {
      const displayName = school ? data.schoolName : data.name;
      const licenceNo = buildLicenceNo(data);
      const adminNotes = school ? `DS Licence: ${licenceNo} | Owner: ${data.ownerName} | Personal DL: ${data.licenseNo || "N/A"} | Own track: ${data.hasOwnTrack ? "Yes" : "No"}` : undefined;
      const res = await fetch("/api/trainers/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName, email: data.email || undefined, mobile: data.phone, bio: school ? `Owned by ${data.ownerName}` : "", city: data.city, pincode: data.pincode, serviceArea: data.serviceArea, vehicleTypes: data.vehicleTypes, experience: Number(data.yearsExp), languages: data.languages, basePrice: data.packages[0]?.price ? Number(data.packages[0].price) : undefined, packagesJson: JSON.stringify(data.packages), licenseNumber: licenceNo, trainerType: data.trainerType, adminNotes, documents: {} }),
      });
      const json = await res.json();
      if (!res.ok) { setSubmitErr(json.error || "Something went wrong."); return; }
      TrainerEvents.completed(data.trainerType);

// Google Ads conversion tracking — fires when trainer completes registration
if (typeof window !== "undefined" && (window as any).gtag) {
  (window as any).gtag("event", "trainer_reg_complete", {
    send_to: "AW-18005538316",
  });
}

setDone(true);
    } catch { setSubmitErr("Network error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inp = "w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all text-sm";
  const bg = { background: "rgba(15,23,42,0.8)" };
  const prog = (step / t.stepLabels.length) * 100;

  const LangToggle = () => (
    <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", borderRadius: 999, padding: 3 }}>
      {(["en", "hi"] as const).map(l => (
        <button key={l} type="button" onClick={() => setLang(l)}
          style={{ padding: "5px 14px", borderRadius: 999, border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.78rem", background: lang === l ? "#F59E0B" : "transparent", color: lang === l ? "#0F172A" : "rgba(255,255,255,0.5)", transition: "all 0.15s" }}>
          {l === "en" ? "EN" : "हि"}
        </button>
      ))}
    </div>
  );

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f2040 50%,#1a1a2e 100%)" }}>
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl" style={{ background: "rgba(251,191,36,0.15)", border: "2px solid rgba(251,191,36,0.4)" }}>🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">{school ? t.successDs : t.successInd}</h1>
        <p className="text-slate-400 mb-8">{t.successMsg} <span className="text-amber-300 font-mono">+91 {data.phone}</span> {t.successMsgPost}</p>
        <button onClick={() => router.push("/")} className="px-8 py-3 bg-amber-400 hover:bg-amber-300 font-bold rounded-xl" style={{ color: "#0f172a" }}>{t.goHome}</button>
      </div>
    </div>
  );

  const heading = step === 1 ? (school ? t.stepHeadings[1].ds : t.stepHeadings[1].ind) : (t.stepHeadings as any)[step];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#0a1628 0%,#0f2040 50%,#1a1a2e 100%)" }}>
      <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between" style={{ background: "rgba(10,22,40,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-white hover:text-amber-300 transition-colors">
          <span className="text-xl">←</span><span className="hidden sm:block text-sm font-medium">LearnDrive</span>
        </button>
        <div className="flex items-center gap-3">
          <LangToggle />
          <span className="text-xs text-slate-500">{t.stepOf} {step} {t.of} {t.stepLabels.length}</span>
          <span className="text-xs font-semibold text-amber-400">{t.stepLabels[step - 1]}</span>
        </div>
      </header>
      <div className="h-0.5 bg-slate-800"><div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${prog}%` }} /></div>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Step indicators */}
        <div className="flex items-center gap-1 mb-8">
          {t.stepLabels.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all flex-shrink-0 ${step > i + 1 ? "bg-amber-400" : step === i + 1 ? "bg-amber-400/20 border-2 border-amber-400 text-amber-400" : "bg-slate-800 border border-slate-600 text-slate-500"}`}
                style={{ color: step > i + 1 ? "#0f172a" : undefined }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              {i < t.stepLabels.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${step > i + 1 ? "bg-amber-400" : "bg-slate-700"}`} />}
            </div>
          ))}
        </div>

        <div className="mb-8">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">{school ? t.regBadge.ds : t.regBadge.ind}</p>
          <h1 className="text-3xl font-bold text-white leading-tight">{heading}</h1>
        </div>

        <div className="rounded-2xl p-6 sm:p-8" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">{t.trainerTypeLabel} <span className="text-amber-400">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  {t.trainerTypes.map(opt => (
                    <button key={opt.v} type="button" onClick={() => set("trainerType", opt.v)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${data.trainerType === opt.v ? "border-amber-400 bg-amber-400/10" : "border-slate-600 hover:border-slate-500"}`}>
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
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">{t.schoolName} <span className="text-amber-400">*</span></label>
                    <input type="text" value={data.schoolName} onChange={e => set("schoolName", e.target.value)} placeholder={t.schoolNamePh} className={inp} style={bg} />
                    <FieldError msg={errors.schoolName} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">{t.regFormat} <span className="text-amber-400">*</span></label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {t.regFormats.map(opt => (
                        <button key={opt.v} type="button" onClick={() => set("licenceFormat", opt.v)}
                          className={`p-3 rounded-xl border text-left transition-all ${data.licenceFormat === opt.v ? "border-amber-400 bg-amber-400/10" : "border-slate-600 hover:border-slate-500"}`}>
                          <div className="text-xs font-bold text-white">{opt.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{opt.eg}</div>
                        </button>
                      ))}
                    </div>
                    {data.licenceFormat === "RTO_STANDARD" && (
                      <div>
                        <input type="text" value={data.schoolLicenceNo} onChange={e => set("schoolLicenceNo", e.target.value.toUpperCase())} placeholder={t.rtoStdPh} className={`${inp} font-mono`} style={bg} />
                        <p className="text-xs text-slate-500 mt-1">{t.rtoStdHint}</p>
                        <FieldError msg={errors.schoolLicenceNo} />
                      </div>
                    )}
                    {data.licenceFormat === "MS_FORM" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{t.msFormLabel} <span className="text-amber-400">*</span></label>
                          <input type="text" value={data.msFormNo} onChange={e => set("msFormNo", e.target.value)} placeholder={t.msFormPh} className={`${inp} font-mono`} style={bg} />
                          <p className="text-xs text-slate-500 mt-1">{t.msFormHint}</p>
                          <FieldError msg={errors.msFormNo} />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{t.msRTOLabel} <span className="text-slate-500">{t.optional}</span></label>
                          <input type="text" value={data.msRTO} onChange={e => set("msRTO", e.target.value)} placeholder={t.msRTOPh} className={inp} style={bg} />
                        </div>
                        <div className="rounded-lg px-3 py-2 text-xs text-blue-300" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>{t.msNote}</div>
                      </div>
                    )}
                    {data.licenceFormat === "OTHER" && (
                      <input type="text" value={data.schoolLicenceNo} onChange={e => set("schoolLicenceNo", e.target.value)} placeholder={t.otherPh} className={inp} style={bg} />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1.5">{t.ownerName} <span className="text-amber-400">*</span></label>
                    <input type="text" value={data.ownerName} onChange={e => set("ownerName", e.target.value)} placeholder={t.ownerPh} className={inp} style={bg} />
                    <FieldError msg={errors.ownerName} />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">{t.fullName} <span className="text-amber-400">*</span></label>
                  <input type="text" value={data.name} onChange={e => set("name", e.target.value)} placeholder={t.fullNamePh} className={inp} style={bg} />
                  <FieldError msg={errors.name} />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">{school ? t.contactNum : t.mobileNum} <span className="text-amber-400">*</span></label>
                <input type="tel" value={data.phone} onChange={e => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder={t.mobilePh} maxLength={10} inputMode="numeric" className={inp} style={bg} />
                <FieldError msg={errors.phone} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">{t.email} <span className="text-slate-500 font-normal">{t.optional}</span></label>
                <input type="email" value={data.email} onChange={e => set("email", e.target.value)} placeholder={t.emailPh} className={inp} style={bg} />
                <FieldError msg={errors.email} />
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">{t.city} <span className="text-amber-400">*</span></label>
                <input type="text" value={citySearch} onChange={e => setCitySearch(e.target.value)} placeholder={t.cityPh} className={inp} style={bg} />
                {citySearch && (
                  <div className="mt-2 rounded-xl border border-slate-600 overflow-hidden max-h-40 overflow-y-auto" style={{ background: "#0d1f38" }}>
                    {CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 8).map(c => (
                      <button key={c} type="button" onClick={() => { set("city", c); setCitySearch(c); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-amber-400/10 ${data.city === c ? "text-amber-400 font-semibold" : "text-slate-300"}`}>{c}</button>
                    ))}
                  </div>
                )}
                <FieldError msg={errors.city} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">{school ? t.schoolPincode : t.homePincode} <span className="text-amber-400">*</span></label>
                <input type="text" value={data.pincode} onChange={e => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder={t.pincodePh} maxLength={6} inputMode="numeric" className={inp} style={bg} />
                <FieldError msg={errors.pincode} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">{t.serviceArea} <span className="text-amber-400">*</span></label>
                <p className="text-xs text-slate-500 mb-2">{t.serviceAreaHint}</p>
                <div className="flex gap-2">
                  <input type="text" value={pcInput} onChange={e => { setPcInput(e.target.value.replace(/\D/g, "").slice(0, 6)); setPcErr(""); }}
                    onKeyDown={e => e.key === "Enter" && addPc()} placeholder={t.enterPincode} maxLength={6} inputMode="numeric" className={`${inp} flex-1`} style={bg} />
                  <button type="button" onClick={addPc} className="px-4 py-3 bg-amber-400/20 text-amber-400 font-bold rounded-xl text-sm border border-amber-400/30">{t.addPincode}</button>
                </div>
                {pcErr && <p className="mt-1 text-xs text-red-400">⚠ {pcErr}</p>}
                {data.serviceArea.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {data.serviceArea.map(p => (
                      <span key={p} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-amber-300" style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)" }}>
                        {p}<button type="button" onClick={() => set("serviceArea", data.serviceArea.filter(x => x !== p))} className="ml-1 text-slate-400 hover:text-red-400">×</button>
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
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">{t.vehicleTypes} <span className="text-amber-400">*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {t.vehicleOptions.map(v => (
                    <button key={v.value} type="button" onClick={() => toggleV(v.value)}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all ${data.vehicleTypes.includes(v.value) ? "border-amber-400 bg-amber-400/10 text-white" : "border-slate-600 text-slate-400"}`}>
                      <span className="text-2xl">{v.icon}</span>
                      <span className="text-xs font-semibold">{v.label}</span>
                    </button>
                  ))}
                </div>
                <FieldError msg={errors.vehicleTypes} />
              </div>

              {school && (
                <button type="button" onClick={() => set("hasOwnTrack", !data.hasOwnTrack)} className="flex items-start gap-3 w-full text-left group">
                  <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.hasOwnTrack ? "border-amber-400 bg-amber-400" : "border-slate-500"}`}>
                    {data.hasOwnTrack && <span className="text-xs font-bold" style={{ color: "#0f172a" }}>✓</span>}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-300">{t.ownTrack}</span>
                    <p className="text-xs text-slate-500 mt-0.5">{t.ownTrackSub}</p>
                  </div>
                </button>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">{school ? t.yearsExpDs : t.yearsExpInd} <span className="text-amber-400">*</span></label>
                <input type="number" value={data.yearsExp} onChange={e => set("yearsExp", e.target.value)} placeholder={t.yearsExpPh} min="1" className={inp} style={bg} />
                <FieldError msg={errors.yearsExp} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">{t.languages}</label>
                <div className="flex flex-wrap gap-2">
                  {t.langOptions.map((label, i) => {
                    const enKey = LANG_EN_KEYS[i];
                    return (
                      <button key={enKey} type="button" onClick={() => toggleL(enKey)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${data.languages.includes(enKey) ? "border-amber-400 bg-amber-400/10 text-amber-300" : "border-slate-600 text-slate-400"}`}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-slate-300">{t.packagesLabel} <span className="text-amber-400">*</span></label>
                  <span className="text-xs text-slate-500">{data.packages.length}/6</span>
                </div>
                <p className="text-xs text-slate-500 mb-4">{t.packagesHint}</p>
                <div className="space-y-5">
                  {data.packages.map((pkg, idx) => (
                    <div key={pkg.id} className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">{t.packageN} {idx + 1}</span>
                        {data.packages.length > 1 && <button type="button" onClick={() => rmPkg(pkg.id)} className="text-xs text-red-400">{t.remove}</button>}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {PACKAGE_TEMPLATES.map((tmpl, ti) => (
                          <button key={tmpl.name} type="button" onClick={() => applyTmpl(pkg.id, tmpl)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${pkg.name === tmpl.name ? "border-amber-400/60 text-amber-300 bg-amber-400/10" : "border-slate-600 text-slate-400"}`}>
                            {t.templateLabels[ti]}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{t.pkgName}</label>
                          <input type="text" value={pkg.name} onChange={e => updPkg(pkg.id, "name", e.target.value)} placeholder={t.pkgNamePh} className={`${inp} py-2.5`} style={bg} />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{t.startPrice}</label>
                          <input type="number" value={pkg.price} onChange={e => updPkg(pkg.id, "price", e.target.value ? Number(e.target.value) : "")} placeholder="3000" min="100" className={`${inp} py-2.5`} style={bg} />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{t.maxPrice} <span className="text-slate-600">{t.maxPriceHint}</span></label>
                          <input type="number" value={pkg.priceMax} onChange={e => updPkg(pkg.id, "priceMax", e.target.value ? Number(e.target.value) : "")} placeholder="6600" className={`${inp} py-2.5`} style={bg} />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{t.days}</label>
                          <input type="number" value={pkg.days} onChange={e => updPkg(pkg.id, "days", e.target.value ? Number(e.target.value) : "")} placeholder="20" min="1" className={`${inp} py-2.5`} style={bg} />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{t.session}</label>
                          <input type="text" value={pkg.sessionLength} onChange={e => updPkg(pkg.id, "sessionLength", e.target.value)} placeholder="30 min/day" className={`${inp} py-2.5`} style={bg} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{t.distPerDay}</label>
                          <input type="text" value={pkg.distancePerDay} onChange={e => updPkg(pkg.id, "distancePerDay", e.target.value)} placeholder="5 km" className={`${inp} py-2.5`} style={bg} />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">{t.acSurcharge} <span className="text-slate-600">{t.optional}</span></label>
                          <input type="number" value={pkg.acSurcharge} onChange={e => updPkg(pkg.id, "acSurcharge", e.target.value ? Number(e.target.value) : "")} placeholder="500" className={`${inp} py-2.5`} style={bg} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">{t.vehicleModels} <span className="text-slate-600">{t.optional}</span></label>
                        <input type="text" value={pkg.vehicleModels} onChange={e => updPkg(pkg.id, "vehicleModels", e.target.value)} placeholder={t.vehicleModelsPh} className={`${inp} py-2.5`} style={bg} />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">{t.whatsIncluded}</label>
                        <input type="text" value={pkg.includes} onChange={e => updPkg(pkg.id, "includes", e.target.value)} placeholder={t.whatsIncludedPh} className={`${inp} py-2.5`} style={bg} />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">{t.trackFee} <span className="text-slate-600">{t.optional}</span></label>
                        <input type="number" value={pkg.trackFeePerVehicle} onChange={e => updPkg(pkg.id, "trackFeePerVehicle", e.target.value ? Number(e.target.value) : "")} placeholder="150" className={`${inp} py-2.5`} style={bg} />
                      </div>
                      <div>
                        <button type="button" onClick={() => updPkg(pkg.id, "hasVariants", !pkg.hasVariants)}
                          className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                          <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${pkg.hasVariants ? "border-amber-400 bg-amber-400" : "border-slate-500"}`} style={{ color: pkg.hasVariants ? "#0f172a" : undefined }}>
                            {pkg.hasVariants ? "✓" : ""}
                          </span>
                          {t.perVehicleModel}
                        </button>
                        {pkg.hasVariants && (
                          <div className="mt-3 space-y-2">
                            <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 px-1 mb-1">
                              <span>{t.vehicleModel}</span><span>{t.nonAC}</span><span>{t.AC}</span>
                            </div>
                            {pkg.variants.map((vr, vi) => (
                              <div key={vi} className="grid grid-cols-3 gap-2 items-center">
                                <input type="text" value={vr.model} onChange={e => updVariant(pkg.id, vi, "model", e.target.value)} placeholder="Wagon R" className={`${inp} py-2`} style={bg} />
                                <input type="number" value={vr.price} onChange={e => updVariant(pkg.id, vi, "price", e.target.value ? Number(e.target.value) : "")} placeholder="3000" className={`${inp} py-2`} style={bg} />
                                <div className="flex gap-1">
                                  <input type="number" value={vr.priceAC} onChange={e => updVariant(pkg.id, vi, "priceAC", e.target.value ? Number(e.target.value) : "")} placeholder="3500" className={`${inp} py-2 flex-1`} style={bg} />
                                  <button type="button" onClick={() => rmVariant(pkg.id, vi)} className="text-red-400 px-1 text-lg">×</button>
                                </div>
                              </div>
                            ))}
                            <button type="button" onClick={() => addVariant(pkg.id)} className="text-xs text-amber-400 border border-amber-400/30 px-3 py-1.5 rounded-lg hover:bg-amber-400/10 transition-colors">{t.addVehicleModel}</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {data.packages.length < 6 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PACKAGE_TEMPLATES.filter(tmpl => !data.packages.find(p => p.name === tmpl.name)).map((tmpl) => {
                      const labelIdx = PACKAGE_TEMPLATES.indexOf(tmpl);
                      return (
                        <button key={tmpl.name} type="button" onClick={() => addPkg(tmpl)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-400 border border-amber-400/30 hover:bg-amber-400/10">
                          {t.addPackages[labelIdx]}
                        </button>
                      );
                    })}
                    <button type="button" onClick={() => addPkg()} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 border border-slate-600">{t.addCustomPkg}</button>
                  </div>
                )}
                <FieldError msg={errors.packages} />
              </div>
            </div>
          )}

          {/* ── STEP 4 ── */}
          {step === 4 && (
            <div className="space-y-5">
              {school && data.licenceFormat !== "OTHER" && (
                <div className="rounded-xl p-4 border border-green-500/20 text-sm text-green-300" style={{ background: "rgba(34,197,94,0.07)" }}>
                  ✅ {t.summaryLabels.reg}: <span className="font-mono font-bold">{buildLicenceNo(data)}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  {school ? t.ownerDL : t.trainerDL}{" "}
                  {school ? <span className="text-slate-500 font-normal">{t.dlOptional}</span> : <span className="text-amber-400">*</span>}
                </label>
                <input type="text" value={data.licenseNo} onChange={e => set("licenseNo", e.target.value.toUpperCase())}
                  placeholder={school ? `${t.dlPh} ${t.dlOptional}` : t.dlPh} className={`${inp} font-mono`} style={bg} />
                <FieldError msg={errors.licenseNo} />
              </div>
              <div className="rounded-xl p-4 border border-slate-700 space-y-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.summary}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-slate-500">{t.summaryLabels.type}</span>
                  <span className="text-amber-300">{school ? t.summaryTypes.ds : t.summaryTypes.ind}</span>
                  {school ? (
                    <>
                      <span className="text-slate-500">{t.summaryLabels.school}</span><span className="text-slate-200">{data.schoolName}</span>
                      <span className="text-slate-500">{t.summaryLabels.reg}</span><span className="text-slate-200 font-mono text-xs">{buildLicenceNo(data) || "—"}</span>
                      <span className="text-slate-500">{t.summaryLabels.owner}</span><span className="text-slate-200">{data.ownerName}</span>
                    </>
                  ) : (
                    <><span className="text-slate-500">{t.summaryLabels.name}</span><span className="text-slate-200">{data.name}</span></>
                  )}
                  <span className="text-slate-500">{t.summaryLabels.phone}</span><span className="text-slate-200 font-mono">+91 {data.phone}</span>
                  <span className="text-slate-500">{t.summaryLabels.city}</span><span className="text-slate-200">{data.city}</span>
                  <span className="text-slate-500">{t.summaryLabels.languages}</span><span className="text-slate-200">{data.languages.join(", ") || "—"}</span>
                </div>
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs font-semibold text-slate-400 mb-2">{t.summaryLabels.packages}</p>
                  {data.packages.map(p => (
                    <div key={p.id} className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">{p.name}</span>
                      <span className="text-amber-300">₹{Number(p.price).toLocaleString("en-IN")}{p.priceMax ? `–₹${Number(p.priceMax).toLocaleString("en-IN")}` : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => set("agreedToTerms", !data.agreedToTerms)} className="flex items-start gap-3 group w-full text-left">
                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.agreedToTerms ? "border-amber-400 bg-amber-400" : "border-slate-500"}`}>
                  {data.agreedToTerms && <span className="text-xs font-bold" style={{ color: "#0f172a" }}>✓</span>}
                </div>
                <span className="text-sm text-slate-300 leading-relaxed">
                  {t.termsText}{" "}
                  <a href="/terms" target="_blank" className="text-amber-400 underline">{t.termsLink}</a>{" "}
                  {t.termsAnd}{" "}
                  <a href="/privacy" target="_blank" className="text-amber-400 underline">{t.privacyLink}</a>.
                </span>
              </button>
              <FieldError msg={errors.agreedToTerms} />
            </div>
          )}
        </div>

        {submitErr && <div className="mt-4 rounded-xl px-4 py-3 text-sm text-red-300" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>⚠ {submitErr}</div>}

        <div className="flex items-center justify-between mt-6 gap-4">
          {step > 1
            ? <button type="button" onClick={back} className="px-6 py-3 text-slate-300 border border-slate-600 rounded-xl text-sm font-medium">{t.back}</button>
            : <div />}
          {step < t.stepLabels.length
            ? <button type="button" onClick={next} className="px-8 py-3 bg-amber-400 hover:bg-amber-300 font-bold rounded-xl text-sm" style={{ color: "#0f172a" }}>{t.continue}</button>
            : <button type="button" onClick={submit} disabled={submitting} className="flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 font-bold rounded-xl text-sm" style={{ color: "#0f172a" }}>
                {submitting ? <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />{t.submitting}</> : t.submit}
              </button>}
        </div>
        <p className="text-center text-xs text-slate-600 mt-8">{t.secureNote}</p>
      </div>
    </div>
  );
}