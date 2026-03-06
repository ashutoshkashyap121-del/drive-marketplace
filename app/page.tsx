"use client";

import { useState, useEffect } from "react";

const LAUNCH_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return timeLeft;
}

const STATS = [
  { value: "500+", label: "Trainers Onboarding" },
  { value: "3", label: "Cities at Launch" },
  { value: "₹0", label: "Booking Fee Ever" },
  { value: "100%", label: "RTO Verified" },
];

const STEPS = [
  { icon: "🔍", title: "Search", desc: "Find verified trainers in your city" },
  { icon: "📅", title: "Book", desc: "Pick a date, pay securely online" },
  { icon: "🚗", title: "Learn", desc: "Trainer arrives at your doorstep" },
  { icon: "🏁", title: "License", desc: "Pass your test with confidence" },
];

export default function ComingSoonPage() {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [carPos, setCarPos] = useState(0);
  const searchParams = useSearchParams();

  // Preview bypass — visit /?preview=ld2025 to skip coming soon
  if (searchParams.get("preview") === "ld2025") {
    if (typeof window !== "undefined") window.location.href = "/trainers";
    return null;
  }
  // Animate car along road
  useEffect(() => {
    const id = setInterval(() => {
      setCarPos((p) => (p >= 100 ? 0 : p + 0.3));
    }, 30);
    return () => clearInterval(id);
  }, []);

  // Cycle through steps
  useEffect(() => {
    const id = setInterval(() => setActiveStep((s) => (s + 1) % 4), 2500);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubmitting(true);
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#070D1F",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#fff",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Orbs */
        .orb { position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.12; pointer-events: none; }
        .orb-1 { width: 600px; height: 600px; background: #F59E0B; top: -200px; left: -200px; animation: orbFloat 10s ease-in-out infinite alternate; }
        .orb-2 { width: 500px; height: 500px; background: #2563EB; bottom: -150px; right: -150px; animation: orbFloat 12s ease-in-out infinite alternate-reverse; }
        @keyframes orbFloat { from { transform: translate(0,0); } to { transform: translate(40px, 30px); } }

        /* Grid */
        .grid { position: fixed; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 64px 64px; pointer-events: none; }

        .page-wrap { position: relative; z-index: 10; }

        /* Nav */
        .nav { padding: 24px 5%; display: flex; align-items: center; justify-content: space-between; }
        .logo { font-family: 'Sora', sans-serif; font-weight: 900; font-size: 1.4rem; color: #fff; text-decoration: none; }
        .logo span { color: #F59E0B; }
        .trainer-link {
          padding: 9px 20px;
          border: 1.5px solid rgba(245,158,11,0.4);
          border-radius: 100px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #F59E0B;
          text-decoration: none;
          transition: all 0.2s;
          background: rgba(245,158,11,0.06);
        }
        .trainer-link:hover { background: rgba(245,158,11,0.15); border-color: #F59E0B; }

        /* Hero */
        .hero { text-align: center; padding: 60px 5% 0; max-width: 760px; margin: 0 auto; }

        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.25);
          border-radius: 100px; padding: 6px 18px;
          font-size: 0.75rem; font-weight: 700;
          color: #F59E0B; letter-spacing: 1.5px; text-transform: uppercase;
          margin-bottom: 28px;
          animation: fadeUp 0.6s ease both;
        }
        .badge-dot { width: 7px; height: 7px; background: #F59E0B; border-radius: 50%; animation: blink 1.4s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

        .headline {
          font-family: 'Sora', sans-serif;
          font-size: clamp(2.6rem, 7vw, 4.4rem);
          font-weight: 900; line-height: 1.08;
          letter-spacing: -2px; margin-bottom: 22px;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .headline em { color: #F59E0B; font-style: normal; }
        .headline .muted { color: rgba(255,255,255,0.35); }

        .sub {
          font-size: 1.05rem; color: rgba(255,255,255,0.45);
          line-height: 1.7; margin-bottom: 44px;
          animation: fadeUp 0.7s 0.2s ease both;
        }

        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        /* Countdown */
        .countdown { display: flex; gap: 12px; justify-content: center; margin-bottom: 44px; flex-wrap: wrap; animation: fadeUp 0.7s 0.3s ease both; }
        .cb {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 18px 22px; min-width: 84px;
          backdrop-filter: blur(8px);
          transition: border-color 0.3s;
        }
        .cb:hover { border-color: rgba(245,158,11,0.4); }
        .cn { font-family:'Sora',sans-serif; font-size: 2.2rem; font-weight:900; line-height:1; margin-bottom:5px; }
        .cl { font-size:0.68rem; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:1.5px; font-weight:600; }
        .csep { font-family:'Sora',sans-serif; font-size:1.8rem; font-weight:900; color:rgba(255,255,255,0.15); display:flex; align-items:center; padding-bottom:22px; }

        /* Form */
        .form-area { animation: fadeUp 0.7s 0.4s ease both; margin-bottom: 20px; }
        .form-row { display:flex; gap:10px; max-width:480px; margin:0 auto; flex-wrap:wrap; justify-content:center; }
        .email-in {
          flex:1; min-width:220px;
          padding:14px 20px;
          background:rgba(255,255,255,0.055);
          border:1.5px solid rgba(255,255,255,0.1);
          border-radius:14px;
          font-family:inherit; font-size:0.92rem; color:#fff; outline:none;
          transition:border-color 0.2s;
        }
        .email-in::placeholder { color:rgba(255,255,255,0.22); }
        .email-in:focus { border-color:#F59E0B; }
        .submit-btn {
          padding:14px 28px;
          background:linear-gradient(135deg,#F59E0B,#D97706);
          color:#fff; font-family:'Sora',sans-serif; font-size:0.9rem; font-weight:700;
          border:none; border-radius:14px; cursor:pointer; white-space:nowrap;
          box-shadow:0 4px 24px rgba(245,158,11,0.35);
          transition:all 0.2s;
        }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(245,158,11,0.5); }
        .submit-btn:disabled { opacity:0.55; cursor:not-allowed; }
        .success-pill {
          display:inline-flex; align-items:center; gap:10px;
          background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.3);
          border-radius:14px; padding:14px 24px;
          color:#4ADE80; font-size:0.9rem; font-weight:600;
        }
        .form-hint { font-size:0.75rem; color:rgba(255,255,255,0.2); margin-top:12px; }

        /* Road animation */
        .road-wrap { position:relative; margin:60px auto 0; max-width:900px; padding:0 5%; animation: fadeUp 0.7s 0.5s ease both; }
        .road {
          width:100%; height:80px; background:#111827;
          border-radius:12px; position:relative; overflow:hidden;
          border:1px solid rgba(255,255,255,0.06);
        }
        .road-line {
          position:absolute; top:50%; transform:translateY(-50%);
          height:4px; border-radius:4px;
          background:repeating-linear-gradient(90deg, #F59E0B 0, #F59E0B 40px, transparent 40px, transparent 80px);
          width:100%; opacity:0.5;
          animation:roadMove 1.5s linear infinite;
        }
        @keyframes roadMove { from{background-position:0} to{background-position:-80px} }
        .road-car {
          position:absolute; top:50%; transform:translateY(-50%);
          font-size:2rem; filter:drop-shadow(0 0 10px rgba(245,158,11,0.6));
          transition:left 0.05s linear;
        }

        /* Stats */
        .stats { display:flex; gap:1px; max-width:700px; margin:0 auto; flex-wrap:wrap; background:rgba(255,255,255,0.05); border-radius:20px; overflow:hidden; margin-top:60px; border:1px solid rgba(255,255,255,0.07); }
        .stat { flex:1; min-width:140px; padding:28px 20px; text-align:center; background:#070D1F; transition:background 0.2s; }
        .stat:hover { background:rgba(245,158,11,0.05); }
        .stat-val { font-family:'Sora',sans-serif; font-size:1.9rem; font-weight:900; color:#F59E0B; margin-bottom:6px; }
        .stat-lbl { font-size:0.78rem; color:rgba(255,255,255,0.35); font-weight:500; }

        /* How it works */
        .hiw { max-width:860px; margin:80px auto 0; padding:0 5%; text-align:center; }
        .section-label { font-size:0.72rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#F59E0B; margin-bottom:12px; }
        .section-title { font-family:'Sora',sans-serif; font-size:1.8rem; font-weight:900; margin-bottom:40px; letter-spacing:-0.5px; }

        .steps { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; }
        .step {
          background:rgba(255,255,255,0.03);
          border:1.5px solid rgba(255,255,255,0.06);
          border-radius:18px; padding:28px 20px;
          transition:all 0.3s; cursor:default;
        }
        .step.active { border-color:rgba(245,158,11,0.5); background:rgba(245,158,11,0.06); }
        .step-icon { font-size:2rem; margin-bottom:14px; }
        .step-title { font-family:'Sora',sans-serif; font-size:0.95rem; font-weight:800; margin-bottom:8px; }
        .step-desc { font-size:0.8rem; color:rgba(255,255,255,0.4); line-height:1.5; }

        /* Trainer CTA */
        .trainer-cta {
          max-width:700px; margin:60px auto;
          background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.03));
          border:1px solid rgba(245,158,11,0.2);
          border-radius:24px; padding:40px;
          text-align:center;
        }
        .cta-title { font-family:'Sora',sans-serif; font-size:1.4rem; font-weight:900; margin-bottom:10px; }
        .cta-sub { font-size:0.9rem; color:rgba(255,255,255,0.45); margin-bottom:24px; line-height:1.6; }
        .cta-btn {
          display:inline-block;
          padding:14px 32px;
          background:linear-gradient(135deg,#F59E0B,#D97706);
          color:#fff; font-family:'Sora',sans-serif; font-size:0.95rem; font-weight:700;
          border-radius:14px; text-decoration:none;
          box-shadow:0 4px 20px rgba(245,158,11,0.3);
          transition:all 0.2s;
        }
        .cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(245,158,11,0.45); }
        .cta-perks { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; margin-top:20px; }
        .cta-perk { font-size:0.78rem; color:rgba(255,255,255,0.35); display:flex; align-items:center; gap:5px; }

        /* Footer */
        .footer { text-align:center; padding:32px 5% 40px; border-top:1px solid rgba(255,255,255,0.05); margin-top:60px; }
        .footer-links { display:flex; gap:20px; justify-content:center; flex-wrap:wrap; }
        .fl { font-size:0.8rem; color:rgba(255,255,255,0.2); text-decoration:none; transition:color 0.2s; }
        .fl:hover { color:#F59E0B; }

        @media(max-width:600px) {
          .headline { letter-spacing:-1px; }
          .stats { flex-direction:column; }
          .stat { border-radius:0; }
        }
      `}</style>

      {/* BG */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="grid" />

      <div className="page-wrap">
        {/* Nav */}
        <nav className="nav">
          <div className="logo">Learn<span>Drive</span></div>
          <a href="/trainers/register" className="trainer-link">Register as Trainer →</a>
        </nav>

        {/* Hero */}
        <div className="hero">
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div className="badge"><div className="badge-dot"/>Launching in India</div>
          </div>

          <h1 className="headline">
            Learn to drive<br/>
            <em>the smarter way</em><br/>
            <span className="muted">coming soon.</span>
          </h1>

          <p className="sub">
            India's first marketplace for verified driving instructors.<br/>
            Book sessions online, track your progress, get licensed faster.
          </p>

          {/* Countdown */}
          <div className="countdown">
            <div className="cb"><div className="cn">{String(days).padStart(2,"0")}</div><div className="cl">Days</div></div>
            <div className="csep">:</div>
            <div className="cb"><div className="cn">{String(hours).padStart(2,"0")}</div><div className="cl">Hours</div></div>
            <div className="csep">:</div>
            <div className="cb"><div className="cn">{String(minutes).padStart(2,"0")}</div><div className="cl">Mins</div></div>
            <div className="csep">:</div>
            <div className="cb"><div className="cn">{String(seconds).padStart(2,"0")}</div><div className="cl">Secs</div></div>
          </div>

          {/* Waitlist */}
          <div className="form-area">
            {!submitted ? (
              <>
                <div className="form-row">
                  <input className="email-in" type="email" placeholder="your@email.com — get early access"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
                  <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "⏳ Joining..." : "Get Early Access →"}
                  </button>
                </div>
                <div className="form-hint">🔒 No spam. Just a launch notification.</div>
              </>
            ) : (
              <div style={{ display:"flex", justifyContent:"center" }}>
                <div className="success-pill">🎉 You're on the early access list! We'll notify you at launch.</div>
              </div>
            )}
          </div>
        </div>

        {/* Animated road */}
        <div className="road-wrap">
          <div className="road">
            <div className="road-line" />
            <div className="road-car" style={{ left: `calc(${carPos}% - 20px)` }}>🚗</div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, padding:"0 4px" }}>
            {["Delhi NCR", "Mumbai", "Bangalore", "More cities soon..."].map((c) => (
              <span key={c} style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.2)", fontWeight:500 }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding:"0 5%", maxWidth:900, margin:"0 auto" }}>
          <div className="stats">
            {STATS.map((s) => (
              <div key={s.label} className="stat">
                <div className="stat-val">{s.value}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="hiw">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">From zero to licensed in 4 steps</h2>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={s.title} className={`step ${i === activeStep ? "active" : ""}`}>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trainer CTA */}
        <div style={{ padding:"0 5%" }}>
          <div className="trainer-cta">
            <div className="cta-title">Are you a driving instructor?</div>
            <div className="cta-sub">
              Join LearnDrive early and get access to thousands of learners in your city.<br/>
              Free to register. We handle bookings, payments, and scheduling.
            </div>
            <a href="/trainers/register" className="cta-btn">Register as a Trainer →</a>
            <div className="cta-perks">
              <div className="cta-perk">✓ Free listing</div>
              <div className="cta-perk">✓ Instant payouts</div>
              <div className="cta-perk">✓ No commission on first 10 bookings</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-links" style={{ marginBottom:16 }}>
            <a href="/trainers" className="fl">Browse Trainers</a>
            <a href="/trainers/register" className="fl">Trainer Registration</a>
            <a href="/terms" className="fl">Terms of Service</a>
            <a href="/privacy" className="fl">Privacy Policy</a>
          </div>
          <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.1)" }}>
            © 2025 LearnDrive · Made with ❤️ in India
          </div>
        </footer>
      </div>
    </main>
  );
}