import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

/**
 * IMPORTANT:
 * This prevents Vercel from executing this route during build time
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("API /bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
