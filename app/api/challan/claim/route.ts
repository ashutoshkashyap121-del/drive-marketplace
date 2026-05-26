import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { smsChallanCashbackClaim } from "@/lib/sms";

const PAYMENT_CAPS: Record<string, number> = {
  upi: 75,
  credit_card: 100,
  debit_card: 50,
};

const PAYMENT_LABELS: Record<string, string> = {
  upi: "UPI (GPay/PhonePe/Paytm)",
  credit_card: "Credit Card",
  debit_card: "Debit Card / Net Banking",
};

function computeCashback(challanAmount: number, paymentMethod: string): number {
  if (!challanAmount || challanAmount < 300 || !PAYMENT_CAPS[paymentMethod]) return 0;
  const raw = Math.round(challanAmount * 0.10);
  const capped = Math.min(raw, PAYMENT_CAPS[paymentMethod]);
  return Math.max(Math.round(capped / 5) * 5, 0);
}

function generateCode(phone: string, vehicleNo: string): string {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  const prefix = vehicleNo.slice(-4).toUpperCase().replace(/\s/g, "");
  return `CB-${prefix}-${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const { phone, vehicleNo, upiId, challanAmount, paymentMethod } = await req.json();

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
    }
    if (!vehicleNo || vehicleNo.trim().length < 4) {
      return NextResponse.json({ error: "Enter your vehicle registration number" }, { status: 400 });
    }
    if (!challanAmount || typeof challanAmount !== "number" || challanAmount < 300) {
      return NextResponse.json({ error: "Challan amount must be at least ₹300" }, { status: 400 });
    }
    if (!paymentMethod || !PAYMENT_CAPS[paymentMethod]) {
      return NextResponse.json({ error: "Select a valid payment method" }, { status: 400 });
    }

    const cleanVehicle = vehicleNo.trim().toUpperCase().replace(/\s/g, "");
    const cashbackAmt = computeCashback(challanAmount, paymentMethod);
    const promoCode = generateCode(phone, cleanVehicle);

    // Deduplicate: same phone in last 90 days
    const existingClaim = await prisma.adminAuditLog.findFirst({
      where: {
        action: "CHALLAN_CASHBACK_CLAIM",
        metadata: { path: ["phone"], equals: phone },
        createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
    });

    if (existingClaim) {
      return NextResponse.json(
        { error: "A cashback claim for this number was already submitted in the last 90 days." },
        { status: 409 }
      );
    }

    await prisma.adminAuditLog.create({
      data: {
        action: "CHALLAN_CASHBACK_CLAIM",
        entityType: "ChallanCashback",
        entityId: null,
        metadata: {
          phone,
          vehicleNo: cleanVehicle,
          upiId: upiId || null,
          challanAmount,
          paymentMethod,
          promoCode,
          cashbackAmt,
          status: "PENDING",
        },
      },
    });

    await smsChallanCashbackClaim({ mobile: phone, promoCode, amount: cashbackAmt }).catch(() => {});

    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    if (resend && process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || "LearnDrive <notifications@learndrive.in>",
        to: process.env.ADMIN_EMAIL,
        subject: `💰 Challan Cashback Claim — ${cleanVehicle} — ₹${cashbackAmt}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;padding:24px;">
            <h2 style="color:#1a2540;">New Challan Cashback Claim</h2>
            <div style="background:#f5f0e8;border-radius:12px;padding:20px;margin:16px 0;">
              <p style="margin:4px 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin:4px 0;"><strong>Vehicle No:</strong> ${cleanVehicle}</p>
              <p style="margin:4px 0;"><strong>Challan Amount:</strong> ₹${challanAmount}</p>
              <p style="margin:4px 0;"><strong>Payment Method:</strong> ${PAYMENT_LABELS[paymentMethod] || paymentMethod}</p>
              <p style="margin:4px 0;"><strong>UPI ID:</strong> ${upiId || "Not provided — send to phone number"}</p>
              <p style="margin:4px 0;"><strong>Cashback to pay:</strong> ₹${cashbackAmt} (10% of ₹${challanAmount}, capped at ₹${PAYMENT_CAPS[paymentMethod]})</p>
              <p style="margin:4px 0;"><strong>Claim Code:</strong> ${promoCode}</p>
            </div>
            <div style="background:#fff8ed;border:1px solid #f5d49a;border-radius:12px;padding:16px;">
              <p style="margin:0;font-weight:700;color:#92400e;">Action required:</p>
              <ol style="margin:8px 0 0;padding-left:20px;color:#555;font-size:14px;line-height:1.8;">
                <li>Verify challan was paid on <a href="https://echallan.parivahan.gov.in">echallan.parivahan.gov.in</a> for vehicle ${cleanVehicle}</li>
                <li>Confirm payment method matches: ${PAYMENT_LABELS[paymentMethod] || paymentMethod}</li>
                <li>If verified, send <strong>₹${cashbackAmt}</strong> via UPI to ${upiId || phone}</li>
                <li>Reply to claimant at ${phone} confirming payout</li>
              </ol>
            </div>
            <a href="https://learndrive.in/admin" style="display:inline-block;margin-top:16px;background:#1a2540;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
              Open Admin →
            </a>
          </div>`,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, promoCode, cashbackAmt });
  } catch (err) {
    console.error("[CHALLAN_CLAIM_ERROR]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
