import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How LearnDrive Works for Driving Instructors | LearnDrive",
  description: "Learn how LearnDrive works for driving schools and independent instructors in India. List free, get online bookings, keep 85% of every booking. No marketing needed.",
  keywords: "how learndrive works trainers, driving instructor online booking india, driving school platform india, get driving students online, driving instructor registration india",
  alternates: { canonical: "https://learndrive.in/how-it-works-for-trainers" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to List Your Driving School on LearnDrive",
  "description": "Step-by-step guide to listing your driving school on LearnDrive and receiving online bookings from students.",
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Register for free", "text": "Visit learndrive.in/trainers/register and complete the 4-step form with your school details, location, and packages." },
    { "@type": "HowToStep", "position": 2, "name": "Get reviewed and go live", "text": "LearnDrive reviews your listing within 24 hours. Once approved, your school is live and visible to students in your city." },
    { "@type": "HowToStep", "position": 3, "name": "Receive booking alerts", "text": "When a student books your school, you receive an instant WhatsApp and email notification with all their details." },
    { "@type": "HowToStep", "position": 4, "name": "Teach and get paid", "text": "Complete the training session. LearnDrive releases your 85% payout within 24 hours of course completion." },
  ],
};

export default function HowItWorksForTrainers() {
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
            <Link href="/trainers/register" style={{ background: "#F59E0B", color: "#0F172A", textDecoration: "none", padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14 }}>
              Register Free →
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "72px 5%", textAlign: "center" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
              How LearnDrive Works<br /><span style={{ color: "#F59E0B" }}>for Driving Schools</span>
            </h1>
            <p style={{ color: "#94A3B8", fontSize: 16, lineHeight: 1.8 }}>
              From registration to first booking — here's exactly how LearnDrive works for driving schools and independent instructors across India.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 5%" }}>

          {/* Breadcrumb */}
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 40 }}>
            <Link href="/" style={{ color: "#F59E0B", textDecoration: "none" }}>LearnDrive</Link> › How it works for trainers
          </p>

          {/* Step by step */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              {
                step: "Step 1",
                title: "Register your school for free",
                body: "Go to learndrive.in/trainers/register and fill out a simple 4-step form. You'll enter your school name, city, RTO registration number, packages and pricing. The whole process takes about 5 minutes. There is no fee to register.",
                note: "Independent trainers with a valid personal driving licence can also register — you don't need to be a registered school.",
                cta: { text: "Register now →", href: "/trainers/register" },
              },
              {
                step: "Step 2",
                title: "LearnDrive reviews and approves your listing",
                body: "After you submit, the LearnDrive team reviews your listing within 24 hours. We verify basic details and approve your school. Once approved, your school is live and visible to students searching for driving schools in your city.",
                note: "You'll receive a WhatsApp confirmation when you go live.",
              },
              {
                step: "Step 3",
                title: "Students find you and book online",
                body: "Students in your city browse LearnDrive, compare schools by price and ratings, and book your school online. They pay via Razorpay (UPI, cards, net banking) at the time of booking. You receive an instant WhatsApp and email alert with the student's name, mobile number and chosen package.",
                note: "You don't need to install any app. All alerts come via WhatsApp.",
              },
              {
                step: "Step 4",
                title: "Confirm the booking and begin training",
                body: "Call or WhatsApp the student to confirm timing and pickup location. Conduct the training as per the package the student booked. LearnDrive handles any cancellations or rescheduling requests on your behalf.",
                note: null,
              },
              {
                step: "Step 5",
                title: "Get paid within 24 hours",
                body: "Once training is complete, LearnDrive releases your payout. You keep 85% of the booking amount. The 15% platform fee covers payment processing, student support, cancellation handling and marketing. Payouts are transferred to your bank account via NEFT/IMPS.",
                note: "For a ₹6,050 booking, you receive ₹5,143. LearnDrive keeps ₹907.",
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 24, paddingBottom: 40, position: "relative" }}>
                {/* Line */}
                {i < 4 && <div style={{ position: "absolute", left: 19, top: 48, bottom: 0, width: 2, background: "#E2E8F0" }} />}
                {/* Circle */}
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, color: "#0F172A", flexShrink: 0, zIndex: 1 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, paddingTop: 6 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{item.step}</p>
                  <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>{item.title}</h2>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: item.note ? 12 : 0 }}>{item.body}</p>
                  {item.note && (
                    <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#92400E" }}>
                      💡 {item.note}
                    </div>
                  )}
                  {item.cta && (
                    <Link href={item.cta.href} style={{ display: "inline-block", marginTop: 16, background: "#F59E0B", color: "#0F172A", textDecoration: "none", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14 }}>
                      {item.cta.text}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Commission table */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px 32px", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 20 }}>Commission breakdown</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, fontSize: 14 }}>
              {[
                ["Booking amount", "You receive (85%)", "Platform fee (15%)"],
                ["₹5,500", "₹4,675", "₹825"],
                ["₹6,050", "₹5,143", "₹908"],
                ["₹7,000", "₹5,950", "₹1,050"],
                ["₹10,000", "₹8,500", "₹1,500"],
              ].map((row, i) => (
                row.map((cell, j) => (
                  <div key={`${i}-${j}`} style={{ padding: "10px 12px", background: i === 0 ? "#F8FAFC" : i % 2 === 0 ? "#fff" : "#FAFAFA", fontWeight: i === 0 ? 700 : 400, color: i === 0 ? "#475569" : j === 1 ? "#16A34A" : "#0F172A", borderBottom: "1px solid #E2E8F0", fontSize: i === 0 ? 12 : 14 }}>
                    {cell}
                  </div>
                ))
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", borderRadius: 24, padding: "40px 32px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Ready to get started?</h2>
            <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 24 }}>Register your driving school for free in 5 minutes.</p>
            <Link href="/trainers/register" style={{ background: "#F59E0B", color: "#0F172A", textDecoration: "none", padding: "14px 32px", borderRadius: 12, fontWeight: 800, fontSize: 15, fontFamily: "'Sora',sans-serif" }}>
              Register Free →
            </Link>
            <p style={{ color: "#475569", fontSize: 12, marginTop: 14 }}>Questions? +91 87008 96528 · hello@learndrive.in</p>
          </div>
        </div>
      </main>
    </>
  );
}