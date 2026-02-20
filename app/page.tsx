"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CITIES = ["Delhi NCR", "Mumbai", "Bangalore"];
const STATS = [
  { value: "500+", label: "Verified Trainers" },
  { value: "3", label: "Cities" },
  { value: "10,000+", label: "Lessons Booked" },
  { value: "4.8★", label: "Avg. Rating" },
];
const STEPS = [
  { number: "01", title: "Choose Your City & Vehicle", desc: "Select your city and whether you want car or bike training.", icon: "📍" },
  { number: "02", title: "Pick a Verified Trainer", desc: "Browse RTO-verified trainers with real reviews and transparent pricing.", icon: "👨‍🏫" },
  { number: "03", title: "Book & Pay Safely", desc: "Book your slot, pay via UPI or EMI. Trainer comes to your location.", icon: "✅" },
];
const TRUST = [
  { icon: "🏛️", title: "RTO Verified Trainers", desc: "Every trainer is verified with the Regional Transport Office. No unregistered instructors ever." },
  { icon: "🔍", title: "Background Checked", desc: "Police verification and background screening done before any trainer is listed." },
  { icon: "👩", title: "Female-Friendly Trainers", desc: "Choose a female trainer or a trainer trained in female-student etiquette." },
  { icon: "🏠", title: "Pickup from Home or Office", desc: "Trainer arrives at your doorstep. No auto-rickshaw to a distant training centre." },
  { icon: "🗣️", title: "Hindi & Regional Language Support", desc: "Learn in Hindi, Kannada, Marathi — whatever you're comfortable with." },
  { icon: "💳", title: "EMI & Pay Later", desc: "Split your course fee into easy monthly instalments. Start driving, pay slowly." },
];

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [vehicleCategory, setVehicleCategory] = useState(""); // "CAR" | "BIKE"
  const [vehicle, setVehicle] = useState(""); // final: "CAR" | "BIKE_GEARED" | "BIKE_NON_GEARED"
  const [hoveredTrust, setHoveredTrust] = useState<number | null>(null);

  const handleVehicleCategory = (cat: string) => {
    setVehicleCategory(cat);
    if (cat === "CAR") setVehicle("CAR");
    else setVehicle(""); // reset until geared/non-geared chosen
  };

  const handleFind = () => {
    if (!city) return;
    if (pincode.length !== 6 || isNaN(Number(pincode))) {
      setPincodeError("Please enter a valid 6-digit pincode");
      return;
    }
    if (!vehicle) return;
    setPincodeError("");
    const params = new URLSearchParams({ city, pincode, vehicle });
    router.push(`/trainers?${params.toString()}`);
  };

  const isReady = city && pincode.length === 6 && vehicle;

  return (
    <main style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hero-section { background: linear-gradient(145deg, #0B1437 0%, #1A2B5F 60%, #0F3460 100%); position: relative; overflow: hidden; }
        .hero-section::before { content: ''; position: absolute; top: -120px; right: -120px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,165,0,0.15) 0%, transparent 70%); pointer-events: none; }
        .hero-section::after { content: ''; position: absolute; bottom: -80px; left: -80px; width: 350px; height: 350px; background: radial-gradient(circle, rgba(255,100,0,0.1) 0%, transparent 70%); pointer-events: none; }
        .brand-name { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.6rem; color: #FFFFFF; letter-spacing: -0.5px; }
        .brand-name span { color: #F59E0B; }
        .hero-headline { font-family: 'Sora', sans-serif; font-weight: 800; font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.15; color: #FFFFFF; letter-spacing: -1px; }
        .hero-headline .accent { color: #F59E0B; }
        .trust-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #E2E8F0; font-size: 0.78rem; font-weight: 500; padding: 5px 12px; border-radius: 100px; backdrop-filter: blur(8px); }
        .trust-pill .dot { width: 6px; height: 6px; background: #4ADE80; border-radius: 50%; }
        .search-card { background: #FFFFFF; border-radius: 20px; padding: 28px; box-shadow: 0 24px 64px rgba(0,0,0,0.25); position: relative; z-index: 2; }
        .form-label { font-size: 0.78rem; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; display: block; }
        .form-select { width: 100%; padding: 14px 16px; border: 2px solid #E2E8F0; border-radius: 12px; font-size: 0.95rem; font-family: inherit; color: #0F172A; background: #F8FAFC; appearance: none; cursor: pointer; transition: border-color 0.2s; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748B' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; }
        .form-select:focus { outline: none; border-color: #F59E0B; background-color: #FFFBEB; }
        .vehicle-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .vehicle-btn { padding: 12px; border-radius: 12px; border: 2px solid #E2E8F0; background: #F8FAFC; cursor: pointer; transition: all 0.2s; font-family: inherit; font-size: 0.88rem; font-weight: 600; color: #475569; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .vehicle-btn.active { border-color: #F59E0B; background: #FFFBEB; color: #92400E; }
        .vehicle-btn:hover { border-color: #F59E0B; }
        .cta-btn { width: 100%; padding: 16px; background: linear-gradient(135deg, #F59E0B, #D97706); color: #FFFFFF; font-family: 'Sora', sans-serif; font-size: 1rem; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; box-shadow: 0 4px 16px rgba(245,158,11,0.4); }
        .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,158,11,0.5); }
        .cta-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .stat-value { font-family: 'Sora', sans-serif; font-size: 1.8rem; font-weight: 800; color: #F59E0B; }
        .stat-label { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 2px; }
        .section-tag { display: inline-block; background: #FEF3C7; color: #92400E; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 100px; margin-bottom: 16px; }
        .section-title { font-family: 'Sora', sans-serif; font-size: clamp(1.6rem, 3.5vw, 2.2rem); font-weight: 800; color: #0F172A; line-height: 1.2; letter-spacing: -0.5px; }
        .step-card { background: #FFFFFF; border-radius: 20px; padding: 28px; border: 1px solid #E2E8F0; transition: box-shadow 0.2s; }
        .step-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .step-number { font-family: 'Sora', sans-serif; font-size: 3rem; font-weight: 800; color: #F1F5F9; line-height: 1; margin-bottom: 12px; }
        .step-icon { font-size: 2rem; margin-bottom: 10px; display: block; }
        .step-title { font-weight: 700; font-size: 1.05rem; color: #0F172A; margin-bottom: 8px; }
        .step-desc { font-size: 0.88rem; color: #64748B; line-height: 1.6; }
        .trust-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
        .trust-card { background: #FFFFFF; border-radius: 16px; padding: 24px; border: 1px solid #E2E8F0; transition: all 0.2s; cursor: default; }
        .trust-card:hover { border-color: #F59E0B; box-shadow: 0 8px 32px rgba(245,158,11,0.12); transform: translateY(-2px); }
        .trust-icon { font-size: 2rem; margin-bottom: 12px; display: block; }
        .trust-title { font-weight: 700; font-size: 0.95rem; color: #0F172A; margin-bottom: 6px; }
        .trust-desc { font-size: 0.85rem; color: #64748B; line-height: 1.6; }
        .footer-bar { background: #0B1437; color: rgba(255,255,255,0.5); text-align: center; padding: 24px 20px; font-size: 0.82rem; }
        .footer-bar a { color: rgba(255,255,255,0.6); text-decoration: none; margin: 0 10px; }
        .footer-bar a:hover { color: #F59E0B; }
        @media (max-width: 768px) {
          .steps-row { grid-template-columns: 1fr !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 5%" }}>
        <div className="brand-name">Learn<span>Drive</span></div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/trainers" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>Browse Trainers</a>
          <a href="/trainers/register" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.82rem" }}>For Schools</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{ padding: "120px 5% 60px", minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div className="hero-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%" }}>

          {/* Left */}
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
              <span className="trust-pill"><span className="dot" /> RTO Verified</span>
              <span className="trust-pill"><span className="dot" /> Background Checked</span>
              <span className="trust-pill">🏠 Home Pickup</span>
            </div>
            <h1 className="hero-headline">
              Learn Driving from<br />
              <span className="accent">Verified Trainers</span><br />
              Near You
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", marginTop: 20, fontSize: "1rem", lineHeight: 1.7, maxWidth: 460 }}>
              Book professional car & bike training in Delhi NCR, Mumbai, and Bangalore. Trainer comes to your home. Pay via UPI or EMI.
            </p>
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 32 }}>
              {STATS.map((s) => (
                <div key={s.label} style={{ textAlign: "left" }}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Search Card */}
          <div>
            <div className="search-card">
              <p style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginBottom: 22 }}>Find a Trainer Today</p>

              {/* Step 1: City */}
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">1. Your City</label>
                <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select your city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Step 2: Pincode */}
              <div style={{ marginBottom: 16, opacity: city ? 1 : 0.4, pointerEvents: city ? "auto" : "none", transition: "opacity 0.2s" }}>
                <label className="form-label">2. Your Pincode</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit pincode"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "")); setPincodeError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleFind()}
                  style={{ width: "100%", padding: "14px 16px", border: `2px solid ${pincodeError ? "#F87171" : "#E2E8F0"}`, borderRadius: 12, fontSize: "0.95rem", fontFamily: "inherit", color: "#0F172A", background: pincodeError ? "#FFF5F5" : "#F8FAFC", outline: "none", transition: "border-color 0.2s" }}
                  onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
                  onBlur={(e) => (e.target.style.borderColor = pincodeError ? "#F87171" : "#E2E8F0")}
                />
                {pincodeError && <p style={{ color: "#EF4444", fontSize: "0.78rem", marginTop: 6 }}>{pincodeError}</p>}
              </div>

              {/* Step 3: Vehicle category */}
              <div style={{ marginBottom: vehicleCategory === "BIKE" ? 12 : 22, opacity: pincode.length === 6 ? 1 : 0.4, pointerEvents: pincode.length === 6 ? "auto" : "none", transition: "opacity 0.2s" }}>
                <label className="form-label">3. What do you want to learn?</label>
                <div className="vehicle-toggle">
                  <button className={`vehicle-btn ${vehicleCategory === "CAR" ? "active" : ""}`} onClick={() => handleVehicleCategory("CAR")}>🚗 Car</button>
                  <button className={`vehicle-btn ${vehicleCategory === "BIKE" ? "active" : ""}`} onClick={() => handleVehicleCategory("BIKE")}>🏍️ Bike</button>
                </div>
              </div>

              {/* Step 3b: Bike type (expands when Bike selected) */}
              {vehicleCategory === "BIKE" && (
                <div style={{ marginBottom: 22, animation: "fadeIn 0.2s ease" }}>
                  <label className="form-label">Bike Type</label>
                  <div className="vehicle-toggle">
                    <button className={`vehicle-btn ${vehicle === "BIKE_GEARED" ? "active" : ""}`} onClick={() => setVehicle("BIKE_GEARED")}>⚙️ Geared</button>
                    <button className={`vehicle-btn ${vehicle === "BIKE_NON_GEARED" ? "active" : ""}`} onClick={() => setVehicle("BIKE_NON_GEARED")}>🛵 Non-Geared</button>
                  </div>
                </div>
              )}

              <button className="cta-btn" disabled={!isReady} onClick={handleFind}>
                Find Verified Trainers →
              </button>

              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94A3B8", marginTop: 14 }}>
                ✓ Free to browse &nbsp;·&nbsp; ✓ No hidden charges &nbsp;·&nbsp; ✓ 18+ only
              </p>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {["💬 Hindi Support", "📱 WhatsApp Updates", "💳 EMI Available"].map((tag) => (
                <span key={tag} style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", padding: "5px 12px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)" }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 5%", background: "#F8F7F4" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="section-tag">Simple Process</span>
            <h2 className="section-title">Book a Lesson in 3 Steps</h2>
          </div>
          <div className="steps-row" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {STEPS.map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-number">{step.number}</div>
                <span className="step-icon">{step.icon}</span>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section style={{ padding: "80px 5%", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-title">Built for India.<br />Built for Trust.</h2>
            <p style={{ color: "#64748B", marginTop: 12, fontSize: "0.95rem", maxWidth: 520, margin: "12px auto 0" }}>
              Every feature is designed keeping the Indian learner in mind — safety, language, affordability.
            </p>
          </div>
          <div className="trust-grid">
            {TRUST.map((item, i) => (
              <div key={item.title} className="trust-card" onMouseEnter={() => setHoveredTrust(i)} onMouseLeave={() => setHoveredTrust(null)}>
                <span className="trust-icon">{item.icon}</span>
                <div className="trust-title">{item.title}</div>
                <p className="trust-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "64px 5%", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: 12 }}>Ready to Start Learning?</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 28, fontSize: "0.95rem" }}>Join thousands of learners across Delhi NCR, Mumbai & Bangalore.</p>
        <a href="/trainers" style={{ display: "inline-block", background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#FFFFFF", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "1rem", padding: "16px 36px", borderRadius: 12, textDecoration: "none", boxShadow: "0 4px 20px rgba(245,158,11,0.4)" }}>Browse Trainers Now →</a>
      </section>

      {/* FOOTER */}
      <footer className="footer-bar">
        <div style={{ marginBottom: 10 }}>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/trainers/register">For Driving Schools</a>
        </div>
        © {new Date().getFullYear()} LearnDrive. All rights reserved. &nbsp;·&nbsp; Delhi NCR · Mumbai · Bangalore
      </footer>
    </main>
  );
}