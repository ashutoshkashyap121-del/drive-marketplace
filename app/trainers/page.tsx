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
  const searchParams = useSearchParams();
  const router = useRouter();

  const city = searchParams.get("city");
  const vehicle = searchParams.get("vehicle");

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

  if (!city) return <div className="p-6">Please select a city</div>;
  if (loading) return <div className="p-6">Loading trainers...</div>;
  if (trainers.length === 0)
    return <div className="p-6">No trainers available in your city.</div>;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-xl font-semibold text-gray-900">
          Available Trainers in {city}
        </h1>

        {trainers.map(trainer => (
          <div
            key={trainer.id}
            className="bg-white rounded-2xl shadow-sm p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {trainer.name}
              </h2>
              <span className="text-sm text-gray-500">
                {trainer.experience}+ yrs
              </span>
            </div>

            <p className="text-sm text-gray-600">
              City: {trainer.city}
            </p>

            <button
              onClick={() =>
                router.push(
                  `/book?trainerId=${trainer.id}&trainerName=${trainer.name}&city=${trainer.city}&amount=5000`
                )
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Book Training
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
