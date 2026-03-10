"use client";

import { useState } from "react";

type Trainer = {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number | null;
  reviewCount: number;
  status: "not_contacted" | "contacted" | "interested" | "registered";
};

type OutreachStatus = "not_contacted" | "contacted" | "interested" | "registered";

const STATUS_CONFIG: Record<OutreachStatus, { label: string; color: string }> = {
  not_contacted: { label: "Not Contacted", color: "bg-gray-100 text-gray-600" },
  contacted: { label: "Contacted", color: "bg-blue-100 text-blue-700" },
  interested: { label: "Interested ✓", color: "bg-yellow-100 text-yellow-700" },
  registered: { label: "Registered 🎉", color: "bg-green-100 text-green-700" },
};

const INDIAN_CITIES = [
  "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune",
  "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad",
  "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan",
  "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar",
  "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
  "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Chandigarh",
  "Guwahati", "Solapur", "Hubli", "Mysuru", "Tiruchirappalli", "Dehradun", "Kochi",
];

function generateMessage(trainerName: string, city: string, lang: "en" | "hi"): string {
  if (lang === "hi") {
    return `नमस्ते ${trainerName}! मैं LearnDrive से हूँ। हमारे पास ${city} में driving lessons के लिए students हैं। आप हमारे साथ जुड़कर हर महीने 10-15 extra students पा सकते हैं। कोई joining fee नहीं, आप 85% fee रखते हैं। Register करें: learndrive.in/trainers/register`;
  }
  return `Hi ${trainerName}! I'm from LearnDrive. We have students in ${city} looking for driving lessons. Join us and get 10-15 extra students/month. No joining fee — you keep 85% of every booking. Register free: learndrive.in/trainers/register`;
}

export default function TrainerOutreachPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [msgLang, setMsgLang] = useState<"en" | "hi">("en");
  const [customMessage, setCustomMessage] = useState("");
  const [useCustomMessage, setUseCustomMessage] = useState(false);
  const [sending, setSending] = useState(false);
  const [smsResult, setSmsResult] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "message">("search");

  const selectedCity = customCity.trim() || city;

  const authenticate = () => {
    if (adminSecret.trim()) setIsAuthenticated(true);
  };

  const handleSearch = async () => {
    if (!selectedCity) return;
    setSearching(true);
    setSearchError("");
    setTrainers([]);
    setSelectedIds(new Set());

    try {
      const res = await fetch("/api/trainer-outreach/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: selectedCity }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSearchError(data.error || "Search failed");
        return;
      }
      setTrainers(data.results || []);
    } catch {
      setSearchError("Network error. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === trainers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(trainers.map((t) => t.id)));
    }
  };

  const updateStatus = (id: string, status: OutreachStatus) => {
    setTrainers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const copyMessage = (trainer: Trainer) => {
    const msg = useCustomMessage
      ? customMessage
      : generateMessage(trainer.name, selectedCity, msgLang);
    navigator.clipboard.writeText(msg);
  };

  const getSelectedTrainers = () => trainers.filter((t) => selectedIds.has(t.id));

  const handleBulkSMS = async () => {
    const selected = getSelectedTrainers().filter((t) => t.phone);
    if (selected.length === 0) {
      setSmsResult("⚠️ No selected trainers have phone numbers.");
      return;
    }

    if (
      !confirm(
        `Send SMS to ${selected.length} trainers in ${selectedCity}? This will use your Fast2SMS credits.`
      )
    )
      return;

    setSending(true);
    setSmsResult("");

    try {
      const numbers = selected.map((t) => t.phone);
      const message = useCustomMessage
        ? customMessage
        : generateMessage("", selectedCity, msgLang).replace("Hi !", "Hi!").replace("नमस्ते !", "नमस्ते!");

      const res = await fetch("/api/trainer-outreach/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ numbers, message }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setSmsResult(`❌ Failed: ${data.error}`);
        return;
      }

      setSmsResult(`✅ SMS sent to ${data.sent} trainers successfully!`);
      // Mark all sent as contacted
      selected.forEach((t) => updateStatus(t.id, "contacted"));
      setSelectedIds(new Set());
    } catch {
      setSmsResult("❌ Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSaveToDb = async () => {
    const withPhone = trainers.filter((t) => t.phone);
    if (withPhone.length === 0) {
      setSaveResult("⚠️ No trainers with phone numbers to save.");
      return;
    }
    setSaving(true);
    setSaveResult("");
    try {
      const res = await fetch("/api/trainer-outreach/save-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          leads: withPhone.map((t) => ({
            name: t.name,
            phone: t.phone,
            city: selectedCity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSaveResult(`❌ Failed: ${data.error}`);
        return;
      }
      setSaveResult(`✅ Saved ${data.saved} new leads to DB (${data.skipped} already existed). Now go to /admin/ai-ops to bulk send!`);
    } catch {
      setSaveResult("❌ Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: trainers.length,
    withPhone: trainers.filter((t) => t.phone).length,
    contacted: trainers.filter((t) => t.status === "contacted").length,
    interested: trainers.filter((t) => t.status === "interested").length,
    registered: trainers.filter((t) => t.status === "registered").length,
  };

  // ── Auth Screen ─────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm">
          <h1 className="text-white font-bold text-xl mb-1">LearnDrive Admin</h1>
          <p className="text-gray-400 text-sm mb-6">Trainer Outreach Dashboard</p>
          <input
            type="password"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && authenticate()}
            placeholder="Enter admin secret"
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 mb-4"
          />
          <button
            onClick={authenticate}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // ── Main UI ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1a2540] text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">🎯 Trainer Outreach</h1>
          <p className="text-gray-400 text-xs">Find and contact driving schools city by city</p>
        </div>
        <div className="flex gap-2">
          {["search", "message"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "search" ? "Find Schools" : "Message Templates"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ── SEARCH TAB ── */}
        {activeTab === "search" && (
          <div className="space-y-5">
            {/* City Selector */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4">Search Driving Schools</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {INDIAN_CITIES.slice(0, 20).map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCity(c); setCustomCity(""); }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      city === c && !customCity
                        ? "bg-[#1a2540] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => { setCustomCity(e.target.value); setCity(""); }}
                  placeholder="Or type any city..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || !selectedCity}
                  className="px-6 py-3 bg-[#1a2540] text-white font-bold rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {searching ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    "🔍 Find Schools"
                  )}
                </button>
              </div>
              {searchError && (
                <p className="text-red-500 text-sm mt-3">⚠️ {searchError}</p>
              )}
            </div>

            {/* Stats */}
            {trainers.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "Found", value: stats.total, color: "text-gray-900" },
                  { label: "With Phone", value: stats.withPhone, color: "text-blue-700" },
                  { label: "Contacted", value: stats.contacted, color: "text-blue-600" },
                  { label: "Interested", value: stats.interested, color: "text-yellow-600" },
                  { label: "Registered", value: stats.registered, color: "text-green-600" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* SMS Result */}
            {smsResult && (
              <div className={`rounded-xl p-4 text-sm font-medium ${smsResult.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {smsResult}
              </div>
            )}

            {/* Save Result */}
            {saveResult && (
              <div className={`rounded-xl p-4 text-sm font-medium ${saveResult.startsWith("✅") ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {saveResult}
              </div>
            )}

            {/* Trainer List */}
            {trainers.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Table Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === trainers.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {selectedIds.size > 0 ? `${selectedIds.size} selected` : `${trainers.length} schools found in ${selectedCity}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Language toggle */}
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
                      <button
                        onClick={() => setMsgLang("en")}
                        className={`px-3 py-1.5 font-medium ${msgLang === "en" ? "bg-[#1a2540] text-white" : "text-gray-600"}`}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => setMsgLang("hi")}
                        className={`px-3 py-1.5 font-medium ${msgLang === "hi" ? "bg-[#1a2540] text-white" : "text-gray-600"}`}
                      >
                        HI
                      </button>
                    </div>
                    {selectedIds.size > 0 && (
                      <button
                        onClick={handleBulkSMS}
                        disabled={sending}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {sending ? "Sending..." : `📱 Send SMS (${selectedIds.size})`}
                      </button>
                    )}
                    {trainers.length > 0 && (
                      <button
                        onClick={handleSaveToDb}
                        disabled={saving}
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        title="Save all found schools to OutreachLead DB so ai-ops can bulk-send automatically"
                      >
                        {saving ? "Saving..." : `💾 Save to DB (${trainers.filter(t => t.phone).length})`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Trainer rows */}
                <div className="divide-y divide-gray-50">
                  {trainers.map((trainer) => (
                    <div
                      key={trainer.id}
                      className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                        selectedIds.has(trainer.id) ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.has(trainer.id)}
                        onChange={() => toggleSelect(trainer.id)}
                        className="w-4 h-4 rounded mt-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{trainer.name}</p>
                            <p className="text-gray-400 text-xs mt-0.5 truncate max-w-xs">{trainer.address}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {trainer.rating && (
                              <span className="text-xs text-gray-500">⭐ {trainer.rating} ({trainer.reviewCount})</span>
                            )}
                            <select
                              value={trainer.status}
                              onChange={(e) => updateStatus(trainer.id, e.target.value as OutreachStatus)}
                              className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${STATUS_CONFIG[trainer.status].color}`}
                            >
                              {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                                <option key={val} value={val}>{cfg.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          {trainer.phone ? (
                            <span className="text-sm font-mono text-gray-700">{trainer.phone}</span>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No phone listed</span>
                          )}
                          {trainer.phone && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => copyMessage(trainer)}
                                className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Copy Message
                              </button>
                              <a
                                href={`https://wa.me/91${trainer.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(generateMessage(trainer.name, selectedCity, msgLang))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                              >
                                WhatsApp
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MESSAGE TEMPLATES TAB ── */}
        {activeTab === "message" && (
          <div className="space-y-5 max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Message Templates</h2>

              {/* Language toggle */}
              <div className="flex rounded-xl border border-gray-200 overflow-hidden w-fit mb-6">
                <button onClick={() => setMsgLang("en")} className={`px-6 py-2 font-semibold text-sm ${msgLang === "en" ? "bg-[#1a2540] text-white" : "text-gray-600"}`}>English</button>
                <button onClick={() => setMsgLang("hi")} className={`px-6 py-2 font-semibold text-sm ${msgLang === "hi" ? "bg-[#1a2540] text-white" : "text-gray-600"}`}>हिन्दी</button>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Preview</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {generateMessage("[Trainer Name]", "[City]", msgLang)}
                </p>
              </div>

              <div className="text-xs text-gray-400 mb-6 space-y-1">
                <p>✅ Personalised with trainer name and city</p>
                <p>✅ Includes registration link</p>
                <p>✅ No joining fee pitch — reduces friction</p>
                <p>✅ 85% revenue share as the hook</p>
              </div>

              {/* Custom message */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="customMsg"
                    checked={useCustomMessage}
                    onChange={(e) => setUseCustomMessage(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="customMsg" className="text-sm font-medium text-gray-700">Use custom message instead</label>
                </div>
                {useCustomMessage && (
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Write your custom message here..."
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 text-sm resize-none"
                  />
                )}
              </div>
            </div>

            {/* WhatsApp tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <h3 className="font-bold text-blue-900 mb-3">💡 Outreach Tips</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• WhatsApp gets 5× better response than SMS — use WhatsApp first</p>
                <p>• Best time to message: 10 AM–12 PM on weekdays</p>
                <p>• Follow up after 3 days if no response</p>
                <p>• Schools with 4+ stars and 50+ reviews are best quality trainers</p>
                <p>• If phone number is missing, search Google Maps manually for the school</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}