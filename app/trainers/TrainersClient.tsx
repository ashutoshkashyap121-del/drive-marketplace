"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Vehicle = {
  type: "CAR" | "BIKE";
  dualControl: boolean;
  insured: boolean;
};

type Trainer = {
  id: number;
  name: string;
  city: string;
  experience: number;
  trainerType: "INDEPENDENT" | "DRIVING_SCHOOL";
  rating: number | null;
  basePrice: number | null;
  verifiedSchool: boolean;
  vehicles: Vehicle[];
};

const CITIES = ["Delhi NCR", "Mumbai", "Bangalore"];

export default function TrainersClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [vehicle, setVehicle] = useState(searchParams.get("vehicle") || "");
  const [pincode, setPincode] = useState(searchParams.get("pincode") || "");
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Fetch whenever city, vehicle, or a complete pincode changes
  useEffect(() => {
    if (!city || !vehicle) return;
    // Don't fire on partial pincode — only on empty or full 6-digit
    if (pincode.length > 0 && pincode.length < 6) return;

    setLoading(true);
    setSearched(true);

    const url = `/api/trainers?city=${encodeURIComponent(city)}&vehicle=${vehicle}${
      pincode.length === 6 ? `&pincode=${pincode}` : ""
    }`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.trainers ?? []);
        setTrainers(list);
        setLoading(false);
      })
      .catch(() => {
        setTrainers([]);
        setLoading(false);
      });
  }, [city, vehicle, pincode]);

  const handleBook = (trainer: Trainer) => {
    router.push(`/trainers/${trainer.id}/book`);
  };

  return (
    <main style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; }

        .top-bar {
          background: linear-gradient(135deg, #0B1437 0%, #1A2B5F 100%);
          padding: 20px 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .brand { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.3rem; color: #fff; text-decoration: none; }
        .brand span { color: #F59E0B; }

        .filter-bar {
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          padding: 16px 5%;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .filter-label { font-size: 0.8rem; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; }
        .filter-select {
          padding: 9px 14px;
          border: 2px solid #E2E8F0;
          border-radius: 10px;
          font-size: 0.88rem;
          font-family: inherit;
          color: #0F172A;
          background: #F8FAFC;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2364748B' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 30px;
        }
        .filter-select:focus { outline: none; border-color: #F59E0B; }

        .pincode-input {
          padding: 9px 14px;
          border: 2px solid #E2E8F0;
          border-radius: 10px;
          font-size: 0.88rem;
          font-family: inherit;
          color: #0F172A;
          background: #F8FAFC;
          width: 150px;
          transition: border-color 0.2s;
        }
        .pincode-input:focus { outline: none; border-color: #F59E0B; }
        .pincode-input::placeholder { color: #CBD5E1; }

        .vehicle-toggle { display: flex; gap: 8px; }
        .vbtn {
          padding: 9px 18px;
          border-radius: 10px;
          border: 2px solid #E2E8F0;
          background: #F8FAFC;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s;
        }
        .vbtn.active { border-color: #F59E0B; background: #FFFBEB; color: #92400E; }

        .result-meta {
          font-size: 0.85rem;
          color: #64748B;
          margin-left: auto;
        }

        .cards-area { padding: 28px 5%; max-width: 900px; margin: 0 auto; }

        .trainer-card {
          background: #FFFFFF;
          border-radius: 18px;
          border: 1px solid #E2E8F0;
          padding: 24px;
          margin-bottom: 16px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: start;
          transition: all 0.2s;
        }
        .trainer-card:hover { border-color: #F59E0B; box-shadow: 0 8px 32px rgba(0,0,0,0.08); }

        .trainer-name { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 700; color: #0F172A; margin-bottom: 6px; }

        .badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
        .badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.72rem; font-weight: 600;
          padding: 3px 10px; border-radius: 100px;
        }
        .badge-green { background: #DCFCE7; color: #166534; }
        .badge-blue { background: #DBEAFE; color: #1E40AF; }
        .badge-amber { background: #FEF3C7; color: #92400E; }
        .badge-gray { background: #F1F5F9; color: #475569; }

        .trainer-meta { font-size: 0.85rem; color: #64748B; display: flex; gap: 16px; flex-wrap: wrap; }
        .meta-item { display: flex; align-items: center; gap: 5px; }

        .price-block { text-align: right; }
        .price-amount { font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 800; color: #0F172A; }
        .price-note { font-size: 0.72rem; color: #94A3B8; margin-bottom: 12px; }

        .book-btn {
          display: block;
          background: linear-gradient(135deg, #F59E0B, #D97706);
          color: #FFFFFF;
          font-family: 'Sora', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 11px 22px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          box-shadow: 0 3px 12px rgba(245,158,11,0.35);
        }
        .book-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(245,158,11,0.45); }

        .rating-star { color: #F59E0B; font-weight: 700; }

        .empty-state {
          text-align: center;
          padding: 64px 20px;
          color: #94A3B8;
        }
        .empty-icon { font-size: 3rem; margin-bottom: 16px; }
        .empty-title { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 700; color: #475569; margin-bottom: 8px; }

        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 18px;
          height: 140px;
          margin-bottom: 16px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      {/* Top nav bar */}
      <div className="top-bar">
        <a href="/" className="brand">Learn<span>Drive</span></a>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>
          {searched && !loading ? `${trainers.length} trainer${trainers.length !== 1 ? "s" : ""} found` : "Find your trainer"}
        </span>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <span className="filter-label">Showing:</span>

        {/* City dropdown */}
        <select
          className="filter-select"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">Select city</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Vehicle toggle */}
        <div className="vehicle-toggle">
          <button className={`vbtn ${vehicle === "CAR" ? "active" : ""}`} onClick={() => setVehicle("CAR")}>
            🚗 Car
          </button>
          <button className={`vbtn ${vehicle === "BIKE" ? "active" : ""}`} onClick={() => setVehicle("BIKE")}>
            🏍️ Bike
          </button>
        </div>

        {/* Pincode filter — only fires fetch at 6 digits */}
        <input
          className="pincode-input"
          type="text"
          inputMode="numeric"
          placeholder="📍 Pincode (optional)"
          value={pincode}
          maxLength={6}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
        />

        {/* Clear pincode pill — shown when pincode is active */}
        {pincode.length === 6 && (
          <button
            onClick={() => setPincode("")}
            style={{
              padding: "6px 12px",
              borderRadius: 100,
              border: "none",
              background: "#FEF3C7",
              color: "#92400E",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {pincode} ✕
          </button>
        )}

        {searched && !loading && (
          <span className="result-meta">{trainers.length} result{trainers.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Main content */}
      <div className="cards-area">

        {/* Prompt to select */}
        {!city || !vehicle ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Select a city and vehicle type above</div>
            <p style={{ fontSize: "0.88rem" }}>to see available verified trainers near you</p>
          </div>
        ) : loading ? (
          <>
            <div className="skeleton" />
            <div className="skeleton" style={{ opacity: 0.7 }} />
            <div className="skeleton" style={{ opacity: 0.4 }} />
          </>
        ) : trainers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">😕</div>
            <div className="empty-title">No trainers found{pincode.length === 6 ? ` in pincode ${pincode}` : ` in ${city}`}</div>
            <p style={{ fontSize: "0.88rem" }}>
              {pincode.length === 6
                ? "Try clearing the pincode filter to see all trainers in your city."
                : "We're onboarding trainers fast — check back soon or try another city."}
            </p>
          </div>
        ) : (
          trainers.map((trainer) => {
            const hasVehicle = trainer.vehicles?.find(v => v.type === vehicle);
            const isDualControl = hasVehicle?.dualControl;
            const isInsured = hasVehicle?.insured;

            return (
              <div key={trainer.id} className="trainer-card">
                {/* Left: trainer info */}
                <div>
                  <div className="trainer-name">{trainer.name}</div>

                  <div className="badge-row">
                    <span className="badge badge-green">✓ RTO Verified</span>
                    {trainer.verifiedSchool && (
                      <span className="badge badge-blue">🏫 School</span>
                    )}
                    {isDualControl && (
                      <span className="badge badge-amber">🔧 Dual Control</span>
                    )}
                    {isInsured && (
                      <span className="badge badge-gray">🛡️ Insured Vehicle</span>
                    )}
                    <span className="badge badge-gray">
                      {trainer.trainerType === "DRIVING_SCHOOL" ? "🏫 Driving School" : "👤 Independent"}
                    </span>
                  </div>

                  <div className="trainer-meta">
                    <span className="meta-item">📍 {trainer.city}</span>
                    <span className="meta-item">⏱ {trainer.experience} yr{trainer.experience !== 1 ? "s" : ""} experience</span>
                    {trainer.rating && trainer.rating > 0 ? (
                      <span className="meta-item rating-star">★ {trainer.rating.toFixed(1)}</span>
                    ) : (
                      <span className="meta-item" style={{ color: "#CBD5E1" }}>No rating yet</span>
                    )}
                  </div>
                </div>

                {/* Right: price + book */}
                <div className="price-block">
                  <div className="price-amount">
                    ₹{(trainer.basePrice ?? 5000).toLocaleString("en-IN")}
                  </div>
                  <div className="price-note">starting price</div>
                  <button className="book-btn" onClick={() => handleBook(trainer)}>
                    Book Now →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}