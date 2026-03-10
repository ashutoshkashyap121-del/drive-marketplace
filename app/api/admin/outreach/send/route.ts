// app/api/admin/outreach/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FAST2SMS_KEY = process.env.FAST2SMS_API_KEY!;
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "1025099124020438";

async function sendWhatsApp(phone: string, trainerName: string): Promise<boolean> {
  const mobile = phone.replace(/^\+91/, "").replace(/\D/g, "");
  try {
    const res = await fetch("https://www.fast2sms.com/dev/whatsapp", {
      method: "POST",
      headers: {
        authorization: FAST2SMS_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number_id: WA_PHONE_ID,
        to: `91${mobile}`,
        type: "template",
        template: {
          name: "trainer_outreach",
          language: { code: "en" },
          components: [
            { type: "body", parameters: [{ type: "text", text: trainerName }] },
          ],
        },
      }),
    });
    const data = await res.json();
    return data.return === true;
  } catch {
    return false;
  }
}

async function sendSMS(phone: string, trainerName: string): Promise<boolean> {
  try {
    const message = `Hi ${trainerName}! Join LearnDrive - India's fastest-growing driving trainer platform. Get 10-15 students/month, keep 85% of every booking. Register free: learndrive.in/trainers/register | Reply STOP to opt out.`;
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: FAST2SMS_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message,
        language: "english",
        flash: 0,
        numbers: phone,
      }),
    });
    const data = await res.json();
    return data.return === true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { leadId, phone, name, sendAll } = await req.json();

  // Single lead
  if (leadId && phone && name) {
    const waSuccess = await sendWhatsApp(phone, name);
    const smsSuccess = waSuccess ? true : await sendSMS(phone, name);

    // Log in DB
    await prisma.outreachLead.update({
      where: { id: leadId },
      data: {
        whatsappSent: waSuccess,
        smsSent: !waSuccess && smsSuccess,
        outreachStatus: waSuccess || smsSuccess ? "CONTACTED" : "FAILED",
        lastContactedAt: new Date(),
      },
    });

    return NextResponse.json({ waSuccess, smsSuccess });
  }

  // Send to all pending leads
  if (sendAll) {
    const leads = await prisma.outreachLead.findMany({
      where: { outreachStatus: "PENDING" },
      take: 100,
    });

    let contacted = 0, failed = 0;
    for (const lead of leads) {
      const waSuccess = await sendWhatsApp(lead.phone, lead.name);
      const smsSuccess = waSuccess ? true : await sendSMS(lead.phone, lead.name);

      await prisma.outreachLead.update({
        where: { id: lead.id },
        data: {
          whatsappSent: waSuccess,
          smsSent: !waSuccess && smsSuccess,
          outreachStatus: waSuccess || smsSuccess ? "CONTACTED" : "FAILED",
          lastContactedAt: new Date(),
        },
      });

      if (waSuccess || smsSuccess) contacted++;
      else failed++;

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 300));
    }

    return NextResponse.json({ contacted, failed, total: leads.length });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}