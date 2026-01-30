"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const [city, setCity] = useState("");
  const [vehicle, setVehicle] = useState("");

  function handleSearch() {
    if (!city || !vehicle) return;
    router.push(`/trainers?city=${city}&vehicle=${vehicle}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-6">

        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/logo.png"
            alt="LearnDrive"
            className="h-16"
          />
        </div>

        {/* Headline */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold text-gray-900">
            Learn Driving from Verified Trainers
          </h1>
          <p className="text-sm text-gray-600">
            Book professional car or bike driving training near you
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-4 text-xs text-gray-600">
          <span>✔ Verified Trainers</span>
          <span>✔ Flexible Timings</span>
          <span>✔ Safe Areas</span>
        </div>

        {/* City */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 bg-white"
          >
            <option value="">Select your city</option>
            <option value="Delhi">Delhi NCR</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mumbai">Mumbai</option>
          </select>
        </div>

        {/* Vehicle */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Vehicle Type
          </label>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 bg-white"
          >
            <option value="">Select vehicle</option>
            <option value="CAR">Car</option>
            <option value="BIKE">Bike</option>
          </select>
        </div>

        {/* CTA */}
        <button
          onClick={handleSearch}
          disabled={!city || !vehicle}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-40 transition"
        >
          Find Trainers
        </button>

        {/* Disclaimer */}
        <p className="text-[11px] text-center text-gray-500 leading-snug">
          By continuing, you confirm that you are <b>18+</b> and legally
          eligible to learn driving.
        </p>

        {/* Footer links */}
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/privacy" className="hover:underline">Privacy</a>
        </div>

      </div>
    </main>
  );
}
