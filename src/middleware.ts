import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Skip auth check for the auth API itself and static assets
  if (
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon") ||
    request.nextUrl.pathname === "/icon" ||
    request.nextUrl.pathname === "/apple-icon"
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("wa_auth");

  if (authCookie?.value === "authenticated") {
    return NextResponse.next();
  }

  // For API routes, return 401
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // For page routes, redirect to login
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    // Match all paths except login page
    "/((?!login|_next/static|_next/image|favicon.ico|icon|apple-icon).*)",
  ],
};
