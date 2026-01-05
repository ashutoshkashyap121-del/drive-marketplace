"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = () => {
    if (password !== "admin123") {
      setError("Invalid password");
      return;
    }

    // IMPORTANT: cookie must be readable by middleware
    document.cookie =
      "admin_auth=true; path=/; sameSite=Lax";

    router.replace("/admin/bookings");
  };

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h2>🔐 Admin Login</h2>

      <input
        type="password"
        placeholder="Admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <button onClick={login}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
