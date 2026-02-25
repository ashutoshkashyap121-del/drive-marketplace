"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Document = {
  docType: string;
  fileName: string;
  fileUrl: string;
};

type Vehicle = {
  type: string;
  dualControl: boolean;
  insured: boolean;
  vehicleNumber: string | null;
  vehicleYear: number | null;
  rcNumber: string | null;
  insuranceValidUntil: string | null;
};

type Trainer = {
  id: number;
  name: string;
  mobile: string;
  email: string | null;
  city: string;
  experience: number;
  trainerType: string;
  status: string;
  rating: number | null;
  basePrice: number | null;
  licenseNumber: string;
  bio: string | null;
  vehicleTypes: string[];
  vehicles: Vehicle[];
  documents: Document[];
  createdAt: string;
};

type Booking = {
  id: number;
  customerName: string;
  mobile: string;
  city: string;
  address: string;
  packageName: string;
  amount: number;
  platformFee: number | null;
  trainerPayout: number | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
  trainer: { name: string };
};

type Stats = {
  pending: number;
  approved: number;
  rejected: number;
  totalRevenue: number;
  pendingBookings: number;
};

const DOC_LABELS: Record<string, string> = {
  LICENSE: "🪪 Licence",
  INSURANCE: "📋 Insurance",
  RC: "🚗 RC Book",
};

const STATUS_BG: Record<string, string> = {
  PENDING: "#FEF3C7",
  APPROVED: "#DCFCE7",
  REJECTED: "#FEE2E2",
  SUSPENDED: "#FEE2E2",
  CONFIRMED: "#DBEAFE",
  COMPLETED: "#DCFCE7",
  CANCELLED: "#FEE2E2",
};

const STATUS_TEXT: Record<string, string> = {
  PENDING: "#92400E",
  APPROVED: "#166534",
  REJECTED: "#991B1B",
  SUSPENDED: "#991B1B",
  CONFIRMED: "#1E40AF",
  COMPLETED: "#166534",
  CANCELLED: "#991B1B",
};

export default function AdminDashboardClient({
  bookings,
  trainers,
  stats,
}: {
  bookings: Booking[];
  trainers: Trainer[];
  stats: Stats;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"trainers" | "bookings">("trainers");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<number, string>>({});

  // ── Filter trainers by status ─────────────────────────────────────────────
  const filteredTrainers = statusFilter === "ALL"
    ? trainers
    : trainers.filter((t) => t.status === statusFilter);

  // ── Actions ───────────────────────────────────────────────────────────────
  async function approveTrainer(id: number) {
    setUpdatingId(id);
    await fetch("/api/admin/trainers/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainerId: id, action: "APPROVED" }),
    });
    router.refresh();
    setUpdatingId(null);
  }

  async function rejectTrainer(id: number) {
    setUpdatingId(id);
    await fetch("/api/admin/trainers/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainerId: id, action: "REJECTED", reason: rejectReason[id] || "" }),
    });
    router.refresh();
    setUpdatingId(null);
  }

  async function suspendTrainer(id: number) {
    setUpdatingId(id);
    await fetch("/api/admin/trainers/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainerId: id, action: "SUSPENDED" }),
    });
    router.refresh();
    setUpdatingId(null);
  }

  async function updateBookingStatus(id: number, status: string) {
    setUpdatingId(id);
    await fetch("/api/admin/bookings/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
    setUpdatingId(null);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <main style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 0.72rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px; padding: 10px 14px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; }
        td { padding: 12px 14px; border-bottom: 1px solid #F1F5F9; font-size: 0.88rem; color: #0F172A; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #FAFAFA; }
        .abtn { padding: 6px 14px; border-radius: 8px; border: none; font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .approve { background: #DCFCE7; color: #166534; } .approve:hover { background: #BBF7D0; }
        .reject { background: #FEE2E2; color: #991B1B; } .reject:hover { background: #FECACA; }
        .suspend { background: #FEF3C7; color: #92400E; } .suspend:hover { background: #FDE68A; }
        .confirm { background: #DBEAFE; color: #1E40AF; } .confirm:hover { background: #BFDBFE; }
        .complete { background: #DCFCE7; color: #166534; } .complete:hover { background: #BBF7D0; }
        .stat-card { cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .stat-card.active { border-color: currentColor; }
        .doc-link { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: #EFF6FF; color: #1D4ED8; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-decoration: none; transition: background 0.15s; }
        .doc-link:hover { background: #DBEAFE; }
        textarea { width: 100%; padding: 8px 12px; border: 1px solid #E2E8F0; border-radius: 8px; font-family: inherit; font-size: 0.82rem; resize: none; outline: none; }
        textarea:focus { border-color: #F59E0B; }
      `}</style>

      {/* Nav */}
      <div style={{ background: "linear-gradient(135deg,#0B1437,#1A2B5F)", padding: "16px 5%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#fff" }}>
          Learn<span style={{ color: "#F59E0B" }}>Drive</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400, fontSize: "0.82rem", marginLeft: 10 }}>Admin Dashboard</span>
        </div>
        <button onClick={handleLogout}
          style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: "0.82rem" }}>
          Sign Out
        </button>
      </div>

      <div style={{ padding: "28px 5%", maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Stat cards (clickable to filter) ─────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, color: "#F59E0B", icon: "💰", filter: null },
            { label: "Pending Trainers", value: stats.pending, color: "#F59E0B", icon: "⏳", filter: "PENDING" },
            { label: "Approved Trainers", value: stats.approved, color: "#10B981", icon: "✅", filter: "APPROVED" },
            { label: "Rejected Trainers", value: stats.rejected, color: "#EF4444", icon: "❌", filter: "REJECTED" },
            { label: "Pending Bookings", value: stats.pendingBookings, color: "#3B82F6", icon: "📋", filter: null },
          ].map((s) => (
            <div key={s.label}
              className={`stat-card${statusFilter === s.filter && s.filter ? " active" : ""}`}
              onClick={() => {
                if (s.filter) { setTab("trainers"); setStatusFilter(statusFilter === s.filter ? "ALL" : s.filter); }
              }}
              style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "2px solid", borderColor: statusFilter === s.filter && s.filter ? s.color : "transparent", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.6rem", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.74rem", color: "#64748B", marginTop: 2 }}>{s.label}</div>
              {s.filter && <div style={{ fontSize: "0.68rem", color: "#94A3B8", marginTop: 4 }}>Click to filter</div>}
            </div>
          ))}
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#E2E8F0", padding: 4, borderRadius: 12, width: "fit-content" }}>
          {(["trainers", "bookings"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "8px 22px", borderRadius: 9, border: "none", fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", background: tab === t ? "#fff" : "transparent", color: tab === t ? "#0F172A" : "#64748B", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s", textTransform: "capitalize" }}>
              {t === "trainers" ? `👨‍🏫 Trainers (${trainers.length})` : `📋 Bookings (${bookings.length})`}
            </button>
          ))}
        </div>

        {/* ── Status filter pills (trainers tab) ───────────────────────── */}
        {tab === "trainers" && (
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {["ALL", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                style={{ padding: "6px 16px", borderRadius: 100, border: "1px solid", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", background: statusFilter === s ? "#0B1437" : "#fff", color: statusFilter === s ? "#fff" : "#475569", borderColor: statusFilter === s ? "#0B1437" : "#E2E8F0" }}>
                {s === "ALL" ? `All (${trainers.length})` : `${s} (${trainers.filter(t => t.status === s).length})`}
              </button>
            ))}
          </div>
        )}

        {/* ── Table card ────────────────────────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>

          {/* ── TRAINERS TAB ──────────────────────────────────────────── */}
          {tab === "trainers" && (
            filteredTrainers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", color: "#94A3B8" }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>👨‍🏫</div>
                <div style={{ fontWeight: 700, color: "#475569" }}>No trainers with status: {statusFilter}</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Trainer</th>
                    <th>Contact</th>
                    <th>City</th>
                    <th>Vehicle / Price</th>
                    <th>Status</th>
                    <th>Documents</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrainers.map((t) => (
                    <>
                      <tr key={t.id} style={{ cursor: "pointer" }} onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}>
                        <td>
                          <div style={{ fontWeight: 700 }}>{t.name}</div>
                          <div style={{ color: "#64748B", fontSize: "0.75rem" }}>{t.experience} yrs · {t.licenseNumber}</div>
                          <div style={{ color: "#94A3B8", fontSize: "0.72rem" }}>{new Date(t.createdAt).toLocaleDateString("en-IN")}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>📱 {t.mobile}</div>
                          {t.email && <div style={{ color: "#64748B", fontSize: "0.75rem" }}>✉️ {t.email}</div>}
                        </td>
                        <td>{t.city}</td>
                        <td>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
                            {t.vehicleTypes.map((v, i) => (
                              <span key={i} style={{ background: "#F1F5F9", padding: "2px 8px", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600 }}>{v}</span>
                            ))}
                          </div>
                          {t.basePrice && <div style={{ fontWeight: 700, color: "#F59E0B", fontSize: "0.85rem" }}>₹{t.basePrice}/hr</div>}
                        </td>
                        <td>
                          <span style={{ background: STATUS_BG[t.status] || "#F1F5F9", color: STATUS_TEXT[t.status] || "#475569", padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700 }}>
                            {t.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {t.documents.length === 0 ? (
                              <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>No docs</span>
                            ) : t.documents.map((doc, i) => (
                              <a key={i} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="doc-link"
                                onClick={(e) => e.stopPropagation()}>
                                {DOC_LABELS[doc.docType] || doc.docType}
                              </a>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {t.status === "PENDING" && (
                              <>
                                <button className="abtn approve" disabled={updatingId === t.id}
                                  onClick={(e) => { e.stopPropagation(); approveTrainer(t.id); }}>
                                  {updatingId === t.id ? "..." : "Approve"}
                                </button>
                                <button className="abtn reject" disabled={updatingId === t.id}
                                  onClick={(e) => { e.stopPropagation(); setExpandedId(t.id); }}>
                                  Reject
                                </button>
                              </>
                            )}
                            {t.status === "APPROVED" && (
                              <button className="abtn suspend" disabled={updatingId === t.id}
                                onClick={(e) => { e.stopPropagation(); suspendTrainer(t.id); }}>
                                {updatingId === t.id ? "..." : "Suspend"}
                              </button>
                            )}
                            {(t.status === "REJECTED" || t.status === "SUSPENDED") && (
                              <button className="abtn approve" disabled={updatingId === t.id}
                                onClick={(e) => { e.stopPropagation(); approveTrainer(t.id); }}>
                                {updatingId === t.id ? "..." : "Re-approve"}
                              </button>
                            )}
                            <button style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#F8FAFC", cursor: "pointer", fontSize: "0.75rem", color: "#64748B" }}
                              onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === t.id ? null : t.id); }}>
                              {expandedId === t.id ? "▲ Less" : "▼ More"}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ── Expanded row ────────────────────────────── */}
                      {expandedId === t.id && (
                        <tr key={`${t.id}-expanded`}>
                          <td colSpan={7} style={{ background: "#F8FAFC", padding: "20px 24px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>

                              {/* Bio */}
                              <div>
                                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Bio</div>
                                <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.6 }}>{t.bio || "—"}</p>
                              </div>

                              {/* Vehicle details */}
                              <div>
                                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Vehicle Details</div>
                                {t.vehicles.length === 0 ? <p style={{ fontSize: "0.82rem", color: "#94A3B8" }}>No vehicle info</p> : t.vehicles.map((v, i) => (
                                  <div key={i} style={{ fontSize: "0.82rem", color: "#374151", lineHeight: 1.8 }}>
                                    <div><strong>{v.type}</strong> {v.vehicleNumber && `· ${v.vehicleNumber}`}</div>
                                    {v.vehicleYear && <div>Year: {v.vehicleYear}</div>}
                                    {v.rcNumber && <div>RC: {v.rcNumber}</div>}
                                    <div>Dual Control: <strong style={{ color: v.dualControl ? "#166534" : "#991B1B" }}>{v.dualControl ? "✅ Yes" : "❌ No"}</strong></div>
                                    {v.insuranceValidUntil && <div>Insurance valid till: {new Date(v.insuranceValidUntil).toLocaleDateString("en-IN")}</div>}
                                  </div>
                                ))}
                              </div>

                              {/* Reject with reason */}
                              {t.status === "PENDING" && (
                                <div>
                                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Reject with Reason</div>
                                  <textarea rows={3} placeholder="Enter rejection reason (optional)..."
                                    value={rejectReason[t.id] || ""}
                                    onChange={(e) => setRejectReason((prev) => ({ ...prev, [t.id]: e.target.value }))} />
                                  <button className="abtn reject" style={{ marginTop: 8 }}
                                    disabled={updatingId === t.id}
                                    onClick={() => rejectTrainer(t.id)}>
                                    {updatingId === t.id ? "Rejecting..." : "Confirm Reject"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )
          )}

          {/* ── BOOKINGS TAB ──────────────────────────────────────────── */}
          {tab === "bookings" && (
            bookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", color: "#94A3B8" }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>📋</div>
                <div style={{ fontWeight: 700, color: "#475569" }}>No bookings yet</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Customer</th><th>Trainer</th><th>City</th>
                    <th>Amount</th><th>Platform Fee</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ color: "#94A3B8", fontSize: "0.75rem" }}>#{b.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                        <div style={{ color: "#64748B", fontSize: "0.75rem" }}>📱 {b.mobile}</div>
                      </td>
                      <td>{b.trainer.name}</td>
                      <td>{b.city}</td>
                      <td style={{ fontWeight: 700 }}>₹{b.amount.toLocaleString("en-IN")}</td>
                      <td style={{ color: "#F59E0B", fontWeight: 700 }}>₹{(b.platformFee ?? 0).toLocaleString("en-IN")}</td>
                      <td>
                        <span style={{ background: STATUS_BG[b.status] || "#F1F5F9", color: STATUS_TEXT[b.status] || "#475569", padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 700 }}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          {b.status === "PENDING" && (
                            <button className="abtn confirm" disabled={updatingId === b.id}
                              onClick={() => updateBookingStatus(b.id, "CONFIRMED")}>Confirm</button>
                          )}
                          {b.status === "CONFIRMED" && (
                            <button className="abtn complete" disabled={updatingId === b.id}
                              onClick={() => updateBookingStatus(b.id, "COMPLETED")}>Complete</button>
                          )}
                          {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                            <button className="abtn reject" disabled={updatingId === b.id}
                              onClick={() => updateBookingStatus(b.id, "CANCELLED")}>Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </main>
  );
}