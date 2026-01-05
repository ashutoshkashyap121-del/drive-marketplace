import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow admin login page always
  if (pathname === "/admin") {
    return NextResponse.next();
  }

  // Protect admin bookings
  if (pathname.startsWith("/admin/bookings")) {
    const isAdmin = req.cookies.get("admin_auth")?.value;

    if (isAdmin !== "true") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
