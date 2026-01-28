"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("");

  function handleSearch() {
    if (!city) return;
    router.push(`/trainers?city=${city}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Learn Driving with Verified Trainers
        </h1>

        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select City</option>
            <option value="Delhi">Delhi</option>
            <option value="Noida">Noida</option>
            <option value="Gurgaon">Gurgaon</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Find Trainers
        </button>
      </div>
    </main>
  );
}
