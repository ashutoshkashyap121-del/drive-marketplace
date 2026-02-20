"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Trainer {
  id: number;
  name: string;
  city: string;
  basePrice: number | null;
  vehicleTypes: string[];
  experience: number;
}

interface FormErrors {
  customerName?: string;
  mobile?: string;
  city?: string;
  address?: string;
  pincode?: string;
  bookingDate?: string;
}

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState({ customerName: "", mobile: "", city: "", address: "", pincode: "", bookingDate: "" });

  useEffect(() => {
    fetch(`/api/trainers/${id}`).then((r) => r.json()).then((data) => { setTrainer(data.trainer); setLoading(false); });
  }, [id]);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!form.customerName.trim()) newErrors.customerName = "Name is required";
    if (!/^\d{10}$/.test(form.mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";
    if (!form.bookingDate) newErrors.bookingDate = "Please select a date";
    else if (new Date(form.bookingDate) < today) newErrors.bookingDate = "Please select a future date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: (name === "mobile" || name === "pincode") ? value.replace(/\D/g, "") : value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, trainerId: id }) });
      const data = await res.json();
      if (!res.ok) alert(data.error || "Something went wrong");
      else setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ color: "#64748B" }}>Loading trainer...</p>
    </div>
  );

  if (!trainer) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ color: "#64748B" }}>Trainer not found.</p>
    </div>
  );

  if (success) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif", padding: "20px" }}>
      <div style={{ background: "#FFFFFF", borderRadius: 24, padding: "48px 40px", textAlign: "center", maxWidth: 440, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>🎉</div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>Booking Confirmed!</h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 28 }}>
          Your session with <strong style={{ color: "#0F172A" }}>{trainer.name}</strong> has been requested. You'll be contacted on your mobile to confirm the details.
        </p>
        <button onClick={() => router.push("/")} style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#FFFFFF", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.95rem", padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.4)" }}>
          Back to Home
        </button>
      </div>
    </div>
  );

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "13px 16px",
    border: `2px solid ${hasError ? "#F87171" : "#E2E8F0"}`,
    borderRadius: 12,
    fontSize: "0.92rem",
    fontFamily: "inherit",
    color: "#0F172A",
    background: hasError ? "#FFF5F5" : "#F8FAFC",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  });

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(145deg, #0B1437 0%, #1A2B5F 100%)", padding: "24px 5%" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", cursor: "pointer", marginBottom: 8, padding: 0 }}>← Back</button>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF" }}>Book a Session</h1>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 5%" }}>

        {/* Trainer card */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, marginBottom: 4 }}>Booking with</p>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: 2 }}>{trainer.name}</h2>
            <p style={{ fontSize: "0.82rem", color: "#64748B" }}>📍 {trainer.city} · {trainer.experience} yrs exp</p>
          </div>
          {trainer.basePrice && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#F59E0B" }}>₹{trainer.basePrice}</p>
              <p style={{ fontSize: "0.75rem", color: "#94A3B8" }}>per session</p>
            </div>
          )}
        </div>

        {/* Form */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px" }}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>Your Details</h3>

          {[
            { label: "Full Name", name: "customerName", type: "text", placeholder: "Rahul Sharma", maxLength: undefined },
            { label: "Mobile Number", name: "mobile", type: "tel", placeholder: "9876543210", maxLength: 10 },
            { label: "City", name: "city", type: "text", placeholder: "Delhi", maxLength: undefined },
            { label: "Address", name: "address", type: "text", placeholder: "123, MG Road", maxLength: undefined },
            { label: "Pincode (optional)", name: "pincode", type: "text", placeholder: "110001", maxLength: 6 },
          ].map(({ label, name, type, placeholder, maxLength }) => (
            <div key={name} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>{label}</label>
              <input
                type={type}
                name={name}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                placeholder={placeholder}
                maxLength={maxLength}
                inputMode={name === "mobile" || name === "pincode" ? "numeric" : undefined}
                style={inputStyle(!!errors[name as keyof FormErrors])}
                onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
                onBlur={(e) => (e.target.style.borderColor = errors[name as keyof FormErrors] ? "#F87171" : "#E2E8F0")}
              />
              {errors[name as keyof FormErrors] && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 5 }}>{errors[name as keyof FormErrors]}</p>}
            </div>
          ))}

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Preferred Date</label>
            <input
              type="date"
              name="bookingDate"
              value={form.bookingDate}
              onChange={handleChange}
              min={todayStr}
              style={inputStyle(!!errors.bookingDate)}
              onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.target.style.borderColor = errors.bookingDate ? "#F87171" : "#E2E8F0")}
            />
            {errors.bookingDate && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 5 }}>{errors.bookingDate}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ width: "100%", padding: "15px", background: submitting ? "#94A3B8" : "linear-gradient(135deg, #F59E0B, #D97706)", color: "#FFFFFF", fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, border: "none", borderRadius: 12, cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.4)", transition: "all 0.2s" }}
          >
            {submitting ? "Submitting..." : "Confirm Booking →"}
          </button>
        </div>
      </div>
    </main>
  );
}