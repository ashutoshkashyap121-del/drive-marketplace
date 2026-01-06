"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BookClient({ searchParams }: any) {
  const router = useRouter();

  const trainer = searchParams?.trainer ?? "";
  const packageName = searchParams?.package ?? "";
  const amount = Number(searchParams?.amount ?? 0);

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");

  async function confirmBooking() {
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainer,
        packageName,
        amount,
        customerName,
        mobile,
        city,
      }),
    });

    router.push("/success");
  }

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2>Book Driving Lessons</h2>

      <p><b>Trainer:</b> {trainer}</p>
      <p><b>Package:</b> {packageName}</p>
      <p><b>Amount:</b> ₹{amount}</p>

      <input
        placeholder="Your Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <input
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <br /><br />
      <button onClick={confirmBooking}>Confirm Booking</button>
    </div>
  );
}
