import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Successful — Starting Your DL Assistance | LearnDrive",
  robots: { index: false },
};

export default function DLAssistanceSuccess() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui" }}>
      <div style={{ background: "white", borderRadius: 24, padding: "48px 32px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a2540", marginBottom: 12 }}>Payment Successful!</h1>
        <p style={{ color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>
          Your payment of ₹499 is confirmed. Our AI assistant Priya is ready to help you get your driving licence.
        </p>
        <div style={{ background: "#fef9ec", borderRadius: 12, padding: 16, marginBottom: 28, border: "1px solid #fde68a" }}>
          <p style={{ fontSize: 14, color: "#92400e", margin: 0, lineHeight: 1.6 }}>
            💬 Click below to start your application. The whole process takes about <strong>5 minutes</strong>. Priya will guide you step by step.
          </p>
        </div>
        <a href="/dl-assistance/chat" style={{ display: "block", background: "linear-gradient(135deg, #1a2540, #2d3f6b)", color: "white", padding: "16px 28px", borderRadius: 12, fontWeight: 800, textDecoration: "none", fontSize: 16, marginBottom: 16 }}>
          🤖 Start with Priya — AI Assistant →
        </a>
        <Link href="/" style={{ fontSize: 13, color: "#94a3b8" }}>← Back to LearnDrive</Link>
      </div>
    </div>
  );
}