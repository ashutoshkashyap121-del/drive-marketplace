"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h2>✅ Booking Successful</h2>
      <p>Thank you! Your driving lesson has been booked.</p>

      <br />

      <button onClick={() => router.push("/")}>
        Go to Home
      </button>
    </div>
  );
}
