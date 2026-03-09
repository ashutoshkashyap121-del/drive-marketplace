// app/trainers/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface Props {
  params: { id: string };
}

export default async function TrainerPage({ params }: Props) {
  let trainer = null;

  try {
    trainer = await prisma.trainer.findUnique({
      where: { id: params.id },
    });
  } catch (err) {
    console.error("Trainer fetch error:", err);
  }

  if (!trainer) return notFound();

  const vehicles: string[] = Array.isArray(trainer.vehicleTypes)
    ? (trainer.vehicleTypes as string[])
    : [];
  const langs: string[] = Array.isArray(trainer.languages)
    ? (trainer.languages as string[])
    : [];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#08111f",
        color: "#fff",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .badge { display:inline-block; padding:4px 12px; border-radius:99px; font-size:13px; font-weight:600; }
      `}</style>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #1e2d42", padding: "0 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#08111f", fontSize: 14 }}>LD</div>
            <span className="font-display" style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>LearnDrive</span>
          </Link>
          <div style={{ flex: 1 }} />
          <Link href="/trainers" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>← All Trainers</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header card */}
        <div style={{ background: "#0d1e33", border: "1px solid #1e2d42", borderRadius: 20, padding: 32, marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 72, height: 72, borderRadius: 16, background: "#1e2d42", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
              🧑‍🏫
            </div>
            <div style={{ flex: 1 }}>
              <h1 className="font-display" style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, color: "#fff" }}>
                {trainer.name}
              </h1>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <span className="badge" style={{ background: "#1e2d42", color: "#94a3b8" }}>📍 {trainer.city}</span>
                {(trainer.experience as number) > 0 && (
                  <span className="badge" style={{ background: "#1e2d42", color: "#fbbf24" }}>
                    {trainer.experience} yrs exp
                  </span>
                )}
                {vehicles.map((v) => (
                  <span key={v} className="badge" style={{ background: "#162030", color: "#60a5fa" }}>{v}</span>
                ))}
              </div>
              {langs.length > 0 && (
                <p style={{ color: "#64748b", fontSize: 14 }}>Speaks: {langs.join(", ")}</p>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#fbbf24" }}>
                ₹{(trainer.basePrice as number)?.toLocaleString()}
              </div>
              <div style={{ color: "#64748b", fontSize: 13 }}>per session</div>
            </div>
          </div>
        </div>

        {/* About */}
        {(trainer as any).about && (
          <div style={{ background: "#0d1e33", border: "1px solid #1e2d42", borderRadius: 20, padding: 28, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>About</h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.7 }}>{(trainer as any).about}</p>
          </div>
        )}

        {/* Book CTA */}
        <div style={{ background: "linear-gradient(135deg, #1e2d42, #0d1e33)", border: "1px solid #fbbf2433", borderRadius: 20, padding: 32, textAlign: "center" }}>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            Ready to start learning?
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: 24, fontSize: 15 }}>
            Book a trial class with {trainer.name} — pay securely online.
          </p>
          <Link
            href={`/book/${trainer.id}`}
            style={{
              display: "inline-block",
              background: "#fbbf24",
              color: "#08111f",
              padding: "14px 36px",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
            }}
          >
            Book a Trial Class
          </Link>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 12 }}>
            Free cancellation · Secure payment via Razorpay
          </p>
        </div>

      </div>
    </main>
  );
}