import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCSRF } from "@/lib/csrf";

async function hasValidAdminSession(sessionId?: string | null): Promise<boolean> {
  if (!sessionId) return false;

  const session = await prisma.adminSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) return false;

  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({
      where: { id: sessionId },
    }).catch(() => undefined);
    return false;
  }

  return true;
}

export async function verifyAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;
    return hasValidAdminSession(sessionId);
  } catch (error) {
    console.error("VERIFY ADMIN ERROR:", error);
    return false;
  }
}

export async function authorizeAdminRequest(
  req: Request,
  options: { requireCsrf?: boolean } = {},
) {
  try {
    const adminSecret = req.headers.get("x-admin-secret");
    if (process.env.ADMIN_SECRET && adminSecret === process.env.ADMIN_SECRET) {
      return { ok: true as const, method: "secret" as const };
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("admin_session")?.value;
    const hasSession = await hasValidAdminSession(sessionId);

    if (!hasSession) {
      return {
        ok: false as const,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }

    if (options.requireCsrf && !(await verifyCSRF(req))) {
      return {
        ok: false as const,
        response: NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 }),
      };
    }

    return { ok: true as const, method: "session" as const };
  } catch (error) {
    console.error("AUTHORIZE ADMIN REQUEST ERROR:", error);
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}

export async function requireAdminPageAccess() {
  const allowed = await verifyAdmin();
  if (!allowed) {
    redirect("/admin");
  }
}
