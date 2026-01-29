"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [vehicle, setVehicle] = useState("");

  const canProceed = city && vehicle;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="LearnDrive"
            width={120}
            height={40}
            priority
          />
        </div>

        {/* Headline */}
        <h1 className="text-xl font-semibold text-center text-gray-900">
          Learn Driving from Verified Trainers
        </h1>

        <p className="text-sm text-gray-600 text-center mt-1">
          Book professional car or bike driving training near you
        </p>

    <div className="flex justify-center gap-4 mt-3 text-xs text-gray-600">
  <span className="flex items-center gap-1">
    ✅ Verified Trainers
  </span>
  <span className="flex items-center gap-1">
    🕒 Flexible Timings
  </span>
  <span className="flex items-center gap-1">
    🛡 Safe Areas
  </span>
</div>

        {/* City */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700">
            City
          </label>
          <select
            className="w-full mt-1 border rounded-xl px-4 py-3"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select your city</option>
            <option value="Delhi">Delhi NCR</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mumbai">Mumbai</option>
          </select>
        </div>

        {/* Vehicle */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">
            Vehicle Type
          </label>
          <select
            className="w-full mt-1 border rounded-xl px-4 py-3"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          >
            <option value="">Select vehicle</option>
            <option value="CAR">Car</option>
            <option value="BIKE">Bike</option>
          </select>
        </div>

        {/* CTA */}
        <button
          disabled={!canProceed}
          onClick={() =>
            router.push(`/trainers?city=${city}&vehicle=${vehicle}`)
          }
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold disabled:opacity-40 active:scale-95 transition"
        >
          Find Trainers
        </button>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mt-3 text-center">
          By continuing, you confirm that you are 18+ and legally eligible to
          learn driving.
        </p>

        {/* Footer */}
        <div className="mt-5 text-xs text-gray-500 text-center">
          <a href="/terms" className="underline mr-3">Terms</a>
          <a href="/privacy" className="underline">Privacy</a>
        </div>
      </div>
    </main>
  );
}
