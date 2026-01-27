"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("");

  function handleSearch() {
    if (!city) return;
    router.push(`/trainers?city=${city}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          Learn Driving with Verified Trainers
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Book car driving training near you
        </p>

        <label className="block text-sm font-medium mb-1">City</label>
        <select
          className="w-full border rounded-lg px-3 py-2 mb-4"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">Select City</option>
          <option value="Delhi">Delhi</option>
          <option value="Noida">Noida</option>
          <option value="Gurgaon">Gurgaon</option>
        </select>

        <button
          onClick={handleSearch}
          disabled={!city}
          className={`w-full py-3 rounded-lg font-semibold text-white ${
            city ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
          }`}
        >
          Find Trainers
        </button>
      </div>
    </main>
  );
}
