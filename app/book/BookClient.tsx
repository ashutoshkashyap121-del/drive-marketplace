"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function BookClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const trainerId = searchParams.get("trainerId");
  const trainerName = searchParams.get("trainerName");
  const amount = Number(searchParams.get("amount") || 0);

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid =
    customerName &&
    mobile.length === 10 &&
    city &&
    address &&
    consent;

  async function confirmBooking() {
    if (!isFormValid) return;

    try {
      setLoading(true);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerId,
          trainerName,
          packageName: "Standard",
          amount,
          customerName,
          mobile,
          city,
          address,
        }),
      });

      if (!res.ok) {
        throw new Error("Booking failed");
      }

      const data = await res.json();
      router.push(`/success?id=${data.id}`);
    } catch (err) {
      alert("Booking failed. Check server logs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">

        <h1 className="text-xl font-semibold text-center">
          Confirm Your Booking
        </h1>

        <div className="border p-4 rounded">
          <p><b>Trainer:</b> {trainerName}</p>
          <p><b>Amount:</b> ₹{amount}</p>
        </div>

        <input
          placeholder="Your Name"
          className="border w-full p-2"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
        />

        <input
          placeholder="Mobile"
          className="border w-full p-2"
          value={mobile}
          onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
        />

        <select
          className="border w-full p-2"
          value={city}
          onChange={e => setCity(e.target.value)}
        >
          <option value="">Select City</option>
          <option>Delhi</option>
          <option>Noida</option>
          <option>Gurgaon</option>
        </select>

        <textarea
          placeholder="Pickup Address"
          className="border w-full p-2"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />

        <label className="text-sm flex gap-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
          />
          I agree to terms
        </label>

        <button
          disabled={!isFormValid || loading}
          onClick={confirmBooking}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </main>
  );
}
