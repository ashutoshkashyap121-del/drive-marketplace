"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Trainer = {
  id: number;
  name: string;
  city: string;
  bio: string | null;
  experience: number;
  vehicleTypes: string[];
  languages: string[];
  basePrice: number | null;
  trainerType: string;
  serviceArea: string[];
};

const CITIES = ["Delhi NCR", "Mumbai", "Bangalore"];
const VEHICLE_LABELS: Record<string, string> = {
  CAR: "🚗 Car",
  BIKE_GEARED: "⚙️ Bike (Geared)",
  BIKE_NON_GEARED: "🛵 Bike (Non-Geared)",
};

function TrainersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [pincode, setPincode] = useState(searchParams.get("pincode") ?? "");
  const [vehicleCategory, setVehicleCategory] = useState(() => {
    const v = searchParams.get("vehicle") ?? "";
    return v === "CAR" ? "CAR" : v.startsWith("BIKE") ? "BIKE" : "";
  });
  const [vehicle, setVehicle] = useState(searchParams.get("vehicle") ?? "");
  const [trainers, setTrainers] = useState<Trainer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleVehicleCategory = (cat: string) => {
    setVehicleCategory(cat);
    if (cat === "CAR") setVehicle("CAR");
    else setVehicle("");
  };

  async function handleSearch(pc = pincode, vc = vehicle) {
    if (pc.length !== 6 || isNaN(Number(pc))) { setError("Please enter a valid 6-digit pincode"); return; }
    if (!vc) { setError("Please select a vehicle type"); return; }
    setError("");
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ pincode: pc });
      params.set("vehicle", vc);
      const res = await fetch(`/api/trainers/search?${params.toString()}`);
      const data = await res.json();
      if (data.success) setTrainers(data.trainers);
      else setError(data.message ?? "Something went wrong");
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialPincode = searchParams.get("pincode") ?? "";
    const initialVehicle = searchParams.get("vehicle") ?? "";
    if (initialPincode.length === 6 && initialVehicle) {
      handleSearch(initialPincode, initialVehicle);
    }
  }, []);

  return (
    <main style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F8F7F4", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .form-select-t { padding: 10px 14px; border: 2px solid rgba(255,255,255,0.2); border-radius: 10px; font-size: 0.88rem; font-family: inherit; color: #FFFFFF; background: rgba(255,255,255,0.1); appearance: none; cursor: pointer; min-width: 130px; }
        .form-select-t:focus { outline: none; border-color: #F59E0B; }
        .form-select-t option { color: #0F172A; background: #FFFFFF; }
        .vbtn { padding: 9px 16px; border-radius: 10px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); cursor: pointer; font-family: inherit; font-size: 0.85rem; font-weight: 600; color: #FFFFFF; transition: all 0.2s; }
        .vbtn.active { border-color: #F59E0B; background: #F59E0B; color: #000; }
        .vbtn:hover { border-color: #F59E0B; }
        .search-btn { padding: 10px 24px; background: linear-gradient(135deg, #F59E0B, #D97706); color: #FFFFFF; font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(245,158,11,0.4); white-space: nowrap; }
        .search-btn:hover { transform: translateY(-1px); }
        .trainer-card { background: #FFFFFF; border-radius: 20px; border: 1px solid #E2E8F0; padding: 24px; transition: all 0.2s; }
        .trainer-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .badge { display: inline-block; font-size: 0.72rem; font-weight: 600; padding: 4px 10px; border-radius: 100px; }
        .book-btn { display: block; width: 100%; padding: 14px; background: linear-gradient(135deg, #0B1437, #1A2B5F); color: #FFFFFF; font-family: 'Sora', sans-serif; font-size: 0.9rem; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; transition: all 0.2s; text-align: center; text-decoration: none; letter-spacing: 0.3px; }
        .book-btn:hover { background: linear-gradient(135deg, #1A2B5F, #0F3460); box-shadow: 0 4px 16px rgba(11,20,55,0.3); }
      `}</style>

      {/* Search bar header */}
      <div style={{ background: "linear-gradient(145deg, #0B1437 0%, #1A2B5F 100%)", padding: "28px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.85rem" }}>Home</a>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
            <span style={{ color: "#F59E0B", fontSize: "0.85rem", fontWeight: 600 }}>Find Trainers</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
            {/* City */}
            <div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>City</p>
              <select className="form-select-t" value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">All cities</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Pincode */}
            <div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Pincode</p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                style={{ padding: "10px 14px", border: "2px solid rgba(255,255,255,0.2)", borderRadius: 10, fontSize: "0.88rem", fontFamily: "inherit", color: "#FFFFFF", background: "rgba(255,255,255,0.1)", outline: "none", width: 150 }}
                onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.2)")}
              />
            </div>

            {/* Vehicle */}
            <div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Vehicle</p>
              <div style={{ display: "flex", gap: 6 }}>
                <button className={`vbtn ${vehicleCategory === "CAR" ? "active" : ""}`} onClick={() => handleVehicleCategory("CAR")}>🚗 Car</button>
                <button className={`vbtn ${vehicleCategory === "BIKE" ? "active" : ""}`} onClick={() => handleVehicleCategory("BIKE")}>🏍️ Bike</button>
              </div>
            </div>

            {/* Bike type */}
            {vehicleCategory === "BIKE" && (
              <div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>Bike Type</p>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className={`vbtn ${vehicle === "BIKE_GEARED" ? "active" : ""}`} onClick={() => setVehicle("BIKE_GEARED")}>⚙️ Geared</button>
                  <button className={`vbtn ${vehicle === "BIKE_NON_GEARED" ? "active" : ""}`} onClick={() => setVehicle("BIKE_NON_GEARED")}>🛵 Non-Geared</button>
                </div>
              </div>
            )}

            <button className="search-btn" onClick={() => handleSearch()} disabled={loading}>
              {loading ? "Searching…" : "Search"}
            </button>
          </div>

          {error && <p style={{ color: "#FCA5A5", fontSize: "0.82rem", marginTop: 10 }}>{error}</p>}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 5%" }}>
        {!searched && (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <p style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</p>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Search for Trainers</p>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Enter your pincode and select a vehicle type to find trainers near you</p>
          </div>
        )}

        {searched && loading && (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <p style={{ color: "#64748B" }}>Finding trainers near you...</p>
          </div>
        )}

        {searched && !loading && trainers?.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <p style={{ fontSize: "3rem", marginBottom: 16 }}>😕</p>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>No trainers found</p>
            <p style={{ color: "#64748B", fontSize: "0.9rem" }}>Try a nearby pincode or remove the vehicle filter</p>
          </div>
        )}

        {trainers && trainers.length > 0 && (
          <>
            <p style={{ color: "#64748B", fontSize: "0.88rem", marginBottom: 24 }}>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: "#0F172A", fontSize: "1.1rem" }}>{trainers.length} trainer{trainers.length !== 1 ? "s" : ""}</span> found near pincode {pincode}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
              {trainers.map((trainer) => (
                <div key={trainer.id} className="trainer-card">
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.05rem", fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>{trainer.name}</h2>
                      <p style={{ fontSize: "0.82rem", color: "#64748B" }}>📍 {trainer.city} · {trainer.experience} yr{trainer.experience !== 1 ? "s" : ""} exp</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {trainer.basePrice ? (
                        <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, color: "#F59E0B", fontSize: "1.1rem" }}>₹{trainer.basePrice}<span style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 400 }}>/hr</span></p>
                      ) : (
                        <p style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Price on request</p>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    <span className="badge" style={{ background: "#EFF6FF", color: "#1D4ED8" }}>{trainer.trainerType}</span>
                    {trainer.vehicleTypes.map((v) => (
                      <span key={v} className="badge" style={{ background: "#F1F5F9", color: "#475569" }}>{VEHICLE_LABELS[v] ?? v}</span>
                    ))}
                  </div>

                  {/* Languages */}
                  <p style={{ fontSize: "0.8rem", color: "#94A3B8", marginBottom: 12 }}>🗣 {trainer.languages.join(", ")}</p>

                  {/* Bio */}
                  {trainer.bio && (
                    <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.6, marginBottom: 16, borderTop: "1px solid #F1F5F9", paddingTop: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {trainer.bio}
                    </p>
                  )}

                  <a href={`/trainers/${trainer.id}/book`} className="book-btn">Book This Trainer →</a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function TrainersPage() {
  return (
    <Suspense>
      <TrainersContent />
    </Suspense>
  );
}