import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminSessionMaxAge,
} from "@/lib/admin-session";

const BASE_PATH = "/admin";

function publicUrl(path: string, request: NextRequest) {
  return new URL(path, process.env.PUBLIC_ADMIN_ORIGIN || request.url);
}

function redirectPath(value: FormDataEntryValue | null) {
  if (
    typeof value !== "string" ||
    (value !== BASE_PATH && !value.startsWith(`${BASE_PATH}/`))
  ) {
    return `${BASE_PATH}/dashboard`;
  }

  if (value.startsWith(`${BASE_PATH}/login`)) {
    return `${BASE_PATH}/dashboard`;
  }

  return value;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return new NextResponse("ADMIN_PASSWORD is not configured", { status: 503 });
  }

  const sessionSecret = process.env.ADMIN_SESSION_SECRET || expectedPassword;

  if (username !== expectedUsername || password !== expectedPassword) {
    const loginUrl = publicUrl(`${BASE_PATH}/login`, request);
    loginUrl.searchParams.set("error", "1");
    loginUrl.searchParams.set("next", redirectPath(formData.get("next")));
    return NextResponse.redirect(loginUrl, 303);
  }

  const response = NextResponse.redirect(
    publicUrl(redirectPath(formData.get("next")), request),
    303,
  );
  response.cookies.set({
    name: getAdminCookieName(),
    value: await createAdminSessionToken(expectedUsername, sessionSecret),
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: BASE_PATH,
    maxAge: getAdminSessionMaxAge(),
  });

  return response;
}
