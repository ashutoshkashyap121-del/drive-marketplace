"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const trainerId = params.id as string;
  const trainerName = searchParams.get("trainerName") || "Your Trainer";
  const city = searchParams.get("trainerCity") || "";
  const amount = Number(searchParams.get("price") || 0);
  const packageName = searchParams.get("pkgName") || "Driving Package";
  const platformFee = Math.round(amount * 0.15);

  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
    bookingDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim() || form.customerName.length < 2) e.customerName = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit Indian mobile number";
    if (!form.address.trim()) e.address = "Enter your pickup address";
    if (!form.pincode || !/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    if (!form.bookingDate) e.bookingDate = "Select a preferred date";
    else {
      const selected = new Date(form.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) e.bookingDate = "Date must be today or in the future";
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerId,
          studentName: form.customerName,
          phone: form.mobile,
          email: form.email,
          packageName,
          price: amount,
          city,
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

      router.push(`/success?id=${data.bookingId}&trainer=${encodeURIComponent(trainerName)}&unverified=${data.isUnverified}`);
    } catch {
      setSubmitError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <main style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .top-bar { background: linear-gradient(135deg, #0B1437, #1A2B5F); padding: 18px 5%; display: flex; align-items: center; gap: 16px; }
        .brand { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.3rem; color: #fff; text-decoration: none; }
        .brand span { color: #F59E0B; }
        .back-btn { color: rgba(255,255,255,0.6); font-size: 0.85rem; text-decoration: none; display: flex; align-items: center; gap: 6px; margin-right: auto; }
        .back-btn:hover { color: #F59E0B; }
        .wrap { max-width: 680px; margin: 0 auto; padding: 32px 5% 60px; }
        .page-title { font-family: 'Sora', sans-serif; font-size: 1.8rem; font-weight: 800; color: #0F172A; margin-bottom: 6px; }
        .page-sub { font-size: 0.9rem; color: #64748B; margin-bottom: 28px; }
        .summary-card { background: #0B1437; border-radius: 16px; padding: 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .summary-name { font-family: 'Sora', sans-serif; font-weight: 700; color: #fff; font-size: 1.05rem; }
        .summary-city { color: rgba(255,255,255,0.5); font-size: 0.82rem; margin-top: 2px; }
        .summary-price { text-align: right; }
        .summary-amount { font-family: 'Sora', sans-serif; font-size: 1.5rem; font-weight: 800; color: #F59E0B; }
        .summary-note { font-size: 0.72rem; color: rgba(255,255,255,0.4); margin-top: 2px; }
        .card { background: #fff; border-radius: 18px; border: 1px solid #E2E8F0; padding: 24px; margin-bottom: 16px; }
        .section-title { font-size: 0.75rem; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 18px; }
        .field { margin-bottom: 16px; }
        .field:last-child { margin-bottom: 0; }
        .label { display: block; font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .label .req { color: #F59E0B; margin-left: 3px; }
        .input {
          width: 100%; padding: 13px 14px;
          border: 2px solid #E2E8F0; border-radius: 12px;
          font-size: 0.92rem; font-family: inherit; color: #0F172A;
          background: #F8FAFC; outline: none; transition: border-color 0.2s;
        }
        .input:focus { border-color: #F59E0B; background: #FFFBEB; }
        .input.error { border-color: #FCA5A5; background: #FFF5F5; }
        .error-msg { color: #EF4444; font-size: 0.75rem; margin-top: 5px; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .prefix-wrap { position: relative; }
        .prefix { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 0.88rem; color: #64748B; font-weight: 600; }
        .prefix-input { padding-left: 44px !important; }
        .fee-breakdown { background: #F8FAFC; border-radius: 12px; padding: 16px; margin-top: 16px; }
        .fee-row { display: flex; justify-content: space-between; font-size: 0.85rem; color: #64748B; margin-bottom: 8px; }
        .fee-row:last-child { margin-bottom: 0; font-weight: 700; color: #0F172A; font-size: 0.95rem; border-top: 1px solid #E2E8F0; padding-top: 8px; margin-top: 8px; }
        .submit-btn {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, #F59E0B, #D97706);
          color: #fff; font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 700;
          border: none; border-radius: 14px; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 4px 16px rgba(245,158,11,0.4);
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,158,11,0.5); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .submit-error { background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; border-radius: 12px; padding: 12px 16px; font-size: 0.85rem; margin-top: 12px; }
        .trust-note { text-align: center; font-size: 0.75rem; color: #94A3B8; margin-top: 14px; }
        @media (max-width: 480px) { .row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="top-bar">
        <a href={`/trainers/${trainerId}`} className="back-btn">← Back to profile</a>
        <a href="/" className="brand">Learn<span>Drive</span></a>
      </div>

      <div className="wrap">
        <h1 className="page-title">Book Your Session</h1>
        <p className="page-sub">Fill in your details and we'll confirm your booking within a few hours.</p>

        {/* Trainer summary */}
        <div className="summary-card">
          <div>
            <div className="summary-name">{trainerName}</div>
            <div className="summary-city">📍 {city}</div>
          </div>
          <div className="summary-price">
            <div className="summary-amount">₹{amount.toLocaleString("en-IN")}</div>
            <div className="summary-note">per session</div>
          </div>
        </div>

        {/* Personal details */}
        <div className="card">
          <div className="section-title">Your Details</div>

          <div className="field">
            <label className="label">Full Name <span className="req">*</span></label>
            <input className={`input ${errors.customerName ? "error" : ""}`}
              placeholder="Rahul Sharma"
              value={form.customerName}
              onChange={(e) => set("customerName", e.target.value)} />
            {errors.customerName && <div className="error-msg">⚠ {errors.customerName}</div>}
          </div>

          <div className="row">
            <div className="field">
              <label className="label">Mobile <span className="req">*</span></label>
              <div className="prefix-wrap">
                <span className="prefix">+91</span>
                <input className={`input prefix-input ${errors.mobile ? "error" : ""}`}
                  placeholder="9876543210" maxLength={10} inputMode="numeric"
                  value={form.mobile}
                  onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} />
              </div>
              {errors.mobile && <div className="error-msg">⚠ {errors.mobile}</div>}
            </div>

            <div className="field">
              <label className="label">Email <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>(optional)</span></label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <div className="section-title">Pickup Location</div>

          <div className="field">
            <label className="label">Full Address <span className="req">*</span></label>
            <input className={`input ${errors.address ? "error" : ""}`}
              placeholder="House/Flat No, Street, Landmark"
              value={form.address}
              onChange={(e) => set("address", e.target.value)} />
            {errors.address && <div className="error-msg">⚠ {errors.address}</div>}
          </div>

          <div className="row">
            <div className="field">
              <label className="label">Pincode <span className="req">*</span></label>
              <input className={`input ${errors.pincode ? "error" : ""}`}
                placeholder="110001" maxLength={6} inputMode="numeric"
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} />
              {errors.pincode && <div className="error-msg">⚠ {errors.pincode}</div>}
            </div>

            <div className="field">
              <label className="label">Preferred Date <span className="req">*</span></label>
              <input className={`input ${errors.bookingDate ? "error" : ""}`}
                type="date" min={minDate}
                value={form.bookingDate}
                onChange={(e) => set("bookingDate", e.target.value)} />
              {errors.bookingDate && <div className="error-msg">⚠ {errors.bookingDate}</div>}
            </div>
          </div>
        </div>

        {/* Fee breakdown */}
        <div className="card">
          <div className="section-title">Price Breakdown</div>
          <div className="fee-breakdown">
            <div className="fee-row">
              <span>Session fee</span>
              <span>₹{amount.toLocaleString("en-IN")}</span>
            </div>
            <div className="fee-row">
              <span>Platform fee (15%)</span>
              <span>₹{platformFee.toLocaleString("en-IN")}</span>
            </div>
            <div className="fee-row">
              <span>Total payable</span>
              <span>₹{(amount).toLocaleString("en-IN")}</span>
            </div>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: 12 }}>
            💳 Payment collected by trainer at session. No online payment required now.
          </p>
        </div>

        <button className="submit-btn" disabled={submitting} onClick={handleSubmit}>
          {submitting
            ? <span>⏳ Submitting...</span>
            : "Confirm Booking Request →"}
        </button>

        {submitError && <div className="submit-error">⚠ {submitError}</div>}

        <p className="trust-note">
          🔒 Your details are secure · No spam · Trainer will contact you to confirm timing
        </p>
      </div>
    </main>
  );
}