"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { rtoData, states, searchRTOs, type RTO } from "@/lib/rto-data";

function RTOCard({ rto }: { rto: RTO }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-blue-700 font-bold text-xs">{rto.code}</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">{rto.name}</p>
            <p className="text-gray-400 text-xs mt-0.5">{rto.city}, {rto.state}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2.5">
        <div className="flex gap-2.5">
          <span className="text-gray-400 text-sm flex-shrink-0 mt-0.5">📍</span>
          <p className="text-gray-600 text-sm leading-relaxed">{rto.address}</p>
        </div>
        <div className="flex gap-2.5">
          <span className="text-gray-400 text-sm flex-shrink-0">📞</span>
          <a href={`tel:${rto.phone}`} className="text-gray-600 text-sm hover:text-blue-600">
            {rto.phone}
          </a>
        </div>
        <div className="flex gap-2.5">
          <span className="text-gray-400 text-sm flex-shrink-0">🕐</span>
          <p className="text-gray-600 text-sm">{rto.timing}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <a
          href={rto.parivahan}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-800 transition-colors"
        >
          Book Slot Online
        </a>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(rto.name + " " + rto.city)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-base"
          title="Open in Google Maps"
        >
          🗺️
        </a>
      </div>
    </div>
  );
}

export default function RTOFinderPage() {
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States");

  const results = useMemo(
    () => searchRTOs(query, selectedState),
    [query, selectedState]
  );

  // Group results by state for display
  const grouped = useMemo(() => {
    const map: Record<string, RTO[]> = {};
    results.forEach((rto) => {
      if (!map[rto.state]) map[rto.state] = [];
      map[rto.state].push(rto);
    });
    return map;
  }, [results]);

  const groupedStates = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm font-medium mb-5">
            🏛️ {rtoData.length} RTOs across India
          </div>
          <h1 className="text-4xl font-bold">
            RTO Office Finder
          </h1>
          <p className="text-blue-100 mt-3 text-lg max-w-xl mx-auto">
            Find any RTO office in India — address, phone, timings, and direct link to book your slot online
          </p>

          {/* Search */}
          <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, RTO name or code..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-gray-800 bg-white border-0 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
              />
            </div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="py-3.5 px-4 rounded-xl text-gray-800 bg-white border-0 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm font-medium min-w-[160px]"
            >
              <option>All States</option>
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Quick city pills */}
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            {["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata"].map((city) => (
              <button
                key={city}
                onClick={() => { setQuery(city); setSelectedState("All States"); }}
                className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-full transition-colors border border-white/20"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            {results.length === rtoData.length
              ? `Showing all ${rtoData.length} RTOs`
              : `${results.length} RTO${results.length !== 1 ? "s" : ""} found`}
            {selectedState !== "All States" ? ` in ${selectedState}` : ""}
            {query ? ` for "${query}"` : ""}
          </p>
          {(query || selectedState !== "All States") && (
            <button
              onClick={() => { setQuery(""); setSelectedState("All States"); }}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* No results */}
        {results.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-700 font-semibold text-lg">No RTOs found</p>
            <p className="text-gray-500 text-sm mt-2">Try searching by city name or state</p>
            <button
              onClick={() => { setQuery(""); setSelectedState("All States"); }}
              className="mt-4 text-blue-600 font-medium text-sm"
            >
              Show all RTOs
            </button>
          </div>
        )}

        {/* Grouped results */}
        {groupedStates.map((state) => (
          <div key={state} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-gray-900">{state}</h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                {grouped[state].length} office{grouped[state].length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {grouped[state].map((rto) => (
                <RTOCard key={rto.code} rto={rto} />
              ))}
            </div>
          </div>
        ))}

        {/* Info section */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 text-lg mb-3">📋 What to Carry to the RTO</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <p className="font-semibold mb-2">For Learner's Licence:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Aadhaar card (original)</li>
                <li>• Age proof (if not Aadhaar)</li>
                <li>• Passport photos (4–6)</li>
                <li>• Application acknowledgement</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">For Driving Licence Test:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Original LL (30+ days old)</li>
                <li>• Application Form 4</li>
                <li>• Aadhaar card (original)</li>
                <li>• Fee payment receipt</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Useful links */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            { icon: "📅", label: "Book RTO Slot Online", href: "/blog/how-to-book-rto-slot-online-india", desc: "Step-by-step Parivahan guide" },
            { icon: "📝", label: "Documents Checklist", href: "/blog/rto-documents-complete-checklist-2025", desc: "All RTO docs in one place" },
            { icon: "🎯", label: "Free RTO Mock Test", href: "/rto-test/practice", desc: "Practice before your test" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-100 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{item.icon}</span>
              <p className="font-semibold text-gray-900 text-sm mt-2">{item.label}</p>
              <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-8 text-white text-center">
          <p className="text-2xl font-bold">Find a Driving Trainer Near You</p>
          <p className="text-orange-100 mt-2 text-sm">
            Certified trainers in Delhi, Mumbai, Bangalore, Hyderabad, Pune and 24 cities
          </p>
          <Link
            href="/trainers"
            className="mt-5 inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors"
          >
            Browse Trainers →
          </Link>
        </div>
      </div>
    </div>
  );
}
