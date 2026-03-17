export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin";

export async function GET(req: Request) {
  try {
    const auth = await authorizeAdminRequest(req);
    if (!auth.ok) {
      return auth.response;
    }

    const bookings = await prisma.booking.findMany({
      include: {
        trainer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("ADMIN BOOKINGS ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
