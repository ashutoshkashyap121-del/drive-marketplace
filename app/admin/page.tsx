"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!password) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password. Try again.");
      setLoading(false);
    }
  }

  return (
    <main style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "linear-gradient(145deg, #0B1437 0%, #1A2B5F 60%, #0F3460 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{
        background: "#FFFFFF",
        borderRadius: 24,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 400,
        boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: "1.8rem",
            color: "#0B1437",
            letterSpacing: "-0.5px",
          }}>
            Learn<span style={{ color: "#F59E0B" }}>Drive</span>
          </div>
          <p style={{ color: "#64748B", fontSize: "0.85rem", marginTop: 6 }}>
            Admin Portal
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            display: "block",
            marginBottom: 8,
          }}>
            Admin Password
          </label>
          <input
            type="password"
            placeholder="Enter your admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: `2px solid ${error ? "#FCA5A5" : "#E2E8F0"}`,
              borderRadius: 12,
              fontSize: "0.95rem",
              fontFamily: "inherit",
              color: "#0F172A",
              background: error ? "#FFF5F5" : "#F8FAFC",
              outline: "none",
              transition: "border-color 0.2s",
            }}
          />
          {error && (
            <p style={{ color: "#DC2626", fontSize: "0.8rem", marginTop: 8 }}>
              ❌ {error}
            </p>
          )}
        </div>

        <button
          onClick={handleLogin}
          disabled={!password || loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading || !password
              ? "#E2E8F0"
              : "linear-gradient(135deg, #F59E0B, #D97706)",
            color: loading || !password ? "#94A3B8" : "#FFFFFF",
            fontFamily: "'Sora', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 700,
            border: "none",
            borderRadius: 12,
            cursor: loading || !password ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            boxShadow: loading || !password ? "none" : "0 4px 16px rgba(245,158,11,0.4)",
          }}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#CBD5E1", marginTop: 20 }}>
          🔒 This area is restricted to admins only
        </p>
      </div>
    </main>
  );
}