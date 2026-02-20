export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin";

export async function GET() {
  try {
    // 🔐 Admin Verification (DB Session)
    if (!(await verifyAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const trainers = await prisma.trainer.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(trainers);

  } catch (error) {
    console.error("ADMIN TRAINERS LIST ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}