// ─────────────────────────────────────────────────────────────────
// PART 1: Add these models to your prisma/schema.prisma
// ─────────────────────────────────────────────────────────────────

/*
model DriverRequest {
  id             Int       @id @default(autoincrement())
  customerName   String
  mobile         String
  email          String?
  city           String
  tripType       String
  startDate      DateTime
  endDate        DateTime?
  days           Int       @default(1)
  pickupAddress  String
  notes          String?
  estimatedPrice Float     @default(0)
  status         String    @default("PENDING") // PENDING | ASSIGNED | COMPLETED | CANCELLED
  assignedDriverId Int?
  assignedDriver DriverApplication? @relation(fields: [assignedDriverId], references: [id])
  createdAt      DateTime  @default(now())
}

model DriverApplication {
  id           Int       @id @default(autoincrement())
  name         String
  mobile       String
  email        String?
  city         String
  pincode      String
  licenseNo    String
  licenseType  String
  yearsExp     Int
  tripTypes    String    // JSON array
  languages    String    // JSON array
  availability String    // JSON array
  hasOwnCar    Boolean   @default(false)
  carModel     String?
  about        String?
  status       String    @default("PENDING") // PENDING | APPROVED | REJECTED
  requests     DriverRequest[]
  createdAt    DateTime  @default(now())
}
*/

// Run after adding to schema:
// npx prisma migrate dev --name add_driver_tables


// ─────────────────────────────────────────────────────────────────
// PART 2: app/api/hire-driver/onboard/route.ts  (separate file)
// ─────────────────────────────────────────────────────────────────

/*
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, email, city, pincode, licenseNo, licenseType,
            yearsExp, tripTypes, languages, availability, hasOwnCar, carModel, about } = body;

    if (!name || !mobile || !city || !licenseNo || !yearsExp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const driver = await prisma.driverApplication.create({
      data: {
        name, mobile, email: email || null, city, pincode,
        licenseNo, licenseType, yearsExp: Number(yearsExp),
        tripTypes: JSON.stringify(tripTypes),
        languages: JSON.stringify(languages),
        availability: JSON.stringify(availability),
        hasOwnCar: Boolean(hasOwnCar),
        carModel: carModel || null,
        about: about || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, id: driver.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
*/


// ─────────────────────────────────────────────────────────────────
// PART 3: app/admin/drivers/page.tsx — Admin driver management
// ─────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DriverApp {
  id: number;
  name: string;
  mobile: string;
  email?: string;
  city: string;
  licenseNo: string;
  licenseType: string;
  yearsExp: number;
  tripTypes: string;
  languages: string;
  availability: string;
  hasOwnCar: boolean;
  carModel?: string;
  about?: string;
  status: string;
  createdAt: string;
}

interface DriverRequest {
  id: number;
  customerName: string;
  mobile: string;
  city: string;
  tripType: string;
  startDate: string;
  days: number;
  pickupAddress: string;
  estimatedPrice: number;
  status: string;
  createdAt: string;
}

export default function AdminDriversPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"requests" | "drivers">("requests");
  const [requests, setRequests] = useState<DriverRequest[]>([]);
  const [drivers, setDrivers] = useState<DriverApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/drivers/requests").then(r => r.json()),
      fetch("/api/admin/drivers/applications").then(r => r.json()),
    ]).then(([req, apps]) => {
      setRequests(req.requests || []);
      setDrivers(apps.drivers || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateDriverStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/drivers/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const updateRequestStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/driver-requests/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const statusColor = (s: string) => ({
    PENDING: "#F59E0B",
    APPROVED: "#22C55E",
    REJECTED: "#EF4444",
    ASSIGNED: "#3B82F6",
    COMPLETED: "#22C55E",
    CANCELLED: "#EF4444",
  }[s] || "#94A3B8");

  const pendingRequests = requests.filter(r => r.status === "PENDING").length;
  const pendingDrivers = drivers.filter(d => d.status === "PENDING").length;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F7F4" }}>
      <p style={{ color: "#64748B" }}>Loading...</p>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(145deg,#0B1437,#1A2B5F)", padding: "24px 5%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <button onClick={() => router.push("/admin")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", cursor: "pointer", marginBottom: 4, padding: 0 }}>← Admin</button>
            <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF" }}>Driver Management</h1>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#F59E0B" }}>{pendingRequests}</p>
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>Pending Requests</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Sora',sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#F59E0B" }}>{pendingDrivers}</p>
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>Driver Applications</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 5%" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "#FFFFFF", borderRadius: 14, padding: 4, border: "1px solid #E2E8F0", marginBottom: 24, width: "fit-content" }}>
          {[
            { id: "requests" as const, label: `Customer Requests (${pendingRequests} new)` },
            { id: "drivers" as const, label: `Driver Applications (${pendingDrivers} new)` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, background: tab === t.id ? "#0B1437" : "transparent", color: tab === t.id ? "#FFFFFF" : "#64748B", transition: "all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Customer Requests Tab ── */}
        {tab === "requests" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {requests.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>No driver requests yet.</div>
            )}
            {requests.map(r => (
              <div key={r.id} style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{r.customerName}</h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748B" }}>📞 {r.mobile} · 📍 {r.city}</p>
                  </div>
                  <span style={{ background: `${statusColor(r.status)}20`, color: statusColor(r.status), padding: "4px 12px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700 }}>{r.status}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
                  {[
                    { l: "Trip Type", v: r.tripType },
                    { l: "Start Date", v: new Date(r.startDate).toLocaleDateString("en-IN") },
                    { l: "Days", v: `${r.days} day${r.days > 1 ? "s" : ""}` },
                    { l: "Est. Amount", v: `₹${r.estimatedPrice.toLocaleString("en-IN")}` },
                    { l: "Your Cut (15%)", v: `₹${Math.round(r.estimatedPrice * 0.15).toLocaleString("en-IN")}` },
                    { l: "Pickup", v: r.pickupAddress },
                  ].map(i => (
                    <div key={i.l}>
                      <p style={{ fontSize: "0.7rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{i.l}</p>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0F172A" }}>{i.v}</p>
                    </div>
                  ))}
                </div>
                {r.status === "PENDING" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => updateRequestStatus(r.id, "ASSIGNED")}
                      style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg,#F59E0B,#D97706)", color: "#fff", fontWeight: 700, border: "none", borderRadius: 10, cursor: "pointer", fontSize: "0.85rem" }}>
                      Assign Driver
                    </button>
                    <button onClick={() => updateRequestStatus(r.id, "CANCELLED")}
                      style={{ padding: "10px 20px", background: "#FEF2F2", color: "#EF4444", fontWeight: 600, border: "1px solid #FECACA", borderRadius: 10, cursor: "pointer", fontSize: "0.85rem" }}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Driver Applications Tab ── */}
        {tab === "drivers" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {drivers.length === 0 && (
              <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>No driver applications yet.</div>
            )}
            {drivers.map(d => (
              <div key={d.id} style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{d.name}</h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748B" }}>📞 {d.mobile} · 📍 {d.city} · {d.yearsExp} yrs exp</p>
                  </div>
                  <span style={{ background: `${statusColor(d.status)}20`, color: statusColor(d.status), padding: "4px 12px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700 }}>{d.status}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 12 }}>
                  {[
                    { l: "DL Number", v: d.licenseNo },
                    { l: "Licence Type", v: d.licenseType },
                    { l: "Own Car", v: d.hasOwnCar ? `Yes — ${d.carModel || ""}` : "No" },
                  ].map(i => (
                    <div key={i.l}>
                      <p style={{ fontSize: "0.7rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{i.l}</p>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0F172A" }}>{i.v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginBottom: 4 }}>Trip types:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {JSON.parse(d.tripTypes || "[]").map((t: string) => (
                      <span key={t} style={{ background: "#F1F5F9", color: "#475569", padding: "3px 10px", borderRadius: 999, fontSize: "0.75rem" }}>{t}</span>
                    ))}
                  </div>
                </div>
                {/* Verify DL link */}
                <a href={`https://parivahan.gov.in/rcdlstatus/vahan/dlStatus.xhtml`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", fontSize: "0.78rem", color: "#3B82F6", marginBottom: 12 }}>
                  🔍 Verify DL on Sarathi →
                </a>
                {d.status === "PENDING" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => updateDriverStatus(d.id, "APPROVED")}
                      style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff", fontWeight: 700, border: "none", borderRadius: 10, cursor: "pointer", fontSize: "0.85rem" }}>
                      ✓ Approve Driver
                    </button>
                    <button onClick={() => updateDriverStatus(d.id, "REJECTED")}
                      style={{ padding: "10px 20px", background: "#FEF2F2", color: "#EF4444", fontWeight: 600, border: "1px solid #FECACA", borderRadius: 10, cursor: "pointer", fontSize: "0.85rem" }}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}