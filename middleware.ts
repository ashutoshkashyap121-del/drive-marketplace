import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow admin login page
  if (pathname === "/admin") {
    return NextResponse.next();
  }

  // Protect all /admin routes except login
  if (pathname.startsWith("/admin")) {
    const session = req.cookies.get("admin_session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};