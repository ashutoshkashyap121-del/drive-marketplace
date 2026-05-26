// app/api/hire-driver/request/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, mobile, email, city, tripType,
      startDate, endDate, days, pickupAddress,
      notes, estimatedPrice,
    } = body;

    if (!name || !mobile || !city || !tripType || !startDate || !pickupAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const price = Number(estimatedPrice) || 0;
    const platformFee = Math.round(price * 0.15);
    const driverPayout = price - platformFee;

    const request = await prisma.driverRequest.create({
      data: {
        customerName: name,
        mobile,
        email: email || null,
        city,
        tripType,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        days: Number(days) || 1,
        pickupAddress,
        notes: notes || null,
        estimatedPrice: price,
        platformFee,
        driverPayout,
        status: "PENDING",
      },
    });

    // Notify admin
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const startFormatted = new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      await resend.emails.send({
        from: process.env.FROM_EMAIL || "LearnDrive <notifications@learndrive.in>",
        to: process.env.ADMIN_EMAIL,
        subject: `🚗 New Driver Hire Request — ${name} — ${city} — ${tripType}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;padding:24px;">
            <div style="background:#1a2540;color:white;border-radius:12px;padding:20px 24px;margin-bottom:20px;">
              <h2 style="margin:0;font-size:18px;">New Driver Hire Request</h2>
              <p style="margin:6px 0 0;color:#aaa;font-size:13px;">Request #${request.id}</p>
            </div>
            <div style="background:#f5f0e8;border-radius:12px;padding:20px;margin-bottom:16px;">
              <h3 style="margin:0 0 10px;font-size:13px;color:#555;text-transform:uppercase;">Customer</h3>
              <p style="margin:4px 0;"><strong>${name}</strong></p>
              <p style="margin:4px 0;">📞 <a href="tel:${mobile}">${mobile}</a></p>
              ${email ? `<p style="margin:4px 0;">✉ ${email}</p>` : ""}
            </div>
            <div style="background:#fff8ed;border:1px solid #f5d49a;border-radius:12px;padding:20px;margin-bottom:16px;">
              <h3 style="margin:0 0 10px;font-size:13px;color:#555;text-transform:uppercase;">Trip Details</h3>
              <p style="margin:4px 0;"><strong>Type:</strong> ${tripType}</p>
              <p style="margin:4px 0;"><strong>City:</strong> ${city}</p>
              <p style="margin:4px 0;"><strong>Start:</strong> ${startFormatted}</p>
              <p style="margin:4px 0;"><strong>Duration:</strong> ${days} day${days > 1 ? "s" : ""}</p>
              <p style="margin:4px 0;"><strong>Pickup:</strong> ${pickupAddress}</p>
              ${notes ? `<p style="margin:4px 0;"><strong>Notes:</strong> ${notes}</p>` : ""}
            </div>
            ${price > 0 ? `
            <div style="background:#edf7f1;border-radius:12px;padding:16px;margin-bottom:20px;">
              <p style="margin:4px 0;"><strong>Estimated:</strong> ₹${price.toLocaleString("en-IN")}</p>
              <p style="margin:4px 0;color:#555;font-size:13px;">Platform fee (15%): ₹${platformFee.toLocaleString("en-IN")}</p>
            </div>` : ""}
            <a href="https://learndrive.in/admin" style="display:inline-block;background:#e8821a;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
              Open Admin →
            </a>
          </div>`,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, id: request.id });
  } catch (err) {
    console.error("Driver request error:", err);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
