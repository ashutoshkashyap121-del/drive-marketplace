"use client";
import { useState, useEffect } from "react";

interface Lead { id: number; name: string; phone: string; city: string; outreachStatus: string; whatsappSent: boolean; smsSent: boolean; lastContactedAt?: string; }
interface Trainer { id: number; name: string; city: string; mobile: string; experience: number; status: string; adminNotes?: string; createdAt: string; vehicleTypes: string[]; }
interface ReviewResult { id: number; name: string; decision: string; reason: string; score: number; }

export default function AIOperationsPage() {
  const [tab, setTab] = useState<"outreach" | "approve">("outreach");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pending, setPending] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [secret, setSecret] = useState("");

  const headers = { "Content-Type": "application/json", "x-admin-secret": secret };

  const addLog = (msg: string) => setLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));

  useEffect(() => {
    setSecret(localStorage.getItem("admin_secret") || "");
    fetchLeads();
    fetchPending();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/outreach/leads", { headers });
      if (res.ok) setLeads(await res.json());
    } catch {}
  };

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/admin/trainers/pending", { headers });
      if (res.ok) setPending(await res.json());
    } catch {}
  };

  const sendToLead = async (lead: Lead) => {
    addLog(`Sending to ${lead.name} (${lead.phone})...`);
    const res = await fetch("/api/admin/outreach/send", {
      method: "POST",
      headers,
      body: JSON.stringify({ leadId: lead.id, phone: lead.phone, name: lead.name }),
    });
    const data = await res.json();
    addLog(`${lead.name}: WhatsApp=${data.waSuccess ? "✅" : "❌"} SMS=${data.smsSuccess ? "✅" : "❌"}`);
    fetchLeads();
  };

  const sendToAll = async () => {
    setLoading(true);
    addLog("Starting bulk outreach to all pending leads...");
    const res = await fetch("/api/admin/outreach/send", {
      method: "POST",
      headers,
      body: JSON.stringify({ sendAll: true }),
    });
    const data = await res.json();
    addLog(`Bulk outreach done: ${data.contacted} contacted, ${data.failed} failed out of ${data.total}`);
    setLoading(false);
    fetchLeads();
  };

  const reviewOne = async (trainer: Trainer) => {
    addLog(`AI reviewing ${trainer.name}...`);
    const res = await fetch("/api/admin/auto-approve", {
      method: "POST",
      headers,
      body: JSON.stringify({ trainerId: trainer.id }),
    });
    const data = await res.json();
    addLog(`${trainer.name}: ${data.decision} (score: ${data.score}) — ${data.reason}`);
    setResults((prev) => [data, ...prev]);
    fetchPending();
  };

  const reviewAll = async () => {
    setLoading(true);
    addLog(`Running AI review on ${pending.length} pending trainers...`);
    const res = await fetch("/api/admin/auto-approve", {
      method: "POST",
      headers,
      body: JSON.stringify({ runAll: true }),
    });
    const data = await res.json();
    addLog(`AI done: ✅ ${data.approved} approved, ❌ ${data.rejected} rejected, 🚩 ${data.flagged} flagged`);
    setResults(data.details || []);
    setLoading(false);
    fetchPending();
  };

  const pendingLeads = leads.filter((l) => l.outreachStatus === "PENDING");
  const contactedLeads = leads.filter((l) => l.outreachStatus === "CONTACTED");

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>🤖 AI Operations</h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>Automated trainer sourcing, outreach & approval</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Pending Leads", value: pendingLeads.length, color: "#f59e0b" },
            { label: "Contacted", value: contactedLeads.length, color: "#3b82f6" },
            { label: "Pending Approval", value: pending.length, color: "#f59e0b" },
            { label: "AI Reviewed", value: results.length, color: "#10b981" },
          ].map((s) => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 20, border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[["outreach", "📤 Outreach"], ["approve", "🤖 AI Approval"]].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t as any)}
              style={{ padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, background: tab === t ? "#f59e0b" : "rgba(255,255,255,0.07)", color: tab === t ? "#0f172a" : "#94a3b8" }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>

          {/* Main panel */}
          <div>
            {/* OUTREACH TAB */}
            {tab === "outreach" && (
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Trainer Leads</h2>
                    <p style={{ fontSize: 13, color: "#64748b" }}>{pendingLeads.length} pending outreach</p>
                  </div>
                  <button onClick={sendToAll} disabled={loading || pendingLeads.length === 0}
                    style={{ padding: "10px 20px", background: loading ? "#374151" : "#10b981", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: 14 }}>
                    {loading ? "Sending..." : `📤 Send to All (${pendingLeads.length})`}
                  </button>
                </div>
                {leads.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: "#475569" }}>
                    <p style={{ fontSize: 32, marginBottom: 12 }}>📋</p>
                    <p>No leads yet. Add leads via the outreach page or scraper.</p>
                  </div>
                ) : (
                  <div>
                    {leads.map((lead) => (
                      <div key={lead.id} style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, marginBottom: 2 }}>{lead.name}</p>
                          <p style={{ fontSize: 13, color: "#64748b" }}>{lead.phone} • {lead.city}</p>
                          {lead.lastContactedAt && (
                            <p style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                              Last contacted: {new Date(lead.lastContactedAt).toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {lead.whatsappSent && <span style={{ fontSize: 11, background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "2px 8px", borderRadius: 20 }}>WA ✓</span>}
                          {lead.smsSent && <span style={{ fontSize: 11, background: "rgba(59,130,246,0.15)", color: "#60a5fa", padding: "2px 8px", borderRadius: 20 }}>SMS ✓</span>}
                          <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 20, background: lead.outreachStatus === "CONTACTED" ? "rgba(16,185,129,0.1)" : lead.outreachStatus === "FAILED" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", color: lead.outreachStatus === "CONTACTED" ? "#10b981" : lead.outreachStatus === "FAILED" ? "#ef4444" : "#f59e0b" }}>
                            {lead.outreachStatus}
                          </span>
                          {lead.outreachStatus === "PENDING" && (
                            <button onClick={() => sendToLead(lead)}
                              style={{ padding: "6px 14px", background: "#1d4ed8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                              Send
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AI APPROVAL TAB */}
            {tab === "approve" && (
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Pending Applications</h2>
                    <p style={{ fontSize: 13, color: "#64748b" }}>{pending.length} awaiting AI review</p>
                  </div>
                  <button onClick={reviewAll} disabled={loading || pending.length === 0}
                    style={{ padding: "10px 20px", background: loading ? "#374151" : "#7c3aed", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: 14 }}>
                    {loading ? "Reviewing..." : `🤖 Review All (${pending.length})`}
                  </button>
                </div>
                {pending.length === 0 ? (
                  <div style={{ padding: 40, textAlign: "center", color: "#475569" }}>
                    <p style={{ fontSize: 32, marginBottom: 12 }}>✅</p>
                    <p>No pending applications right now.</p>
                  </div>
                ) : (
                  <div>
                    {pending.map((t) => (
                      <div key={t.id} style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "flex-start", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, marginBottom: 2 }}>{t.name}</p>
                          <p style={{ fontSize: 13, color: "#64748b" }}>{t.mobile} • {t.city} • {t.experience} yrs exp</p>
                          <p style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{(t.vehicleTypes || []).join(", ")}</p>
                          {t.adminNotes && <p style={{ fontSize: 11, color: "#7c3aed", marginTop: 4 }}>🤖 {t.adminNotes}</p>}
                        </div>
                        <button onClick={() => reviewOne(t)}
                          style={{ padding: "7px 16px", background: "#7c3aed", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                          AI Review
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Results */}
                {results.length > 0 && (
                  <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>REVIEW RESULTS</p>
                    {results.map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <span style={{ fontSize: 18 }}>{r.decision === "APPROVE" ? "✅" : r.decision === "REJECT" ? "❌" : "🚩"}</span>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 14 }}>{r.name} <span style={{ color: "#64748b", fontWeight: 400 }}>score: {r.score}/100</span></p>
                          <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{r.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Activity log */}
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8" }}>⚡ Activity Log</h3>
            </div>
            <div style={{ padding: 16, height: 500, overflowY: "auto" }}>
              {log.length === 0 ? (
                <p style={{ color: "#374151", fontSize: 13 }}>No activity yet...</p>
              ) : (
                log.map((entry, i) => (
                  <p key={i} style={{ fontSize: 12, color: "#64748b", marginBottom: 8, lineHeight: 1.5, borderBottom: "1px solid rgba(255,255,255,0.03)", paddingBottom: 8 }}>
                    {entry}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}