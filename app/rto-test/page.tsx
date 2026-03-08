import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RTO Practice Test 2025 — Free & Paid Mock Tests | LearnDrive",
  description: "Prepare for India's RTO driving licence written test. Free topic-wise practice + full timed mock test with 60+ official questions. Traffic signs, road rules, speed limits and more.",
};

const features = [
  { icon: "🚦", title: "Traffic Signs & Signals", desc: "All mandatory, cautionary, and informatory signs" },
  { icon: "🛣️", title: "Road Rules & Lane Discipline", desc: "Right of way, overtaking, roundabouts" },
  { icon: "⚡", title: "Speed Limits & Fines", desc: "City, highway, school zone limits" },
  { icon: "🪪", title: "Documents & Licence Types", desc: "DL, RC, PUC requirements" },
  { icon: "🚫", title: "Drunk Driving & Penalties", desc: "BAC limits and legal consequences" },
  { icon: "🛤️", title: "Highway & Expressway Rules", desc: "Expressway safety and regulations" },
];

export default function RTOTestPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0f4ff", fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .jk { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .btn-primary { background: linear-gradient(135deg, #1d4ed8, #7c3aed); color: white; border: none; border-radius: 10px; padding: 16px 32px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(29,78,216,0.4); }
        .btn-premium { background: linear-gradient(135deg, #b45309, #dc2626); color: white; border: none; border-radius: 10px; padding: 16px 32px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-block; font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-premium:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(180,83,9,0.4); }
        .feature-card { background: white; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; transition: transform 0.2s, box-shadow 0.2s; }
        .feature-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .plan-card { background: white; border-radius: 16px; padding: 32px; border: 2px solid #e2e8f0; transition: all 0.2s; }
        .plan-card.featured { border-color: #1d4ed8; box-shadow: 0 0 0 4px rgba(29,78,216,0.1); }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
        .stat { text-align: center; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 12px; }
        .check { color: #16a34a; font-weight: 700; margin-right: 8px; }
        .cross { color: #6b7280; margin-right: 8px; }
      `}</style>

      {/* Header */}
      <header style={{ background: "#0f172a", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="jk" style={{ color: "white", fontSize: 20, fontWeight: 800 }}>LearnDrive</span>
          </Link>
          <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <Link href="/blog" className="jk" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>Blog</Link>
            <Link href="/trainers" className="jk" style={{ background: "#1d4ed8", color: "white", fontSize: 13, textDecoration: "none", fontWeight: 700, padding: "8px 18px", borderRadius: 8 }}>Book Trainer</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", padding: "72px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(29,78,216,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(124,58,237,0.15) 0%, transparent 60%)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          <span className="badge jk" style={{ background: "rgba(29,78,216,0.2)", color: "#93c5fd", marginBottom: 20 }}>🇮🇳 India's Most Complete RTO Prep</span>
          <h1 className="jk" style={{ color: "white", fontSize: 54, fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: "-1.5px" }}>
            Pass Your RTO Test<br />
            <span style={{ background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>First Time, Every Time</span>
          </h1>
          <p className="jk" style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.6, marginBottom: 40 }}>
            60+ questions from actual RTO question banks. Practice free, or take the full timed mock test to know if you're ready.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
            {[["60+", "Questions"], ["6", "Topics"], ["100%", "Free Practice"], ["₹49", "Full Mock Test"]].map(([val, label]) => (
              <div key={label} className="stat jk">
                <div style={{ color: "white", fontSize: 28, fontWeight: 900, lineHeight: 1 }}>{val}</div>
                <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/rto-test/practice" className="btn-primary jk">Start Free Practice →</Link>
            <Link href="/rto-test/mock" className="btn-premium jk">Full Mock Test ₹49</Link>
          </div>
        </div>
      </section>

      {/* Topics Covered */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 className="jk" style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: 8 }}>All 6 Official RTO Topics</h2>
          <p className="jk" style={{ color: "#64748b", fontSize: 16 }}>The same categories tested in the official RTO learner's licence examination</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 className="jk" style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{f.title}</h3>
              <p className="jk" style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background: "#0f172a", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="jk" style={{ fontSize: 32, fontWeight: 800, color: "white", letterSpacing: "-0.5px", marginBottom: 8 }}>Free Practice or Full Mock Test?</h2>
            <p className="jk" style={{ color: "#64748b", fontSize: 16 }}>Choose what suits your preparation level</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 780, margin: "0 auto" }}>
            {/* Free Plan */}
            <div className="plan-card">
              <div style={{ marginBottom: 20 }}>
                <span className="badge jk" style={{ background: "#dcfce7", color: "#166534", marginBottom: 12 }}>Free Forever</span>
                <div className="jk" style={{ fontSize: 36, fontWeight: 900, color: "#0f172a" }}>₹0</div>
                <div className="jk" style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>No credit card needed</div>
              </div>
              <ul style={{ listStyle: "none", marginBottom: 28 }}>
                {[
                  ["✓ Practice all 6 topics", true],
                  ["✓ 5 questions per topic", true],
                  ["✓ Instant answer explanations", true],
                  ["✓ Unlimited retries", true],
                  ["✗ No timer (not like real test)", false],
                  ["✗ No performance report", false],
                  ["✗ No full 30-question mock", false],
                ].map(([item, included]) => (
                  <li key={String(item)} className="jk" style={{ fontSize: 14, color: included ? "#1e293b" : "#9ca3af", marginBottom: 8, fontWeight: included ? 500 : 400 }}>
                    <span className={included ? "check" : "cross"}>{String(item).substring(0, 1)}</span>
                    {String(item).substring(2)}
                  </li>
                ))}
              </ul>
              <Link href="/rto-test/practice" className="jk" style={{ display: "block", textAlign: "center", padding: "14px", background: "#f1f5f9", color: "#0f172a", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
                Start Free Practice →
              </Link>
            </div>

            {/* Paid Plan */}
            <div className="plan-card featured">
              <div style={{ marginBottom: 20 }}>
                <span className="badge jk" style={{ background: "#fef3c7", color: "#92400e", marginBottom: 12 }}>⭐ Recommended</span>
                <div className="jk" style={{ fontSize: 36, fontWeight: 900, color: "#0f172a" }}>₹49</div>
                <div className="jk" style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>One-time payment</div>
              </div>
              <ul style={{ listStyle: "none", marginBottom: 28 }}>
                {[
                  ["✓ Everything in Free", true],
                  ["✓ 30-question full mock test", true],
                  ["✓ Real 30-minute timer", true],
                  ["✓ Score report with analysis", true],
                  ["✓ Weak topic identification", true],
                  ["✓ Road sign image questions", true],
                  ["✓ Unlimited mock test retakes", true],
                ].map(([item, included]) => (
                  <li key={String(item)} className="jk" style={{ fontSize: 14, color: "#1e293b", marginBottom: 8, fontWeight: 500 }}>
                    <span className="check">{String(item).substring(0, 1)}</span>
                    {String(item).substring(2)}
                  </li>
                ))}
              </ul>
              <Link href="/rto-test/mock" className="jk" style={{ display: "block", textAlign: "center", padding: "14px", background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", color: "white", borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
                Unlock Full Mock Test →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 className="jk" style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Ready to ace the RTO test?</h2>
          <p className="jk" style={{ color: "#64748b", fontSize: 16, marginBottom: 28 }}>Start with free practice and unlock the full mock test when you're ready to simulate the real exam.</p>
          <Link href="/rto-test/practice" className="btn-primary jk" style={{ marginRight: 12 }}>Start Free Practice</Link>
          <Link href="/blog" className="jk" style={{ color: "#1d4ed8", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>Read Study Guides →</Link>
        </div>
      </section>

      <footer style={{ background: "#0f172a", padding: 24, textAlign: "center" }}>
        <p className="jk" style={{ color: "#334155", fontSize: 13 }}>© 2025 LearnDrive · <Link href="/terms" style={{ color: "#334155" }}>Terms</Link> · <Link href="/help" style={{ color: "#334155" }}>Help</Link></p>
      </footer>
    </main>
  );
}