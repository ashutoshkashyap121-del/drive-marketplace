export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { notifyAdminCorporateInquiry } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const company = String(body.company || "").trim().slice(0, 200);
    const contactName = String(body.contactName || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().slice(0, 160);
    const phone = String(body.phone || "").trim().slice(0, 30);
    const city = String(body.city || "").trim().slice(0, 80);
    const teamSize = String(body.teamSize || "").trim().slice(0, 40);
    const message = String(body.message || "").trim().slice(0, 2000);
    const website = String(body.website || "").trim(); // honeypot — bots fill this

    // Silently accept bot submissions so they don't retry.
    if (website) return NextResponse.json({ success: true });

    if (!company || !contactName || !phone) {
      return NextResponse.json(
        { error: "Company, your name, and phone are required." },
        { status: 400 },
      );
    }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    // Always log (visible in Vercel logs) as a backup record in case email delivery fails.
    console.log("[CORPORATE_INQUIRY]", { company, contactName, email, phone, city, teamSize });

    await notifyAdminCorporateInquiry({
      company,
      contactName,
      email,
      phone,
      city,
      teamSize,
      message,
    }).catch((err) => console.error("[CORPORATE_INQUIRY_EMAIL_ERROR]", err));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[CORPORATE_INQUIRY_ERROR]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
