import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const SERVICE_FEE = 49; // ₹49 flat service fee

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

export async function POST(req: NextRequest) {
  const rz = getRazorpay();
  if (!rz) return NextResponse.json({ error: "Payment provider not configured" }, { status: 500 });

  try {
    const { vehicleNo, challanAmount, name, phone } = await req.json();

    if (!vehicleNo || String(vehicleNo).trim().length < 6)
      return NextResponse.json({ error: "Enter a valid vehicle number" }, { status: 400 });
    if (!challanAmount || Number(challanAmount) < 100)
      return NextResponse.json({ error: "Challan amount must be at least ₹100" }, { status: 400 });
    if (!/^[6-9]\d{9}$/.test(String(phone)))
      return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
    if (!name || String(name).trim().length < 2)
      return NextResponse.json({ error: "Enter your name" }, { status: 400 });

    const totalAmount = Number(challanAmount) + SERVICE_FEE;

    const order = await rz.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `cp_${Date.now()}`,
      notes: {
        service: "challan-pay",
        vehicleNo: String(vehicleNo).trim().toUpperCase(),
        challanAmount: String(challanAmount),
        serviceFee: String(SERVICE_FEE),
        name: String(name).trim(),
        phone: String(phone),
      },
    });

    return NextResponse.json({ orderId: order.id, totalAmount, serviceFee: SERVICE_FEE });
  } catch (err) {
    console.error("[CHALLAN_PAY_ORDER_ERROR]", err);
    return NextResponse.json({ error: "Order creation failed. Please try again." }, { status: 500 });
  }
}
