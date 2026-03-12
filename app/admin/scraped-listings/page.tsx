"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ExternalLink, Phone, Globe, MapPin, Star, RefreshCw } from "lucide-react";

interface ScrapedTrainer {
  id: string;
  name: string;
  city: string;
  phone: string;
  rating: number;
  basePrice: number;
  status: string;
  adminNotes: string; // JSON with scraped metadata
  packagesJson: string;
  createdAt: string;
}

interface ScrapedMeta {
  source: string;
  address: string;
  website?: string;
  reviewCount: number;
  photoUrl?: string;
  scrapedAt: string;
  isUnverified: boolean;
  placeId: string;
}

export default function ScrapedListingsPage() {
  const [trainers, setTrainers] = useState<ScrapedTrainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    loadTrainers();
  }, [filter]);

  async function loadTrainers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/scraped-listings?status=${filter}`);
      const data = await res.json();
      setTrainers(data.trainers ?? []);
      setStats(data.stats ?? { pending: 0, approved: 0, rejected: 0 });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: "APPROVED" | "REJECTED") {
    setActionLoading(id);
    await fetch(`/api/admin/scraped-listings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setTrainers((prev) => prev.filter((t) => t.id !== id));
    setStats((s) => ({
      ...s,
      pending: s.pending - 1,
      approved: status === "APPROVED" ? s.approved + 1 : s.approved,
      rejected: status === "REJECTED" ? s.rejected + 1 : s.rejected,
    }));
    setActionLoading(null);
  }

  async function approveAll() {
    if (!confirm(`Approve all ${stats.pending} pending listings?`)) return;
    setLoading(true);
    await fetch(`/api/admin/scraped-listings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bulkApproveAll: true }),
    });
    loadTrainers();
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Scraped Listings</h1>
            <p className="text-[#666] text-sm mt-1">
              Driving schools pulled from Google Maps — review before going live
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadTrainers}
              className="flex items-center gap-1.5 text-sm border border-[#e8e2d9] bg-white rounded-xl px-3 py-2 hover:bg-[#faf7f2]"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            {filter === "PENDING" && stats.pending > 0 && (
              <button
                onClick={approveAll}
                className="flex items-center gap-1.5 text-sm bg-[#2a7a4b] text-white rounded-xl px-4 py-2 hover:bg-[#236640]"
              >
                <CheckCircle size={14} /> Approve All ({stats.pending})
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Pending Review", count: stats.pending, color: "#e8821a", status: "PENDING" },
            { label: "Live on site", count: stats.approved, color: "#2a7a4b", status: "APPROVED" },
            { label: "Rejected", count: stats.rejected, color: "#cc3333", status: "REJECTED" },
          ].map((s) => (
            <button
              key={s.status}
              onClick={() => setFilter(s.status as any)}
              className={`bg-white rounded-2xl border p-4 text-left transition-all ${
                filter === s.status ? "border-[#e8821a] shadow-sm" : "border-[#e8e2d9]"
              }`}
            >
              <div className="text-3xl font-bold" style={{ color: s.color }}>
                {s.count}
              </div>
              <div className="text-[#666] text-sm">{s.label}</div>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-16 text-[#888]">Loading...</div>
        ) : trainers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e8e2d9] text-[#888]">
            No {filter.toLowerCase()} listings
          </div>
        ) : (
          <div className="space-y-3">
            {trainers.map((trainer) => {
              let meta: ScrapedMeta | null = null;
              try { meta = JSON.parse(trainer.adminNotes); } catch {}
              let packages: any[] = [];
              try { packages = JSON.parse(trainer.packagesJson); } catch {}

              return (
                <div
                  key={trainer.id}
                  className="bg-white rounded-2xl border border-[#e8e2d9] p-5 flex gap-4"
                >
                  {/* Photo */}
                  {meta?.photoUrl ? (
                    <img
                      src={meta.photoUrl}
                      alt={trainer.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#e8e2d9]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#f5f0e8] flex items-center justify-center shrink-0 text-2xl">
                      🚗
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-[#1a1a2e]">{trainer.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#666] mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {trainer.city}
                          </span>
                          {trainer.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star size={11} className="text-[#e8821a]" />
                              {trainer.rating.toFixed(1)}
                              {meta?.reviewCount ? ` (${meta.reviewCount} reviews)` : ""}
                            </span>
                          )}
                          {trainer.phone && trainer.phone !== "0000000000" && (
                            <span className="flex items-center gap-1">
                              <Phone size={11} /> {trainer.phone}
                            </span>
                          )}
                        </div>
                        {meta?.address && (
                          <p className="text-xs text-[#888] mt-1 truncate max-w-xl">{meta.address}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <div className="text-[#e8821a] font-bold text-lg">
                          ₹{trainer.basePrice.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[#aaa] text-xs">incl. ₹500 platform fee</div>
                      </div>
                    </div>

                    {/* Packages preview */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {packages.slice(0, 3).map((p, i) => (
                        <span
                          key={i}
                          className="text-xs bg-[#f5f0e8] text-[#555] border border-[#e8e2d9] rounded-full px-2.5 py-0.5"
                        >
                          {p.name} · ₹{p.price?.toLocaleString("en-IN")}
                        </span>
                      ))}
                    </div>

                    {/* Links + actions */}
                    <div className="flex items-center gap-3 mt-3">
                      {meta?.website && (
                        <a
                          href={meta.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[#2a7a4b] hover:underline"
                        >
                          <Globe size={11} /> Website
                        </a>
                      )}
                      {meta?.placeId && (
                        <a
                          href={`https://maps.google.com/?cid=${meta.placeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-[#2a7a4b] hover:underline"
                        >
                          <ExternalLink size={11} /> Google Maps
                        </a>
                      )}

                      {filter === "PENDING" && (
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => updateStatus(trainer.id, "REJECTED")}
                            disabled={actionLoading === trainer.id}
                            className="flex items-center gap-1.5 text-xs text-[#cc3333] border border-[#f5c2c2] rounded-xl px-3 py-1.5 hover:bg-[#fff5f5]"
                          >
                            <XCircle size={13} /> Reject
                          </button>
                          <button
                            onClick={() => updateStatus(trainer.id, "APPROVED")}
                            disabled={actionLoading === trainer.id}
                            className="flex items-center gap-1.5 text-xs bg-[#2a7a4b] text-white rounded-xl px-3 py-1.5 hover:bg-[#236640]"
                          >
                            <CheckCircle size={13} /> Approve → Go Live
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}