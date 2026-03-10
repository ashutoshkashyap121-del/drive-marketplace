"use client";
import { useState } from "react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Pay ₹499",
    description: "One-time payment. No hidden charges. Instant confirmation on WhatsApp.",
    icon: "💳",
  },
  {
    number: "02",
    title: "AI Collects Your Details",
    description: "Our AI assistant messages you on WhatsApp and collects all required information step by step.",
    icon: "🤖",
  },
  {
    number: "03",
    title: "We Fill Your Application",
    description: "AI fills your Sarathi portal Form 4 automatically and sends you the completed PDF.",
    icon: "📄",
  },
  {
    number: "04",
    title: "RTO Slot Booked",
    description: "We check available slots at your nearest RTO and book the earliest one for you.",
    icon: "📅",
  },
  {
    number: "05",
    title: "Document Checklist Sent",
    description: "Personalised checklist sent to your WhatsApp — exactly what to bring, nothing extra.",
    icon: "✅",
  },
  {
    number: "06",
    title: "Reminders Till Test Day",
    description: "Automated reminders 3 days before, 1 day before, and morning of your test.",
    icon: "🔔",
  },
];

const faqs = [
  {
    q: "Do I need to visit the RTO at all?",
    a: "Yes — you still need to appear for the driving test in person. But we handle everything else — forms, documents, slot booking, reminders. Most people fail because they bring wrong documents or miss their slot. We eliminate that completely.",
  },
  {
    q: "How does the AI collect my information?",
    a: "After payment, our AI assistant sends you a WhatsApp message and asks you questions one at a time — name, address, Aadhaar number, vehicle type etc. It takes about 5 minutes to complete.",
  },
  {
    q: "What if I haven't done my Learner Licence yet?",
    a: "No problem. We assist with both Learner Licence (LL) and Permanent Licence (DL) applications. Tell us during the WhatsApp conversation and we'll guide you from step one.",
  },
  {
    q: "Which cities do you cover?",
    a: "We currently cover Delhi NCR, Mumbai, Bangalore, Hyderabad, Chennai, Pune, Jaipur and 40+ other cities across India.",
  },
  {
    q: "What if my test fails?",
    a: "We offer rebooking assistance at ₹199 — a discounted rate. We'll also send you practice tips and common mistakes to avoid before your next attempt.",
  },
  {
    q: "Is my Aadhaar data safe?",
    a: "Yes. All personal data is encrypted using AES-256 and is only used to fill your application form. We never share or sell your data.",
  },
];

const included = [
  "Sarathi Form 4 filled automatically",
  "RTO slot booked at nearest RTO",
  "Personalised document checklist on WhatsApp",
  "3 reminder messages before test day",
  "Morning-of-test tips message",
  "Post-test insurance upsell (optional)",
];

const notIncluded = [
  "Physical RTO visit (you must appear in person)",
  "RTO government fees (paid separately at RTO)",
  "Driving lessons (book separately on LearnDrive)",
];

export default function DLAssistancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/dl-assistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!data.orderId) throw new Error("Order creation failed");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 49900,
        currency: "INR",
        name: "LearnDrive",
        description: "DL Assistance Service",
        order_id: data.orderId,
        handler: async (response: any) => {
          await fetch("/api/payments/dl-assistance/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          window.location.href = "/dl-assistance/success";
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#f59e0b" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div style={{ fontFamily: "'Georgia', serif", background: "#fafaf8", minHeight: "100vh" }}>

        {/* Nav */}
        <nav style={{ background: "#1a2540", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>Learn</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "white" }}>Drive</span>
          </Link>
          <a href="https://wa.me/918700896528" target="_blank" rel="noopener noreferrer"
            style={{ background: "#25d366", color: "white", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            💬 WhatsApp Us
          </a>
        </nav>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #1a2540 0%, #2d3f6b 100%)", color: "white", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(245,158,11,0.2)", color: "#f59e0b", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20, border: "1px solid rgba(245,158,11,0.3)" }}>
            🇮🇳 Available across 50+ Indian cities
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 20, maxWidth: 700, margin: "0 auto 20px" }}>
            Get Your Driving Licence<br />
            <span style={{ color: "#f59e0b" }}>Without the RTO Confusion</span>
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Our AI assistant fills your forms, books your RTO slot, sends your document checklist, and reminds you till test day. All for ₹499.
          </p>

          {/* Price card */}
          <div style={{ background: "white", borderRadius: 20, padding: "32px", maxWidth: 400, margin: "0 auto", color: "#1a2540", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8, fontFamily: "system-ui" }}>Complete DL Assistance</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 900, color: "#1a2540" }}>₹499</span>
              <span style={{ fontSize: 16, color: "#94a3b8", textDecoration: "line-through", fontFamily: "system-ui" }}>₹999</span>
            </div>
            <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600, marginBottom: 24, fontFamily: "system-ui" }}>50% launch discount — limited time</div>
            <button onClick={handlePayment} disabled={loading}
              style={{ width: "100%", background: "#f59e0b", color: "#1a2540", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, fontFamily: "system-ui" }}>
              {loading ? "Processing..." : "Get Started →"}
            </button>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12, fontFamily: "system-ui" }}>
              🔒 Secure payment via Razorpay · Instant WhatsApp confirmation
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, margin: "40px 0", textAlign: "center" }}>
            {[
              { value: "2,000+", label: "Licences assisted" },
              { value: "96%", label: "Success rate" },
              { value: "50+", label: "Cities covered" },
            ].map((s) => (
              <div key={s.label} style={{ background: "white", borderRadius: 16, padding: "24px 16px", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#1a2540" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, fontFamily: "system-ui" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{ margin: "56px 0" }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1a2540", marginBottom: 8, textAlign: "center" }}>How It Works</h2>
            <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40, fontFamily: "system-ui" }}>6 steps. All handled by AI. You just show up at the RTO.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
              {steps.map((step) => (
                <div key={step.number} style={{ background: "white", borderRadius: 16, padding: "24px", border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{step.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", fontFamily: "system-ui" }}>STEP {step.number}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2540", marginBottom: 8, fontFamily: "system-ui" }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, fontFamily: "system-ui" }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, margin: "56px 0" }}>
            <div style={{ background: "#f0fdf4", borderRadius: 16, padding: "28px", border: "1px solid #bbf7d0" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#166534", marginBottom: 16, fontFamily: "system-ui" }}>✅ What's Included</h3>
              {included.map((item) => (
                <div key={item} style={{ fontSize: 14, color: "#166534", marginBottom: 10, fontFamily: "system-ui" }}>✓ {item}</div>
              ))}
            </div>
            <div style={{ background: "#fef9ec", borderRadius: 16, padding: "28px", border: "1px solid #fde68a" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#92400e", marginBottom: 16, fontFamily: "system-ui" }}>ℹ️ Not Included</h3>
              {notIncluded.map((item) => (
                <div key={item} style={{ fontSize: 14, color: "#92400e", marginBottom: 10, fontFamily: "system-ui" }}>✗ {item}</div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ margin: "56px 0" }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1a2540", marginBottom: 8, textAlign: "center" }}>Frequently Asked Questions</h2>
            <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40, fontFamily: "system-ui" }}>Everything you need to know before getting started.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: "100%", padding: "18px 20px", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#1a2540", fontFamily: "system-ui" }}>{faq.q}</span>
                    <span style={{ fontSize: 18, color: "#f59e0b" }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 20px 18px", fontSize: 14, color: "#64748b", lineHeight: 1.7, fontFamily: "system-ui" }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{ background: "linear-gradient(135deg, #1a2540 0%, #2d3f6b 100%)", borderRadius: 24, padding: "48px 32px", textAlign: "center", color: "white", margin: "56px 0" }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Ready to Get Your Driving Licence?</h2>
            <p style={{ color: "#94a3b8", marginBottom: 32, fontFamily: "system-ui" }}>Join 2,000+ Indians who got their licence hassle-free with LearnDrive.</p>
            <button onClick={handlePayment} disabled={loading}
              style={{ background: "#f59e0b", color: "#1a2540", border: "none", borderRadius: 12, padding: "16px 40px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "system-ui" }}>
              Get Started for ₹499 →
            </button>
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 16, fontFamily: "system-ui" }}>
              Or WhatsApp us: <a href="https://wa.me/918700896528" style={{ color: "#f59e0b" }}>+91 87008 96528</a>
            </p>
          </div>

        </div>

        {/* Footer */}
        <div style={{ background: "#1a2540", color: "#64748b", textAlign: "center", padding: "24px", fontSize: 13, fontFamily: "system-ui" }}>
          © 2025 LearnDrive · <Link href="/privacy" style={{ color: "#64748b" }}>Privacy</Link> · <Link href="/terms" style={{ color: "#64748b" }}>Terms</Link>
        </div>
      </div>
    </>
  );
}