"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TrainersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const city = searchParams.get("city");

  const [trainers, setTrainers] = useState<any[]>([]);

  useEffect(() => {
    if (!city) return;
    fetch(`/api/trainers?city=${city}`)
      .then(res => res.json())
      .then(setTrainers);
  }, [city]);

  if (!city) return <div>Select city</div>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Driving Trainers</h1>

      {trainers.map(trainer => (
        <div key={trainer.id} className="border p-4 mb-4">
          <p className="font-semibold">{trainer.name}</p>
          <p>{trainer.experience} yrs experience</p>

          <button
            className="text-blue-600 mt-2"
            onClick={() =>
              router.push(
                `/book?trainerId=${trainer.id}&trainerName=${trainer.name}&amount=5000`
              )
            }
          >
            Book Now →
          </button>
        </div>
      ))}
    </main>
  );
}
