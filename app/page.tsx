"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Trainer {
  id: string;
  name: string;
  city: string;
  areas: string;
  basePrice: number;
  experience: number;
  languages: string[];
  vehicleTypes: string[];
  rating?: number;
  reviewCount?: number;
}

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const TOP_CITIES = [
  "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Jaipur", "Chandigarh", "Kochi",
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
  { value: "50+", label: "Cities" },
  { value: "2,400+", label: "Students waitlisted" },
  { value: "85%", label: "Trainer payout" },
  { value: "₹0", label: "Joining fee" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "📍",
    title: "Pick your city",
    desc: "Search from 50+ cities across India. We'll show trainers covering your area.",
  },
  {
    step: "02",
    icon: "👤",
    title: "Choose your trainer",
    desc: "See experience, areas covered, pricing, and languages. Pick the right fit.",
  },
  {
    step: "03",
    icon: "📅",
    title: "Book a slot",
    desc: "Schedule your first session online. Pay securely. Start learning.",
  },
];

const FEATURES = [
  { icon: "🛡️", title: "Verified trainers", desc: "Every trainer is DL-verified before listing" },
  { icon: "🚗", title: "Dual-control cars", desc: "Safety brake on trainer side — always" },
  { icon: "💳", title: "Secure payments", desc: "Razorpay-powered, refund policy included" },
  { icon: "🗓️", title: "Flexible scheduling", desc: "Morning, evening, weekend — you choose" },
  { icon: "📍", title: "Comes to you", desc: "Trainer picks you up from your location" },
  { icon: "⭐", title: "Rated & reviewed", desc: "Real ratings from verified students" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
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
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCities = ALL_CITIES.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch recent blog posts
  useEffect(() => {
    fetch("/api/blog/posts?limit=3")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.posts)) setRecentBlogs(data.posts);
      })
      .catch(() => {});
  }, []);

  const handleSearch = async (city: string) => {
    if (!city) return;
    setSelectedCity(city);
    setQuery(city);
    setShowCityDropdown(false);
    setSearchState("loading");
    setWlDone(false);

    try {
      const res = await fetch(`/api/trainers/by-city?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (data.trainers && data.trainers.length > 0) {
        setTrainers(data.trainers);
        setSearchState("trainers");
      } else {
        setWaitlistCity(city);
        setWaitlistCount(data.waitlistCount || 0);
        setSearchState("waitlist");
      }

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setSearchState("idle");
    }
  };

  const handleWaitlistSubmit = async () => {
    if (!wlPhone || !/^[6-9]\d{9}$/.test(wlPhone)) {
      setWlError("Enter a valid 10-digit mobile number");
      return;
    }
    setWlSubmitting(true);
    setWlError("");
    try {
      const res = await fetch("/api/waitlist/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: wlName, phone: wlPhone, email: wlEmail, city: waitlistCity }),
      });
      if (res.ok) {
        setWlDone(true);
      } else {
        const d = await res.json();
        setWlError(d.error || "Something went wrong. Please try again.");
      }
    } catch {
      setWlError("Network error. Please try again.");
    } finally {
      setWlSubmitting(false);
    }
  };

  const vehicleLabel = (v: string) =>
    v === "CAR" ? "🚗 Car" : v === "BIKE_GEARED" ? "🏍️ Bike" : "🛵 Scooter";

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "#08111f",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .animate-fade-up {
          animation: fadeUp 0.6s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-3px);
          border-color: rgba(251,191,36,0.4) !important;
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        }
        .city-pill {
          transition: all 0.15s ease;
        }
        .city-pill:hover {
          background: rgba(251,191,36,0.12);
          border-color: rgba(251,191,36,0.5);
          color: #fbbf24;
        }
        /* Noise texture overlay */
        .noise::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          border-radius: inherit;
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 px-5 py-4 flex items-center justify-between"
        style={{
          background: "rgba(8,17,31,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: "#fbbf24", color: "#08111f" }}
          >
            LD
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            LearnDrive
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5"
          >
            Blog
          </Link>
          <Link
            href="/rto-test/practice"
            className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5"
          >
            RTO Test
          </Link>
          <Link
            href="/trainers/register"
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            style={{
              background: "rgba(251,191,36,0.1)",
              border: "1px solid rgba(251,191,36,0.3)",
              color: "#fbbf24",
            }}
          >
            Become a trainer
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-5 pt-20 pb-16 text-center"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(251,191,36,0.12) 0%, transparent 70%)",
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 animate-fade-up"
            style={{
              background: "rgba(251,191,36,0.1)",
              border: "1px solid rgba(251,191,36,0.25)",
              color: "#fbbf24",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Now live in 50+ cities across India
          </div>

          <h1
            className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold leading-none tracking-tight mb-6 animate-fade-up delay-1"
            style={{ color: "#fff" }}
          >
            Find a driving
            <br />
            <span style={{ color: "#fbbf24" }}>trainer near you</span>
          </h1>

          <p
            className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up delay-2"
          >
            Verified trainers. Dual-control cars. Book online in 60 seconds.
          </p>

          {/* City Search Box */}
          <div
            className="max-w-md mx-auto relative animate-fade-up delay-3"
            ref={dropdownRef}
          >
            <div
              className="flex gap-2 p-2 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowCityDropdown(true);
                }}
                onFocus={() => setShowCityDropdown(true)}
                placeholder="Enter your city..."
                className="flex-1 bg-transparent px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none text-sm"
              />
              <button
                onClick={() => handleSearch(selectedCity || query)}
                disabled={!query}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                style={{ background: "#fbbf24", color: "#08111f" }}
              >
                Search
              </button>
            </div>

            {/* Dropdown */}
            {showCityDropdown && filteredCities.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
                style={{
                  background: "#0f1d33",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                }}
              >
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSearch(city)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-amber-400/10 hover:text-amber-300 transition-colors flex items-center gap-2"
                  >
                    <span className="text-slate-500 text-xs">📍</span>
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick city pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-5 animate-fade-up delay-4">
            {TOP_CITIES.slice(0, 8).map((city) => (
              <button
                key={city}
                onClick={() => handleSearch(city)}
                className="city-pill px-3 py-1.5 rounded-full text-xs text-slate-400 border border-slate-700"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEARCH RESULTS ───────────────────────────────────────────────────── */}
      <div ref={resultRef}>
        {/* Loading */}
        {searchState === "loading" && (
          <section className="py-16 text-center px-5">
            <div
              className="inline-block w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-4"
            />
            <p className="text-slate-400">Finding trainers in {query}…</p>
          </section>
        )}

        {/* Trainers Found */}
        {searchState === "trainers" && (
          <section className="max-w-5xl mx-auto px-5 py-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  Trainers in {selectedCity}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {trainers.length} trainer{trainers.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <button
                onClick={() => setSearchState("idle")}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Change city
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainers.map((t) => (
                <div
                  key={t.id}
                  className="card-hover rounded-2xl p-5 relative overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div className="text-right">
                      <div className="text-amber-400 font-bold text-lg">
                        ₹{t.basePrice.toLocaleString()}
                      </div>
                      <div className="text-slate-500 text-xs">per hour</div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-white mb-0.5">{t.name}</h3>
                  <p className="text-slate-500 text-xs mb-3 line-clamp-1">{t.areas}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {t.vehicleTypes.map((v) => (
                      <span
                        key={v}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
                      >
                        {vehicleLabel(v)}
                      </span>
                    ))}
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
                    >
                      {t.experience}yr exp
                    </span>
                  </div>

                  {t.rating && (
                    <div className="flex items-center gap-1 mb-3 text-xs text-slate-400">
                      <span className="text-amber-400">★</span>
                      <span className="font-semibold text-white">{t.rating}</span>
                      <span className="text-slate-600">({t.reviewCount} reviews)</span>
                    </div>
                  )}

                  <Link
                    href={`/trainers/${t.id}`}
                    className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: "#fbbf24", color: "#08111f" }}
                  >
                    View & Book
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Waitlist Fallback */}
        {searchState === "waitlist" && (
          <section className="max-w-lg mx-auto px-5 py-16 text-center">
            <div
              className="rounded-3xl p-8 sm:p-10 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(251,191,36,0.2)",
              }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251,191,36,0.07) 0%, transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="text-5xl mb-4">🚀</div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">
                  Coming to {waitlistCity} soon!
                </h2>
                <p className="text-slate-400 text-sm mb-1">
                  We're onboarding trainers in {waitlistCity} right now.
                </p>
                {waitlistCount > 0 && (
                  <p className="text-amber-400 font-semibold text-sm mb-6">
                    Join {waitlistCount.toLocaleString()}+ students already waiting
                  </p>
                )}
                {!waitlistCount && (
                  <p className="text-slate-500 text-sm mb-6">
                    Be first in line — we'll notify you the moment trainers are ready.
                  </p>
                )}

                {!wlDone ? (
                  <div className="space-y-3 text-left">
                    <input
                      type="text"
                      value={wlName}
                      onChange={(e) => setWlName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                      style={{
                        background: "rgba(15,23,42,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={wlPhone}
                        onChange={(e) =>
                          setWlPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        placeholder="Mobile number *"
                        maxLength={10}
                        className="w-full pl-12 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                        style={{
                          background: "rgba(15,23,42,0.8)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      />
                    </div>
                    <input
                      type="email"
                      value={wlEmail}
                      onChange={(e) => setWlEmail(e.target.value)}
                      placeholder="Email (optional)"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                      style={{
                        background: "rgba(15,23,42,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    {wlError && (
                      <p className="text-red-400 text-xs">⚠ {wlError}</p>
                    )}
                    <button
                      onClick={handleWaitlistSubmit}
                      disabled={wlSubmitting}
                      className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60"
                      style={{ background: "#fbbf24", color: "#08111f" }}
                    >
                      {wlSubmitting ? "Joining…" : "Notify me when ready →"}
                    </button>
                    <p className="text-slate-600 text-xs text-center">
                      No spam. We'll text you once when trainers go live.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-green-400 font-semibold mb-1">You're on the list!</p>
                    <p className="text-slate-400 text-sm">
                      We'll WhatsApp you when trainers are ready in {waitlistCity}.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setSearchState("idle")}
                  className="mt-4 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  ← Search another city
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <section
        className="px-5 py-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-extrabold text-amber-400 mb-1">
                {s.value}
              </div>
              <div className="text-slate-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="px-5 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3">
            Simple process
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            How LearnDrive works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.step}
              className="relative rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="text-xs font-bold mb-4 font-mono"
                style={{ color: "rgba(251,191,36,0.5)" }}
              >
                {step.step}
              </div>
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              {i < HOW_IT_WORKS.length - 1 && (
                <div
                  className="hidden sm:block absolute top-1/2 -right-3 text-slate-700 text-xl z-10"
                  style={{ transform: "translateY(-50%)" }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section
        className="px-5 py-20"
        style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3">
              Why LearnDrive
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Safe, simple, trusted
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-5 card-hover"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR TRAINERS CTA ─────────────────────────────────────────────────── */}
      <section className="px-5 py-20 max-w-5xl mx-auto">
        <div
          className="rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(251,191,36,0.04) 100%)",
            border: "1px solid rgba(251,191,36,0.2)",
          }}
        >
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(251,191,36,0.06) 0%, transparent 70%)",
            }}
          />
          <div className="relative flex-1">
            <p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">
              Driving trainers
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Get 10–15 extra students per month
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              List your profile free. Keep 85% of every booking. No joining fee, no monthly subscription.
              Register in 5 minutes — students find you.
            </p>
          </div>
          <div className="relative flex-shrink-0">
            <Link
              href="/trainers/register"
              className="inline-block px-8 py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "#fbbf24", color: "#08111f" }}
            >
              Register as trainer →
            </Link>
            <p className="text-slate-600 text-xs text-center mt-3">Free to join • 5 minutes</p>
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ─────────────────────────────────────────────────────── */}
      {recentBlogs.length > 0 && (
        <section
          className="px-5 py-20"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2">
                  Driving guides
                </p>
                <h2 className="font-display text-3xl font-bold text-white">
                  Latest from the blog
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:block text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentBlogs.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-2xl p-5 card-hover group"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="inline-block text-xs px-2.5 py-1 rounded-full mb-4 font-medium"
                    style={{
                      background: "rgba(251,191,36,0.1)",
                      color: "#fbbf24",
                      border: "1px solid rgba(251,191,36,0.2)",
                    }}
                  >
                    {post.category}
                  </div>
                  <h3 className="font-semibold text-white text-sm leading-snug mb-2 group-hover:text-amber-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">
                    {post.description}
                  </p>
                  <span className="text-xs text-slate-600">{post.readTime} min read</span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6 sm:hidden">
              <Link
                href="/blog"
                className="text-sm font-semibold text-amber-400"
              >
                View all articles →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer
        className="px-5 py-12"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: "#fbbf24", color: "#08111f" }}
                >
                  LD
                </div>
                <span className="font-display font-bold text-white">LearnDrive</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                India's driving trainer marketplace. Find, book, and review verified driving trainers near you.
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Students
              </p>
              <div className="space-y-2">
                {[
                  ["Find a trainer", "/trainers"],
                  ["RTO practice test", "/rto-test/practice"],
                  ["DL expiry check", "/dl-expiry"],
                  ["RTO offices", "/rto-offices"],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="block text-slate-500 text-xs hover:text-slate-300 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Trainers
              </p>
              <div className="space-y-2">
                {[
                  ["Register as trainer", "/trainers/register"],
                  ["Trainer benefits", "/for-trainers"],
                  ["Help & Support", "/help"],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="block text-slate-500 text-xs hover:text-slate-300 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Company
              </p>
              <div className="space-y-2">
                {[
                  ["Blog", "/blog"],
                  ["Privacy Policy", "/privacy"],
                  ["Terms of Service", "/terms"],
                  ["Refund Policy", "/refund-policy"],
                  ["Contact us", "/contact"],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="block text-slate-500 text-xs hover:text-slate-300 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-slate-700 text-xs">
              © {new Date().getFullYear()} LearnDrive. All rights reserved.
            </p>
            <p className="text-slate-700 text-xs">
              support@learndrive.in · +91 87008 96528
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}