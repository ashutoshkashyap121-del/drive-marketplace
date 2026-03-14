import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hire a Driver in India — Outstation, Wedding, Airport | LearnDrive",
  description: "Book a verified driver for outstation trips, weddings, airport drops and daily use across India. Trained, background-checked drivers. Book online in 2 minutes.",
  keywords: "hire a driver india, book driver india, outstation driver booking, wedding driver india, airport drop driver, driver on demand india, rent a driver india",
  alternates: { canonical: "https://learndrive.in/hire-a-driver" },
  openGraph: {
    title: "Hire a Verified Driver in India | LearnDrive",
    description: "Book a verified driver for outstation trips, weddings, airport drops. Trained, background-checked. Book online in 2 minutes.",
    url: "https://learndrive.in/hire-a-driver",
    siteName: "LearnDrive",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Driver Hiring Service — LearnDrive",
  "description": "Book a verified driver in India for outstation trips, weddings, airport transfers and daily use.",
  "provider": { "@type": "Organization", "name": "LearnDrive", "url": "https://learndrive.in" },
  "areaServed": { "@type": "Country", "name": "India" },
  "serviceType": "Driver Hiring",
};

const USE_CASES = [
  { icon: "🛣️", title: "Outstation trips", desc: "Long drives to another city or state. Driver handles the entire journey. You relax." },
  { icon: "💒", title: "Weddings & events", desc: "Professional driver for wedding day. No stress about parking or drinking and driving." },
  { icon: "✈️", title: "Airport transfers", desc: "Early morning or late night airport drops and pickups. Punctual, no surge pricing." },
  { icon: "🏥", title: "Medical & emergencies", desc: "Hospital trips, medical appointments. Calm, experienced drivers who know the city." },
  { icon: "👴", title: "Senior citizen travel", desc: "Reliable driver for elderly parents. Regular trips to temple, hospital, market." },
  { icon: "📅", title: "Daily / monthly hire", desc: "Hire a driver for your car on a daily or monthly basis. Consistent, background-checked." },
];

export default function HireADriver() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ fontFamily: "'DM Sans', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

        {/* Nav */}
        <nav style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ textDecoration: "none", fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
              Learn<span style={{ color: "#F59E0B" }}>Drive</span>
            </Link>
            <a href="tel:+918700896528" style={{ background: "#F59E0B", color: "#0F172A", textDecoration: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14 }}>
              📞 Book Now
            </a>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "72px 5%", textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "inline-block", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 700, marginBottom: 24 }}>
              🚗 Verified Drivers Across India
            </div>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
              Hire a Driver<br /><span style={{ color: "#F59E0B" }}>for Your Car</span>
            </h1>
            <p style={{ color: "#94A3B8", fontSize: 17, lineHeight: 1.8, marginBottom: 36 }}>
              Outstation trips, weddings, airport drops, daily hire. Background-checked, trained drivers. Book in 2 minutes.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:+918700896528" style={{ background: "#F59E0B", color: "#0F172A", textDecoration: "none", padding: "16px 32px", borderRadius: 14, fontWeight: 800, fontSize: 16, fontFamily: "'Sora',sans-serif" }}>
                📞 Call to Book: +91 87008 96528
              </a>
              <a href="https://wa.me/918700896528?text=Hi, I want to hire a driver" target="_blank" rel="noopener noreferrer" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", textDecoration: "none", padding: "16px 32px", borderRadius: 14, fontWeight: 600, fontSize: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
                WhatsApp Us →
              </a>
            </div>
            <p style={{ color: "#475569", fontSize: 13, marginTop: 16 }}>Available across Delhi, Mumbai, Bangalore, Hyderabad, Chennai and 20+ cities</p>
          </div>
        </div>

        {/* Use cases */}
        <div style={{ padding: "72px 5%", maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#0F172A", textAlign: "center", marginBottom: 48 }}>
            When do you need a driver?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {USE_CASES.map((u) => (
              <div key={u.title} style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 28 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{u.icon}</div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{u.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div style={{ background: "#fff", padding: "48px 5%" }}>
          <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: "#0F172A", marginBottom: 28 }}>Every LearnDrive driver is</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              {["✅ Background verified", "✅ Police checked", "✅ Valid driving licence", "✅ Trained & professional", "✅ Punctual", "✅ Non-smoker"].map((p) => (
                <div key={p} style={{ background: "#F0FDF4", borderRadius: 12, padding: "14px 16px", fontSize: 14, color: "#166534", fontWeight: 600 }}>{p}</div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO text */}
        <div style={{ padding: "48px 5%", maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, color: "#0F172A", marginBottom: 16 }}>Hire a driver in India — how it works</h2>
          <p style={{ color: "#555", fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
            LearnDrive connects you with trained, verified drivers across 24+ cities in India. Whether you need a driver for an outstation trip from Delhi to Jaipur, an airport transfer in Mumbai, or a wedding driver in Bangalore — we have experienced drivers available on short notice.
          </p>
          <p style={{ color: "#555", fontSize: 14, lineHeight: 1.9 }}>
            All LearnDrive drivers hold a valid commercial driving licence, have undergone background and police verification, and are trained in professional driving etiquette. To book a driver, call +91 87008 96528 or WhatsApp us with your trip details.
          </p>
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "72px 5%", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Need a driver today?</h2>
          <p style={{ color: "#94A3B8", fontSize: 15, marginBottom: 32 }}>Call or WhatsApp us. We'll confirm your driver within 2 hours.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:+918700896528" style={{ background: "#F59E0B", color: "#0F172A", textDecoration: "none", padding: "16px 32px", borderRadius: 14, fontWeight: 800, fontSize: 16 }}>
              📞 +91 87008 96528
            </a>
            <a href="https://wa.me/918700896528?text=Hi, I want to hire a driver" target="_blank" rel="noopener noreferrer" style={{ background: "#25D366", color: "#fff", textDecoration: "none", padding: "16px 32px", borderRadius: 14, fontWeight: 700, fontSize: 16 }}>
              💬 WhatsApp Us
            </a>
          </div>
          <div style={{ marginTop: 32 }}>
            <p style={{ color: "#475569", fontSize: 13, marginBottom: 12 }}>Are you a driver? Join LearnDrive and start getting bookings.</p>
            <Link href="/trainers/register" style={{ color: "#F59E0B", fontSize: 14, textDecoration: "underline" }}>Register as a driver →</Link>
          </div>
        </div>
      </main>
    </>
  );
}