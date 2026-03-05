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
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
    bookingDate: "",
  });

  useEffect(() => {
    fetch(`/api/trainers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTrainer(data.trainer);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function validate(): boolean {
    const e: FormErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!form.customerName.trim() || form.customerName.length < 2) e.customerName = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit Indian mobile number";
    if (!form.address.trim()) e.address = "Enter your pickup address";
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    if (!form.bookingDate) e.bookingDate = "Please select a date";
    else if (new Date(form.bookingDate) < today) e.bookingDate = "Please select today or a future date";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "mobile" || name === "pincode" ? value.replace(/\D/g, "") : value,
    });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError("");
  };

  const handleSubmit = async () => {
    if (!validate() || !trainer) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerId: id,
          customerName: form.customerName,
          mobile: form.mobile,
          email: form.email,
          city: trainer.city, // ← use trainer's city, not manual input
          address: form.address,
          pincode: form.pincode,
          bookingDate: form.bookingDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }
      // ✅ Redirect to success page (triggers SMS to learner when admin confirms)
      router.push(
        `/success?id=${data.booking.id}&trainer=${encodeURIComponent(trainer.name)}`
      );
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ color: "#64748B" }}>Loading...</p>
    </div>
  );

  if (!trainer) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
      <p style={{ color: "#64748B" }}>Trainer not found.</p>
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

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 5% 60px" }}>

        {/* Trainer summary card */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, marginBottom: 4 }}>Booking with</p>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: 2 }}>{trainer.name}</h2>
            <p style={{ fontSize: "0.82rem", color: "#64748B" }}>📍 {trainer.city} · {trainer.experience} yrs exp</p>
          </div>
          {trainer.basePrice && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#F59E0B" }}>₹{trainer.basePrice.toLocaleString("en-IN")}</p>
              <p style={{ fontSize: "0.75rem", color: "#94A3B8" }}>per session</p>
            </div>
          )}
        </div>

        {/* Form */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px" }}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>Your Details</h3>

          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Full Name *</label>
            <input type="text" name="customerName" value={form.customerName} onChange={handleChange}
              placeholder="Rahul Sharma" style={inputStyle(!!errors.customerName)}
              onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.target.style.borderColor = errors.customerName ? "#F87171" : "#E2E8F0")} />
            {errors.customerName && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 5 }}>⚠ {errors.customerName}</p>}
          </div>

          {/* Mobile */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Mobile Number *</label>
            <input type="tel" name="mobile" value={form.mobile} onChange={handleChange}
              placeholder="9876543210" maxLength={10} inputMode="numeric"
              style={inputStyle(!!errors.mobile)}
              onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.target.style.borderColor = errors.mobile ? "#F87171" : "#E2E8F0")} />
            {errors.mobile && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 5 }}>⚠ {errors.mobile}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Email <span style={{ color: "#CBD5E1", fontWeight: 400 }}>(optional)</span></label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" style={inputStyle(false)}
              onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")} />
          </div>

          {/* Address */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Pickup Address *</label>
            <input type="text" name="address" value={form.address} onChange={handleChange}
              placeholder="House/Flat No, Street, Landmark" style={inputStyle(!!errors.address)}
              onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.target.style.borderColor = errors.address ? "#F87171" : "#E2E8F0")} />
            {errors.address && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 5 }}>⚠ {errors.address}</p>}
          </div>

          {/* Pincode */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Pincode <span style={{ color: "#CBD5E1", fontWeight: 400 }}>(optional)</span></label>
            <input type="text" name="pincode" value={form.pincode} onChange={handleChange}
              placeholder="110001" maxLength={6} inputMode="numeric"
              style={inputStyle(!!errors.pincode)}
              onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.target.style.borderColor = errors.pincode ? "#F87171" : "#E2E8F0")} />
            {errors.pincode && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 5 }}>⚠ {errors.pincode}</p>}
          </div>

          {/* Date */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Preferred Date *</label>
            <input type="date" name="bookingDate" value={form.bookingDate} onChange={handleChange}
              min={todayStr} style={inputStyle(!!errors.bookingDate)}
              onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.target.style.borderColor = errors.bookingDate ? "#F87171" : "#E2E8F0")} />
            {errors.bookingDate && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 5 }}>⚠ {errors.bookingDate}</p>}
          </div>

          {submitError && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 12, padding: "12px 16px", fontSize: "0.85rem", marginBottom: 16 }}>
              ⚠ {submitError}
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitting}
            style={{ width: "100%", padding: "15px", background: submitting ? "#94A3B8" : "linear-gradient(135deg, #F59E0B, #D97706)", color: "#FFFFFF", fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, border: "none", borderRadius: 12, cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.4)", transition: "all 0.2s" }}>
            {submitting ? "⏳ Submitting..." : "Confirm Booking Request →"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94A3B8", marginTop: 14 }}>
            🔒 Your details are secure · Trainer will contact you to confirm timing
          </p>
        </div>
      </div>
    </main>
  );
}