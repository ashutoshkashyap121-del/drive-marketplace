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
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-2 text-center">
          Learn Driving with Verified Trainers
        </h1>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Book bike or car driving training near you
        </p>

        <label className="text-sm font-medium">City</label>
        <select
          className="w-full border rounded-lg px-3 py-2 mt-1 mb-4"
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
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:bg-gray-400"
        >
          Book Driving Training
        </button>
      </div>
    </main>
  );
}
