import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const auth = await authorizeAdminRequest(req);
  if (!auth.ok) {
    return auth.response;
  }

  const leads = await prisma.outreachLead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(leads);
}
