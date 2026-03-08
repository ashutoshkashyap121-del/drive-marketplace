// app/api/trainer-outreach/sms/route.ts
// Sends SMS to selected trainers via Fast2SMS

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { numbers, message } = await req.json();

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return NextResponse.json({ error: "Phone numbers required" }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Clean numbers — remove +91, spaces, dashes
    const cleaned = numbers
      .map((n: string) => n.replace(/\D/g, "").replace(/^91/, "").slice(-10))
      .filter((n: string) => n.length === 10);

    if (cleaned.length === 0) {
      return NextResponse.json({ error: "No valid phone numbers found" }, { status: 400 });
    }

    // Fast2SMS bulk DLT route
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q", // Quick transactional route
        message: message,
        language: "english",
        flash: 0,
        numbers: cleaned.join(","),
      }),
    });

    const data = await response.json();

    if (!response.ok || data.return === false) {
      console.error("Fast2SMS error:", data);
      return NextResponse.json(
        { error: data.message?.[0] || "SMS sending failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sent: cleaned.length,
      requestId: data.request_id,
    });
  } catch (err) {
    console.error("SMS error:", err);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}