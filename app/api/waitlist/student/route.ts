// app/api/waitlist/student/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, city } = await req.json();

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Valid 10-digit mobile number required" },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 });
    }

    // Upsert to avoid duplicates on same phone number
    await prisma.studentWaitlist.upsert({
      where: { phone },
      update: { city, name: name || undefined, email: email || undefined },
      create: {
        name: name || null,
        phone,
        email: email || null,
        city,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Admin endpoint to view waitlist (basic auth via ADMIN_SECRET header)
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const city = req.nextUrl.searchParams.get("city");

  const waitlist = await prisma.studentWaitlist.findMany({
    where: city ? { city: { contains: city, mode: "insensitive" } } : {},
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ waitlist, count: waitlist.length });
}