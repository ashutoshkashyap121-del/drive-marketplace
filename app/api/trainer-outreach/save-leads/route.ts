import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const auth = await authorizeAdminRequest(req, { requireCsrf: true });
  if (!auth.ok) {
    return auth.response;
  }

  const { leads } = await req.json();

  if (!leads || !Array.isArray(leads) || leads.length === 0) {
    return NextResponse.json({ error: "No leads provided" }, { status: 400 });
  }

  let saved = 0;
  let skipped = 0;

  for (const lead of leads) {
    const phone = lead.phone?.replace(/\D/g, "").replace(/^91/, "").slice(-10);
    if (!phone || phone.length !== 10) {
      skipped++;
      continue;
    }

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
      skipped++;
    }
  }

  return NextResponse.json({ success: true, saved, skipped });
}
