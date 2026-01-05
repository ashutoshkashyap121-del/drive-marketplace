"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [vehicle, setVehicle] = useState("");

  const handleSubmit = () => {
    if (!city || !vehicle) return;
    router.push(`/trainers?city=${city}&vehicle=${vehicle}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Learn Driving with Verified Trainers
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Book bike or car driving training near you
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">City</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select City</option>
            <option value="bangalore">Bangalore</option>
            <option value="delhi-ncr">Delhi NCR</option>
            <option value="mumbai">Mumbai</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Vehicle</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          >
            <option value="">Select Vehicle</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
          disabled={!city || !vehicle}
        >
          Book Driving Training
        </button>
      </div>
    </main>
  );
}
