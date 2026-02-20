export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("admin_session")?.value;

    if (sessionId) {
      // 🗑 Delete session from DB (if exists)
      await prisma.adminSession.deleteMany({
        where: { id: sessionId },
      });
    }

    // 🍪 Clear cookie
    cookieStore.set("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("ADMIN LOGOUT ERROR:", error);

    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}