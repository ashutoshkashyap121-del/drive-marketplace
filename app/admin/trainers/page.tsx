"use client";

import { useEffect, useState } from "react";

type Trainer = {
  id: number;
  name: string;
  city: string;
  status: string;
};

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    fetch("/api/admin/trainers/list")
      .then(res => res.json())
      .then(data => setTrainers(data));
  }, []);

  const approve = async (id: number) => {
    await fetch("/api/admin/trainers/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainerId: id }),
    });

    location.reload();
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Pending Trainers</h1>

      {trainers.map(t => (
        <div key={t.id} className="border p-4 rounded-xl">
          <div>{t.name}</div>
          <div>{t.city}</div>
          <div>Status: {t.status}</div>

          {t.status === "PENDING" && (
            <button
              onClick={() => approve(t.id)}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2"
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
