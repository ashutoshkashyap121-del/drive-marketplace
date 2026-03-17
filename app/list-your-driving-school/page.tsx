import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "List Your Driving School Online for Free | LearnDrive",
  description: "List your driving school on LearnDrive and start getting online bookings instantly. Free listing. No marketing needed. Schools keep 85% of every booking. Join 100+ schools across India.",
  keywords: "list driving school online india, driving school listing free, get students driving school, driving school online booking platform, register driving school india, driving school lead generation india",
  alternates: { canonical: "https://learndrive.in/list-your-driving-school" },
  openGraph: {
    title: "List Your Driving School Online for Free | LearnDrive",
    description: "Start getting online bookings from students in your city. Free listing. 5-minute setup. Schools keep 85% of every booking.",
    url: "https://learndrive.in/list-your-driving-school",
    siteName: "LearnDrive",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "List Your Driving School Online — LearnDrive",
  "description": "Free driving school listing platform in India. Get online bookings from students across your city.",
  "url": "https://learndrive.in/list-your-driving-school",
  "mainEntity": {
    "@type": "Service",
    "name": "Driving School Listing on LearnDrive",
    "description": "List your driving school for free and receive online bookings from students in your city.",
    "provider": { "@type": "Organization", "name": "LearnDrive", "url": "https://learndrive.in" },
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR", "description": "Free listing. 15% commission per booking." },
  },
};

const STEPS = [
  { num: "01", title: "Register in 5 minutes", desc: "Fill out a simple form with your school name, location, packages and pricing. No documents needed upfront." },
  { num: "02", title: "Get reviewed & go live", desc: "LearnDrive reviews your listing within 24 hours. Once approved, students across your city can find and book you." },
  { num: "03", title: "Receive bookings on WhatsApp", desc: "When a student books, you get an instant WhatsApp + email alert with all their details. Confirm with one tap." },
  { num: "04", title: "Teach and get paid", desc: "Complete the training. LearnDrive releases your payout within 24 hours. No chasing payments." },
];

const BENEFITS = [
  { icon: "₹0", title: "Free to list", desc: "No upfront cost. No subscription. No hidden fees. You only pay 15% when you get a booking." },
  { icon: "📱", title: "Bookings on WhatsApp", desc: "Every booking alert goes straight to your WhatsApp. No app to download, no dashboard to check." },
  { icon: "🔒", title: "Secure online payments", desc: "Students pay via Razorpay. Money is collected and transferred to you. No cash handling." },
  { icon: "🏙️", title: "24 cities covered", desc: "Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Pune and 20+ more cities. Expand your reach." },
  { icon: "📣", title: "No marketing needed", desc: "LearnDrive brings students to you. You focus on teaching, we handle the rest." },
  { icon: "85%", title: "You keep most", desc: "Schools keep 85% of every booking. LearnDrive takes only 15% as a platform fee." },
];

const FAQS = [
  { q: "Is listing my driving school free?", a: "Yes, completely free. There is no subscription or monthly fee. LearnDrive charges a 15% commission only when you receive a confirmed, paid booking." },
  { q: "How quickly will I start getting bookings?", a: "Most schools start receiving their first booking enquiries within 1-2 weeks of going live, depending on your city and competition." },
  { q: "Do I need to be RTO-registered to list?", a: "Yes, you need a valid driving school registration from your local RTO. Independent certified trainers with a personal driving licence can also list." },
  { q: "What cities does LearnDrive operate in?", a: "We currently cover 24 cities: Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Jaipur, Ahmedabad, Surat, Lucknow, Chandigarh, Bhopal, Indore, Nagpur, Patna, Coimbatore, Kochi, Visakhapatnam, Noida, Gurgaon, Vadodara, Rajkot and Faridabad. More cities coming soon." },
  { q: "How does LearnDrive handle payments?", a: "Students pay online via Razorpay (UPI, cards, net banking). LearnDrive collects the payment and transfers your 85% share within 24 hours of course completion." },
  { q: "What if a student cancels?", a: "LearnDrive handles all cancellations and refunds. You are notified immediately and a replacement booking is prioritised." },
];

export default function ListYourDrivingSchool() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main style={{ fontFamily: "'DM Sans', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
        `}</style>

        {/* Nav */}
        <nav style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ textDecoration: "none", fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
              Learn<span style={{ color: "#F59E0B" }}>Drive</span>
            </Link>
            <Link href="/trainers/register" style={{ background: "#F59E0B", color: "#0F172A", textDecoration: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14 }}>
              List Your School Free →
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "72px 5% 80px", textAlign: "center" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ display: "inline-block", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 700, marginBottom: 24 }}>
              🇮🇳 India's Fastest Growing Driving School Platform
            </div>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
              Get More Students.<br />
              <span style={{ color: "#F59E0B" }}>Zero Marketing Spend.</span>
            </h1>
            <p style={{ color: "#94A3B8", fontSize: 17, lineHeight: 1.8, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
              List your driving school on LearnDrive for free. Students in your city find you, book online, and pay instantly. You just teach.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/trainers/register" style={{ background: "#F59E0B", color: "#0F172A", textDecoration: "none", padding: "16px 32px", borderRadius: 14, fontWeight: 800, fontSize: 16, fontFamily: "'Sora',sans-serif" }}>
                List Your School Free →
              </Link>
              <Link href="/trainers" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", textDecoration: "none", padding: "16px 32px", borderRadius: 14, fontWeight: 600, fontSize: 16, border: "1px solid rgba(255,255,255,0.15)" }}>
                See Live Schools
              </Link>
            </div>
            <p style={{ color: "#475569", fontSize: 13, marginTop: 16 }}>Free listing · No credit card · Goes live in 24 hours</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "28px 5%" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center" }}>
            {[
              { value: "24", label: "Cities covered" },
              { value: "₹0", label: "Cost to list" },
              { value: "85%", label: "You keep per booking" },
              { value: "24hrs", label: "To go live" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 800, color: "#F59E0B" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ padding: "72px 5%", maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#0F172A", textAlign: "center", marginBottom: 8 }}>
            How it works
          </h2>
          <p style={{ color: "#64748B", textAlign: "center", marginBottom: 48, fontSize: 15 }}>From registration to first booking in under 48 hours</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {STEPS.map((s) => (
              <div key={s.num} style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 28 }}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 36, fontWeight: 800, color: "#F59E0B", marginBottom: 12 }}>{s.num}</div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div style={{ background: "#fff", padding: "72px 5%" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#0F172A", textAlign: "center", marginBottom: 48 }}>
              Why schools choose LearnDrive
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {BENEFITS.map((b) => (
                <div key={b.title} style={{ background: "#F8F7F4", borderRadius: 16, padding: "24px 28px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#F59E0B", minWidth: 40 }}>{b.icon}</div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: "#0F172A", marginBottom: 6, fontSize: 15 }}>{b.title}</h3>
                    <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div style={{ padding: "72px 5%", maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#0F172A", textAlign: "center", marginBottom: 40 }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {FAQS.map((f) => (
              <div key={f.q} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px" }}>
                <h3 style={{ fontWeight: 700, color: "#0F172A", marginBottom: 8, fontSize: 15 }}>{f.q}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "72px 5%", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
            Ready to grow your driving school?
          </h2>
          <p style={{ color: "#94A3B8", fontSize: 15, marginBottom: 32 }}>Join 100+ driving schools already getting online bookings on LearnDrive.</p>
          <Link href="/trainers/register" style={{ background: "#F59E0B", color: "#0F172A", textDecoration: "none", padding: "16px 40px", borderRadius: 14, fontWeight: 800, fontSize: 16, fontFamily: "'Sora',sans-serif" }}>
            List Your School for Free →
          </Link>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 16 }}>Questions? Call us: +91 87008 96528 or email hello@learndrive.in</p>
        </div>
      </main>
    </>
  );
}
