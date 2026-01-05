"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function TrainerDetailPage() {
  const params = useParams();
  const id = params.id;

  // Static data for MVP
  const trainer = {
    id: 1,
    name: "Ramesh Kumar",
    area: "Whitefield",
    experience: "8 years",
  };

  const packages = [
    {
      name: "5 Sessions",
      amount: 3000,
    },
    {
      name: "10 Sessions",
      amount: 5500,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">
        Trainer Profile
      </h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="font-semibold text-lg">{trainer.name}</p>
        <p className="text-gray-600">
          {trainer.area} • {trainer.experience} experience
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">
        Training Packages
      </h2>

      <div className="space-y-4">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="bg-white p-4 rounded shadow"
          >
            <p className="font-medium">{pkg.name}</p>
            <p className="text-gray-600 mb-3">
              ₹{pkg.amount}
            </p>

            <Link
              href={`/book?trainer=${encodeURIComponent(
                trainer.name
              )}&package=${encodeURIComponent(
                pkg.name
              )}&amount=${pkg.amount}`}
            >
              <button className="w-full bg-black text-white py-2 rounded">
                Book Now
              </button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
