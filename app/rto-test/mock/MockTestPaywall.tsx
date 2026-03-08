"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MockTestPaywall() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order
      const orderRes = await fetch("/api/rto-test/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 4900 }),
      });
      const { orderId, error } = await orderRes.json();
      if (!orderId) throw new Error(error || "Order creation failed");

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 4900,
        currency: "INR",
        name: "LearnDrive",
        description: "RTO Full Mock Test — Unlimited Retakes",
        order_id: orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 3. Verify server-side → sets httpOnly cookie
            const verifyRes = await fetch("/api/rto-test/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const data = await verifyRes.json();
            if (data.success) {
              // 4. Hard navigate so server component re-reads cookie
              router.refresh();
            } else {
              alert("Payment verification failed. Please contact support@learndrive.in");
            }
          } catch {
            alert("Something went wrong. Please contact support@learndrive.in");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#1d4ed8" },
      };

      const rzp = new (window as unknown as {
        Razorpay: new (opts: typeof options) => { open(): void };
      }).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#f0f4ff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .jk { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
      `}</style>

      <header style={{ background: "#0f172a", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="jk" style={{ color: "white", fontSize: 18, fontWeight: 800 }}>LearnDrive</span>
          </Link>
          <Link href="/rto-test" className="jk" style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none" }}>← Back to RTO Test</Link>
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", borderRadius: 20, padding: "48px 40px", marginBottom: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏛️</div>
          <h1 className="jk" style={{ color: "white", fontSize: 32, fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px" }}>
            Full RTO Mock Test
          </h1>
          <p className="jk" style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            30 questions · 30 minutes · Just like the real RTO exam
          </p>

          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 24, marginBottom: 28, textAlign: "left" }}>
            {[
              "30 questions across all 6 RTO topics",
              "Real 30-minute countdown timer",
              "Road sign image questions",
              "Full score report with topic-wise breakdown",
              "Instant explanations for every answer",
              "Unlimited retakes — same payment (7 days)",
            ].map((item) => (
              <div key={item} className="jk" style={{ fontSize: 14, color: "#e2e8f0", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#4ade80", fontWeight: 800 }}>✓</span>
                {item}
              </div>
            ))}
          </div>

          <div className="jk" style={{ fontSize: 48, fontWeight: 900, color: "white", marginBottom: 4 }}>₹49</div>
          <div className="jk" style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>One-time · Unlimited retakes for 7 days</div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="jk"
            style={{
              width: "100%", padding: "16px",
              background: loading ? "#475569" : "linear-gradient(135deg, #1d4ed8, #7c3aed)",
              color: "white", border: "none", borderRadius: 12,
              fontSize: 17, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s",
            }}
          >
            {loading ? "⏳ Processing..." : "Pay ₹49 & Start Test →"}
          </button>

          <p className="jk" style={{ color: "#475569", fontSize: 12, marginTop: 12 }}>
            🔒 Secure payment via Razorpay · UPI, cards, net banking
          </p>
        </div>

        <Link href="/rto-test/practice" className="jk" style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: 600, fontSize: 15 }}>
          ← Practice for free first
        </Link>
      </div>
    </main>
  );
}