import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { Resend } from "resend";

const razorpay = new Razorpay({
  key_id:    process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
const resend = new Resend(process.env.RESEND_API_KEY!);

async function sendWhatsApp(to: string, message: string) {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token   = process.env.WHATSAPP_TOKEN;
  if (!phoneId || !token) return;
  await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to, type: "text", text: { body: message },
    }),
  });
}

// ─── GET /api/cron/auto-refund ────────────────────────────────────────────────
// Called by Vercel cron every hour
// Finds PENDING bookings from scraped schools older than 4 hours and auto-refunds

export async function GET(req: NextRequest) {
  // Verify cron secret
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

  // Find PENDING bookings older than 4 hours from unverified (scraped) trainers
  const staleBookings = await prisma.booking.findMany({
    where: {
      status:      "PENDING",
      paymentStatus: "PAID",
      createdAt:   { lt: fourHoursAgo },
      trainer: {
        adminNotes: { contains: "scraped_gmb" },
      },
    },
    include: { trainer: true },
  });

  console.log(`[auto-refund] Found ${staleBookings.length} stale bookings to refund`);

  const results = [];

  for (const booking of staleBookings) {
    let refundId: string | null = null;

    // Attempt Razorpay refund
    try {
      if (booking.razorpayPaymentId) {
        const refund = await (razorpay.payments.refund as any)(booking.razorpayPaymentId, {
          amount: booking.amount * 100,
          speed:  "optimum",
          notes:  { reason: "Auto-refund: booking not confirmed within 4 hours" },
        });
        refundId = refund.id;
      }
    } catch (err: any) {
      console.error(`[auto-refund] Razorpay error for booking ${booking.id}:`, err.message);
    }

    // Update booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status:        "CANCELLED",
        paymentStatus: "REFUNDED",
      },
    });

    // WhatsApp student
    await sendWhatsApp(`91${booking.mobile}`,
      `Hi ${booking.customerName}, we were unable to confirm your booking with ${booking.trainer.name} within 4 hours.\n\n` +
      `Your full refund of ₹${booking.amount.toLocaleString("en-IN")} has been initiated automatically.\n` +
      `It will reflect in your account within 5–7 business days.\n\n` +
      `Sorry for the inconvenience. Please try another trainer at learndrive.in\n\n— LearnDrive Team`
    );
    // Alert admin
    await resend.emails.send({
      from:    process.env.FROM_EMAIL!,
      to:      process.env.ADMIN_EMAIL!,
      subject: `⚠️ Auto-refunded booking #${booking.id} — ${booking.trainer.name}`,
      html: `
        <div style="font-family:sans-serif;padding:24px;">
          <h3 style="color:#dc2626;">Auto-Refund Triggered</h3>
          <p><strong>Booking:</strong> #${booking.id}</p>
          <p><strong>Student:</strong> ${booking.customerName} — ${booking.mobile}</p>
          <p><strong>School:</strong> ${booking.trainer.name} (${booking.trainer.city})</p>
          <p><strong>Amount Refunded:</strong> ₹${booking.amount.toLocaleString("en-IN")}</p>
          <p><strong>Refund ID:</strong> ${refundId ?? "Manual processing needed"}</p>
          <p style="color:#dc2626;"><strong>Action:</strong> Call this school and pitch LearnDrive partnership to prevent future lost bookings.</p>
        </div>
      `,
    });

    results.push({ bookingId: booking.id, refundId, trainerName: booking.trainer.name });
  }

  return NextResponse.json({
    processed: results.length,
    results,
  });
}