export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin";
import { verifyCSRF } from "@/lib/csrf";
import { logAdminAction } from "@/lib/audit";
import { notifyTrainerApproved, notifyTrainerRejected } from "@/lib/notifications";

const VALID_ACTIONS = ["APPROVED", "REJECTED", "SUSPENDED"];

export async function POST(req: Request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await verifyCSRF(req))) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    const body = await req.json();
    const { trainerId, action, reason } = body;

    if (!trainerId || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: "trainerId and valid action (APPROVED, REJECTED, SUSPENDED) required" },
        { status: 400 }
      );
    }

    const existing = await prisma.trainer.findUnique({
      where: { id: trainerId },
      select: { status: true, name: true, email: true, city: true },
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

    if (existing.email) {
      if (action === "APPROVED") {
        notifyTrainerApproved({
          id: trainerId,
          name: existing.name,
          email: existing.email,
          city: existing.city,
        }).catch((err) => console.error("[NOTIFY_APPROVED_ERROR]", err));
      } else if (action === "REJECTED") {
        notifyTrainerRejected({
          name: existing.name,
          email: existing.email,
          reason: reason || undefined,
        }).catch((err) => console.error("[NOTIFY_REJECTED_ERROR]", err));
      }
    }

    return NextResponse.json({ success: true, trainer: updated });

  } catch (error) {
    console.error("ADMIN TRAINER APPROVE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}