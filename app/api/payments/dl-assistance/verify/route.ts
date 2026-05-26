import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Notify admin — customer details come later via /api/dl-assistance/send-details
    const resend = new Resend(process.env.RESEND_API_KEY);
    if (process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || "LearnDrive <notifications@learndrive.in>",
        to: process.env.ADMIN_EMAIL,
        subject: `💰 New DL Assistance payment — ₹499 — ${razorpay_payment_id}`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;padding:24px;">
            <h2 style="color:#1a2540;">New DL Assistance Payment Received</h2>
            <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
            <p><strong>Order ID:</strong> ${razorpay_order_id}</p>
            <p><strong>Amount:</strong> ₹499</p>
            <p style="color:#555;font-size:13px;">Customer details will arrive in a second email once they complete the chat with Priya.</p>
          </div>`,
      }).catch(() => {}); // non-blocking
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DL_ASSIST_VERIFY_ERROR]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
