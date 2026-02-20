"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: number;
  packageName: string;
  amount: number;
  customerName: string;
  mobile: string;
  city: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  trainer: {
    id: number;
    name: string;
    city: string;
  };
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("FETCH BOOKINGS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      setUpdatingId(id);

      await fetch("/api/admin/bookings/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      await fetchBookings();
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading bookings...</div>;
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>

      {bookings.length === 0 && (
        <div className="text-gray-600">No bookings yet.</div>
      )}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-white p-5 rounded-xl shadow-sm border"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">
                  {b.customerName} ({b.mobile})
                </div>
                <div className="text-sm text-gray-600">
                  Trainer: {b.trainer?.name}
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {new Date(b.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-3 text-sm">
              <div>Package: {b.packageName}</div>
              <div>Amount: ₹ {b.amount}</div>
              <div>City: {b.city}</div>
              <div>Status: {b.status}</div>
              <div>Payment: {b.paymentStatus}</div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                disabled={updatingId === b.id}
                onClick={() => updateStatus(b.id, "CONFIRMED")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Confirm
              </button>

              <button
                disabled={updatingId === b.id}
                onClick={() => updateStatus(b.id, "CANCELLED")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
