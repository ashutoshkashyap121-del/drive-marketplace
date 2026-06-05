"use client";

import { useState } from "react";

type FormState = {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  teamSize: string;
  message: string;
  website: string; // honeypot
};

const EMPTY: FormState = {
  company: "",
  contactName: "",
  email: "",
  phone: "",
  city: "",
  teamSize: "",
  message: "",
  website: "",
};

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

export default function CorporateForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/corporate-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) setStatus("done");
      else {
        setStatus("error");
        setError(j.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-3 text-4xl">✅</div>
        <h3 className="text-xl font-bold text-green-800">Thanks — we&apos;ll be in touch!</h3>
        <p className="mt-2 text-green-700">
          Our corporate team will reach out within 1 business day to plan training for{" "}
          {form.company || "your team"}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Honeypot — hidden from users, bots tend to fill it */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={set("website")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Company name *</label>
          <input value={form.company} onChange={set("company")} placeholder="Acme Logistics Pvt Ltd" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Your name *</label>
          <input value={form.contactName} onChange={set("contactName")} placeholder="Full name" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Work email</label>
          <input type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Phone *</label>
          <input value={form.phone} onChange={set("phone")} placeholder="10-digit mobile" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
          <input value={form.city} onChange={set("city")} placeholder="Delhi / Mumbai / Bangalore" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">People to train</label>
          <select value={form.teamSize} onChange={set("teamSize")} className={inputCls}>
            <option value="">Select…</option>
            <option>1–10</option>
            <option>11–50</option>
            <option>51–200</option>
            <option>200+</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">What do you need? (optional)</label>
        <textarea
          value={form.message}
          onChange={set("message")}
          rows={4}
          placeholder="e.g. defensive-driving for 40 delivery riders in Pune, on-site, within a month."
          className={inputCls}
        />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Request a corporate quote"}
      </button>
      <p className="text-xs text-gray-500">We&apos;ll respond within 1 business day. No spam.</p>
    </form>
  );
}
