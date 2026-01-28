"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id") || "";
  const [copied, setCopied] = useState(false);

  function copyBookingId() {
    if (!bookingId) return;
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center space-y-6">

        {/* Check Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-3xl">✅</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800">
          Booking Confirmed
        </h1>

        <p className="text-gray-600 text-sm">
          Your driving training booking has been successfully placed.
        </p>

        {/* Booking ID */}
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Booking ID</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-mono font-semibold">
              {bookingId || "—"}
            </span>
            {bookingId && (
              <button
                onClick={copyBookingId}
                className="text-sm text-blue-600 underline"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
        </div>

        {/* Reassurance */}
        <div className="text-sm text-gray-600 space-y-1">
          <p>📞 Our trainer will call you shortly.</p>
          <p>📍 Please be available at your pickup location.</p>
        </div>

        {/* Next steps */}
        <div className="border-t pt-4 text-xs text-gray-500">
          <p>
            Please save your Booking ID for future reference.
          </p>
        </div>

        {/* CTA */}
        <a
          href="/"
          className="inline-block w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}
