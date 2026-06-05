"use client";

import { useState } from "react";
import Link from "next/link";

type Match = {
  id: number;
  name: string;
  city: string;
  rating: number | null;
  experience: number;
  trainerType: string;
  price: number | null;
  languages: string[];
  vehicleTypes: string[];
  verifiedSchool: boolean;
  matchScore: number;
  reasons: string[];
  aiReason: string | null;
};

const CITIES = [
  "Delhi", "Noida", "Gurugram", "Faridabad", "Ghaziabad",
  "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur",
];
const LANGUAGES = ["Hindi", "English", "Kannada", "Marathi", "Tamil", "Telugu", "Bengali", "Punjabi", "Gujarati"];

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

function scoreColor(s: number) {
  if (s >= 80) return "bg-green-100 text-green-700";
  if (s >= 60) return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700";
}

export default function MatchClient() {
  const [form, setForm] = useState({ city: "", vehicleType: "CAR", language: "", budget: "", goal: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [note, setNote] = useState("");

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.city) {
      setError("Please pick your city.");
      return;
    }
    setStatus("loading");
    setError("");
    setNote("");
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budget: form.budget ? Number(form.budget) : 0 }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(j.error || "Something went wrong.");
        return;
      }
      setMatches(j.matches || []);
      setNote(j.message || "");
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">City *</label>
            <select value={form.city} onChange={set("city")} className={inputCls}>
              <option value="">Select your city…</option>
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">What do you want to learn?</label>
            <select value={form.vehicleType} onChange={set("vehicleType")} className={inputCls}>
              <option value="CAR">Car</option>
              <option value="BIKE_GEARED">Geared bike</option>
              <option value="BIKE_NON_GEARED">Scooter / non-geared</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Preferred language</label>
            <select value={form.language} onChange={set("language")} className={inputCls}>
              <option value="">Any</option>
              {LANGUAGES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Budget (₹, optional)</label>
            <input
              type="number"
              value={form.budget}
              onChange={set("budget")}
              placeholder="e.g. 6000"
              className={inputCls}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Anything specific? (optional)</label>
          <input value={form.goal} onChange={set("goal")} placeholder="e.g. nervous beginner, need automatic car" className={inputCls} />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-5 w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
        >
          {status === "loading" ? "Finding your best matches…" : "Find my trainer"}
        </button>
      </form>

      {status === "done" && (
        <div className="mt-10">
          {matches.length === 0 ? (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
              {note || "No matches found. Try widening your filters."}
            </p>
          ) : (
            <>
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Your top {matches.length} match{matches.length > 1 ? "es" : ""}
              </h2>
              <div className="space-y-4">
                {matches.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900">{m.name}</h3>
                          {m.verifiedSchool && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {m.city} · {m.experience} yrs{m.rating ? ` · ${m.rating.toFixed(1)}★` : ""}
                          {m.price ? ` · from ₹${m.price.toLocaleString("en-IN")}` : ""}
                        </p>
                      </div>
                      <span className={`flex-none rounded-full px-3 py-1 text-sm font-bold ${scoreColor(m.matchScore)}`}>
                        {m.matchScore}% match
                      </span>
                    </div>

                    {m.aiReason && <p className="mt-3 text-sm italic text-gray-700">“{m.aiReason}”</p>}

                    {m.reasons.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.reasons.map((r) => (
                          <span key={r} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/trainers/${m.id}`}
                      className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      View profile &amp; book →
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
