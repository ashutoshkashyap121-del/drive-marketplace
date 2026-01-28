"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-6 border rounded-lg w-96">
        <h1 className="text-xl font-bold mb-2">
          Learn Driving with Verified Trainers
        </h1>

        <p className="text-sm text-gray-600 mb-4">
          Book driving training near you
        </p>

        <select
          className="border p-2 w-full mb-4"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">Select City</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
        </select>

        <button
          disabled={!city}
          onClick={() => router.push(`/trainers?city=${city}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
        >
          View Trainers
        </button>
      </div>
    </main>
  );
}
