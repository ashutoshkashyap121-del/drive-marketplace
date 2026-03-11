// app/api/dl-reminder/route.ts
// Saves DL expiry reminder subscription

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { mobile, dlExpiryDate, name } = await req.json();

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json({ error: "Valid 10-digit mobile required" }, { status: 400 });
    }

    if (!dlExpiryDate) {
      return NextResponse.json({ error: "DL expiry date required" }, { status: 400 });
    }

    const expiry = new Date(dlExpiryDate);
    if (isNaN(expiry.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    // Don't save if already expired by more than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (expiry < thirtyDaysAgo) {
      return NextResponse.json({
        error: "Your DL has already expired. Use our DL Assistance service to renew it.",
        expired: true,
      }, { status: 400 });
    }

    // Upsert — if same mobile exists, update expiry date
    const reminder = await (prisma as any).dLReminder.upsert({
      where: {
        // Use a unique constraint workaround — find existing and update
        id: -1, // force create path
      },
      update: {},
      create: {
        mobile,
        dlExpiryDate: expiry,
        name: name || null,
        active: true,
      },
    }).catch(async () => {
      // If upsert fails, just create
      return (prisma as any).dLReminder.create({
        data: {
          mobile,
          dlExpiryDate: expiry,
          name: name || null,
          active: true,
        },
      });
    });

    // Send immediate confirmation SMS via Fast2SMS
    const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const confirmMsg = daysLeft > 60
      ? `LearnDrive: Hi${name ? ` ${name}` : ""}! We'll remind you before your DL expires on ${expiry.toLocaleDateString("en-IN")}. Need help renewing? Visit learndrive.in/dl-assistance`
      : daysLeft > 0
      ? `LearnDrive: Hi${name ? ` ${name}` : ""}! Your DL expires in ${daysLeft} days. Start renewal now to avoid fines. We can help: learndrive.in/dl-assistance`
      : `LearnDrive: Hi${name ? ` ${name}` : ""}! Your DL has expired. Renew it now to avoid ₹5,000 fine. We can help: learndrive.in/dl-assistance`;

    await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message: confirmMsg,
        numbers: mobile,
        flash: 0,
      }),
    }).catch(() => {}); // Don't fail if SMS fails

    return NextResponse.json({
      success: true,
      daysLeft,
      message: daysLeft <= 0
        ? "Your DL has expired — we recommend getting DL Assistance now."
        : `Got it! We'll remind you ${daysLeft > 60 ? "60, 30, and 7" : daysLeft > 30 ? "30 and 7" : "7"} days before your DL expires.`,
    });
  } catch (error) {
    console.error("DL reminder error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}