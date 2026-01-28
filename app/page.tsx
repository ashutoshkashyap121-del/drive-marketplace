"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-4">
          Learn Driving with Verified Trainers
        </h1>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 w-full mb-4"
        >
          <option value="">Select City</option>
          <option value="Delhi">Delhi</option>
          <option value="Noida">Noida</option>
        </select>

        <button
          disabled={!city}
          onClick={() => router.push(`/trainers?city=${city}`)}
          className="bg-blue-600 text-white p-2 w-full rounded disabled:opacity-50"
        >
          Book Driving Training
        </button>
      </div>
    </main>
  );
}
