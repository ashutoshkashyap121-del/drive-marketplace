export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const auth = await authorizeAdminRequest(req, { requireCsrf: true });
    if (!auth.ok) {
      return auth.response;
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;
    const isProduction = process.env.NODE_ENV === "production";

    if (sessionId) {
      await prisma.adminSession.deleteMany({
        where: { id: sessionId },
      });
    }

    cookieStore.set("admin_session", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
      priority: "high",
    });

    cookieStore.set("csrf_token", "", {
      httpOnly: false,
      secure: isProduction,
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
      priority: "high",
    });

    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("ADMIN LOGOUT ERROR:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
