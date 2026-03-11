// app/api/cron/dl-reminders/route.ts
// Called daily by Vercel Cron — sends WhatsApp/SMS reminders at 60, 30, 7 days before DL expiry

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function sendSMS(mobile: string, message: string) {
  await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: process.env.FAST2SMS_API_KEY || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: "q",
      message,
      numbers: mobile,
      flash: 0,
    }),
  });
}

export async function GET(req: NextRequest) {
  // Verify cron secret so random people can't trigger it
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const results = { sent60: 0, sent30: 0, sent7: 0, errors: 0 };

  try {
    // ── 60-day reminders ──────────────────────────────────────────────────────
    const in60Days = new Date(today);
    in60Days.setDate(today.getDate() + 60);
    const in61Days = new Date(in60Days);
    in61Days.setDate(in60Days.getDate() + 1);

    const due60 = await (prisma as any).dLReminder.findMany({
      where: {
        active: true,
        reminded60: false,
        dlExpiryDate: { gte: in60Days, lt: in61Days },
      },
    });

    for (const r of due60) {
      try {
        const msg = `LearnDrive: Hi${r.name ? ` ${r.name}` : ""}! Your driving licence expires in 60 days (${new Date(r.dlExpiryDate).toLocaleDateString("en-IN")}). Start renewal now to avoid delays. Need help? We handle everything for ₹499: learndrive.in/dl-assistance`;
        await sendSMS(r.mobile, msg);
        await (prisma as any).dLReminder.update({ where: { id: r.id }, data: { reminded60: true } });
        results.sent60++;
      } catch { results.errors++; }
    }

    // ── 30-day reminders ──────────────────────────────────────────────────────
    const in30Days = new Date(today);
    in30Days.setDate(today.getDate() + 30);
    const in31Days = new Date(in30Days);
    in31Days.setDate(in30Days.getDate() + 1);

    const due30 = await (prisma as any).dLReminder.findMany({
      where: {
        active: true,
        reminded30: false,
        dlExpiryDate: { gte: in30Days, lt: in31Days },
      },
    });

    for (const r of due30) {
      try {
        const msg = `LearnDrive: URGENT - Your driving licence expires in 30 days! Renew now to avoid ₹1,000 penalty & insurance issues. We handle the full renewal for ₹499: learndrive.in/dl-assistance`;
        await sendSMS(r.mobile, msg);
        await (prisma as any).dLReminder.update({ where: { id: r.id }, data: { reminded30: true } });
        results.sent30++;
      } catch { results.errors++; }
    }

    // ── 7-day reminders ───────────────────────────────────────────────────────
    const in7Days = new Date(today);
    in7Days.setDate(today.getDate() + 7);
    const in8Days = new Date(in7Days);
    in8Days.setDate(in7Days.getDate() + 1);

    const due7 = await (prisma as any).dLReminder.findMany({
      where: {
        active: true,
        reminded7: false,
        dlExpiryDate: { gte: in7Days, lt: in8Days },
      },
    });

    for (const r of due7) {
      try {
        const msg = `LearnDrive: LAST WARNING - Your DL expires in 7 days! Don't risk a ₹5,000 fine or insurance rejection. Let us handle your renewal today for ₹499: learndrive.in/dl-assistance`;
        await sendSMS(r.mobile, msg);
        await (prisma as any).dLReminder.update({ where: { id: r.id }, data: { reminded7: true } });
        results.sent7++;
      } catch { results.errors++; }
    }

    // ── Deactivate fully reminded or expired reminders ─────────────────────
    await (prisma as any).dLReminder.updateMany({
      where: {
        active: true,
        reminded60: true,
        reminded30: true,
        reminded7: true,
      },
      data: { active: false },
    });

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error("Cron DL reminder error:", error);
    return NextResponse.json({ error: "Cron failed", details: String(error) }, { status: 500 });
  }
}