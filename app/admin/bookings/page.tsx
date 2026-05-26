"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: number;
  packageName: string;
  amount: number;
  customerName: string;
  mobile: string;
  city: string;
  address: string;
  status: string;
  paymentStatus: string;
  razorpayPaymentId: string | null;
  createdAt: string;
  trainer: {
    id: number;
    name: string;
    city: string;
    mobile: string;
    email: string | null;
  };
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function waLink(phone: string, message: string) {
  const num = phone.replace(/\D/g, "").slice(-10);
  return `https://wa.me/91${num}?text=${encodeURIComponent(message)}`;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filter, setFilter] = useState("ALL");

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH BOOKINGS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await fetch("/api/admin/bookings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": getCsrfToken() },
        body: JSON.stringify({ id, status: newStatus }),
      });
      await fetchBookings();
    } catch (error) {
      console.error("UPDATE STATUS ERROR:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <div className="p-8 text-gray-500">Loading bookings...</div>;

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <div className="flex gap-2 text-sm">
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg font-medium ${filter === s ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            No bookings{filter !== "ALL" ? ` with status ${filter}` : ""} yet.
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((b) => {
            const trainerWa = b.trainer?.mobile
              ? waLink(b.trainer.mobile, `Hi ${b.trainer.name}! A student ${b.customerName} (${b.mobile}) has booked a ${b.packageName} package via LearnDrive in ${b.city}. Please confirm their first session. Booking ID: #${b.id}`)
              : null;
            const studentWa = b.mobile
              ? waLink(b.mobile, `Hi ${b.customerName}! Your booking with ${b.trainer?.name} in ${b.city} is confirmed. They will call you shortly to schedule your first session. – LearnDrive`)
              : null;

            return (
              <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-lg">#{b.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[b.status] || "bg-gray-100 text-gray-600"}`}>{b.status}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${b.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{b.paymentStatus}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{new Date(b.createdAt).toLocaleString("en-IN")}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-amber-500">₹{b.amount.toLocaleString("en-IN")}</div>
                    <div className="text-xs text-slate-400">{b.packageName}</div>
                  </div>
                </div>

                {/* Two columns: student + trainer */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">Student</div>
                    <div className="font-semibold text-slate-900">{b.customerName}</div>
                    <div className="text-sm text-slate-600 mt-1">{b.mobile}</div>
                    {b.address && <div className="text-xs text-slate-500 mt-1">{b.address}</div>}
                    <div className="text-xs text-slate-500 mt-1">{b.city}</div>
                    {studentWa && (
                      <a href={studentWa} target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-3 text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-600">
                        WhatsApp Student
                      </a>
                    )}
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <div className="text-xs font-bold text-amber-600 uppercase mb-2">Trainer to Call</div>
                    <div className="font-semibold text-slate-900">{b.trainer?.name || "—"}</div>
                    <div className="text-sm text-slate-600 mt-1">{b.trainer?.mobile || "No phone"}</div>
                    {b.trainer?.mobile && (
                      <a href={`tel:${b.trainer.mobile}`}
                        className="inline-block mt-2 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-700 mr-2">
                        Call
                      </a>
                    )}
                    {trainerWa && (
                      <a href={trainerWa} target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-600">
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                  {b.status !== "CONFIRMED" && (
                    <button disabled={updatingId === b.id} onClick={() => updateStatus(b.id, "CONFIRMED")}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold">
                      Mark Confirmed
                    </button>
                  )}
                  {b.status !== "COMPLETED" && (
                    <button disabled={updatingId === b.id} onClick={() => updateStatus(b.id, "COMPLETED")}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold">
                      Mark Completed
                    </button>
                  )}
                  {b.status !== "CANCELLED" && (
                    <button disabled={updatingId === b.id} onClick={() => updateStatus(b.id, "CANCELLED")}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold">
                      Cancel
                    </button>
                  )}
                  {b.razorpayPaymentId && (
                    <span className="text-xs text-slate-400 self-center ml-auto">
                      {b.razorpayPaymentId}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
