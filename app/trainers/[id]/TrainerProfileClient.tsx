"use client";

import { useRouter } from "next/navigation";

type Vehicle = {
  type: string;
  vehicleNumber: string | null;
  vehicleYear: number | null;
  dualControl: boolean;
  insured: boolean;
  insuranceValidUntil: string | null;
};

type Trainer = {
  id: number;
  name: string;
  mobile: string;
  city: string;
  bio: string | null;
  experience: number;
  vehicleTypes: string[];
  languages: string[];
  basePrice: number | null;
  rating: number | null;
  trainerType: string;
  vehicles: Vehicle[];
};

const VEHICLE_LABELS: Record<string, { label: string; icon: string }> = {
  CAR: { label: "Car", icon: "🚗" },
  BIKE_GEARED: { label: "Geared Bike", icon: "🏍️" },
  BIKE_NON_GEARED: { label: "Scooter", icon: "🛵" },
};

export default function TrainerProfileClient({ trainer }: { trainer: Trainer }) {
  const router = useRouter();
  const car = trainer.vehicles.find((v) => v.type === "CAR");
  const hasDualControl = car?.dualControl;

  const handleBook = () => {
    router.push(
      `/trainers/${trainer.id}/book?trainerName=${encodeURIComponent(trainer.name)}&city=${encodeURIComponent(trainer.city)}&amount=${trainer.basePrice ?? 0}`
    );
  };

  return (
    <main style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .top-bar {
          background: linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%);
          padding: 18px 5%;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .brand { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.3rem; color: #fff; text-decoration: none; }
        .brand span { color: #F59E0B; }
        .back-btn { color: rgba(255,255,255,0.6); font-size: 0.85rem; text-decoration: none; display: flex; align-items: center; gap: 6px; margin-right: auto; }
        .back-btn:hover { color: #F59E0B; }

        .hero-band {
          background: linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%);
          padding: 40px 5% 60px;
        }
        .hero-inner { max-width: 860px; margin: 0 auto; }

        .avatar {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F59E0B, #D97706);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Sora', sans-serif;
          font-size: 2rem; font-weight: 800;
          color: #0B1437;
          margin-bottom: 16px;
          flex-shrink: 0;
        }

        .trainer-name { font-family: 'Sora', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 6px; }
        .trainer-sub { color: rgba(255,255,255,0.6); font-size: 0.9rem; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .trainer-sub .dot { width: 4px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 50%; }

        .badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 0.75rem; font-weight: 600;
          padding: 5px 12px; border-radius: 100px;
        }
        .badge-green { background: rgba(74,222,128,0.15); color: #4ADE80; border: 1px solid rgba(74,222,128,0.25); }
        .badge-amber { background: rgba(245,158,11,0.15); color: #F59E0B; border: 1px solid rgba(245,158,11,0.25); }
        .badge-blue { background: rgba(96,165,250,0.15); color: #60A5FA; border: 1px solid rgba(96,165,250,0.25); }

        .content-area { max-width: 860px; margin: -32px auto 0; padding: 0 5% 60px; position: relative; }

        .card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          padding: 28px;
          margin-bottom: 16px;
        }
        .card-title {
          font-family: 'Sora', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }

        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
        .info-item { }
        .info-label { font-size: 0.75rem; color: #94A3B8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .info-value { font-size: 0.95rem; color: #0F172A; font-weight: 600; }

        .vehicle-card {
          background: #F8FAFC;
          border-radius: 14px;
          padding: 16px;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .vehicle-icon { font-size: 1.8rem; }
        .vehicle-name { font-weight: 700; color: #0F172A; font-size: 0.95rem; }
        .vehicle-detail { font-size: 0.8rem; color: #64748B; margin-top: 2px; }

        .lang-pill {
          display: inline-flex; align-items: center;
          background: #F1F5F9; color: #475569;
          font-size: 0.82rem; font-weight: 600;
          padding: 6px 14px; border-radius: 100px;
          border: 1px solid #E2E8F0;
        }

        .bio-text { font-size: 0.95rem; color: #475569; line-height: 1.75; }

        .sticky-footer {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: #fff;
          border-top: 1px solid #E2E8F0;
          padding: 16px 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          z-index: 50;
          box-shadow: 0 -8px 32px rgba(0,0,0,0.08);
        }
        .price-big { font-family: 'Sora', sans-serif; font-size: 1.6rem; font-weight: 800; color: #0F172A; }
        .price-note { font-size: 0.75rem; color: #94A3B8; margin-top: 2px; }

        .book-btn {
          background: linear-gradient(135deg, #F59E0B, #D97706);
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          padding: 14px 36px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(245,158,11,0.4);
          white-space: nowrap;
        }
        .book-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,158,11,0.5); }

        .rating-star { color: #F59E0B; font-weight: 800; font-size: 1.1rem; }

        @media (max-width: 600px) {
          .trainer-name { font-size: 1.5rem; }
          .price-big { font-size: 1.3rem; }
          .book-btn { padding: 14px 24px; font-size: 0.9rem; }
        }
      `}</style>

      {/* Top nav */}
      <div className="top-bar">
        <a href="/trainers" className="back-btn">← Back to trainers</a>
        <a href="/" className="brand">Learn<span>Drive</span></a>
      </div>

      {/* Hero band */}
      <div className="hero-band">
        <div className="hero-inner">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
            <div className="avatar">{trainer.name.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <div className="trainer-name">{trainer.name}</div>
              <div className="trainer-sub">
                <span>📍 {trainer.city}</span>
                <span className="dot" />
                <span>⏱ {trainer.experience} yrs experience</span>
                {trainer.rating && trainer.rating > 0 && (
                  <>
                    <span className="dot" />
                    <span className="rating-star">★ {trainer.rating.toFixed(1)}</span>
                  </>
                )}
              </div>
              <div className="badge-row">
                <span className="badge badge-green">✓ RTO Verified</span>
                <span className="badge badge-green">✓ Background Checked</span>
                {hasDualControl && <span className="badge badge-amber">🔧 Dual Control Car</span>}
                {trainer.trainerType === "DRIVING_SCHOOL"
                  ? <span className="badge badge-blue">🏫 Driving School</span>
                  : <span className="badge badge-blue">👤 Independent</span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="content-area">

        {/* About */}
        {trainer.bio && (
          <div className="card">
            <div className="card-title">About</div>
            <p className="bio-text">{trainer.bio}</p>
          </div>
        )}

        {/* Key info */}
        <div className="card">
          <div className="card-title">Training Details</div>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Vehicle Types</div>
              <div className="info-value">
                {trainer.vehicleTypes.map((v) => VEHICLE_LABELS[v]?.label ?? v).join(", ")}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">Languages</div>
              <div className="info-value">{trainer.languages.join(", ")}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Experience</div>
              <div className="info-value">{trainer.experience} years</div>
            </div>
            <div className="info-item">
              <div className="info-label">City</div>
              <div className="info-value">{trainer.city}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Pickup</div>
              <div className="info-value">🏠 From your location</div>
            </div>
          </div>
        </div>

        {/* Vehicles */}
        {trainer.vehicles.length > 0 && (
          <div className="card">
            <div className="card-title">Training Vehicle{trainer.vehicles.length > 1 ? "s" : ""}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {trainer.vehicles.map((v, i) => (
                <div key={i} className="vehicle-card">
                  <div className="vehicle-icon">{VEHICLE_LABELS[v.type]?.icon ?? "🚗"}</div>
                  <div>
                    <div className="vehicle-name">{VEHICLE_LABELS[v.type]?.label ?? v.type}</div>
                    <div className="vehicle-detail">
                      {v.vehicleYear && `${v.vehicleYear} model`}
                      {v.dualControl && " · Dual Control"}
                      {v.insured && " · Insured"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        <div className="card">
          <div className="card-title">Teaches In</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {trainer.languages.map((lang) => (
              <span key={lang} className="lang-pill">🗣️ {lang}</span>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div className="card" style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "✓ RTO-verified trainer with valid driving licence",
              "✓ Background and police verification done",
              "✓ Trainer comes to your home or office",
              "✓ Secure payment — no cash required",
            ].map((point) => (
              <div key={point} style={{ fontSize: "0.88rem", color: "#92400E", fontWeight: 500 }}>{point}</div>
            ))}
          </div>
        </div>

        {/* Spacer for sticky footer */}
        <div style={{ height: 100 }} />
      </div>

      {/* Sticky book footer */}
      <div className="sticky-footer">
        <div>
          <div className="price-big">₹{(trainer.basePrice ?? 0).toLocaleString("en-IN")}</div>
          <div className="price-note">per session · no hidden charges</div>
        </div>
        <button className="book-btn" onClick={handleBook}>
          Book Now →
        </button>
      </div>
    </main>
  );
}