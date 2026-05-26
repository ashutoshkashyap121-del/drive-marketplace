"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TrainerCard from "@/components/TrainerCard";
import Footer from "@/components/Footer";
import { LIVE_CITY_COUNT } from "@/lib/live-coverage";

const RECENT_BLOGS = [
  { slug: "how-to-get-driving-licence-india", title: "How to Get a Driving Licence in India (2025 Complete Guide)", description: "Step-by-step guide to getting your driving licence in India – from learner's licence to permanent licence, RTO test tips, and documents checklist.", category: "Licence Guide", readTime: 8 },
  { slug: "rto-documents-complete-checklist-2025", title: "RTO Documents Complete Checklist 2025", description: "Complete list of documents needed for learner's licence and permanent driving licence application at RTO offices across India.", category: "Licence Guide", readTime: 5 },
  { slug: "rto-test-tips-tricks-pass-first-time", title: "RTO Test Tips & Tricks – Pass First Time", description: "Practice with expert tips covering traffic rules, road signs, and driving regulations to pass your driving licence test first time.", category: "RTO Tips", readTime: 6 },
];

interface TrainerPackage {
  id: string;
  name: string;
  price: number;
  priceMax?: number;
  days?: number;
  sessionLength?: string;
  distancePerDay?: string;
  includes?: string;
  trackFeePerVehicle?: number;
  acSurcharge?: number;
}

interface Trainer {
  id: number;
  name: string;
  city: string;
  basePrice: number;
  experience: number;
  languages: string[];
  vehicleTypes: string[];
  packagesJson: any;
  rating?: number;
}

const TOP_CITIES = [
  "Delhi", "Noida", "Gurugram", "Faridabad", "Mumbai",
  "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata",
  "Jaipur", "Chandigarh", "Kochi",
  "Indore", "Lucknow", "Ahmedabad", "Surat", "Nagpur",
  "Bhopal", "Coimbatore", "Mysuru", "Vadodara", "Dehradun",
];

const ALL_CITIES = [
  ...TOP_CITIES,
  "Visakhapatnam", "Patna", "Ludhiana", "Agra", "Nashik",
  "Faridabad", "Meerut", "Rajkot", "Varanasi", "Ranchi",
  "Amritsar", "Gwalior", "Jodhpur", "Madurai", "Raipur",
  "Guwahati", "Noida", "Gurugram", "Navi Mumbai", "Thane",
];

const STATS = [
  { value: String(LIVE_CITY_COUNT), label: "Cities" },
  { value: "1,000+", label: "Driving Schools Listed" },
  { value: "4.8★",   label: "Avg School Rating" },
  { value: "₹5,500", label: "Starting Price" },
];

const FREE_TOOLS = [
  { icon: "🪪", title: "DL Check",     desc: "Check driving licence validity",     href: "/dl-check" },
  { icon: "🚗", title: "RC Check",     desc: "Vehicle registration details",       href: "/rc-check" },
  { icon: "🚦", title: "Challan Check",desc: "Check pending traffic fines",        href: "/challan-check" },
  { icon: "📝", title: "RTO Mock Test",desc: "Practice for your RTO exam",         href: "/rto-test/practice" },
  { icon: "🤖", title: "DL Assistance",desc: "AI-powered DL application help",     href: "/dl-assistance" },
  { icon: "🏫", title: "Find Schools", desc: "Book a driving school near you",     href: "/trainers" },
];

const HOW_IT_WORKS = [
  { step: "01", icon: "📍", title: "Pick your city", desc: `Search from ${LIVE_CITY_COUNT} cities across India. We'll show trainers covering your area.` },
  { step: "02", icon: "👤", title: "Choose your trainer", desc: "See experience, areas covered, pricing, and languages. Pick the right fit." },
  { step: "03", icon: "📅", title: "Book a slot", desc: "Schedule your first session online. Confirm your slot in 60 seconds. Start learning." },
];

const FEATURES = [
  { icon: "🛡️", title: "Verified trainers", desc: "Every trainer is DL-verified before listing" },
  { icon: "🚗", title: "Dual-control cars", desc: "Safety brake on trainer side — always" },
  { icon: "💳", title: "Secure payments", desc: "Razorpay-powered, refund policy included" },
  { icon: "🗓️", title: "Flexible scheduling", desc: "Morning, evening, weekend — you choose" },
  { icon: "📍", title: "Comes to you", desc: "Trainer picks you up from your location" },
  { icon: "⭐", title: "Rated & reviewed", desc: "Real ratings from verified students" },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [homeVehicle, setHomeVehicle] = useState<"CAR" | "BIKE">("CAR");
  const [homePincode, setHomePincode] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchState, setSearchState] = useState<"idle" | "loading" | "trainers" | "waitlist">("idle");
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [waitlistCity, setWaitlistCity] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [wlName, setWlName] = useState("");
  const [wlPhone, setWlPhone] = useState("");
  const [wlEmail, setWlEmail] = useState("");
  const [wlSubmitting, setWlSubmitting] = useState(false);
  const [wlDone, setWlDone] = useState(false);
  const [wlError, setWlError] = useState("");
  const recentBlogs = RECENT_BLOGS;
  const resultRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCities = ALL_CITIES.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = async (city: string) => {
    const normalizedCity = city.trim();
    if (!normalizedCity) return;
    setShowCityDropdown(false);

    const params = new URLSearchParams({
      city: normalizedCity,
      vehicle: homeVehicle,
    });
    if (/^\d{6}$/.test(homePincode)) {
      params.set("pincode", homePincode);
    }

    router.push(`/trainers?${params.toString()}`);
  };

  const handleWaitlist = async () => {
    if (!wlPhone || wlPhone.length < 10) { setWlError("Enter a valid 10-digit mobile number"); return; }
    setWlSubmitting(true); setWlError("");
    try {
      const res = await fetch("/api/waitlist/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: wlName, phone: wlPhone, email: wlEmail, city: waitlistCity }),
      });
      if (res.ok) { setWlDone(true); }
      else { const d = await res.json(); setWlError(d.error || "Something went wrong"); }
    } catch { setWlError("Network error. Try again."); }
    finally { setWlSubmitting(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#0F172A" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Sora', sans-serif; }
        .fade-up { animation: fadeUp 0.5s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.12s; }
        .d3 { animation-delay: 0.2s; }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
        .city-chip:hover { background: #FEF3C7 !important; border-color: #F59E0B !important; color: #B45309 !important; }
        input:focus { outline: none; border-color: #F59E0B !important; }
        .nav-links { display: flex; align-items: center; gap: 2px; }
        .nav-trainer-btn { white-space: nowrap !important; flex-shrink: 0 !important; }
        .hire-driver-link { white-space: nowrap; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-trainer-btn { font-size: 12px !important; padding: 7px 10px !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 50, padding: "0 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 8 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Sora', sans-serif", color: "#0F172A", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>
              Learn<span style={{ color: "#F59E0B" }}>Drive</span>
            </span>
          </Link>
          <div style={{ flex: 1 }} />
          <div className="nav-links">
            <Link href="/blog" style={{ color: "#64748B", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px" }}>Blog</Link>
            <Link href="/rto-test/practice" style={{ color: "#64748B", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px" }}>RTO Test</Link>
            <Link href="/dl-assistance" style={{ color: "#64748B", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px" }}>DL Assistance</Link>
            {/* ── NEW: Hire a Driver link ── */}
            <Link href="/hire-driver" className="hire-driver-link" style={{ color: "#64748B", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px", display: "flex", alignItems: "center", gap: 4 }}>
              🚗 Hire a Driver
            </Link>
          </div>
          <Link href="/trainers/register" className="nav-trainer-btn" style={{ background: "#F59E0B", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700, padding: "8px 18px", borderRadius: 10 }}>
            Join as Trainer
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(145deg, #0B1437 0%, #1A2B5F 100%)", padding: "72px 5% 64px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#FCD34D", borderRadius: 99, padding: "5px 14px", fontSize: 13, fontWeight: 600, marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
            {`Now live in ${LIVE_CITY_COUNT} cities across India`}
          </div>

          <h1 className="font-display fade-up d1" style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 18 }}>
            Find a driving<br />
            <span style={{ color: "#F59E0B" }}>trainer near you</span>
          </h1>

          <p className="fade-up d2" style={{ color: "rgba(255,255,255,0.65)", fontSize: 18, marginBottom: 36, lineHeight: 1.6 }}>
            Verified trainers. Dual-control cars. Book online in 60 seconds.
          </p>

          {/* Search bar */}
          <div className="fade-up d3" style={{ position: "relative", maxWidth: 520, margin: "0 auto" }} ref={dropdownRef}>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 }}>
              <button
                onClick={() => setHomeVehicle("CAR")}
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: homeVehicle === "CAR" ? "#F59E0B" : "rgba(255,255,255,0.08)",
                  color: homeVehicle === "CAR" ? "#0F172A" : "#FFFFFF",
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Car
              </button>
              <button
                onClick={() => setHomeVehicle("BIKE")}
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: homeVehicle === "BIKE" ? "#F59E0B" : "rgba(255,255,255,0.08)",
                  color: homeVehicle === "BIKE" ? "#0F172A" : "#FFFFFF",
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Bike
              </button>
            </div>
            <div style={{ display: "flex", background: "#FFFFFF", borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowCityDropdown(true); }}
                onFocus={() => setShowCityDropdown(true)}
                onKeyDown={(e) => e.key === "Enter" && query.trim() && handleSearch(query.trim())}
                placeholder="Enter your city..."
                style={{ flex: 1, padding: "15px 18px", border: "none", fontSize: 15, color: "#0F172A", background: "transparent", outline: "none" }}
              />
              <button
                onClick={() => query.trim() && handleSearch(query.trim())}
                style={{ background: "#F59E0B", color: "#fff", border: "none", padding: "0 24px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
              >
                Search
              </button>
            </div>
            <div style={{ marginTop: 10 }}>
              <input
                value={homePincode}
                onChange={(e) => setHomePincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Optional pincode (6 digits) for area-specific results"
                inputMode="numeric"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#FFFFFF",
                  fontSize: 13,
                }}
              />
            </div>
            {showCityDropdown && filteredCities.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", zIndex: 100, overflow: "hidden" }}>
                {filteredCities.map((c) => (
                  <button key={c} onClick={() => { setQuery(c); handleSearch(c); setShowCityDropdown(false); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 16px", background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "#0F172A", borderBottom: "1px solid #F1F5F9" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF3C7")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    📍 {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick city pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 20 }}>
            {TOP_CITIES.slice(0, 8).map((c) => (
              <button key={c} className="city-chip" onClick={() => { setQuery(c); handleSearch(c); }}
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)", borderRadius: 99, padding: "5px 14px", fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
                {c}
              </button>
            ))}
          </div>

          {/* Social proof */}
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.45)", textAlign: "center" }}>
            🔒 Free to search · No registration required · 1,000+ schools listed
          </p>
        </div>
      </div>

      {/* ── SEARCH RESULTS ── */}
      <div ref={resultRef}>
        {searchState === "loading" && (
          <div style={{ textAlign: "center", padding: "48px 5%", color: "#64748B" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
            Finding trainers in {query}…
          </div>
        )}

        {searchState === "trainers" && (
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 5%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800 }}>
                {trainers.length} trainer{trainers.length !== 1 ? "s" : ""} in {query}
              </h2>
              <button onClick={() => { setSearchState("idle"); setQuery(""); }} style={{ background: "none", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", color: "#64748B" }}>
                ✕ Clear
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {trainers.map((trainer) => (
                <TrainerCard key={trainer.id} trainer={trainer} />
              ))}
            </div>
          </div>
        )}

        {searchState === "waitlist" && (
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 5%" }}>
            <div style={{ background: "#FFFFFF", borderRadius: 20, border: "1px solid #E2E8F0", padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
              <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
                Coming to {waitlistCity} soon!
              </h2>
              {waitlistCount > 0 && (
                <p style={{ color: "#F59E0B", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                  {waitlistCount} student{waitlistCount !== 1 ? "s" : ""} already waiting
                </p>
              )}
              <p style={{ color: "#64748B", fontSize: 14, marginBottom: 24 }}>
                Be the first to know when trainers are available in your city.
              </p>
              {!wlDone ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input value={wlName} onChange={(e) => setWlName(e.target.value)} placeholder="Your name (optional)"
                    style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, color: "#0F172A" }} />
                  <input value={wlPhone} onChange={(e) => setWlPhone(e.target.value.replace(/\D/g, ""))} placeholder="Mobile number *" maxLength={10} inputMode="numeric"
                    style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, color: "#0F172A" }} />
                  <input value={wlEmail} onChange={(e) => setWlEmail(e.target.value)} placeholder="Email (optional)" type="email"
                    style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, color: "#0F172A" }} />
                  {wlError && <p style={{ color: "#EF4444", fontSize: 13 }}>⚠ {wlError}</p>}
                  <button onClick={handleWaitlist} disabled={wlSubmitting}
                    style={{ background: "#F59E0B", color: "#fff", border: "none", padding: "13px", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: wlSubmitting ? "not-allowed" : "pointer", opacity: wlSubmitting ? 0.7 : 1 }}>
                    {wlSubmitting ? "Joining…" : "Notify Me When Available →"}
                  </button>
                </div>
              ) : (
                <div style={{ color: "#16A34A", fontWeight: 600, fontSize: 15 }}>
                  ✅ You're on the list! We'll notify you.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── STATS ── */}
      <div style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", padding: "32px 5%" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: "#F59E0B" }}>{s.value}</div>
              <div style={{ color: "#64748B", fontSize: 14, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Free Tools Section ── */}
      <div style={{ padding: "48px 5%", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 8, textAlign: "center" }}>
            Free Vehicle & Licence Tools
          </h2>
          <p style={{ color: "#64748B", fontSize: 14, textAlign: "center", marginBottom: 28 }}>
            Everything you need before and after getting your driving licence
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {FREE_TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href}
                style={{ background: "#F8F7F4", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px", textDecoration: "none", display: "block", transition: "all 0.15s" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{tool.icon}</div>
                <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 15, marginBottom: 4 }}>{tool.title}</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>{tool.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ padding: "72px 5%", maxWidth: 1100, margin: "0 auto" }}>
        <h2 className="font-display" style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, marginBottom: 48 }}>
          How it works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: "#FEF3C7", border: "2px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>
                {item.icon}
              </div>
              <div style={{ color: "#F59E0B", fontSize: 12, fontWeight: 700, letterSpacing: "1px", marginBottom: 6 }}>STEP {item.step}</div>
              <h3 className="font-display" style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ background: "#FFFFFF", padding: "72px 5%", borderTop: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 className="font-display" style={{ textAlign: "center", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, marginBottom: 48 }}>
            Why LearnDrive?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card-hover" style={{ background: "#F8F7F4", borderRadius: 16, border: "1px solid #E2E8F0", padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HIRE A DRIVER BANNER ── */}
      <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "56px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: "inline-block", background: "rgba(245,158,11,0.2)", color: "#F59E0B", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 16, border: "1px solid rgba(245,158,11,0.3)" }}>
              🚗 New Service
            </div>
            <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>
              Need Someone to Drive<br />Your Own Car?
            </h2>
            <p style={{ color: "#94A3B8", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
              Hire a verified, background-checked driver for outstation trips, weddings, full-day errands, or airport transfers. Your car, our driver.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
              {["✅ Verified drivers", "🔒 Background checked", "💰 From ₹800/trip", "📍 20+ cities"].map((item) => (
                <span key={item} style={{ color: "#CBD5E1", fontSize: 13 }}>{item}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/hire-driver" style={{ display: "inline-block", background: "#F59E0B", color: "#0B1437", padding: "14px 28px", borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
                Hire a Driver →
              </Link>
              <Link href="/hire-driver/onboard" style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", color: "#fff", padding: "14px 28px", borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
                Become a Driver
              </Link>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, minWidth: 220 }}>
            {[
              { v: "₹800+", l: "Per trip" },
              { v: "85%", l: "Driver keeps" },
              { v: "20+", l: "Cities" },
              { v: "2hr", l: "Confirmation" },
            ].map(s => (
              <div key={s.l} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "18px 16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#F59E0B" }}>{s.v}</div>
                <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DL ASSISTANCE BANNER ── */}
      <div style={{ background: "linear-gradient(135deg, #1a2540 0%, #2d3f6b 100%)", padding: "56px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: "inline-block", background: "rgba(245,158,11,0.2)", color: "#f59e0b", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 16, border: "1px solid rgba(245,158,11,0.3)" }}>
              🆕 New Service
            </div>
            <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>
              Get Your Driving Licence<br />Without the RTO Confusion
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
              Our AI fills your Sarathi form, books your RTO slot, sends your document checklist and reminds you till test day.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
              {["✅ Form 4 filled automatically", "📅 RTO slot booked", "📋 Document checklist", "🔔 Reminders till test day"].map((item) => (
                <span key={item} style={{ color: "#cbd5e1", fontSize: 13 }}>{item}</span>
              ))}
            </div>
            <Link href="/dl-assistance" style={{ display: "inline-block", background: "#f59e0b", color: "#1a2540", padding: "14px 32px", borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
              Get Started — ₹499 →
            </Link>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "28px 32px", border: "1px solid rgba(255,255,255,0.1)", minWidth: 200, textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#f59e0b" }}>30</div>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>Mins to complete form</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#f59e0b" }}>0</div>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>Hidden charges</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#f59e0b" }}>₹499</div>
            <div style={{ color: "#94a3b8", fontSize: 13 }}>All inclusive</div>
          </div>
        </div>
      </div>

      {/* ── BLOG ── */}
      {recentBlogs.length > 0 && (
        <div style={{ padding: "72px 5%", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
            <h2 className="font-display" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800 }}>Driving Tips & Guides</h2>
            <Link href="/blog" style={{ color: "#F59E0B", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>View all →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {recentBlogs.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="card-hover" style={{ border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
                  <div style={{ padding: 24 }}>
                    <div style={{ color: "#F59E0B", fontSize: 12, fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>{post.category} • {post.readTime} min read</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, lineHeight: 1.4 }}>{post.title}</h3>
                    <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{post.description}</p>
                    <span style={{ color: "#0F172A", fontWeight: 700, fontSize: 14 }}>Read Article →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
