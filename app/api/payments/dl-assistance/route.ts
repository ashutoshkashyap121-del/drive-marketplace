import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const order = await razorpay.orders.create({
      amount: 49900, // ₹499 in paise
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