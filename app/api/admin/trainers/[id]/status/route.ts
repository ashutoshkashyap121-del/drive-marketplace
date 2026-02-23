export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin";
import { verifyCSRF } from "@/lib/csrf";
import { logAdminAction } from "@/lib/audit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔐 Session validation
    if (!(await verifyAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🛡️ CSRF validation
    if (!verifyCSRF(req)) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    const { id: rawId } = await params;
    const id = parseInt(rawId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid trainer ID" },
        { status: 400 }
      );
    }

    const { status } = await req.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // 🔎 Fetch old status
    const existing = await prisma.trainer.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Trainer not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.trainer.update({
      where: { id },
      data: { status },
    });

    // 📝 Audit log
    await logAdminAction({
      action: "TRAINER_STATUS_UPDATED",
      entityType: "Trainer",
      entityId: id,
      metadata: {
        previousStatus: existing.status,
        newStatus: status,
      },
    });

    return NextResponse.json({ success: true, trainer: updated });

  } catch (error) {
    console.error("ADMIN TRAINER STATUS UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}