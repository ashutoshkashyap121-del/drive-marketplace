import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin";

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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authorizeAdminRequest(req, { requireCsrf: true });
    if (!auth.ok) {
      return auth.response;
    }

    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
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

    if (status === "COMPLETED" && booking.mobile) {
      const reviewUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/review/${booking.id}?trainer=${encodeURIComponent(booking.trainer.name)}`;
      const msg = `LearnDrive: Hi ${booking.customerName}! How was your driving session with ${booking.trainer.name}? Rate your experience (takes 30 seconds): ${reviewUrl}`;
      await sendSMS(booking.mobile, msg).catch(() => undefined);
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
