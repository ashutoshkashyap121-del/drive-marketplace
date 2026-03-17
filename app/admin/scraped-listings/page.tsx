"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ExternalLink, Phone, Globe, MapPin, Star, RefreshCw, Filter } from "lucide-react";

interface ScrapedTrainer {
  id: string;
  name: string;
  city: string;
  mobile: string;
  rating: number;
  basePrice: number;
  status: string;
  adminNotes: string;
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

const CITIES = [
  "All Cities","Delhi","Mumbai","Bangalore","Hyderabad","Chennai",
  "Pune","Kolkata","Jaipur","Ahmedabad","Surat","Lucknow","Chandigarh",
  "Bhopal","Indore","Nagpur","Patna","Coimbatore","Kochi","Visakhapatnam",
  "Noida","Gurgaon","Vadodara","Rajkot","Faridabad",
];

const RATING_OPTIONS = [
  { label: "All Ratings", value: "" },
  { label: "4.5 ★ and above", value: "4.5" },
  { label: "4.0 ★ and above", value: "4.0" },
  { label: "3.5 ★ and above", value: "3.5" },
  { label: "Below 3.5 ★",     value: "below3.5" },
];

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export default function ScrapedListingsPage() {
  const [trainers, setTrainers]         = useState<ScrapedTrainer[]>([]);
  const [loading, setLoading]           = useState(true);
  const [status, setStatus]             = useState<"PENDING"|"APPROVED"|"REJECTED">("PENDING");
  const [cityFilter, setCityFilter]     = useState("All Cities");
  const [ratingFilter, setRatingFilter] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats]               = useState({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => { loadTrainers(); }, [status]);

  async function loadTrainers() {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/scraped-listings?status=${status}`);
      const data = await res.json();
      setTrainers(data.trainers ?? []);
      setStats(data.stats ?? { pending: 0, approved: 0, rejected: 0 });
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: "APPROVED"|"REJECTED") {
    setActionLoading(id);
    await fetch("/api/admin/scraped-listings", {
      method:  "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": getCsrfToken(),
      },
      body:    JSON.stringify({ id, status: newStatus }),
    });
    setTrainers((prev) => prev.filter((t) => t.id !== id));
    setStats((s) => ({
      ...s,
      pending:  s.pending - 1,
      approved: newStatus === "APPROVED" ? s.approved + 1 : s.approved,
      rejected: newStatus === "REJECTED" ? s.rejected + 1 : s.rejected,
    }));
    setActionLoading(null);
  }

  async function approveAll() {
    const visible = filtered;
    if (!confirm(`Approve ${visible.length} visible listings?`)) return;
    setLoading(true);
    for (const t of visible) {
      await fetch("/api/admin/scraped-listings", {
        method:  "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
        body:    JSON.stringify({ id: t.id, status: "APPROVED" }),
      });
    }
    loadTrainers();
  }

  // Client-side filter by city + rating
  const filtered = trainers.filter((t) => {
    const cityOk = cityFilter === "All Cities" || t.city === cityFilter;
    let ratingOk = true;
    if (ratingFilter === "4.5")        ratingOk = t.rating >= 4.5;
    else if (ratingFilter === "4.0")   ratingOk = t.rating >= 4.0;
    else if (ratingFilter === "3.5")   ratingOk = t.rating >= 3.5;
    else if (ratingFilter === "below3.5") ratingOk = t.rating < 3.5;
    return cityOk && ratingOk;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: 0 }}>Scraped Listings</h1>
            <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>Driving schools pulled from Google Maps — review before going live</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={loadTrainers} style={outlineBtn}>
              <RefreshCw size={13} /> Refresh
            </button>
            {status === "PENDING" && filtered.length > 0 && (
              <button onClick={approveAll} style={greenBtn}>
                <CheckCircle size={13} /> Approve Visible ({filtered.length})
              </button>
            )}
          </div>
        </div>

        {/* Status tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Pending Review", count: stats.pending,  color: "#e8821a", key: "PENDING"  },
            { label: "Live on site",   count: stats.approved, color: "#2a7a4b", key: "APPROVED" },
            { label: "Rejected",       count: stats.rejected, color: "#cc3333", key: "REJECTED" },
          ].map((s) => (
            <button key={s.key} onClick={() => setStatus(s.key as any)}
              style={{ background: "#fff", borderRadius: 16, border: `2px solid ${status === s.key ? s.color : "#e8e2d9"}`, padding: "14px 16px", textAlign: "left", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.count}</div>
              <div style={{ color: "#666", fontSize: 13 }}>{s.label}</div>
            </button>
          ))}
        </div>

        {/* ── Filters ── */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e2d9", padding: "16px 20px", marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Filter size={15} color="#888" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>Filter:</span>

          {/* City */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            style={selectStyle}
          >
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Rating */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            style={selectStyle}
          >
            {RATING_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>

          {/* Active filters summary */}
          {(cityFilter !== "All Cities" || ratingFilter) && (
            <button
              onClick={() => { setCityFilter("All Cities"); setRatingFilter(""); }}
              style={{ fontSize: 12, color: "#cc3333", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 100, padding: "4px 10px", cursor: "pointer" }}
            >
              ✕ Clear filters
            </button>
          )}

          <span style={{ marginLeft: "auto", fontSize: 12, color: "#888" }}>
            Showing {filtered.length} of {trainers.length}
          </span>
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", background: "#fff", borderRadius: 20, border: "1px solid #e8e2d9", color: "#888" }}>
            No {status.toLowerCase()} listings{cityFilter !== "All Cities" ? ` in ${cityFilter}` : ""}{ratingFilter ? ` with selected rating` : ""}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((trainer) => {
              let meta: ScrapedMeta | null = null;
              try { meta = JSON.parse(trainer.adminNotes); } catch {}
              let packages: any[] = [];
              try { packages = JSON.parse(trainer.packagesJson); } catch {}
              const platformFee = Math.round(trainer.basePrice * 0.10);
              const total       = trainer.basePrice + platformFee;

              return (
                <div key={trainer.id} style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8e2d9", padding: 20, display: "flex", gap: 16 }}>

                  {/* Photo */}
                  {meta?.photoUrl ? (
                    <img src={meta.photoUrl} alt={trainer.name}
                      style={{ width: 64, height: 64, borderRadius: 12, objectFit: "cover", flexShrink: 0, border: "1px solid #e8e2d9" }} />
                  ) : (
                    <div style={{ width: 64, height: 64, borderRadius: 12, background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🚗</div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ fontWeight: 700, color: "#1a1a2e", margin: 0, fontSize: 15 }}>{trainer.name}</h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 4, fontSize: 12, color: "#666" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} />{trainer.city}</span>
                          {trainer.rating > 0 && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <Star size={11} color="#e8821a" fill="#e8821a" />
                              {trainer.rating.toFixed(1)}
                              {meta?.reviewCount ? ` (${meta.reviewCount})` : ""}
                            </span>
                          )}
                          {trainer.mobile && trainer.mobile !== "0000000000" && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Phone size={11} />{trainer.mobile}</span>
                          )}
                        </div>
                        {meta?.address && (
                          <p style={{ fontSize: 12, color: "#888", marginTop: 4, marginBottom: 0 }}>{meta.address}</p>
                        )}
                      </div>

                      {/* Price breakdown */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#e8821a" }}>
                          ₹{total.toLocaleString("en-IN")}
                        </div>
                        <div style={{ fontSize: 11, color: "#aaa" }}>
                          ₹{trainer.basePrice.toLocaleString("en-IN")} + ₹{platformFee.toLocaleString("en-IN")} fee
                        </div>
                      </div>
                    </div>

                    {/* Package pills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                      {packages.map((p, i) => (
                        <span key={i} style={{ fontSize: 11, background: "#f5f0e8", color: "#555", border: "1px solid #e8e2d9", borderRadius: 100, padding: "3px 10px" }}>
                          {p.name} · ₹{p.price?.toLocaleString("en-IN")}
                        </span>
                      ))}
                    </div>

                    {/* Links + actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                      {meta?.website && (
                        <a href={meta.website} target="_blank" rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2a7a4b", textDecoration: "none" }}>
                          <Globe size={11} /> Website
                        </a>
                      )}
                      {meta?.placeId && (
                        <a href={`https://maps.google.com/?cid=${meta.placeId}`} target="_blank" rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2a7a4b", textDecoration: "none" }}>
                          <ExternalLink size={11} /> Google Maps
                        </a>
                      )}

                      {status === "PENDING" && (
                        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                          <button onClick={() => updateStatus(trainer.id, "REJECTED")}
                            disabled={actionLoading === trainer.id}
                            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#cc3333", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "7px 14px", cursor: "pointer" }}>
                            <XCircle size={13} /> Reject
                          </button>
                          <button onClick={() => updateStatus(trainer.id, "APPROVED")}
                            disabled={actionLoading === trainer.id}
                            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#fff", background: "#2a7a4b", border: "none", borderRadius: 10, padding: "7px 14px", cursor: "pointer" }}>
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

const outlineBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, fontSize: 13,
  border: "1px solid #e8e2d9", background: "#fff", borderRadius: 12,
  padding: "8px 14px", cursor: "pointer", color: "#555",
};
const greenBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, fontSize: 13,
  background: "#2a7a4b", color: "#fff", border: "none",
  borderRadius: 12, padding: "8px 16px", cursor: "pointer",
};
const selectStyle: React.CSSProperties = {
  border: "1px solid #e8e2d9", borderRadius: 10, padding: "7px 12px",
  fontSize: 13, color: "#333", background: "#fff", cursor: "pointer", outline: "none",
};
