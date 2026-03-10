// app/api/admin/trainers/pending/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TrainerStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trainers = await prisma.trainer.findMany({
    where: { status: TrainerStatus.PENDING },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, city: true, mobile: true,
      experience: true, status: true, adminNotes: true,
      createdAt: true, vehicleTypes: true, licenseNumber: true,
      serviceArea: true, basePrice: true, languages: true,
    },
  });

  return NextResponse.json(trainers);
}