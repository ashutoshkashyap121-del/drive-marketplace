import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Swap this URL once you have your ACKO / PolicyBazaar affiliate ID
const AFFILIATE_URL =
  process.env.INSURANCE_AFFILIATE_URL ||
  "https://www.acko.com/car-insurance/?utm_source=learndrive&utm_medium=challan-cashback&utm_campaign=insurance-affiliate";

export async function GET(req: NextRequest) {
  const source = req.nextUrl.searchParams.get("src") || "unknown";

  // Fire-and-forget click log — don't block the redirect
  prisma.adminAuditLog
    .create({
      data: {
        action: "AFFILIATE_CLICK",
        entityType: "InsuranceAffiliate",
        entityId: null,
        metadata: { source, url: AFFILIATE_URL, ts: new Date().toISOString() },
      },
    })
    .catch(() => {});

  return NextResponse.redirect(AFFILIATE_URL, { status: 302 });
}
