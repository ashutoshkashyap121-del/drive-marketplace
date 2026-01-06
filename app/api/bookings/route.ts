import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

export async function GET() {
  try {
    const prisma = await getPrisma();

    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const prisma = await getPrisma();
    const body = await req.json();

    const booking = await prisma.booking.create({
      data: body,
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
