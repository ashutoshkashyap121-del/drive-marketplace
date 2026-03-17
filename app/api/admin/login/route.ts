export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = req.headers.get("x-real-ip")?.trim();
    const clientIp = forwardedFor || realIp || "unknown";
    const rateLimit = checkRateLimit(`admin-login:${clientIp}`);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again later." },
        {
          status: 429,
          headers: {
            "Cache-Control": "no-store",
            "Retry-After": "900",
          },
        },
      );
    }

    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      );
    }

    const sessionId = randomUUID();
    const csrfToken = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const isProduction = process.env.NODE_ENV === "production";

    await prisma.adminSession.create({
      data: {
        id: sessionId,
        expiresAt,
      },
    });

    const cookieStore = await cookies();

    cookieStore.set("admin_session", sessionId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
      priority: "high",
    });

    cookieStore.set("csrf_token", csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
      priority: "high",
    });

    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
