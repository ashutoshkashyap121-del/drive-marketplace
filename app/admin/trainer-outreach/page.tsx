"use client";

import { useMemo, useState } from "react";

type Trainer = {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number | null;
  reviewCount: number;
  status: "not_contacted" | "contacted" | "interested" | "registered";
};

const INDIAN_CITIES = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
  "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad", "Ludhiana",
  "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Amritsar",
  "Ranchi", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur",
  "Madurai", "Raipur", "Chandigarh", "Guwahati", "Mysuru", "Dehradun", "Kochi",
];

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function generateMessage(name: string, city: string, lang: "en" | "hi"): string {
  if (lang === "hi") {
    return `नमस्ते ${name}! LearnDrive पर ${city} में driving lessons के लिए students उपलब्ध हैं. बिना joining fee के register करें: learndrive.in/trainers/register`;
  }
  return `Hi ${name}! LearnDrive has students in ${city} looking for driving lessons. Register free and keep 85% of every booking: learndrive.in/trainers/register`;
}

export default function TrainerOutreachPage() {
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [msgLang, setMsgLang] = useState<"en" | "hi">("en");
  const [customMessage, setCustomMessage] = useState("");
  const [useCustomMessage, setUseCustomMessage] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [smsResult, setSmsResult] = useState("");
  const [saveResult, setSaveResult] = useState("");

  const selectedCity = customCity.trim() || city;

  const selectedTrainers = useMemo(
    () => trainers.filter((trainer) => selectedIds.has(trainer.id)),
    [selectedIds, trainers],
  );

  async function handleSearch() {
    if (!selectedCity) return;
    setSearching(true);
    setSearchError("");
    setSmsResult("");
    setSaveResult("");
    setSelectedIds(new Set());

    try {
      const res = await fetch("/api/trainer-outreach/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
        body: JSON.stringify({ city: selectedCity }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSearchError(data.error || "Search failed");
        setTrainers([]);
        return;
      }
      setTrainers(data.results || []);
    } catch {
      setSearchError("Network error. Please try again.");
      setTrainers([]);
    } finally {
      setSearching(false);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === trainers.length) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(trainers.map((trainer) => trainer.id)));
  }

  function markSelected(status: Trainer["status"]) {
    const selected = new Set(selectedIds);
    setTrainers((prev) => prev.map((trainer) => (
      selected.has(trainer.id) ? { ...trainer, status } : trainer
    )));
  }

  async function handleBulkSMS() {
    const targets = selectedTrainers.filter((trainer) => trainer.phone);
    if (targets.length === 0) {
      setSmsResult("No selected trainers have phone numbers.");
      return;
    }

    setSending(true);
    setSmsResult("");

    try {
      const message = useCustomMessage
        ? customMessage
        : generateMessage("", selectedCity, msgLang).replace("Hi !", "Hi!").replace("नमस्ते !", "नमस्ते!");

      const res = await fetch("/api/trainer-outreach/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
        body: JSON.stringify({
          numbers: targets.map((trainer) => trainer.phone),
          message,
        }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setSmsResult(data.error || "SMS sending failed.");
        return;
      }

      setSmsResult(`SMS sent to ${data.sent} trainers.`);
      markSelected("contacted");
      setSelectedIds(new Set());
    } catch {
      setSmsResult("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function handleSaveToDb() {
    const leads = trainers
      .filter((trainer) => trainer.phone)
      .map((trainer) => ({
        name: trainer.name,
        phone: trainer.phone,
        city: selectedCity,
      }));

    if (leads.length === 0) {
      setSaveResult("No trainers with phone numbers to save.");
      return;
    }

    setSaving(true);
    setSaveResult("");

    try {
      const res = await fetch("/api/trainer-outreach/save-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
        body: JSON.stringify({ leads }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setSaveResult(data.error || "Saving leads failed.");
        return;
      }

      setSaveResult(`Saved ${data.saved} leads. Skipped ${data.skipped}.`);
    } catch {
      setSaveResult("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const stats = {
    total: trainers.length,
    withPhone: trainers.filter((trainer) => trainer.phone).length,
    selected: selectedIds.size,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Trainer Outreach</h1>
            <p className="text-sm text-slate-500">Search city-level trainer leads, save them, and send outreach safely from the admin session.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="text-slate-500">Results</div>
              <div className="mt-1 text-xl font-bold text-slate-900">{stats.total}</div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="text-slate-500">With Phone</div>
              <div className="mt-1 text-xl font-bold text-slate-900">{stats.withPhone}</div>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="text-slate-500">Selected</div>
              <div className="mt-1 text-xl font-bold text-slate-900">{stats.selected}</div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select a city</option>
              {INDIAN_CITIES.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <input
              value={customCity}
              onChange={(event) => setCustomCity(event.target.value)}
              placeholder="Or type a city manually"
              className="rounded-xl border border-slate-300 px-4 py-3"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !selectedCity}
              className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
          {searchError && <p className="mt-3 text-sm text-red-600">{searchError}</p>}
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Results</h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={toggleSelectAll} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
                  {selectedIds.size === trainers.length && trainers.length > 0 ? "Clear selection" : "Select all"}
                </button>
                <button onClick={() => markSelected("interested")} disabled={selectedIds.size === 0} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400">
                  Mark interested
                </button>
                <button onClick={() => markSelected("registered")} disabled={selectedIds.size === 0} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400">
                  Mark registered
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {trainers.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
                  Search a city to load trainer leads.
                </div>
              )}

              {trainers.map((trainer) => {
                const msg = encodeURIComponent(
                  useCustomMessage && customMessage
                    ? customMessage
                    : generateMessage(trainer.name, selectedCity, msgLang)
                );
                const waUrl = trainer.phone
                  ? `https://wa.me/91${trainer.phone.replace(/\D/g, "").slice(-10)}?text=${msg}`
                  : null;
                return (
                  <div key={trainer.id} className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(trainer.id)}
                      onChange={() => toggleSelect(trainer.id)}
                      className="mt-1 h-4 w-4 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-semibold text-slate-900">{trainer.name}</div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{trainer.status}</span>
                      </div>
                      <div className="mt-1 text-sm text-slate-600 truncate">{trainer.address}</div>
                      <div className="mt-1 text-sm text-slate-500">{trainer.phone || "No phone"}{trainer.rating ? ` • ${trainer.rating} (${trainer.reviewCount})` : ""}</div>
                    </div>
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setTrainers((prev) => prev.map((t) =>
                            t.id === trainer.id ? { ...t, status: "contacted" } : t
                          ));
                        }}
                        className="flex-shrink-0 rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white hover:bg-green-600"
                      >
                        WA
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Message</h2>
              <div className="mb-3 flex gap-2">
                <button
                  onClick={() => setMsgLang("en")}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${msgLang === "en" ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700"}`}
                >
                  English
                </button>
                <button
                  onClick={() => setMsgLang("hi")}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${msgLang === "hi" ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700"}`}
                >
                  Hindi
                </button>
              </div>
              <label className="mb-3 flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={useCustomMessage}
                  onChange={(event) => setUseCustomMessage(event.target.checked)}
                />
                Use custom message
              </label>
              <textarea
                rows={8}
                value={useCustomMessage ? customMessage : generateMessage("[Trainer Name]", selectedCity || "[City]", msgLang)}
                onChange={(event) => setCustomMessage(event.target.value)}
                disabled={!useCustomMessage}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 disabled:bg-slate-100"
              />
              <button
                onClick={handleBulkSMS}
                disabled={sending || selectedIds.size === 0}
                className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {sending ? "Sending..." : `Send SMS to ${selectedIds.size} selected`}
              </button>
              {smsResult && <p className="mt-3 text-sm text-slate-600">{smsResult}</p>}
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Save Leads</h2>
              <p className="text-sm text-slate-600">Save the current search results into outreach leads for bulk follow-up in AI Ops.</p>
              <button
                onClick={handleSaveToDb}
                disabled={saving || trainers.length === 0}
                className="mt-4 w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:bg-amber-200"
              >
                {saving ? "Saving..." : "Save Current Leads"}
              </button>
              {saveResult && <p className="mt-3 text-sm text-slate-600">{saveResult}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
