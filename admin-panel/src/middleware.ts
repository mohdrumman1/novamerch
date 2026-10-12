import { NextRequest, NextResponse } from "next/server";
import { getAdminCookieName, isValidAdminSession } from "@/lib/admin-session";

const BASE_PATH = "/admin";

function isPublicPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname === `${BASE_PATH}/login` ||
    pathname === "/api/auth/login" ||
    pathname === `${BASE_PATH}/api/auth/login` ||
    // Public intake endpoints. They self-authorize via Origin allowlist +
    // per-IP rate limiting (see the route implementations).
    pathname === "/api/public/quote-requests" ||
    pathname === `${BASE_PATH}/api/public/quote-requests` ||
    pathname === "/api/public/lead-intake" ||
    pathname === `${BASE_PATH}/api/public/lead-intake` ||
    pathname === "/api/public/inbound-enquiries" ||
    pathname === `${BASE_PATH}/api/public/inbound-enquiries` ||
    pathname.startsWith("/api/public/artwork-approval/") ||
    pathname.startsWith(`${BASE_PATH}/api/public/artwork-approval/`) ||
    pathname.startsWith("/api/public/order-tracking/") ||
    pathname.startsWith(`${BASE_PATH}/api/public/order-tracking/`) ||
    pathname === "/api/webhooks/brevo" ||
    pathname === `${BASE_PATH}/api/webhooks/brevo` ||
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

  // Keep the short local URL users naturally type while retaining the
  // `/admin` base path used by the deployed application.
  const legacyAdminPath = ["/orders", "/quotes", "/invoices", "/shipments", "/customers", "/dashboard", "/financials", "/goods", "/action-centre", "/approvals", "/issues"].find((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (legacyAdminPath) {
    return NextResponse.redirect(new URL(`${BASE_PATH}${pathname}${search}`, request.url), 308);
  }

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
