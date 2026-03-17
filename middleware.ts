import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isAdminLoginApi = pathname === "/api/admin/login";
  const adminSession = req.cookies.get("admin_session")?.value;
  const adminSecret = req.headers.get("x-admin-secret");
  const hasAdminSecret =
    Boolean(process.env.ADMIN_SECRET) && adminSecret === process.env.ADMIN_SECRET;

  const response = NextResponse.next();

  if (isAdminPage || isAdminApi) {
    response.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
  }

  if (pathname === "/admin" || isAdminLoginApi) {
    return response;
  }

  if ((isAdminPage || isAdminApi) && !adminSession && !hasAdminSecret) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
