import { NextRequest, NextResponse } from "next/server";
import { TrainerStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const auth = await authorizeAdminRequest(req);
  if (!auth.ok) {
    return auth.response;
  }

  const trainers = await prisma.trainer.findMany({
    where: { status: TrainerStatus.PENDING },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      city: true,
      mobile: true,
      experience: true,
      status: true,
      adminNotes: true,
      createdAt: true,
      vehicleTypes: true,
      licenseNumber: true,
      serviceArea: true,
      basePrice: true,
      languages: true,
    },
  });

  return NextResponse.json(trainers);
}
