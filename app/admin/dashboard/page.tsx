// app/admin/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdminPageAccess } from "@/lib/admin";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminPageAccess();

  const [pending, approved, rejected] = await Promise.all([
    prisma.trainer.count({ where: { status: "PENDING" } }),
    prisma.trainer.count({ where: { status: "APPROVED" } }),
    prisma.trainer.count({ where: { status: "REJECTED" } }),
  ]);

  // Fetch ALL trainers with vehicles + documents
  const trainers = await prisma.trainer.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      mobile: true,
      email: true,
      city: true,
      pincode: true,
      licenseNumber: true,
      vehicleTypes: true,
      serviceArea: true,
      experience: true,
      trainerType: true,
      bio: true,
      status: true,
      basePrice: true,
      packagesJson: true,
      rating: true,
      createdAt: true,
      vehicles: {
        select: {
          type: true,
          dualControl: true,
          insured: true,
          vehicleNumber: true,
          vehicleYear: true,
          rcNumber: true,
          insuranceValidUntil: true,
        },
      },
      documents: {
        select: {
          docType: true,
          fileName: true,
          fileUrl: true,
        },
      },
    },
  });

  // Fetch all bookings
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { trainer: { select: { name: true } } },
  });

  const stats = {
    pending,
    approved,
    rejected,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.platformFee ?? 0), 0),
    pendingBookings: bookings.filter((b) => b.status === "PENDING").length,
  };

  return (
    <AdminDashboardClient
      trainers={trainers.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        vehicles: t.vehicles.map((v) => ({
          ...v,
          insuranceValidUntil: v.insuranceValidUntil?.toISOString() ?? null,
        })),
      }))}
      bookings={bookings.map((b) => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
        bookingDate: b.bookingDate?.toISOString() ?? null,
      }))}
      stats={stats}
    />
  );
}
