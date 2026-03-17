import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin";
import { logAdminAction } from "@/lib/audit";

const VALID_ACTIONS = ["APPROVED", "REJECTED", "SUSPENDED"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authorizeAdminRequest(req, { requireCsrf: true });
    if (!auth.ok) {
      return auth.response;
    }

    const { id: rawId } = await params;
    const trainerId = parseInt(rawId, 10);
    const { action, reason } = await req.json();

    if (Number.isNaN(trainerId) || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json({ error: "Invalid trainer ID or action" }, { status: 400 });
    }

    const existing = await prisma.trainer.findUnique({
      where: { id: trainerId },
      select: { status: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
    }

    const updated = await prisma.trainer.update({
      where: { id: trainerId },
      data: { status: action },
    });

    await logAdminAction({
      action: `TRAINER_${action}`,
      entityType: "Trainer",
      entityId: String(trainerId),
      metadata: {
        previousStatus: existing.status,
        newStatus: action,
        reason: reason || null,
      },
    });

    return NextResponse.json({ success: true, trainer: updated });
  } catch (error) {
    console.error("ADMIN TRAINER STATUS ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
