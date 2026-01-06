import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";        // ✅ REQUIRED
export const dynamic = "force-dynamic"; // ✅ REQUIRED

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const booking = await prisma.booking.create({
      data: body,
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("POST /api/bookings error", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
