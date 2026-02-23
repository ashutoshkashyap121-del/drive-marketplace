export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin";
import { verifyCSRF } from "@/lib/csrf";
import { logAdminAction } from "@/lib/audit";
import { notifyTrainerApproved, notifyTrainerRejected } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    // 🔐 Session validation
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🛡️ CSRF validation — NOTE: await is required since verifyCSRF is now async
    if (!(await verifyCSRF(req))) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    const body = await req.json();
    const { trainerId, action, reason } = body;

    // action can be "APPROVED" or "REJECTED"
    if (!trainerId || !["APPROVED", "REJECTED"].includes(action)) {
      return NextResponse.json({ error: "trainerId and valid action required" }, { status: 400 });
    }

    // Fetch existing trainer
    const existing = await prisma.trainer.findUnique({
      where: { id: trainerId },
      select: { status: true, name: true, email: true, city: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
    }

    // Update status
    const updated = await prisma.trainer.update({
      where: { id: trainerId },
      data: { status: action },
    });

    // 📝 Audit log
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

    // ── Notify trainer (non-blocking) ──────────────────────────────────────
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