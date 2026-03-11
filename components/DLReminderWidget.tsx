"use client";
// components/DLReminderWidget.tsx
// Location: components/DLReminderWidget.tsx

import { useState } from "react";

export default function DLReminderWidget() {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean; message?: string; expired?: boolean; error?: string;
  } | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const daysLeft = expiryDate
    ? Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handleSubmit = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setResult({ error: "Enter a valid 10-digit mobile number" });
      return;
    }
    if (!expiryDate) {
      setResult({ error: "Please select your DL expiry date" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/dl-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, name, dlExpiryDate: expiryDate }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (result?.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-bold text-green-800 text-lg">Reminder Set!</p>
        <p className="text-green-700 text-sm mt-2">{result.message}</p>
        {daysLeft !== null && daysLeft <= 60 && (
          <a
            href="/dl-assistance"
            className="mt-4 inline-flex items-center gap-2 bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-amber-600 transition-colors"
          >
            Get DL Assistance Now — ₹499 →
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 text-white">
      <div className="flex items-start gap-3 mb-5">
        <span className="text-3xl">🔔</span>
        <div>
          <h3 className="font-bold text-lg leading-tight">Get Free DL Expiry Reminders</h3>
          <p className="text-blue-200 text-sm mt-1">
            We&apos;ll SMS you 60, 30, and 7 days before your DL expires — so you never pay a fine.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 text-sm focus:outline-none focus:border-yellow-400"
        />

        <input
          type="tel"
          placeholder="Mobile number (10 digits)"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
          inputMode="numeric"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 text-sm focus:outline-none focus:border-yellow-400"
        />

        <div>
          <label className="text-xs text-blue-300 mb-1 block">Your DL expiry date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>

        {daysLeft !== null && (
          <div className={`text-xs px-3 py-2 rounded-lg font-semibold ${
            daysLeft <= 0 ? "bg-red-500/20 text-red-200" :
            daysLeft <= 30 ? "bg-red-500/20 text-red-200" :
            daysLeft <= 60 ? "bg-amber-500/20 text-amber-200" :
            "bg-green-500/20 text-green-200"
          }`}>
            {daysLeft <= 0
              ? "🚨 Your DL has already expired — renew immediately"
              : daysLeft <= 30
              ? `⚠️ Only ${daysLeft} days left — start renewal now`
              : daysLeft <= 60
              ? `⏳ ${daysLeft} days left — good time to start renewal`
              : `✅ ${daysLeft} days left — we'll remind you when it's time`}
          </div>
        )}

        {result?.error && (
          <p className="text-red-300 text-xs">⚠ {result.error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-yellow-400 text-blue-900 font-bold rounded-xl text-sm hover:bg-yellow-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Setting reminder..." : "Remind Me Before Expiry →"}
        </button>

        {daysLeft !== null && daysLeft <= 60 && daysLeft > 0 && (
          <a
            href="/dl-assistance"
            className="block text-center py-2.5 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors"
          >
            Or let us handle your renewal for ₹499 →
          </a>
        )}

        {daysLeft !== null && daysLeft <= 0 && (
          <a
            href="/dl-assistance"
            className="block text-center py-2.5 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-colors"
          >
            🚨 DL Expired — Get Help Now for ₹499 →
          </a>
        )}
      </div>

      <p className="text-blue-300 text-xs mt-4 text-center">
        Free · No spam · Only DL reminders
      </p>
    </div>
  );
}