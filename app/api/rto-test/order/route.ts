import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    // Only allow ₹49 (4900 paise) for RTO test
    if (amount !== 4900) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
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