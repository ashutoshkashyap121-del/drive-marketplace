"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function BookClient() {
  const params = useSearchParams();
  const router = useRouter();

  const trainerId = params.get("trainerId") || "";
  const trainerName = params.get("trainerName") || "";
  const city = params.get("city") || "";
  const amount = Number(params.get("amount") || 0);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [consent, setConsent] = useState(false);

  const isValid =
    name.trim().length > 0 &&
    mobile.length === 10 &&
    address.trim().length > 0 &&
    consent;

  async function confirmBooking() {
    if (!isValid) return;

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainerId,
        trainerName,
        amount,
        customerName: name,
        mobile,
        city,
        address,
      }),
    });

    const data = await res.json();
    router.push(`/success?id=${data.id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">

        <h1 className="text-xl font-semibold text-center">
          Confirm Your Booking
        </h1>

        {/* Booking summary */}
        <div className="bg-blue-50 rounded-xl p-4 text-sm">
          <p><b>Trainer:</b> {trainerName}</p>
          <p><b>City:</b> {city}</p>
          <p className="mt-2 text-lg font-bold text-blue-700">₹{amount}</p>
        </div>

        <input
          placeholder="Your Name"
          className="w-full border rounded-xl px-4 py-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Mobile Number"
          className="w-full border rounded-xl px-4 py-3"
          value={mobile}
          inputMode="numeric"
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
        />

        <textarea
          placeholder="Pickup Address"
          className="w-full border rounded-xl px-4 py-3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label className="flex gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          I confirm I am 18+, legally eligible to learn driving, and accept risks.
        </label>

        <button
          onClick={confirmBooking}
          disabled={!isValid}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-40"
        >
          Confirm Booking
        </button>
      </div>
    </main>
  );
}
