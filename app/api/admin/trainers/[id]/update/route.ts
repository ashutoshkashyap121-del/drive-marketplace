// app/api/admin/trainers/[id]/update/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Next.js 15: params is a Promise
) {
  try {
    const { id } = await params;
    const trainerId = parseInt(id);
    if (isNaN(trainerId)) {
      return NextResponse.json({ error: "Invalid trainer ID" }, { status: 400 });
    }

    const body = await req.json();
    const { packagesJson, basePrice } = body;

    // Validate packagesJson is a valid JSON array
    if (packagesJson !== undefined && packagesJson !== null) {
      try {
        const parsed = JSON.parse(packagesJson);
        if (!Array.isArray(parsed)) {
          return NextResponse.json({ error: "packagesJson must be a JSON array" }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: "Invalid packagesJson format" }, { status: 400 });
      }
    }

    const updated = await prisma.trainer.update({
      where: { id: trainerId },
      data: {
        ...(packagesJson !== undefined && { packagesJson }),
        ...(basePrice !== undefined && { basePrice: basePrice ? Number(basePrice) : null }),
      },
      select: { id: true, name: true, packagesJson: true, basePrice: true },
    });

    return NextResponse.json({ success: true, trainer: updated });
  } catch (error) {
    console.error("Trainer update error:", error);
    return NextResponse.json({ error: "Failed to update trainer" }, { status: 500 });
  }
}