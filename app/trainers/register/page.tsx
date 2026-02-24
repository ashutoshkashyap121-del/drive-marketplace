"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type VehicleType = "CAR" | "BIKE_GEARED" | "BIKE_NON_GEARED";

interface FormData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  pincode: string;
  city: string;
  serviceArea: string[];
  vehicleTypes: VehicleType[];
  yearsExp: string;
  languages: string[];
  pricePerHour: string;
  hasDualControl: boolean;
  vehicleYear: string;
  insuranceValidUntil: string;
  rcNumber: string;
  vehicleNumber: string;
  licensePhotoUrl: string;
  licensePhotoName: string;
  insuranceDocUrl: string;
  insuranceDocName: string;
  rcDocUrl: string;
  rcDocName: string;
  licenseNo: string;
  aadharNo: string;
  agreedToTerms: boolean;
}

const CITIES = ["Delhi NCR", "Mumbai", "Bangalore"];

const VEHICLE_OPTIONS: { value: VehicleType; label: string; icon: string; desc: string }[] = [
  { value: "CAR", label: "Car", icon: "🚗", desc: "Manual & automatic transmission" },
  { value: "BIKE_GEARED", label: "Geared Bike", icon: "🏍️", desc: "Motorcycles with gears" },
  { value: "BIKE_NON_GEARED", label: "Scooter / Non-Geared", icon: "🛵", desc: "Scooters & automatic bikes" },
];

const LANGUAGES = ["Hindi","English","Marathi","Kannada","Tamil","Telugu","Bengali","Gujarati","Punjabi"];
const CURRENT_YEAR = new Date().getFullYear();
const STEPS = [
  { id: 1, label: "Personal", icon: "👤" },
  { id: 2, label: "Location", icon: "📍" },
  { id: 3, label: "Expertise", icon: "🎓" },
  { id: 4, label: "Documents", icon: "📄" },
  { id: 5, label: "Verify", icon: "🔒" },
];

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400 flex items-center gap-1"><span>⚠</span>{msg}</p>;
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-300 mb-1.5 tracking-wide">
      {children}{required && <span className="text-amber-400 ml-1">*</span>}
    </label>
  );
}

function Input({ type = "text", value, onChange, placeholder, maxLength, disabled, min, max }: {
  type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; maxLength?: number; disabled?: boolean; min?: string; max?: string;
}) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} maxLength={maxLength} disabled={disabled} min={min} max={max}
      className="w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500
        focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20
        disabled:opacity-50 transition-all duration-200"
      style={{ background: "rgba(15, 23, 42, 0.8)" }}
    />
  );
}

function FileUpload({ label, required, accept, fileName, uploadedUrl, onUpload, hint }: {
  label: string; required?: boolean; accept: string;
  fileName: string; uploadedUrl: string;
  onUpload: (url: string, name: string) => void; hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.size > 5 * 1024 * 1024) { setError("File too large — max 5 MB"); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "trainer-documents");
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onUpload(data.secure_url, file.name);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Label required={required}>{label}</Label>
      {hint && <p className="text-xs text-slate-500 mb-2">{hint}</p>}
      <div onClick={() => !uploading && ref.current?.click()}
        className={`flex items-center gap-4 px-4 py-4 rounded-xl border-2 border-dashed transition-all duration-200
          ${uploadedUrl ? "border-green-500/50 bg-green-500/5 cursor-pointer"
            : uploading ? "border-amber-400/50 bg-amber-400/5 cursor-wait"
            : "border-slate-600 hover:border-amber-400/50 hover:bg-amber-400/5 cursor-pointer"}`}>
        <input ref={ref} type="file" accept={accept} onChange={handleChange} className="hidden" />
        <div className="text-2xl">{uploadedUrl ? "✅" : uploading ? "⏳" : "📁"}</div>
        <div className="flex-1 min-w-0">
          {uploadedUrl ? (
            <><p className="text-sm font-medium text-green-400 truncate">{fileName}</p>
            <p className="text-xs text-slate-500 mt-0.5">Uploaded to cloud ✓ · Click to replace</p></>
          ) : uploading ? (
            <p className="text-sm font-medium text-amber-300">Uploading to cloud...</p>
          ) : (
            <><p className="text-sm font-medium text-slate-300">Click to upload</p>
            <p className="text-xs text-slate-500 mt-0.5">JPG, PNG or PDF · Max 5 MB</p></>
          )}
        </div>
        {!uploadedUrl && !uploading && (
          <span className="text-xs text-amber-400 font-semibold border border-amber-400/30 rounded-lg px-3 py-1.5">Browse</span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">⚠ {error}</p>}
    </div>
  );
}

function StepPersonal({ data, errors, onChange }: {
  data: FormData; errors: Partial<Record<keyof FormData, string>>;
  onChange: (k: keyof FormData, v: any) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>Full Name</Label>
        <Input value={data.name} onChange={(v) => onChange("name", v)} placeholder="Rajesh Kumar" />
        <FieldError msg={errors.name} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Email Address</Label>
          <Input type="email" value={data.email} onChange={(v) => onChange("email", v)} placeholder="rajesh@example.com" />
          <FieldError msg={errors.email} />
        </div>
        <div>
          <Label required>Mobile Number</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">+91</span>
            <input type="tel" value={data.phone}
              onChange={(e) => onChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="9876543210" maxLength={10}
              className="w-full border border-slate-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500
                focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200"
              style={{ background: "rgba(15, 23, 42, 0.8)" }} />
          </div>
          <p className="mt-1 text-xs text-slate-500">Learners will contact you on this number</p>
          <FieldError msg={errors.phone} />
        </div>
      </div>
      <div>
        <Label required>About You</Label>
        <textarea value={data.bio} onChange={(e) => onChange("bio", e.target.value)}
          placeholder="Tell learners about your teaching style, experience, and what makes you a great driving instructor..."
          rows={4} maxLength={500}
          className="w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500
            focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 resize-none"
          style={{ background: "rgba(15, 23, 42, 0.8)" }} />
        <div className="flex justify-between items-start mt-1">
          <FieldError msg={errors.bio} />
          <span className="text-xs text-slate-500 ml-auto">{data.bio.length}/500</span>
        </div>
      </div>
    </div>
  );
}

function StepLocation({ data, errors, onChange }: {
  data: FormData; errors: Partial<Record<keyof FormData, string>>;
  onChange: (k: keyof FormData, v: any) => void;
}) {
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeError, setPincodeError] = useState("");

  const addPincode = () => {
    const p = pincodeInput.trim();
    if (!/^\d{6}$/.test(p)) { setPincodeError("Enter a valid 6-digit pincode"); return; }
    if (data.serviceArea.includes(p)) { setPincodeError("Pincode already added"); return; }
    if (data.serviceArea.length >= 10) { setPincodeError("Maximum 10 service pincodes"); return; }
    onChange("serviceArea", [...data.serviceArea, p]);
    setPincodeInput(""); setPincodeError("");
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>City</Label>
          <div className="grid grid-cols-1 gap-2 mt-1">
            {CITIES.map((city) => (
              <button key={city} type="button" onClick={() => onChange("city", city)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  data.city === city ? "border-amber-400 bg-amber-400/10 text-amber-300" : "border-slate-600 text-slate-300 hover:border-slate-500"
                }`}
                style={{ background: data.city === city ? "rgba(251,191,36,0.1)" : "rgba(15,23,42,0.8)" }}>
                {data.city === city && <span className="mr-2 text-amber-400">✓</span>}{city}
              </button>
            ))}
          </div>
          <FieldError msg={errors.city} />
        </div>
        <div>
          <Label required>Your Home Pincode</Label>
          <Input value={data.pincode} onChange={(v) => onChange("pincode", v.replace(/\D/g, "").slice(0, 6))} placeholder="110001" maxLength={6} />
          <p className="mt-1 text-xs text-slate-500">The pincode where you are based</p>
          <FieldError msg={errors.pincode} />
        </div>
      </div>
      <div>
        <Label required>Service Pincodes</Label>
        <p className="text-xs text-slate-500 mb-2">Add all pincodes you can travel to for training (max 10)</p>
        <div className="flex gap-2">
          <input type="tel" value={pincodeInput}
            onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPincode())}
            placeholder="e.g. 110001" maxLength={6}
            className="flex-1 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500
              focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200"
            style={{ background: "rgba(15, 23, 42, 0.8)" }} />
          <button type="button" onClick={addPincode}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 font-bold rounded-xl transition-colors duration-200 text-sm"
            style={{ color: "#0f172a" }}>Add</button>
        </div>
        {pincodeError && <p className="mt-1 text-xs text-red-400">⚠ {pincodeError}</p>}
        {data.serviceArea.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.serviceArea.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 border border-slate-600 rounded-lg text-sm text-slate-200 font-mono">
                {p}
                <button type="button" onClick={() => onChange("serviceArea", data.serviceArea.filter((x) => x !== p))}
                  className="text-slate-400 hover:text-red-400 transition-colors ml-1 font-bold">×</button>
              </span>
            ))}
          </div>
        )}
        <FieldError msg={errors.serviceArea} />
      </div>
    </div>
  );
}

function StepExpertise({ data, errors, onChange }: {
  data: FormData; errors: Partial<Record<keyof FormData, string>>;
  onChange: (k: keyof FormData, v: any) => void;
}) {
  const hasCAR = data.vehicleTypes.includes("CAR");

  const toggleVehicle = (v: VehicleType) => {
    const current = data.vehicleTypes;
    onChange("vehicleTypes", current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
  };

  const toggleLang = (l: string) => {
    const current = data.languages;
    onChange("languages", current.includes(l) ? current.filter((x) => x !== l) : [...current, l]);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label required>Vehicle Types You Train</Label>
        <div className="grid grid-cols-1 gap-3 mt-1">
          {VEHICLE_OPTIONS.map((v) => {
            const selected = data.vehicleTypes.includes(v.value);
            return (
              <button key={v.value} type="button" onClick={() => toggleVehicle(v.value)}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl border text-left transition-all duration-200 ${
                  selected ? "border-amber-400 bg-amber-400/10" : "border-slate-600 hover:border-slate-500"
                }`}
                style={{ background: selected ? "rgba(251,191,36,0.1)" : "rgba(15,23,42,0.8)" }}>
                <span className="text-2xl">{v.icon}</span>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${selected ? "text-amber-300" : "text-slate-200"}`}>{v.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{v.desc}</div>
                </div>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selected ? "border-amber-400 bg-amber-400" : "border-slate-600"}`}>
                  {selected && <span className="text-xs font-bold" style={{ color: "#0f172a" }}>✓</span>}
                </div>
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.vehicleTypes} />
      </div>

      {hasCAR && (
        <div className="rounded-xl p-4 border" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)" }}>
          <div className="flex items-start gap-3">
            <div className="text-red-400 text-lg mt-0.5">⚠️</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-300 mb-1">Dual Control Vehicle — Mandatory for Car Trainers</p>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Under the <strong className="text-slate-300">Motor Vehicles Act, 1988</strong>, all cars used for driving training must have dual controls. Trainers without dual control cars will not be approved.
              </p>
              <button type="button" onClick={() => onChange("hasDualControl", !data.hasDualControl)}
                className="flex items-start gap-3 w-full text-left group">
                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                  data.hasDualControl ? "border-green-400 bg-green-400" : "border-slate-500 group-hover:border-red-400"}`}>
                  {data.hasDualControl && <span className="text-xs font-bold" style={{ color: "#0f172a" }}>✓</span>}
                </div>
                <span className="text-sm text-slate-200 leading-relaxed">
                  I confirm my training car has <strong className="text-white">dual control (dual brake & clutch pedals)</strong> installed and meets all Motor Vehicles Act requirements.
                </span>
              </button>
              <FieldError msg={errors.hasDualControl} />
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-widest mb-3">Training Vehicle Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label required>Vehicle Registration Number</Label>
            <Input value={data.vehicleNumber} onChange={(v) => onChange("vehicleNumber", v.toUpperCase())} placeholder="DL01AB1234" />
            <FieldError msg={errors.vehicleNumber} />
          </div>
          <div>
            <Label required>Vehicle Year of Manufacture</Label>
            <Input type="number" value={data.vehicleYear} onChange={(v) => onChange("vehicleYear", v)}
              placeholder={String(CURRENT_YEAR - 3)} min={String(CURRENT_YEAR - 8)} max={String(CURRENT_YEAR)} />
            <p className="mt-1 text-xs text-slate-500">Must be {CURRENT_YEAR - 8} or newer</p>
            <FieldError msg={errors.vehicleYear} />
          </div>
          <div>
            <Label required>RC Number</Label>
            <Input value={data.rcNumber} onChange={(v) => onChange("rcNumber", v.toUpperCase())} placeholder="DL01AB1234" />
            <FieldError msg={errors.rcNumber} />
          </div>
          <div>
            <Label required>Insurance Valid Until</Label>
            <Input type="date" value={data.insuranceValidUntil} onChange={(v) => onChange("insuranceValidUntil", v)}
              min={new Date().toISOString().split("T")[0]} />
            <FieldError msg={errors.insuranceValidUntil} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Years of Experience</Label>
          <Input type="number" value={data.yearsExp} onChange={(v) => onChange("yearsExp", v)} placeholder="5" min="5" />
          <p className="mt-1 text-xs text-slate-500">Minimum 5 years required</p>
          <FieldError msg={errors.yearsExp} />
        </div>
        <div>
          <Label required>Base Price per Hour (₹)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
            <input type="number" value={data.pricePerHour} onChange={(e) => onChange("pricePerHour", e.target.value)}
              placeholder="500" min={200} max={5000}
              className="w-full border border-slate-600 rounded-xl pl-8 pr-4 py-3 text-white placeholder-slate-500
                focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200"
              style={{ background: "rgba(15, 23, 42, 0.8)" }} />
          </div>
          <p className="mt-1 text-xs text-slate-500">Min ₹200 · Max ₹5,000</p>
          <FieldError msg={errors.pricePerHour} />
        </div>
      </div>

      <div>
        <Label required>Languages You Teach In</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {LANGUAGES.map((lang) => {
            const selected = data.languages.includes(lang);
            return (
              <button key={lang} type="button" onClick={() => toggleLang(lang)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  selected ? "border-amber-400 bg-amber-400/10 text-amber-300" : "border-slate-600 text-slate-400 hover:border-slate-500"
                }`}
                style={{ background: selected ? "rgba(251,191,36,0.1)" : "transparent" }}>
                {selected && "✓ "}{lang}
              </button>
            );
          })}
        </div>
        <FieldError msg={errors.languages} />
      </div>
    </div>
  );
}

function StepDocuments({ data, errors, onChange }: {
  data: FormData; errors: Partial<Record<keyof FormData, string>>;
  onChange: (k: keyof FormData, v: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl p-4 border border-blue-500/20 text-sm text-blue-300"
        style={{ background: "rgba(59,130,246,0.07)" }}>
        📄 Files upload directly to secure cloud storage. Max 5 MB per file.
      </div>

      <FileUpload label="Driving Licence (Front & Back)" required
        accept="image/jpeg,image/png,application/pdf"
        fileName={data.licensePhotoName} uploadedUrl={data.licensePhotoUrl}
        hint="Upload a clear photo/scan of your valid Indian driving licence"
        onUpload={(url, name) => { onChange("licensePhotoUrl", url); onChange("licensePhotoName", name); }} />
      <FieldError msg={errors.licensePhotoUrl} />

      <FileUpload label="Vehicle Insurance Document" required
        accept="image/jpeg,image/png,application/pdf"
        fileName={data.insuranceDocName} uploadedUrl={data.insuranceDocUrl}
        hint="Upload your current valid vehicle insurance certificate"
        onUpload={(url, name) => { onChange("insuranceDocUrl", url); onChange("insuranceDocName", name); }} />
      <FieldError msg={errors.insuranceDocUrl} />

      <FileUpload label="Vehicle RC (Registration Certificate)" required
        accept="image/jpeg,image/png,application/pdf"
        fileName={data.rcDocName} uploadedUrl={data.rcDocUrl}
        hint="Upload your vehicle Registration Certificate (RC book)"
        onUpload={(url, name) => { onChange("rcDocUrl", url); onChange("rcDocName", name); }} />
      <FieldError msg={errors.rcDocUrl} />

      <div className="rounded-xl p-4 border border-amber-400/15" style={{ background: "rgba(251,191,36,0.04)" }}>
        <p className="text-xs text-slate-400 leading-relaxed">
          🔒 Documents are stored securely and only accessible to the LearnDrive admin team for verification. Never shared publicly.
        </p>
      </div>
    </div>
  );
}

function StepCredentials({ data, errors, onChange }: {
  data: FormData; errors: Partial<Record<keyof FormData, string>>;
  onChange: (k: keyof FormData, v: any) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300"
        style={{ background: "rgba(59,130,246,0.08)" }}>
        🔒 Your credentials are encrypted and used only for RTO verification.
      </div>
      <div>
        <Label required>Driving Licence Number</Label>
        <Input value={data.licenseNo} onChange={(v) => onChange("licenseNo", v.toUpperCase())} placeholder="DL0120230001234" />
        <p className="mt-1 text-xs text-slate-500">Must be a valid Indian DL covering the vehicle classes you selected</p>
        <FieldError msg={errors.licenseNo} />
      </div>
      <div>
        <Label>Aadhar Number (Optional)</Label>
        <input type="password" value={data.aadharNo}
          onChange={(e) => onChange("aadharNo", e.target.value.replace(/\D/g, "").slice(0, 12))}
          placeholder="••••••••••••" maxLength={12}
          className="w-full border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500
            focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200"
          style={{ background: "rgba(15, 23, 42, 0.8)" }} />
        <p className="mt-1 text-xs text-slate-500">12-digit Aadhaar · masked for privacy</p>
        <FieldError msg={errors.aadharNo} />
      </div>
      <div className="pt-2">
        <button type="button" onClick={() => onChange("agreedToTerms", !data.agreedToTerms)}
          className="flex items-start gap-3 group w-full text-left">
          <div className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
            data.agreedToTerms ? "border-amber-400 bg-amber-400" : "border-slate-500 group-hover:border-slate-400"}`}>
            {data.agreedToTerms && <span className="text-xs font-bold" style={{ color: "#0f172a" }}>✓</span>}
          </div>
          <span className="text-sm text-slate-300 leading-relaxed">
            I confirm all information and documents are genuine. I agree to LearnDrive's{" "}
            <a href="/terms" target="_blank" className="text-amber-400 underline">Trainer Terms of Service</a>,{" "}
            <a href="/privacy" target="_blank" className="text-amber-400 underline">Privacy Policy</a>, and the{" "}
            <span className="text-amber-400 underline">Platform Commission Structure</span>.
            I understand that providing false information will result in immediate removal from the platform.
          </span>
        </button>
        <FieldError msg={errors.agreedToTerms} />
      </div>
      <div className="border border-amber-400/20 rounded-xl p-4" style={{ background: "rgba(251,191,36,0.05)" }}>
        <h4 className="text-sm font-semibold text-amber-300 mb-2">📝 What happens next?</h4>
        <ul className="text-sm text-slate-400 space-y-1.5">
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">1.</span>Our team reviews your application within 24–48 hours</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">2.</span>We verify your driving licence and documents</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">3.</span>You receive an approval email</li>
          <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">4.</span>Your profile goes live and learners start booking you!</li>
        </ul>
      </div>
    </div>
  );
}

function validateStep(step: number, data: FormData): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {};

  if (step === 1) {
    if (!data.name.trim() || data.name.length < 2) errors.name = "Full name is required (min 2 characters)";
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Valid email is required";
    if (!data.phone || !/^[6-9]\d{9}$/.test(data.phone)) errors.phone = "Valid 10-digit Indian mobile required";
    if (!data.bio || data.bio.length < 20) errors.bio = "Bio must be at least 20 characters";
  }

  if (step === 2) {
    if (!data.city) errors.city = "Select your city";
    if (!data.pincode || !/^\d{6}$/.test(data.pincode)) errors.pincode = "Valid 6-digit pincode required";
    if (data.serviceArea.length === 0) errors.serviceArea = "Add at least one service pincode";
  }

  if (step === 3) {
    if (data.vehicleTypes.length === 0) errors.vehicleTypes = "Select at least one vehicle type";
    if (data.vehicleTypes.includes("CAR") && !data.hasDualControl)
      errors.hasDualControl = "You must confirm dual control vehicle to train car learners";
    if (!data.vehicleNumber || data.vehicleNumber.length < 6) errors.vehicleNumber = "Enter your vehicle registration number";
    if (!data.rcNumber || data.rcNumber.length < 6) errors.rcNumber = "Enter your RC number";
    const year = Number(data.vehicleYear);
    if (!data.vehicleYear || isNaN(year) || year < CURRENT_YEAR - 8 || year > CURRENT_YEAR)
      errors.vehicleYear = `Vehicle must be manufactured between ${CURRENT_YEAR - 8} and ${CURRENT_YEAR}`;
    if (!data.insuranceValidUntil) errors.insuranceValidUntil = "Enter your insurance validity date";
    else if (new Date(data.insuranceValidUntil) <= new Date()) errors.insuranceValidUntil = "Insurance must be currently valid";
    if (!data.yearsExp || isNaN(Number(data.yearsExp)) || Number(data.yearsExp) < 5)
      errors.yearsExp = "Minimum 5 years of experience required";
    if (data.languages.length === 0) errors.languages = "Select at least one language";
    const price = Number(data.pricePerHour);
    if (!data.pricePerHour || isNaN(price) || price < 200 || price > 5000)
      errors.pricePerHour = "Price must be between ₹200 and ₹5,000";
  }

  if (step === 4) {
    if (!data.licensePhotoUrl) errors.licensePhotoUrl = "Upload your driving licence photo";
    if (!data.insuranceDocUrl) errors.insuranceDocUrl = "Upload your insurance document";
    if (!data.rcDocUrl) errors.rcDocUrl = "Upload your RC document";
  }

  if (step === 5) {
    if (!data.licenseNo || data.licenseNo.length < 10) errors.licenseNo = "Enter your driving licence number";
    if (data.aadharNo && !/^\d{12}$/.test(data.aadharNo)) errors.aadharNo = "Aadhaar must be 12 digits";
    if (!data.agreedToTerms) errors.agreedToTerms = "You must agree to the terms to continue";
  }

  return errors;
}

const INITIAL_DATA: FormData = {
  name: "", email: "", phone: "", bio: "",
  pincode: "", city: "", serviceArea: [],
  vehicleTypes: [], yearsExp: "", languages: [], pricePerHour: "",
  hasDualControl: false, vehicleYear: "", insuranceValidUntil: "", rcNumber: "", vehicleNumber: "",
  licensePhotoUrl: "", licensePhotoName: "",
  insuranceDocUrl: "", insuranceDocName: "",
  rcDocUrl: "", rcDocName: "",
  licenseNo: "", aadharNo: "", agreedToTerms: false,
};

export default function TrainerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onChange = useCallback((key: keyof FormData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const goNext = () => {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setErrors({});
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => { setStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleSubmit = async () => {
    const stepErrors = validateStep(5, data);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/trainers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          mobile: data.phone,
          bio: data.bio,
          city: data.city,
          pincode: data.pincode,
          serviceArea: data.serviceArea,
          vehicleTypes: data.vehicleTypes,
          experience: Number(data.yearsExp),
          languages: data.languages,
          basePrice: Number(data.pricePerHour),
          hasDualControl: data.hasDualControl,
          vehicleNumber: data.vehicleNumber,
          vehicleYear: Number(data.vehicleYear),
          rcNumber: data.rcNumber,
          insuranceValidUntil: data.insuranceValidUntil,
          licenseNumber: data.licenseNo,
          aadharNo: data.aadharNo || undefined,
          documents: {
            licensePhotoUrl: data.licensePhotoUrl,
            licensePhotoName: data.licensePhotoName,
            insuranceDocUrl: data.insuranceDocUrl,
            insuranceDocName: data.insuranceDocName,
            rcDocUrl: data.rcDocUrl,
            rcDocName: data.rcDocName,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.issues) {
          const mapped: Partial<Record<keyof FormData, string>> = {};
          for (const [k, v] of Object.entries(json.issues)) {
            mapped[k as keyof FormData] = Array.isArray(v) ? v[0] : String(v);
          }
          setErrors(mapped);
          setSubmitError("Please fix the errors above and try again.");
        } else {
          setSubmitError(json.error || "Something went wrong. Please try again.");
        }
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1a1a2e 100%)" }}>
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
            style={{ background: "rgba(251,191,36,0.15)", border: "2px solid rgba(251,191,36,0.4)" }}>🎉</div>
          <h1 className="text-3xl font-bold text-white mb-3">Application Submitted!</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Thanks, <span className="text-amber-300 font-semibold">{data.name}</span>! Our team will verify your credentials within{" "}
            <strong className="text-white">24–48 hours</strong>. Check your email at{" "}
            <span className="text-amber-300">{data.email}</span> for updates.
          </p>
          <div className="rounded-2xl p-6 mb-8 text-left space-y-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3 text-sm text-slate-300"><span className="text-amber-400">✓</span>Application & documents received</div>
            <div className="flex items-center gap-3 text-sm text-slate-400"><span className="text-slate-600">○</span>DL & vehicle verification in progress</div>
            <div className="flex items-center gap-3 text-sm text-slate-400"><span className="text-slate-600">○</span>Profile approval & go-live</div>
          </div>
          <button onClick={() => router.push("/")}
            className="px-8 py-3 bg-amber-400 hover:bg-amber-300 font-bold rounded-xl transition-colors"
            style={{ color: "#0f172a" }}>Back to Home</button>
        </div>
      </div>
    );
  }

  const progress = (step / STEPS.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #1a1a2e 100%)" }}>
      <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between"
        style={{ background: "rgba(10, 22, 40, 0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
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

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">Trainer Registration</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "Where do you operate?"}
            {step === 3 && "What do you teach?"}
            {step === 4 && "Upload your documents"}
            {step === 5 && "Verify your credentials"}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {step === 1 && "Basic info that learners will see on your profile"}
            {step === 2 && "Help learners find you based on their location"}
            {step === 3 && "Your vehicle expertise, training vehicle details, and pricing"}
            {step === 4 && "Secure upload — used for verification only, never shared publicly"}
            {step === 5 && "One-time verification to build learner trust"}
          </p>
        </div>

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

        <div className="rounded-2xl p-6 sm:p-8"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>
          {step === 1 && <StepPersonal data={data} errors={errors} onChange={onChange} />}
          {step === 2 && <StepLocation data={data} errors={errors} onChange={onChange} />}
          {step === 3 && <StepExpertise data={data} errors={errors} onChange={onChange} />}
          {step === 4 && <StepDocuments data={data} errors={errors} onChange={onChange} />}
          {step === 5 && <StepCredentials data={data} errors={errors} onChange={onChange} />}
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
              className="px-6 py-3 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-xl text-sm font-medium transition-all duration-200">
              ← Back
            </button>
          ) : <div />}

          {step < STEPS.length ? (
            <button type="button" onClick={goNext}
              className="flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 font-bold rounded-xl transition-all duration-200 text-sm"
              style={{ color: "#0f172a" }}>Continue →</button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed font-bold rounded-xl transition-all duration-200 text-sm"
              style={{ color: "#0f172a" }}>
              {isSubmitting ? (
                <><span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Submitting...</>
              ) : "Submit Application ✓"}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">
          🔒 Secure · Documents uploaded to encrypted cloud storage · Never shared publicly
        </p>
      </div>
    </div>
  );
}