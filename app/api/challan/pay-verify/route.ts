import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { sendChallanPayConfirmation } from "@/lib/sms";

function generateRef(vehicleNo: string): string {
  const suffix = Date.now().toString(36).toUpperCase().slice(-5);
  const prefix = vehicleNo.slice(-4).toUpperCase().replace(/\s/g, "");
  return `CP-${prefix}-${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      vehicleNo,
      challanAmount,
      name,
      phone,
    } = await req.json();

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const cleanVehicle = String(vehicleNo).trim().toUpperCase().replace(/\s/g, "");
    const refCode = generateRef(cleanVehicle);
    const totalPaid = Number(challanAmount) + 49;

    // Log to AdminAuditLog
    await prisma.adminAuditLog.create({
      data: {
        action: "CHALLAN_PAY_ORDER",
        entityType: "ChallanPayment",
        entityId: razorpay_payment_id,
        metadata: {
          vehicleNo: cleanVehicle,
          challanAmount: Number(challanAmount),
          serviceFee: 49,
          totalPaid,
          name: String(name).trim(),
          phone: String(phone),
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          refCode,
          status: "PENDING_FULFILLMENT",
        },
      },
    });

    // SMS user
    await sendChallanPayConfirmation({
      mobile: String(phone),
      vehicleNo: cleanVehicle,
      refCode,
      totalPaid,
    }).catch(() => {});

    // Email admin
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    if (resend && process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || "LearnDrive <notifications@learndrive.in>",
        to: process.env.ADMIN_EMAIL,
        subject: `🚦 Challan Payment — ${cleanVehicle} — ₹${totalPaid} received`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;padding:24px;">
            <h2 style="color:#1a2540;">Challan Payment Received — Action Required</h2>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:16px 0;">
              <p style="margin:4px 0;"><strong>Customer:</strong> ${name} (${phone})</p>
              <p style="margin:4px 0;"><strong>Vehicle No:</strong> ${cleanVehicle}</p>
              <p style="margin:4px 0;"><strong>Challan Amount:</strong> ₹${challanAmount}</p>
              <p style="margin:4px 0;"><strong>Service Fee:</strong> ₹49</p>
              <p style="margin:4px 0;"><strong>Total Collected:</strong> ₹${totalPaid}</p>
              <p style="margin:4px 0;"><strong>Razorpay Payment ID:</strong> ${razorpay_payment_id}</p>
              <p style="margin:4px 0;"><strong>Ref Code:</strong> ${refCode}</p>
            </div>
            <div style="background:#fff8ed;border:1px solid #f5d49a;border-radius:12px;padding:16px;">
              <p style="margin:0;font-weight:700;color:#92400e;">⚡ Action required within 4 hours:</p>
              <ol style="margin:8px 0 0;padding-left:20px;color:#555;font-size:14px;line-height:2;">
                <li>Go to <a href="https://echallan.parivahan.gov.in/index/accused-challan">echallan.parivahan.gov.in</a></li>
                <li>Search for vehicle <strong>${cleanVehicle}</strong></li>
                <li>Pay the challan of ₹${challanAmount} (we've already collected this from customer)</li>
                <li>Download the receipt</li>
                <li>SMS customer at ${phone}: "Your challan for ${cleanVehicle} has been paid. Receipt saved. Ref: ${refCode} – LearnDrive"</li>
              </ol>
            </div>
            <a href="https://learndrive.in/admin" style="display:inline-block;margin-top:16px;background:#1a2540;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
              Open Admin →
            </a>
          </div>`,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, refCode });
  } catch (err) {
    console.error("[CHALLAN_PAY_VERIFY_ERROR]", err);
    return NextResponse.json({ error: "Verification failed. Contact support." }, { status: 500 });
  }
}
