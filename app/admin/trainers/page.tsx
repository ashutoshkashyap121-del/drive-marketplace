"use client";
// app/admin/trainers/page.tsx

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Package {
  name: string;
  price: number;
  priceMax?: number;
  days?: number;
  sessionLength?: string;
  distancePerDay?: string;
  includes?: string;
  acSurcharge?: number;
  trackFeePerVehicle?: number;
}

interface Trainer {
  id: number;
  name: string;
  city: string;
  status: string;
  experience: number;
  basePrice: number | null;
  packagesJson: string | null;
  languages: string[];
  vehicleTypes: string[];
  mobile: string;
  email?: string | null;
}

const EMPTY_PKG: Package = {
  name: "",
  price: 0,
  days: undefined,
  sessionLength: "",
  distancePerDay: "",
  includes: "",
  acSurcharge: undefined,
  trackFeePerVehicle: undefined,
};

// ─── Package Editor ───────────────────────────────────────────────────────────

function PackageEditor({
  packages,
  onChange,
}: {
  packages: Package[];
  onChange: (pkgs: Package[]) => void;
}) {
  const update = (i: number, field: keyof Package, value: any) => {
    const updated = packages.map((p, idx) =>
      idx === i ? { ...p, [field]: value === "" ? undefined : value } : p
    );
    onChange(updated);
  };

  const remove = (i: number) => onChange(packages.filter((_, idx) => idx !== i));

  const add = () => onChange([...packages, { ...EMPTY_PKG }]);

  return (
    <div>
      {packages.map((pkg, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            background: "#F8FAFC",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#374151" }}>
              Package {i + 1}
            </span>
            <button
              onClick={() => remove(i)}
              style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}
            >
              ✕ Remove
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelStyle}>Package Name *</label>
              <input
                value={pkg.name}
                onChange={e => update(i, "name", e.target.value)}
                placeholder="e.g. 15-Day Course"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Price (₹) *</label>
              <input
                type="number"
                value={pkg.price || ""}
                onChange={e => update(i, "price", Number(e.target.value))}
                placeholder="e.g. 6000"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Max Price (₹) — for range</label>
              <input
                type="number"
                value={pkg.priceMax || ""}
                onChange={e => update(i, "priceMax", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 8000 (optional)"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Number of Days</label>
              <input
                type="number"
                value={pkg.days || ""}
                onChange={e => update(i, "days", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 15"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Session Length</label>
              <input
                value={pkg.sessionLength || ""}
                onChange={e => update(i, "sessionLength", e.target.value)}
                placeholder="e.g. 1 hour"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Distance Per Day</label>
              <input
                value={pkg.distancePerDay || ""}
                onChange={e => update(i, "distancePerDay", e.target.value)}
                placeholder="e.g. 10 km"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>AC Surcharge (₹)</label>
              <input
                type="number"
                value={pkg.acSurcharge || ""}
                onChange={e => update(i, "acSurcharge", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 500"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Track Fee Per Vehicle (₹)</label>
              <input
                type="number"
                value={pkg.trackFeePerVehicle || ""}
                onChange={e => update(i, "trackFeePerVehicle", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 300"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <label style={labelStyle}>What&apos;s Included (shown to student)</label>
            <textarea
              value={pkg.includes || ""}
              onChange={e => update(i, "includes", e.target.value)}
              placeholder="e.g. Pickup from your area, RTO test prep, flexible timings"
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        </div>
      ))}

      <button
        onClick={add}
        style={{
          width: "100%",
          padding: "10px",
          border: "2px dashed #CBD5E1",
          borderRadius: 10,
          background: "none",
          color: "#64748B",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        + Add Package
      </button>
    </div>
  );
}

// ─── Trainer Row ──────────────────────────────────────────────────────────────

function TrainerRow({
  trainer,
  onRefresh,
}: {
  trainer: Trainer;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [packages, setPackages] = useState<Package[]>(() => {
    if (!trainer.packagesJson) return [];
    try { return JSON.parse(trainer.packagesJson); } catch { return []; }
  });
  const [basePrice, setBasePrice] = useState<string>(
    trainer.basePrice ? String(trainer.basePrice) : ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const approve = async () => {
    await fetch("/api/admin/trainers/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainerId: trainer.id }),
    });
    onRefresh();
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/trainers/${trainer.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packagesJson: JSON.stringify(packages),
          basePrice: basePrice ? Number(basePrice) : null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const d = await res.json();
        setError(d.error || "Save failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const statusColor =
    trainer.status === "APPROVED"
      ? "#16A34A"
      : trainer.status === "PENDING"
      ? "#F59E0B"
      : "#EF4444";

  return (
    <div
      style={{
        border: "1px solid #E2E8F0",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 12,
        background: "#fff",
      }}
    >
      {/* Row header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{trainer.name}</div>
          <div style={{ color: "#64748B", fontSize: 13 }}>
            {trainer.city} · {trainer.mobile}
            {trainer.email ? ` · ${trainer.email}` : ""}
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
            {trainer.vehicleTypes.join(", ")} · {trainer.languages.join(", ")}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: statusColor,
              background: `${statusColor}18`,
              borderRadius: 99,
              padding: "3px 10px",
            }}
          >
            {trainer.status}
          </span>

          <span style={{ fontSize: 12, color: "#64748B" }}>
            {packages.length} package{packages.length !== 1 ? "s" : ""}
          </span>

          {trainer.status === "PENDING" && (
            <button
              onClick={approve}
              style={{
                background: "#16A34A",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Approve
            </button>
          )}

          <button
            onClick={() => setExpanded(p => !p)}
            style={{
              background: "#F1F5F9",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              color: "#374151",
            }}
          >
            {expanded ? "▲ Hide" : "▼ Edit Packages"}
          </button>
        </div>
      </div>

      {/* Package editor */}
      {expanded && (
        <div style={{ borderTop: "1px solid #E2E8F0", padding: 20, background: "#FAFAFA" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Base / Fallback Price (₹) — shown if no packages</label>
            <input
              type="number"
              value={basePrice}
              onChange={e => setBasePrice(e.target.value)}
              placeholder="e.g. 6000"
              style={{ ...inputStyle, maxWidth: 200 }}
            />
          </div>

          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "#374151" }}>
            Packages
          </div>

          <PackageEditor packages={packages} onChange={setPackages} />

          {error && (
            <p style={{ color: "#EF4444", fontSize: 13, marginTop: 8 }}>⚠ {error}</p>
          )}

          <button
            onClick={save}
            disabled={saving}
            style={{
              marginTop: 16,
              background: saved ? "#16A34A" : "#F59E0B",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 28px",
              fontWeight: 700,
              fontSize: 14,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              transition: "background 0.2s",
            }}
          >
            {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Packages"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  fontSize: 13,
  color: "#0F172A",
  background: "#fff",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#64748B",
  marginBottom: 4,
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED">("ALL");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/trainers/list")
      .then(res => res.json())
      .then(data => { setTrainers(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = trainers.filter(t =>
    filter === "ALL" ? true : t.status === filter
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Trainer Management</h1>
      <p style={{ color: "#64748B", fontSize: 14, marginBottom: 24 }}>
        Approve trainers and manage their packages
      </p>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["ALL", "PENDING", "APPROVED"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 16px",
              borderRadius: 99,
              border: "1px solid #E2E8F0",
              background: filter === f ? "#0F172A" : "#fff",
              color: filter === f ? "#fff" : "#64748B",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {f} ({trainers.filter(t => f === "ALL" ? true : t.status === f).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: "#64748B", padding: 40, textAlign: "center" }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: "#94A3B8", padding: 40, textAlign: "center" }}>No trainers found.</div>
      ) : (
        filtered.map(t => <TrainerRow key={t.id} trainer={t} onRefresh={load} />)
      )}
    </div>
  );
}