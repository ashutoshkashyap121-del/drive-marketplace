export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin";
import { logAdminAction } from "@/lib/audit";
import { notifyTrainerApproved, notifyTrainerRejected } from "@/lib/notifications";
import { smsTrainerApproved, smsTrainerRejected } from "@/lib/sms";
import { fetchTrainerGoogleRating } from "@/lib/google-places";

const VALID_ACTIONS = ["APPROVED", "REJECTED", "SUSPENDED"];

export async function POST(req: Request) {
  try {
    const auth = await authorizeAdminRequest(req, { requireCsrf: true });
    if (!auth.ok) {
      return auth.response;
    }

    const body = await req.json();
    const { trainerId, action, reason } = body;

    if (!trainerId || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: "trainerId and valid action (APPROVED, REJECTED, SUSPENDED) required" },
        { status: 400 },
      );
    }

    const existing = await prisma.trainer.findUnique({
      where: { id: trainerId },
      select: { status: true, name: true, email: true, mobile: true, city: true, trainerType: true },
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
      metadata: { previousStatus: existing.status, newStatus: action, reason: reason || null },
    });

    if (action === "APPROVED") {
      try {
        await smsTrainerApproved({
          name: existing.name,
          mobile: existing.mobile,
          city: existing.city,
        });
      } catch (err) {
        console.error("[SMS_APPROVED_ERROR]", err);
      }

      try {
        if (existing.email) {
          await notifyTrainerApproved({
            id: trainerId,
            name: existing.name,
            email: existing.email,
            city: existing.city,
          });
        }
      } catch (err) {
        console.error("[EMAIL_APPROVED_ERROR]", err);
      }

      // Seed the profile with a real Google/GMB rating. Schools only — individual
      // trainers rarely have a Google Business listing, and the name-match guard in
      // fetchTrainerGoogleRating prevents stamping a wrong rating.
      if (existing.trainerType === "DRIVING_SCHOOL") {
        try {
          const g = await fetchTrainerGoogleRating(existing.name, existing.city);
          if (g) {
            await prisma.trainer.update({
              where: { id: trainerId },
              data: { rating: g.rating },
            });
            console.log(
              `[GMB_RATING] ${existing.name} → ${g.rating}★ (${g.reviewCount} reviews), matched "${g.matchedName}"`,
            );
          }
        } catch (err) {
          console.error("[GMB_RATING_ERROR]", err);
        }
      }
    }

    if (action === "REJECTED") {
      try {
        await smsTrainerRejected({
          name: existing.name,
          mobile: existing.mobile,
          reason: reason || undefined,
        });
      } catch (err) {
        console.error("[SMS_REJECTED_ERROR]", err);
      }

      try {
        if (existing.email) {
          await notifyTrainerRejected({
            name: existing.name,
            email: existing.email,
            reason: reason || undefined,
          });
        }
      } catch (err) {
        console.error("[EMAIL_REJECTED_ERROR]", err);
      }
    }

    return NextResponse.json({ success: true, trainer: updated });
  } catch (error) {
    console.error("ADMIN TRAINER APPROVE ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
