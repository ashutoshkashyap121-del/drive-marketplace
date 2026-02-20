"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

type Trainer = {
  id: number;
  name: string;
  mobile: string;
  city: string;
  experience: number;
  trainerType: string;
  status: string;
  rating: number | null;
  basePrice: number | null;
  licenseNumber: string;
  vehicles: { type: string; dualControl: boolean; insured: boolean }[];
  createdAt: string;
};

type Stats = {
  totalRevenue: number;
  pendingBookings: number;
  pendingTrainers: number;
  approvedTrainers: number;
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
  const [tab, setTab] = useState<"bookings" | "trainers">("bookings");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function updateTrainerStatus(id: number, status: string) {
    setUpdatingId(id);
    await fetch("/api/admin/trainers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
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

  const statusColor: Record<string, string> = {
    PENDING: "#FEF3C7",
    CONFIRMED: "#DBEAFE",
    COMPLETED: "#DCFCE7",
    CANCELLED: "#FEE2E2",
    APPROVED: "#DCFCE7",
    REJECTED: "#FEE2E2",
    SUSPENDED: "#FEE2E2",
  };
  const statusText: Record<string, string> = {
    PENDING: "#92400E",
    CONFIRMED: "#1E40AF",
    COMPLETED: "#166534",
    CANCELLED: "#991B1B",
    APPROVED: "#166534",
    REJECTED: "#991B1B",
    SUSPENDED: "#991B1B",
  };

  return (
    <main style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 0.72rem; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px; padding: 10px 14px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; }
        td { padding: 14px; border-bottom: 1px solid #F1F5F9; font-size: 0.88rem; color: #0F172A; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #FAFAFA; }
        .action-btn { padding: 6px 14px; border-radius: 8px; border: none; font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .btn-approve { background: #DCFCE7; color: #166534; }
        .btn-approve:hover { background: #BBF7D0; }
        .btn-reject { background: #FEE2E2; color: #991B1B; }
        .btn-reject:hover { background: #FECACA; }
        .btn-confirm { background: #DBEAFE; color: #1E40AF; }
        .btn-confirm:hover { background: #BFDBFE; }
        .btn-complete { background: #DCFCE7; color: #166534; }
        .btn-complete:hover { background: #BBF7D0; }
      `}</style>

      {/* Top nav */}
      <div style={{
        background: "linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%)",
        padding: "16px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#fff" }}>
          Learn<span style={{ color: "#F59E0B" }}>Drive</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400, fontSize: "0.85rem", marginLeft: 12 }}>
            Admin Dashboard
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: "0.82rem", fontFamily: "inherit" }}
        >
          Sign Out
        </button>
      </div>

      <div style={{ padding: "28px 5%", maxWidth: 1200, margin: "0 auto" }}>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Platform Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, color: "#F59E0B", icon: "💰" },
            { label: "Pending Bookings", value: stats.pendingBookings, color: "#3B82F6", icon: "📋" },
            { label: "Approved Trainers", value: stats.approvedTrainers, color: "#10B981", icon: "✅" },
            { label: "Awaiting Approval", value: stats.pendingTrainers, color: "#EF4444", icon: "⏳" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#FFFFFF",
              borderRadius: 16,
              padding: "20px 24px",
              border: "1px solid #E2E8F0",
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#E2E8F0", padding: 4, borderRadius: 12, width: "fit-content" }}>
          {(["bookings", "trainers"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 22px",
                borderRadius: 9,
                border: "none",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                background: tab === t ? "#FFFFFF" : "transparent",
                color: tab === t ? "#0F172A" : "#64748B",
                boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s",
                textTransform: "capitalize",
              }}
            >
              {t === "bookings" ? `📋 Bookings (${bookings.length})` : `👨‍🏫 Trainers (${trainers.length})`}
            </button>
          ))}
        </div>

        {/* Table card */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>

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
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Trainer</th>
                    <th>City</th>
                    <th>Amount</th>
                    <th>Platform Fee</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ color: "#94A3B8", fontSize: "0.78rem" }}>#{b.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                        <div style={{ color: "#64748B", fontSize: "0.78rem" }}>📱 {b.mobile}</div>
                      </td>
                      <td>{b.trainer.name}</td>
                      <td>{b.city}</td>
                      <td style={{ fontWeight: 700 }}>₹{b.amount.toLocaleString("en-IN")}</td>
                      <td style={{ color: "#F59E0B", fontWeight: 700 }}>
                        ₹{(b.platformFee ?? 0).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span style={{
                          background: statusColor[b.status] || "#F1F5F9",
                          color: statusText[b.status] || "#475569",
                          padding: "3px 10px",
                          borderRadius: 100,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          {b.status === "PENDING" && (
                            <button
                              className="action-btn btn-confirm"
                              disabled={updatingId === b.id}
                              onClick={() => updateBookingStatus(b.id, "CONFIRMED")}
                            >
                              Confirm
                            </button>
                          )}
                          {b.status === "CONFIRMED" && (
                            <button
                              className="action-btn btn-complete"
                              disabled={updatingId === b.id}
                              onClick={() => updateBookingStatus(b.id, "COMPLETED")}
                            >
                              Complete
                            </button>
                          )}
                          {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                            <button
                              className="action-btn btn-reject"
                              disabled={updatingId === b.id}
                              onClick={() => updateBookingStatus(b.id, "CANCELLED")}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {tab === "trainers" && (
            trainers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", color: "#94A3B8" }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>👨‍🏫</div>
                <div style={{ fontWeight: 700, color: "#475569" }}>No trainers yet</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>Type</th>
                    <th>Vehicles</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{t.name}</div>
                        <div style={{ color: "#64748B", fontSize: "0.78rem" }}>{t.experience} yrs exp</div>
                      </td>
                      <td>{t.mobile}</td>
                      <td>{t.city}</td>
                      <td style={{ fontSize: "0.78rem" }}>{t.trainerType}</td>
                      <td>
                        {t.vehicles.map((v, i) => (
                          <span key={i} style={{ background: "#F1F5F9", padding: "2px 8px", borderRadius: 4, fontSize: "0.72rem", marginRight: 4 }}>
                            {v.type}
                          </span>
                        ))}
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {t.basePrice ? `₹${t.basePrice.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td>
                        <span style={{
                          background: statusColor[t.status] || "#F1F5F9",
                          color: statusText[t.status] || "#475569",
                          padding: "3px 10px",
                          borderRadius: 100,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          {t.status !== "APPROVED" && (
                            <button
                              className="action-btn btn-approve"
                              disabled={updatingId === t.id}
                              onClick={() => updateTrainerStatus(t.id, "APPROVED")}
                            >
                              Approve
                            </button>
                          )}
                          {t.status === "APPROVED" && (
                            <button
                              className="action-btn btn-reject"
                              disabled={updatingId === t.id}
                              onClick={() => updateTrainerStatus(t.id, "SUSPENDED")}
                            >
                              Suspend
                            </button>
                          )}
                          {t.status === "PENDING" && (
                            <button
                              className="action-btn btn-reject"
                              disabled={updatingId === t.id}
                              onClick={() => updateTrainerStatus(t.id, "REJECTED")}
                            >
                              Reject
                            </button>
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