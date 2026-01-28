"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-6 border rounded-lg">
        <h1 className="text-xl font-bold mb-4">
          Learn Driving with Verified Trainers
        </h1>

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
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Book Driving Training
        </button>
      </div>
    </main>
  );
}
