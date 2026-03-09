// app/trainers/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TrainerPage({ params }: Props) {
  const { id: idStr } = await params;
  let trainer = null;
  try {
    trainer = await prisma.trainer.findUnique({
      where: { id: parseInt(idStr) },
    });
  } catch (err) {
    console.error("Trainer fetch error:", err);
  }

  if (!trainer) return notFound();

  const vehicles: string[] = Array.isArray(trainer.vehicleTypes) ? (trainer.vehicleTypes as string[]) : [];
  const langs: string[] = Array.isArray(trainer.languages) ? (trainer.languages as string[]) : [];

  return (
    <main style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Nav */}
      <nav style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0 5%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 12 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <Image src="/logo.png" alt="LearnDrive" width={110} height={34} style={{ objectFit: "contain" }} />
          </Link>
          <div style={{ flex: 1 }} />
          <Link href="/trainers" style={{ color: "#64748B", textDecoration: "none", fontSize: 14 }}>← All Trainers</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "36px 5% 60px" }}>

        {/* Header card - dark gradient matching booking page header */}
        <div style={{ background: "linear-gradient(145deg, #0B1437 0%, #1A2B5F 100%)", borderRadius: 20, padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🧑‍🏫</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#FFFFFF" }}>{trainer.name}</h1>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 99, padding: "3px 12px", fontSize: 13 }}>📍 {trainer.city}</span>
                {(trainer.experience as number) > 0 && (
                  <span style={{ background: "rgba(245,158,11,0.2)", color: "#FCD34D", borderRadius: 99, padding: "3px 12px", fontSize: 13, fontWeight: 600 }}>{trainer.experience} yrs exp</span>
                )}
                {vehicles.map((v) => (
                  <span key={v} style={{ background: "rgba(96,165,250,0.15)", color: "#93C5FD", borderRadius: 99, padding: "3px 12px", fontSize: 13 }}>{v}</span>
                ))}
              </div>
              {langs.length > 0 && <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 8 }}>Speaks: {langs.join(", ")}</p>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 800, color: "#F59E0B" }}>₹{(trainer.basePrice as number)?.toLocaleString("en-IN")}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>per session</div>
            </div>
          </div>
        </div>

        {/* About */}
        {(trainer as any).about && (
          <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 10 }}>About</h2>
            <p style={{ color: "#64748B", lineHeight: 1.7 }}>{(trainer as any).about}</p>
          </div>
        )}

        {/* Included */}
        <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>What's included</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {["Dual-control car", "RTO test prep", "Flexible timings", "Pickup from your location"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#374151" }}>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Book CTA */}
        <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", padding: 28, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 8, color: "#0F172A" }}>Ready to start learning?</h2>
          <p style={{ color: "#64748B", marginBottom: 24, fontSize: 15 }}>Book a trial class with {trainer.name}. Pay securely online.</p>
          <Link href={`/trainers/${trainer.id}/book`} style={{ display: "inline-block", background: "#F59E0B", color: "#FFFFFF", padding: "14px 40px", borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 20px rgba(245,158,11,0.35)" }}>
            Book a Trial Class →
          </Link>
          <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 12 }}>Free cancellation · Secure payment via Razorpay</p>
        </div>

      </div>
    </main>
  );
}