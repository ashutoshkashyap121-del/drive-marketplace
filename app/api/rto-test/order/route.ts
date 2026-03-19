import { NextResponse } from "next/server";
import Razorpay from "razorpay";

function getRazorpayClient(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

export async function POST(req: Request) {
  const razorpayClient = getRazorpayClient();
  if (!razorpayClient) {
    return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });
  }

  try {
    const { amount } = await req.json();

    // Only allow ₹49 (4900 paise) for RTO test
    if (amount !== 4900) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const order = await razorpayClient.orders.create({
      amount: 4900,
      currency: "INR",
      receipt: `rto_${Date.now()}`,
      notes: {
        product: "RTO Mock Test",
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("RTO order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
