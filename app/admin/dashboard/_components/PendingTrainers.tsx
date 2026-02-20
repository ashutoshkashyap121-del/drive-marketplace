"use client";

import { useState } from "react";

type Trainer = {
  id: number;
  name: string;
  mobile: string;
  email: string | null;
  city: string;
  licenseNumber: string;
  vehicleTypes: string[];
  serviceArea: string[];
  experience: number;
  trainerType: string;
  bio: string | null;
};

export default function PendingTrainers({ initial }: { initial: Trainer[] }) {
  const [trainers, setTrainers] = useState<Trainer[]>(initial);
  const [loading, setLoading] = useState<number | null>(null); // trainer id being actioned

  async function updateStatus(id: number, status: "APPROVED" | "REJECTED") {
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/trainers/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Remove from pending list on success
        setTrainers((prev) => prev.filter((t) => t.id !== id));
      } else {
        const data = await res.json();
        alert(data.message ?? "Something went wrong");
      }
    } catch {
      alert("Network error — please try again");
    } finally {
      setLoading(null);
    }
  }

  if (trainers.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        🎉 No pending trainers — you're all caught up!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trainers.map((trainer) => (
        <div
          key={trainer.id}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {trainer.name}
              </h3>
              <p className="text-sm text-gray-500">
                {trainer.city} · {trainer.trainerType}
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              PENDING
            </span>
          </div>

          {/* Details grid */}
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            <div>
              <dt className="text-gray-400 text-xs">Mobile</dt>
              <dd className="text-gray-800 font-medium">{trainer.mobile}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs">Email</dt>
              <dd className="text-gray-800">{trainer.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs">License No.</dt>
              <dd className="text-gray-800">{trainer.licenseNumber}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs">Experience</dt>
              <dd className="text-gray-800">{trainer.experience} yrs</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs">Vehicle Types</dt>
              <dd className="text-gray-800">
                {trainer.vehicleTypes.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs">Service Pincodes</dt>
              <dd className="text-gray-800">
                {trainer.serviceArea.length > 0
                  ? trainer.serviceArea.join(", ")
                  : "—"}
              </dd>
            </div>
          </dl>

          {/* Bio */}
          {trainer.bio && (
            <p className="text-sm text-gray-600 border-t border-gray-100 pt-3">
              {trainer.bio}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => updateStatus(trainer.id, "APPROVED")}
              disabled={loading === trainer.id}
              className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold py-2 transition-colors"
            >
              {loading === trainer.id ? "Saving…" : "✓ Approve"}
            </button>
            <button
              onClick={() => updateStatus(trainer.id, "REJECTED")}
              disabled={loading === trainer.id}
              className="flex-1 rounded-xl bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 border border-red-200 text-sm font-semibold py-2 transition-colors"
            >
              {loading === trainer.id ? "Saving…" : "✕ Reject"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}