export const runtime = "nodejs";
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
    const { amount, customerName, trainerName } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Razorpay amount is in paise (multiply by 100)
    const order = await razorpayClient.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        customerName,
        trainerName,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("[RAZORPAY_ORDER_ERROR]", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
