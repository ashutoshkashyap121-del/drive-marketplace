import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authorizeAdminRequest(req, { requireCsrf: true });
    if (!auth.ok) {
      return auth.response;
    }

    const { id } = await params;
    const trainerId = parseInt(id, 10);

    if (Number.isNaN(trainerId)) {
      return NextResponse.json({ error: "Invalid trainer ID" }, { status: 400 });
    }

    const body = await req.json();
    const { packagesJson, basePrice } = body;

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
