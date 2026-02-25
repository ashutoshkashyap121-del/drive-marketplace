"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessClient() {
  const params = useSearchParams();
  const router = useRouter();
  const bookingId = params.get("id");
  const trainerName = params.get("trainer");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-5">

        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl">
            🎉
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Booking Requested!
        </h1>

        <p className="text-sm text-gray-600 leading-relaxed">
          Your session with <strong>{trainerName || "your trainer"}</strong> has been requested.
          You'll be contacted on your mobile to confirm the details.
        </p>

        {/* Booking ID */}
        {bookingId && (
          <div className="bg-gray-50 rounded-xl py-3 px-4">
            <p className="text-xs text-gray-400 mb-1">Booking Reference</p>
            <p className="text-lg font-bold text-blue-700">#{bookingId}</p>
          </div>
        )}

        {/* Steps */}
        <div className="text-left bg-amber-50 rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3">What happens next?</p>
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <span className="text-amber-500 font-bold">1.</span>
            Our team reviews your booking within a few hours
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <span className="text-amber-500 font-bold">2.</span>
            Your trainer will call you to confirm the time & location
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <span className="text-amber-500 font-bold">3.</span>
            Your training session begins! 🚗
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full py-3 rounded-xl font-bold text-white transition"
          style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
        >
          Back to Home
        </button>

      </div>
    </main>
  );
}