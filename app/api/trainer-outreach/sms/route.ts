import { NextRequest, NextResponse } from "next/server";
import { authorizeAdminRequest } from "@/lib/admin";

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeAdminRequest(req, { requireCsrf: true });
    if (!auth.ok) {
      return auth.response;
    }

    const { numbers, message } = await req.json();

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return NextResponse.json({ error: "Phone numbers required" }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const cleaned = numbers
      .map((n: string) => n.replace(/\D/g, "").replace(/^91/, "").slice(-10))
      .filter((n: string) => n.length === 10);

    if (cleaned.length === 0) {
      return NextResponse.json({ error: "No valid phone numbers found" }, { status: 400 });
    }

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: process.env.FAST2SMS_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message,
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
        { status: 500 },
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
