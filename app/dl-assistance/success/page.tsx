import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Successful — DL Assistance | LearnDrive",
  robots: { index: false },
};

export default function DLAssistanceSuccess() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui" }}>
      <div style={{ background: "white", borderRadius: 24, padding: "48px 32px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a2540", marginBottom: 12 }}>Payment Successful!</h1>
        <p style={{ color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>
          Our AI assistant will WhatsApp you within 5 minutes to collect your details and get started.
        </p>
        <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 16, marginBottom: 28, border: "1px solid #bbf7d0" }}>
          <p style={{ fontSize: 14, color: "#166534", margin: 0 }}>
            📱 Watch for a WhatsApp message from <strong>+91 87008 96528</strong>
          </p>
        </div>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
          Questions? WhatsApp us directly:
        </p>
        <a href="https://wa.me/918700896528" target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", background: "#25d366", color: "white", padding: "12px 28px", borderRadius: 10, fontWeight: 700, textDecoration: "none", marginBottom: 16 }}>
          💬 Open WhatsApp
        </a>
        <br />
        <Link href="/" style={{ fontSize: 13, color: "#94a3b8" }}>← Back to LearnDrive</Link>
      </div>
    </div>
  );
}