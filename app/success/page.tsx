"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const saveBooking = async () => {
      const trainer = params.get("trainer");
      const packageName = params.get("package");
      const amount = params.get("amount");

      if (!trainer || !packageName || !amount) return;

      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainer,
          packageName,
          amount: Number(amount),
        }),
      });
    };

    saveBooking();
  }, [params]);

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">✅ Booking Successful</h1>
      <p>Your booking has been confirmed and saved.</p>

      <button
        className="mt-6 px-4 py-2 bg-black text-white rounded"
        onClick={() => router.push("/admin/bookings")}
      >
        Go to Admin Bookings
      </button>
    </div>
  );
}
