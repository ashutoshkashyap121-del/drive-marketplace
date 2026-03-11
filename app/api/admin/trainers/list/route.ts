// app/api/admin/trainers/list/route.ts
// Replace your existing list route with this — adds packagesJson + extra fields

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trainers = await prisma.trainer.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        mobile: true,
        email: true,
        status: true,
        experience: true,
        basePrice: true,
        packagesJson: true,
        languages: true,
        vehicleTypes: true,
      },
      orderBy: [
        { status: "asc" },   // PENDING first (alphabetically before APPROVED)
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(trainers);
  } catch (error) {
    console.error("Admin trainer list error:", error);
    return NextResponse.json([], { status: 500 });
  }
}