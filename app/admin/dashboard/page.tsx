export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  // Check auth
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "authenticated") {
    redirect("/admin");
  }

  // Fetch data
  const [bookings, trainers] = await Promise.all([
    prisma.booking.findMany({
      include: { trainer: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.trainer.findMany({
      include: { vehicles: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Stats
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.platformFee ?? 0), 0);
  const pendingBookings = bookings.filter(b => b.status === "PENDING").length;
  const pendingTrainers = trainers.filter(t => t.status === "PENDING").length;
  const approvedTrainers = trainers.filter(t => t.status === "APPROVED").length;

  return (
    <AdminDashboardClient
      bookings={JSON.parse(JSON.stringify(bookings))}
      trainers={JSON.parse(JSON.stringify(trainers))}
      stats={{ totalRevenue, pendingBookings, pendingTrainers, approvedTrainers }}
    />
  );
}