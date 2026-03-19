import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

function getRazorpayClient(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

export async function POST(req: NextRequest) {
  const razorpayClient = getRazorpayClient();
  if (!razorpayClient) {
    return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
  }

  try {
    const order = await razorpayClient.orders.create({
      amount: 49900,
      currency: "INR",
      receipt: `dl_assist_${Date.now()}`,
      notes: { service: "dl-assistance" },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    console.error("Razorpay error:", err);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
