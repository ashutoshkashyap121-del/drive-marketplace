"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: number;
  trainer: string;
  packageName: string;
  amount: number;
  customerName: string;
  mobile: string;
  city: string;
  status: string;
  createdAt: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    setLoading(true);
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await fetchBookings();
    setLoading(false);
  };

  const today = new Date().toDateString();

  const filteredBookings = bookings.filter((b) => {
    if (filter === "ALL") return true;
    if (filter === "TODAY")
      return new Date(b.createdAt).toDateString() === today;
    return b.status === filter;
  });

  return (
    <div style={{ padding: 30 }}>
      <h2>📋 All Bookings</h2>

      {/* FILTERS */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setFilter("ALL")}>All</button>{" "}
        <button onClick={() => setFilter("TODAY")}>Today</button>{" "}
        <button onClick={() => setFilter("PENDING")}>Pending</button>{" "}
        <button onClick={() => setFilter("CONFIRMED")}>Confirmed</button>{" "}
        <button onClick={() => setFilter("CANCELLED")}>Cancelled</button>
      </div>

      {filteredBookings.map((b) => (
        <div
          key={b.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <b>Trainer:</b> {b.trainer}<br />
          <b>Package:</b> {b.packageName}<br />
          <b>Amount:</b> ₹{b.amount}

          <hr />

          <b>Customer:</b> {b.customerName}<br />
          <b>Mobile:</b> {b.mobile}<br />
          <b>City:</b> {b.city}<br />

          <b>Status:</b>{" "}
          <span
            style={{
              fontWeight: "bold",
              color:
                b.status === "CONFIRMED"
                  ? "green"
                  : b.status === "CANCELLED"
                  ? "red"
                  : "orange",
            }}
          >
            {b.status}
          </span>

          <br />
          <small>{new Date(b.createdAt).toLocaleString()}</small>

          <div style={{ marginTop: 10 }}>
            <button
              disabled={loading || b.status === "CONFIRMED"}
              onClick={() => updateStatus(b.id, "CONFIRMED")}
            >
              ✅ Confirm
            </button>{" "}
            <button
              disabled={loading || b.status === "CANCELLED"}
              onClick={() => updateStatus(b.id, "CANCELLED")}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
