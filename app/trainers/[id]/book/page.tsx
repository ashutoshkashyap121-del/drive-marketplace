"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

declare global {
  interface Window { Razorpay: any; }
}

interface Trainer {
  id: number;
  name: string;
  city: string;
  basePrice: number | null;
  price?: number | null;
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

// Platform fee logic — flat ₹500 if >= ₹2000, else 10%
function computeFees(price: number) {
  const platformFee = price >= 2000 ? 500 : Math.round(price * 0.1);
  const trainerPayout = price - platformFee;
  return { platformFee, trainerPayout };
}

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceFromUrl   = parseInt(searchParams.get("price") || "0");
  const pkgName        = searchParams.get("pkgName") || "Training Package";
  const trainerNameFromUrl = searchParams.get("trainerName") || "";
  const trainerCityFromUrl = searchParams.get("trainerCity") || "";

  const trainerId = Array.isArray(id) ? id[0] : id;
  const [trainer, setTrainer]     = useState<Trainer | null>(null);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]       = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
    bookingDate: "",
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    fetch(`/api/trainers/${id}`)
      .then((r) => r.json())
      .then((data) => { setTrainer(data.trainer ?? data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const trainerName = trainer?.name || trainerNameFromUrl;
  const trainerCity = trainer?.city || trainerCityFromUrl;
  const totalAmount = priceFromUrl > 0 ? priceFromUrl : (trainer?.basePrice || trainer?.price || 0);
  const { platformFee, trainerPayout } = computeFees(totalAmount);

  function validate(): boolean {
    const e: FormErrors = {};
    const today = new Date(); today.setHours(0, 0, 0, 0);
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
    setForm({ ...form, [name]: name === "mobile" || name === "pincode" ? value.replace(/\D/g, "") : value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSubmitError("");
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (totalAmount <= 0) { setSubmitError("Invalid amount. Please go back and select a package."); return; }
    setSubmitting(true); setSubmitError("");

    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, customerName: form.customerName, trainerName }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { setSubmitError(orderData.error || "Failed to initiate payment."); setSubmitting(false); return; }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LearnDrive",
        description: `${pkgName} with ${trainerName}`,
        order_id: orderData.orderId,
        prefill: { name: form.customerName, contact: form.mobile, email: form.email || "" },
        theme: { color: "#F59E0B" },
        modal: {
          ondismiss: () => {
            setSubmitError("Payment cancelled. Your booking was not confirmed.");
            setSubmitting(false);
            router.push(`/trainers/${trainerId}`);
          },
        },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                trainerId: id,
                customerName: form.customerName,
                mobile: form.mobile,
                email: form.email,
                city: trainerCity,
                address: form.address,
                pincode: form.pincode,
                bookingDate: form.bookingDate,
                packageName: pkgName,
                totalAmount,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) { setSubmitError(verifyData.error || "Payment verification failed. Contact support."); setSubmitting(false); return; }
            router.push(`/success?id=${verifyData.booking.id}&trainer=${encodeURIComponent(trainerName)}`);
          } catch {
            setSubmitError("Payment received but booking failed. Contact support with payment ID: " + response.razorpay_payment_id);
            setSubmitting(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

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

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4" }}>
      <p style={{ color: "#64748B" }}>Loading...</p>
    </div>
  );

  if (!trainer && !trainerNameFromUrl) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#64748B", marginBottom: 16 }}>Could not load trainer details.</p>
        <button onClick={() => router.push(`/trainers/${trainerId}`)} style={{ color: "#F59E0B", background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 16 }}>← Go Back</button>
      </div>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(145deg, #0B1437 0%, #1A2B5F 100%)", padding: "24px 5%" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <button onClick={() => router.push(`/trainers/${trainerId}`)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", cursor: "pointer", marginBottom: 8, padding: 0 }}>
            ← Back
          </button>
          {/* ✅ FIX: Show package name, not "Book Trial Class" */}
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF" }}>
            Book {pkgName}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 5% 60px" }}>

        {/* ── Booking summary card ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, marginBottom: 4 }}>
                Booking with
              </p>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: 2 }}>
                {trainerName}
              </h2>
              <p style={{ fontSize: "0.82rem", color: "#64748B" }}>📍 {trainerCity}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#F59E0B" }}>
                ₹{totalAmount.toLocaleString("en-IN")}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{pkgName}</p>
            </div>
          </div>
        </div>

        {/* ✅ NEW: Lowest package note */}
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: "1rem", flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0, lineHeight: 1.5 }}>
            You are booking the <strong>{pkgName}</strong> — the starting package for this trainer.
            If you wish to upgrade to a higher package later, the difference in price will be applicable.
          </p>
        </div>

        {/* Secure payment badge */}
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.2rem" }}>🔒</span>
          <div>
            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#166534", margin: 0 }}>Secure Payment via Razorpay</p>
            <p style={{ fontSize: "0.75rem", color: "#16A34A", margin: 0 }}>UPI · Cards · Net Banking · Wallets accepted</p>
          </div>
        </div>

        {/* ── Form ── */}
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
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
              Email <span style={{ color: "#CBD5E1", fontWeight: 400 }}>(optional)</span>
            </label>
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
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
              Pincode <span style={{ color: "#CBD5E1", fontWeight: 400 }}>(optional)</span>
            </label>
            <input type="text" name="pincode" value={form.pincode} onChange={handleChange}
              placeholder="110001" maxLength={6} inputMode="numeric"
              style={inputStyle(!!errors.pincode)}
              onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.target.style.borderColor = errors.pincode ? "#F87171" : "#E2E8F0")} />
            {errors.pincode && <p style={{ color: "#EF4444", fontSize: "0.75rem", marginTop: 5 }}>⚠ {errors.pincode}</p>}
          </div>

          {/* Date */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>Preferred Start Date *</label>
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

          {/* ✅ FIX: Correct price breakdown — no hardcoded ₹299 trial line */}
          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: "1px solid #E2E8F0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#64748B", marginBottom: 6 }}>
              <span>{pkgName}</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#16A34A", marginBottom: 6 }}>
              <span>↳ Goes to trainer</span>
              <span>₹{trainerPayout.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#64748B", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #E2E8F0" }}>
              <span>↳ Platform fee (LearnDrive)</span>
              <span>₹{platformFee.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#0F172A" }}>
              <span>Total payable</span>
              <span style={{ color: "#F59E0B" }}>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={submitting}
            style={{ width: "100%", padding: "15px", background: submitting ? "#94A3B8" : "linear-gradient(135deg, #F59E0B, #D97706)", color: "#FFFFFF", fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, border: "none", borderRadius: 12, cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.4)", transition: "all 0.2s" }}>
            {submitting ? "⏳ Opening Payment..." : `Pay ₹${totalAmount.toLocaleString("en-IN")} & Confirm →`}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94A3B8", marginTop: 14 }}>
            🔒 Secured by Razorpay · Trainer will contact you to confirm timing
          </p>
        </div>
      </div>
    </main>
  );
}