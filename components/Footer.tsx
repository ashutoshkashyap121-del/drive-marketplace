// components/Footer.tsx
import Link from "next/link";

const CITIES = [
  "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Chennai",
  "Pune", "Kolkata", "Jaipur", "Chandigarh", "Kochi",
  "Indore", "Lucknow", "Ahmedabad", "Noida", "Gurugram",
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#0F172A", color: "#94A3B8", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .footer-link { color: #94A3B8; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .footer-link:hover { color: #F59E0B; }
        .footer-city { color: #64748B; text-decoration: none; font-size: 13px; transition: color 0.15s; }
        .footer-city:hover { color: #F59E0B; }
        .footer-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 0; }
      `}</style>

      {/* ── Main footer grid ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 5% 40px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40 }}>

        {/* Brand column */}
        <div style={{ gridColumn: "span 1" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#FFFFFF", marginBottom: 12 }}>
            Learn<span style={{ color: "#F59E0B" }}>Drive</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 20, color: "#64748B" }}>
            India's trusted platform to find verified driving trainers, hire drivers, and get your licence without the RTO confusion.
          </p>
          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <a href="tel:+918700896528" className="footer-link" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>📞</span>
              <span>+91 87008 96528</span>
            </a>
            <a href="mailto:support@learndrive.in" className="footer-link" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>✉️</span>
              <span>support@learndrive.in</span>
            </a>

          </div>
          {/* Social */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {[
              { href: "https://www.facebook.com/profile.php?id=61579668686130", label: "Facebook", icon: "📘" },
              { href: "https://instagram.com/learndrive.in", label: "Instagram", icon: "📸" },
              { href: "https://linkedin.com/company/learndrive", label: "LinkedIn", icon: "💼" },
              { href: "https://whatsapp.com/channel/0029VbCk5iC6WaKnB5TRo622", label: "WhatsApp Channel", icon: "💬" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, textDecoration: "none", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,158,11,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 16 }}>Services</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/trainers" className="footer-link">Find a Driving Trainer</Link>
            <Link href="/hire-driver" className="footer-link">Hire a Driver</Link>
            <Link href="/hire-driver/onboard" className="footer-link">Become a Driver</Link>
            <Link href="/dl-assistance" className="footer-link">DL Assistance</Link>
            <Link href="/rto-test/practice" className="footer-link">RTO Practice Test</Link>
            <Link href="/trainers/register" className="footer-link">Register as Trainer</Link>
          </div>
        </div>

        {/* Learn */}
        <div>
          <h4 style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 16 }}>Learn</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/blog" className="footer-link">Blog & Guides</Link>
            <Link href="/blog/how-to-get-driving-licence-india" className="footer-link">How to Get a DL</Link>
            <Link href="/blog/rto-documents-complete-checklist-2025" className="footer-link">RTO Documents Checklist</Link>
            <Link href="/blog/rto-test-tips-tricks-pass-first-time" className="footer-link">RTO Test Tips</Link>
            <Link href="/rto-test/practice" className="footer-link">Mock RTO Test</Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 16 }}>Company</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/about" className="footer-link">About Us</Link>
            <Link href="/careers" className="footer-link">Careers</Link>
            <Link href="/contact" className="footer-link">Contact Us</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/refund" className="footer-link">Refund Policy</Link>
            <Link href="/track-refund" className="footer-link">Track Refund</Link>
          </div>
        </div>
      </div>

      {/* ── Cities strip ── */}
      <hr className="footer-divider" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 5%" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>
          Available Cities
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
          {CITIES.map(city => (
            <a key={city} href={`/?city=${encodeURIComponent(city)}`} className="footer-city">
              {city}
            </a>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <hr className="footer-divider" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 5%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: 13, color: "#475569" }}>
          © {year} LearnDrive Technologies Pvt. Ltd. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/terms" className="footer-link" style={{ fontSize: 13 }}>Terms</Link>
          <Link href="/privacy" className="footer-link" style={{ fontSize: 13 }}>Privacy</Link>
          <Link href="/refund" className="footer-link" style={{ fontSize: 13 }}>Refunds</Link>
          <Link href="/track-refund" className="footer-link" style={{ fontSize: 13 }}>Track Refund</Link>
        </div>
      </div>
    </footer>
  );
}
