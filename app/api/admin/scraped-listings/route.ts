import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — list scraped trainers by status
export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") ?? "PENDING";

  const [trainers, pending, approved, rejected] = await Promise.all([
    prisma.trainer.findMany({
      where: {
        status: status as any,
        adminNotes: { contains: "scraped_gmb" },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        city: true,
        phone: true,
        rating: true,
        basePrice: true,
        status: true,
        adminNotes: true,
        packagesJson: true,
        createdAt: true,
      },
    }),
    prisma.trainer.count({ where: { status: "PENDING", adminNotes: { contains: "scraped_gmb" } } }),
    prisma.trainer.count({ where: { status: "APPROVED", adminNotes: { contains: "scraped_gmb" } } }),
    prisma.trainer.count({ where: { status: "REJECTED", adminNotes: { contains: "scraped_gmb" } } }),
  ]);

  return NextResponse.json({ trainers, stats: { pending, approved, rejected } });
}

// PATCH — approve / reject individual or bulk
export async function PATCH(req: NextRequest) {
  const body = await req.json();

  // Bulk approve all pending scraped listings
  if (body.bulkApproveAll) {
    await prisma.trainer.updateMany({
      where: {
        status: "PENDING",
        adminNotes: { contains: "scraped_gmb" },
      },
      data: { status: "APPROVED" },
    });
    return NextResponse.json({ ok: true });
  }

  // Individual update
  const { id, status } = body;
  if (!id || !["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  await prisma.trainer.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ ok: true });
}