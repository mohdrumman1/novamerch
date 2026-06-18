import { NextRequest, NextResponse } from "next/server";
import { getAdminCookieName, isValidAdminSession } from "@/lib/admin-session";

const BASE_PATH = "/admin";

function isPublicPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === `${BASE_PATH}/login` ||
    pathname === "/api/auth/login" ||
    pathname === `${BASE_PATH}/api/auth/login` ||
    // Public intake endpoint — self-authorizes via Origin allowlist + per-IP
    // rate limiting (see admin-panel/src/app/api/public/quote-requests).
    pathname === "/api/public/quote-requests" ||
    pathname === `${BASE_PATH}/api/public/quote-requests` ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith(`${BASE_PATH}/_next/`)
  );
}

export async function middleware(request: NextRequest) {
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return new NextResponse("ADMIN_PASSWORD is not configured", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const sessionSecret = process.env.ADMIN_SESSION_SECRET || expectedPassword;
  const { pathname, search } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(getAdminCookieName())?.value;
  const isAuthenticated = await isValidAdminSession(
    token,
    expectedUsername,
    sessionSecret,
  );

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL(`${BASE_PATH}/login`, request.url);
  const nextPath = pathname.startsWith(BASE_PATH) ? pathname : `${BASE_PATH}${pathname}`;
  loginUrl.searchParams.set("next", `${nextPath}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/:path*"],
};
