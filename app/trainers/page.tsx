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

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city) return;

    fetch(`/api/trainers?city=${city}`)
      .then(res => res.json())
      .then(data => {
        setTrainers(data);
        setLoading(false);
      });
  }, [city]);

  if (!city) return <div className="p-8">Select city</div>;
  if (loading) return <div className="p-8">Loading...</div>;
  if (trainers.length === 0)
    return <div className="p-8">No trainers available in your city yet.</div>;

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Driving Trainers</h1>

      {trainers.map(trainer => (
        <div
          key={trainer.id}
          className="border rounded-lg p-6 mb-4"
        >
          <h2 className="text-xl font-semibold">{trainer.name}</h2>

          <p className="text-gray-700">
            City: {trainer.city} • {trainer.experience} yrs experience
          </p>

          <p className="text-gray-600">
            Vehicles: {trainer.vehicles.length || "None"}
          </p>

        <button
        onClick={() =>
       router.push(
      `/book?trainerId=${trainer.id}&trainerName=${trainer.name}&amount=5000`
    )
  }
  className="mt-4 text-blue-600"
>
  Book Now →
</button>

        </div>
      ))}
    </main>
  );
}
