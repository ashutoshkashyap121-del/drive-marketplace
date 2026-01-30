"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessClient() {
  const params = useSearchParams();
  const router = useRouter();

  const bookingId = params.get("id");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center space-y-5">

        {/* Logo */}
        <img
          src="/logo.png"
          alt="LearnDrive"
          className="mx-auto h-14"
        />

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-gray-900">
          Booking Confirmed
        </h1>

        <p className="text-sm text-gray-600">
          Your driving training booking has been successfully placed.
        </p>

        {/* Booking ID */}
        <div className="bg-gray-50 rounded-xl py-3">
          <p className="text-xs text-gray-500">Booking ID</p>
          <p className="text-lg font-bold text-blue-700">
            {bookingId}
          </p>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-600 space-y-1">
          <p>📞 Our trainer will call you shortly</p>
          <p>📍 Please be available at your pickup location</p>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Back to Home
        </button>

      </div>
    </main>
  );
}
