// app/api/cron/review-requests/route.ts
// Runs daily — sends review SMS to customers whose booking was completed yesterday

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find COMPLETED bookings from yesterday with no review yet
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    const completedBookings = await prisma.booking.findMany({
      where: {
        status: "COMPLETED",
        bookingDate: { gte: yesterday, lte: endOfYesterday },
        review: null, // no review yet
      },
      include: {
        trainer: { select: { name: true } },
        review: true,
      },
    });

    let sent = 0;

    for (const booking of completedBookings) {
      if (!booking.mobile) continue;

      const reviewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/review/${booking.id}?trainer=${encodeURIComponent(booking.trainer.name)}`;
      const msg = `LearnDrive: Hi ${booking.customerName}! How was your driving session with ${booking.trainer.name}? Your review helps other learners. Rate now (30 seconds): ${reviewUrl}`;

      await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: process.env.FAST2SMS_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ route: "q", message: msg, numbers: booking.mobile, flash: 0 }),
      }).catch(() => {});

      sent++;
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}