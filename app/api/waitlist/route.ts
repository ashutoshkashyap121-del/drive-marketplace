export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check for duplicate
    const existing = await prisma.waitlist.findUnique({ where: { email } });
    if (existing) {
      // Don't error — just return success silently so we don't leak info
      return NextResponse.json({ success: true });
    }

    await prisma.waitlist.create({ data: { email } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[WAITLIST_ERROR]", error);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Admin-only: fetch all waitlist emails
  // Basic protection — check for admin token in header
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await prisma.waitlist.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ total: entries.length, entries });
}