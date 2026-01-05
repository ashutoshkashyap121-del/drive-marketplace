import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic"; // 🔴 VERY IMPORTANT

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("API /bookings error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
