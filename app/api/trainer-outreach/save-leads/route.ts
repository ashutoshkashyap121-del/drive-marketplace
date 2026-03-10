// app/api/trainer-outreach/save-leads/route.ts
// Saves leads found via Google Places into OutreachLead table
// so ai-ops can bulk-send WhatsApp/SMS to them automatically

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { leads } = await req.json();

  if (!leads || !Array.isArray(leads) || leads.length === 0) {
    return NextResponse.json({ error: "No leads provided" }, { status: 400 });
  }

  let saved = 0;
  let skipped = 0;

  for (const lead of leads) {
    const phone = lead.phone?.replace(/\D/g, "").replace(/^91/, "").slice(-10);
    if (!phone || phone.length !== 10) { skipped++; continue; }

    try {
      await prisma.outreachLead.create({
        data: {
          name: lead.name || "Unknown",
          phone,
          city: lead.city || "Unknown",
          source: "gmaps",
          outreachStatus: "PENDING",
        },
      });
      saved++;
    } catch {
      // Unique constraint — already exists
      skipped++;
    }
  }

  return NextResponse.json({ success: true, saved, skipped });
}