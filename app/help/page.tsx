import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help & FAQ | LearnDrive",
  description: "Answers to common questions about booking driving lessons, cancellations, refunds, and trainer verification on LearnDrive.",
  alternates: { canonical: "/help" },
};

const FAQS = [
  {
    category: "Booking",
    icon: "📅",
    questions: [
      {
        q: "How do I book a driving session?",
        a: "Search for trainers by city and vehicle type on our Trainers page. Click 'Book Now' on any trainer, fill in your details, pick a date, and pay securely via Razorpay. You'll get a booking confirmation with a reference number.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept UPI (GPay, PhonePe, Paytm), debit/credit cards, and net banking via Razorpay. All payments are 100% secure.",
      },
      {
        q: "Do I need a Learner's Licence before booking?",
        a: "Yes. For sessions on public roads, you must have a valid Learner's Licence (LL) issued by an RTO. You can practice on private grounds without an LL.",
      },
      {
        q: "Can I choose my session time?",
        a: "You select a preferred date while booking. Your trainer will then call you to confirm the exact time that works for both of you.",
      },
    ],
  },
  {
    category: "Cancellations & Refunds",
    icon: "💰",
    questions: [
      {
        q: "How do I cancel my booking?",
        a: "Visit learndrive.in/cancel, enter your Booking ID (found in your confirmation) and registered mobile number. Your refund will be initiated automatically.",
      },
      {
        q: "What is the refund policy?",
        a: "Cancellations made 24+ hours before your session get a 100% refund. Same-day cancellations get a 50% refund. No refund for no-shows. If a trainer cancels, you get a full refund automatically.",
      },
      {
        q: "How long does the refund take?",
        a: "Refunds are processed immediately via Razorpay. UPI refunds appear within 24 hours. Card refunds take 5–7 business days depending on your bank.",
      },
      {
        q: "What if my trainer doesn't show up?",
        a: "If your trainer cancels or doesn't show up, you'll receive a 100% refund automatically. Please email support@learndrive.in with your booking ID so we can also take action against the trainer.",
      },
    ],
  },
  {
    category: "Trainers",
    icon: "👨‍🏫",
    questions: [
      {
        q: "How are trainers verified?",
        a: "All trainers go through our verification process — valid driving licence, Aadhaar verification, minimum 5 years experience, and vehicle insurance check. Car trainers must have dual control vehicles.",
      },
      {
        q: "What does 'Dual Control' mean?",
        a: "Dual control means the trainer's car has a second set of brake and clutch pedals on the passenger side. This is required by law under the Motor Vehicles Act 1988 for all training vehicles.",
      },
      {
        q: "Can I request a female trainer?",
        a: "We are onboarding female trainers. Please email support@learndrive.in with your city and we'll try to match you with one as they become available.",
      },
      {
        q: "What if I'm not satisfied with my trainer?",
        a: "Email support@learndrive.in within 24 hours of your session. We'll review the situation and may offer a rebooking with a different trainer at no extra charge.",
      },
    ],
  },
  {
    category: "Account & Technical",
    icon: "⚙️",
    questions: [
      {
        q: "Where is my booking ID?",
        a: "Your booking ID is shown on the confirmation page after payment and sent via SMS to your registered mobile number. It looks like #42 or #103.",
      },
      {
        q: "I didn't receive a confirmation SMS. What do I do?",
        a: "Check that your mobile number was entered correctly. Email support@learndrive.in with your name and booking date and we'll resend the details.",
      },
      {
        q: "Is my payment information safe?",
        a: "Yes. We use Razorpay for all payments — we never store your card or UPI details. Razorpay is PCI-DSS certified and trusted by thousands of Indian businesses.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "32px 5%" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link href="/" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#fff", textDecoration: "none" }}>
            Learn<span style={{ color: "#F59E0B" }}>Drive</span>
          </Link>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "2rem", fontWeight: 800, color: "#fff", marginTop: 24, marginBottom: 8 }}>
            Help & FAQ
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: 0 }}>
            Everything you need to know about LearnDrive
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 5% 80px" }}>

        {/* Quick action cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 48 }}>
          {[
            { icon: "❌", label: "Cancel a Booking", href: "/cancel", color: "#FEF2F2", border: "#FECACA", text: "#DC2626" },
            { icon: "💰", label: "Refund Policy", href: "/refund", color: "#FEF3C7", border: "#FDE68A", text: "#92400E" },
            { icon: "TR", label: "Track Refund", href: "/track-refund", color: "#F0F9FF", border: "#BAE6FD", text: "#0C4A6E" },
            { icon: "🔍", label: "Find a Trainer", href: "/trainers", color: "#EFF6FF", border: "#BFDBFE", text: "#1E40AF" },
            { icon: "📧", label: "Email Support", href: "mailto:support@learndrive.in", color: "#F0FDF4", border: "#BBF7D0", text: "#166534" },
            { icon: "📞", label: "Call Support", href: "tel:+918700896528", color: "#F5F3FF", border: "#DDD6FE", text: "#5B21B6" },
          ].map((item) => (
            <a key={item.label} href={item.href}
              style={{ background: item.color, border: `1px solid ${item.border}`, borderRadius: 14, padding: "16px", textAlign: "center", textDecoration: "none", transition: "transform 0.15s", display: "block" }}>
              <div style={{ fontSize: "1.6rem", marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: item.text }}>{item.label}</div>
            </a>
          ))}
        </div>

        {/* FAQ sections */}
        {FAQS.map((section) => (
          <div key={section.category} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              {section.icon} {section.category}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {section.questions.map((item) => (
                <details key={item.q}
                  style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "16px 20px", cursor: "pointer" }}>
                  <summary style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.92rem", fontWeight: 700, color: "#0F172A", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    {item.q}
                    <span style={{ color: "#F59E0B", fontSize: "1.1rem", flexShrink: 0 }}>+</span>
                  </summary>
                  <p style={{ fontSize: "0.88rem", color: "#374151", lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still need help */}
        <div style={{ background: "linear-gradient(135deg, #0B1437, #1A2B5F)", borderRadius: 20, padding: "32px", textAlign: "center" }}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", color: "#fff", fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>
            Still need help?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: 24 }}>
            Our support team typically responds within 24 hours.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:support@learndrive.in"
              style={{ display: "inline-block", padding: "12px 24px", background: "#F59E0B", color: "#0F172A", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.9rem", borderRadius: 12, textDecoration: "none" }}>
              📧 support@learndrive.in
            </a>
            <a href="tel:+918700896528"
              style={{ display: "inline-block", padding: "12px 24px", background: "rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.9rem", borderRadius: 12, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              📞 +91 87008 96528
            </a>
          </div>
        </div>

        {/* Footer links */}
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
          {[["Terms of Service", "/terms"], ["Privacy Policy", "/privacy"], ["Refund Policy", "/refund"], ["Track Refund", "/track-refund"], ["Home", "/"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: "0.82rem", color: "#94A3B8", textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
