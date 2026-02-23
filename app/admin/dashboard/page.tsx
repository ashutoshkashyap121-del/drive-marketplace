// 🔒 TODO: Add your auth guard here (NextAuth / Clerk / middleware)
// e.g. with NextAuth: const session = await getServerSession(); if (!session) redirect("/login");

import {prisma} from "@/lib/prisma";
import PendingTrainers from "./_components/PendingTrainers";

export const dynamic = "force-dynamic"; // always fetch fresh data

export default async function AdminDashboardPage() {
  const [pending, approved, rejected] = await Promise.all([
    prisma.trainer.count({ where: { status: "PENDING" } }),
    prisma.trainer.count({ where: { status: "APPROVED" } }),
    prisma.trainer.count({ where: { status: "REJECTED" } }),
  ]);

  const pendingTrainers = await prisma.trainer.findMany({
    where: { status: "PENDING" },
    orderBy: { id: "desc" },
    select: {
      id: true,
      name: true,
      mobile: true,
      email: true,
      city: true,
      licenseNumber: true,
      vehicleTypes: true,
      serviceArea: true,
      experience: true,
      trainerType: true,
      bio: true,
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">LearnDrive · Trainer Management</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pending", value: pending, color: "text-yellow-600" },
            { label: "Approved", value: approved, color: "text-green-600" },
            { label: "Rejected", value: rejected, color: "text-red-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm"
            >
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Pending approvals */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Pending Approvals
            {pending > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                {pending}
              </span>
            )}
          </h2>
          <PendingTrainers initial={pendingTrainers} />
        </section>
      </div>
    </main>
  );
}