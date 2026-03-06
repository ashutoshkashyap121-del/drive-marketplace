import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | LearnDrive",
  description:
    "LearnDrive's refund and cancellation policy — cancel 24 hours before your session for a full refund.",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)", padding: "32px 5%" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Link href="/" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#fff", textDecoration: "none" }}>
            Learn<span style={{ color: "#F59E0B" }}>Drive</span>
          </Link>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "2rem", fontWeight: 800, color: "#fff", marginTop: 24, marginBottom: 4 }}>
            Refund & Cancellation Policy
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", margin: 0 }}>
            Last updated: March 2025
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 5% 80px" }}>

        {/* Quick summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 48 }}>
          {[
            { icon: "✅", label: "Cancel 24hrs before", value: "Full Refund", color: "#DCFCE7", border: "#BBF7D0", text: "#166534" },
            { icon: "⚠️", label: "Same-day cancellation", value: "50% Refund", color: "#FEF3C7", border: "#FDE68A", text: "#92400E" },
            { icon: "❌", label: "Learner no-show", value: "No Refund", color: "#FEE2E2", border: "#FECACA", text: "#991B1B" },
            { icon: "🔁", label: "Trainer no-show", value: "Full Refund", color: "#DCFCE7", border: "#BBF7D0", text: "#166534" },
          ].map((item) => (
            <div key={item.label} style={{ background: item.color, border: `1px solid ${item.border}`, borderRadius: 16, padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: item.text, marginBottom: 4 }}>{item.value}</div>
              <div style={{ fontSize: "0.78rem", color: item.text, opacity: 0.8 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Policy sections */}
        {[
          {
            title: "1. Cancellation by Learner",
            content: [
              "You may cancel your booking directly from your booking confirmation page.",
              "Cancellations made more than 24 hours before the scheduled session are eligible for a 100% refund.",
              "Cancellations made within 24 hours of the session are eligible for a 50% refund.",
              "No refund will be issued for learner no-shows (i.e., if you do not show up at the scheduled location and time without cancelling).",
            ],
          },
          {
            title: "2. Cancellation by Trainer",
            content: [
              "If a trainer cancels or fails to show up for a confirmed session, you will receive a 100% refund.",
              "LearnDrive will notify you via SMS and email immediately upon trainer cancellation.",
              "You may rebook with the same trainer or choose a different trainer at no additional charge.",
            ],
          },
          {
            title: "3. Refund Processing",
            content: [
              "Refunds are processed automatically via Razorpay to your original payment method.",
              "Refunds typically appear within 5–7 business days depending on your bank or card provider.",
              "UPI refunds are usually instant or within 24 hours.",
              "Platform fees (15% of booking amount) are non-refundable in all cases.",
            ],
          },
          {
            title: "4. How to Cancel",
            content: [
              "Visit learndrive.in/cancel and enter your booking ID and registered mobile number.",
              "Confirm your cancellation — refund will be initiated automatically.",
              "You will receive an SMS and email confirmation once the refund is processed.",
              "For issues, contact support@learndrive.in with your booking ID.",
            ],
          },
          {
            title: "5. Disputes",
            content: [
              "If you believe a refund was incorrectly denied, email support@learndrive.in within 7 days of your session date.",
              "Include your booking ID, registered mobile number, and reason for dispute.",
              "LearnDrive will review and respond within 3 business days.",
              "LearnDrive's decision on refund disputes is final.",
            ],
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>
              {section.title}
            </h2>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px" }}>
              {section.content.map((point, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < section.content.length - 1 ? 14 : 0 }}>
                  <span style={{ color: "#F59E0B", fontWeight: 700, marginTop: 1, flexShrink: 0 }}>→</span>
                  <p style={{ margin: 0, fontSize: "0.92rem", color: "#374151", lineHeight: 1.7 }}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div style={{ background: "linear-gradient(135deg, #0B1437, #1A2B5F)", borderRadius: 20, padding: "32px", textAlign: "center", marginTop: 48 }}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", color: "#fff", fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>
            Need help with a refund?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: 24 }}>
            Our support team typically responds within 24 hours.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/cancel" style={{ padding: "12px 24px", background: "#F59E0B", color: "#0F172A", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.9rem", borderRadius: 10, textDecoration: "none" }}>
              Cancel a Booking →
            </a>
            <a href="mailto:support@learndrive.in" style={{ padding: "12px 24px", background: "rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.9rem", borderRadius: 10, textDecoration: "none" }}>
              Email Support
            </a>
          </div>
        </div>

        {/* Footer links */}
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
          {[["Terms of Service", "/terms"], ["Privacy Policy", "/privacy"], ["Home", "/"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: "0.82rem", color: "#94A3B8", textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}