"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessClient() {
  const params = useSearchParams();
  const router = useRouter();

  const bookingId = params.get("id");

  return (
    <main className="min-h-screen bg-gray-50 px-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center space-y-4">

        <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          ✅
        </div>

        <h1 className="text-xl font-semibold">
          Booking Confirmed
        </h1>

        <p className="text-sm text-gray-600">
          Your driving training booking has been successfully placed.
        </p>

        <div className="bg-gray-100 rounded-xl py-3">
          <div className="text-xs text-gray-500">Booking ID</div>
          <div className="text-lg font-bold">{bookingId}</div>
        </div>

        <p className="text-xs text-gray-500">
          Our trainer will contact you shortly.  
          Please be available at your pickup location.
        </p>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}
