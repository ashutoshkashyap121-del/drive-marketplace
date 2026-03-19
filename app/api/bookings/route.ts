import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { Resend } from "resend";

function getRazorpayClient(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

async function sendWhatsApp(to: string, message: string) {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;
  if (!phoneId || !token) return;
  await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    }),
  });
}

export async function POST(req: NextRequest) {
  const { trainerId, studentName, phone, email, packageName, price, address, city, pincode } =
    await req.json();

  if (!trainerId || !studentName || !phone || !price) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const razorpayClient = getRazorpayClient();
  if (!razorpayClient) {
    return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
  }

  const resendClient = getResendClient();

  const trainer = await prisma.trainer.findUnique({ where: { id: Number(trainerId) } });
  if (!trainer) return NextResponse.json({ error: "Trainer not found" }, { status: 404 });

  let isUnverified = false;
  let scrapedMeta: any = {};
  try {
    scrapedMeta = JSON.parse(trainer.adminNotes ?? "{}");
    isUnverified = scrapedMeta.isUnverified === true;
  } catch {}

  const order = await razorpayClient.orders.create({
    amount: price * 100,
    currency: "INR",
    receipt: `ld_${Date.now()}`,
    notes: {
      trainerId: String(trainerId),
      studentName,
      phone,
      packageName,
      isUnverified: String(isUnverified),
    },
  });

  const booking = await prisma.booking.create({
    data: {
      trainerId: Number(trainerId),
      customerName: studentName,
      mobile: phone,
      city: city ?? trainer.city,
      address: address ?? "",
      pincode: pincode ?? "",
      packageName: packageName ?? "Package",
      amount: price,
      status: "PENDING",
      razorpayOrderId: order.id,
    },
  });

  if (isUnverified) {
    const adminMsg = buildAdminCoordinationMessage({
      bookingId: String(booking.id),
      studentName,
      studentPhone: phone,
      studentEmail: email,
      trainerName: trainer.name,
      trainerPhone: trainer.mobile,
      trainerAddress: scrapedMeta.address ?? trainer.city,
      trainerWebsite: scrapedMeta.website ?? "",
      trainerGMB: scrapedMeta.placeId ? `https://maps.google.com/?cid=${scrapedMeta.placeId}` : "",
      packageName: packageName ?? "Package",
      price,
      city: trainer.city,
    });

    await sendWhatsApp("918700896528", adminMsg);

    if (resendClient) {
      await resendClient.emails.send({
        from: process.env.FROM_EMAIL!,
        to: process.env.ADMIN_EMAIL!,
        subject: `ðŸ”” New booking â€” coordinate with ${trainer.name} (${trainer.city})`,
        html: buildAdminEmail({
          bookingId: String(booking.id),
          studentName,
          studentPhone: phone,
          studentEmail: email,
          trainerName: trainer.name,
          trainerPhone: trainer.mobile,
          trainerAddress: scrapedMeta.address,
          trainerWebsite: scrapedMeta.website,
          trainerGMB: scrapedMeta.placeId ? `https://maps.google.com/?cid=${scrapedMeta.placeId}` : "",
          packageName: packageName ?? "Package",
          price,
          city: trainer.city,
        }),
      });
    }

    await sendWhatsApp(
      `91${phone}`,
      `Hi ${studentName}! âœ… Your booking with ${trainer.name} in ${trainer.city} is confirmed!\n\nPackage: ${packageName}\nAmount paid: â‚¹${price.toLocaleString(
        "en-IN"
      )}\n\nOur team will call you within 2 hours to confirm your first session.\n\nâ€” LearnDrive\nðŸ“ž +91 87008 96528`
    );
  }

  return NextResponse.json({
    orderId: order.id,
    bookingId: booking.id,
    isUnverified,
  });
}

function buildAdminCoordinationMessage(d: {
  bookingId: string;
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  trainerName: string;
  trainerPhone: string;
  trainerAddress: string;
  trainerWebsite: string;
  trainerGMB: string;
  packageName: string;
  price: number;
  city: string;
}) {
  return `ðŸ”” *NEW BOOKING â€” ACTION NEEDED*

*Booking ID:* ${d.bookingId}

*Student:*
Name: ${d.studentName}
Phone: ${d.studentPhone}
${d.studentEmail ? `Email: ${d.studentEmail}` : ""}

*School to Coordinate With:*
Name: ${d.trainerName}
City: ${d.city}
Phone: ${d.trainerPhone}
Address: ${d.trainerAddress}
${d.trainerWebsite ? `Website: ${d.trainerWebsite}` : ""}
${d.trainerGMB ? `GMB: ${d.trainerGMB}` : ""}

*Package:* ${d.packageName}
*Amount Collected:* â‚¹${d.price.toLocaleString("en-IN")}

*STEPS:*
1. Call ${d.trainerName} on ${d.trainerPhone}
2. Share student: ${d.studentName}, ${d.studentPhone}
3. Confirm session schedule
4. Pitch LearnDrive â€” 1st booking already done!
5. Mark CONFIRMED in admin

https://learndrive.in/admin`;
}

function buildAdminEmail(d: {
  bookingId: string;
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  trainerName: string;
  trainerPhone: string;
  trainerAddress?: string;
  trainerWebsite?: string;
  trainerGMB?: string;
  packageName: string;
  price: number;
  city: string;
}) {
  return `
  <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#1a1a2e;color:white;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <h2 style="margin:0;font-size:18px;">ðŸ”” New Booking â€” Coordinate with ${d.trainerName}</h2>
      <p style="margin:6px 0 0;color:#aaa;font-size:13px;">Booking ID: ${d.bookingId}</p>
    </div>
    <div style="background:#f5f0e8;border-radius:12px;padding:20px;margin-bottom:16px;">
      <h3 style="margin:0 0 12px;font-size:13px;color:#555;text-transform:uppercase;">Student</h3>
      <p style="margin:4px 0;"><strong>${d.studentName}</strong></p>
      <p style="margin:4px 0;color:#555;">ðŸ“ž ${d.studentPhone}</p>
      ${d.studentEmail ? `<p style="margin:4px 0;color:#555;">âœ‰ï¸ ${d.studentEmail}</p>` : ""}
    </div>
    <div style="background:#fff8ed;border:1px solid #f5d49a;border-radius:12px;padding:20px;margin-bottom:16px;">
      <h3 style="margin:0 0 12px;font-size:13px;color:#555;text-transform:uppercase;">School to Call</h3>
      <p style="margin:4px 0;"><strong>${d.trainerName}</strong> Â· ${d.city}</p>
      <p style="margin:4px 0;color:#555;">ðŸ“ž <a href="tel:${d.trainerPhone}">${d.trainerPhone}</a></p>
      ${d.trainerAddress ? `<p style="margin:4px 0;color:#555;">ðŸ“ ${d.trainerAddress}</p>` : ""}
      ${d.trainerWebsite ? `<p style="margin:4px 0;"><a href="${d.trainerWebsite}">${d.trainerWebsite}</a></p>` : ""}
      ${d.trainerGMB ? `<p style="margin:4px 0;"><a href="${d.trainerGMB}" style="color:#2a7a4b;">View on Google Maps â†’</a></p>` : ""}
    </div>
    <div style="background:#edf7f1;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:4px 0;"><strong>Package:</strong> ${d.packageName}</p>
      <p style="margin:4px 0;"><strong>Amount:</strong> <span style="color:#e8821a;font-size:18px;font-weight:bold;">â‚¹${d.price.toLocaleString(
        "en-IN"
      )}</span></p>
    </div>
    <div style="border:2px solid #e8821a;border-radius:12px;padding:20px;">
      <h3 style="margin:0 0 12px;color:#e8821a;">ðŸ“‹ Action Steps</h3>
      <ol style="margin:0;padding-left:20px;line-height:1.8;">
        <li>Call <strong>${d.trainerName}</strong> on <strong>${d.trainerPhone}</strong></li>
        <li>Share student: <strong>${d.studentName}</strong> Â· <strong>${d.studentPhone}</strong></li>
        <li>Confirm session schedule</li>
        <li>Pitch LearnDrive â€” 1st booking already done, â‚¹500 commission waived for joining!</li>
        <li>Mark booking <strong>CONFIRMED</strong> in admin</li>
      </ol>
      <a href="https://learndrive.in/admin" style="display:inline-block;margin-top:16px;background:#e8821a;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
        Open Admin â†’
      </a>
    </div>
  </div>`;
}
