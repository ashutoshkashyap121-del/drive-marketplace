// app/api/admin/bookings/[id]/route.ts
// PATCH to update booking status — when marked COMPLETED, auto-sends review request via SMS

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth check
  const adminSecret = req.headers.get("x-admin-secret");
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const { status } = await req.json();

    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { trainer: { select: { name: true } } },
    });

    // When marked COMPLETED — send review request SMS
    if (status === "COMPLETED" && booking.mobile) {
      const reviewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/review/${booking.id}?trainer=${encodeURIComponent(booking.trainer.name)}`;
      const msg = `LearnDrive: Hi ${booking.customerName}! How was your driving session with ${booking.trainer.name}? Rate your experience (takes 30 seconds): ${reviewUrl}`;
      await sendSMS(booking.mobile, msg).catch(() => {});
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}