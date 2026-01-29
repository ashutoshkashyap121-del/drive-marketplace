"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Trainer = {
  id: number;
  name: string;
  city: string;
  experience: number;
  vehicles: any[];
};

export default function TrainersPage() {
  const params = useSearchParams();
  const router = useRouter();

  const city = params.get("city");
  const vehicle = params.get("vehicle");

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    fetch(`/api/trainers?city=${city}&vehicle=${vehicle}`)
      .then(res => res.json())
      .then(data => {
        setTrainers(data);
        setLoading(false);
      });
  }, [city, vehicle]);

  if (!city) return <div className="p-6">City not selected</div>;
  if (loading) return <div className="p-6">Loading trainers…</div>;
  if (trainers.length === 0)
    return <div className="p-6">No trainers available in {city}</div>;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-xl font-semibold text-center mb-4 text-gray-900">
        Trainers in {city}
      </h1>

      <div className="max-w-md mx-auto space-y-4">
        {trainers.map(trainer => (
          <div
            key={trainer.id}
            className="bg-white rounded-2xl shadow p-4"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {trainer.name}
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              {trainer.experience}+ yrs experience
            </p>

            <button
              onClick={() =>
                router.push(
                  `/book?trainerId=${trainer.id}&trainerName=${trainer.name}&city=${city}&amount=5000`
                )
              }
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl font-medium active:scale-95 transition"
            >
              Book Training
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
