import { NextResponse } from "next/server";
import { getAdminCookieName } from "@/lib/admin-session";

const BASE_PATH = "/admin";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL(`${BASE_PATH}/login`, request.url), 303);
  response.cookies.delete({
    name: getAdminCookieName(),
    path: BASE_PATH,
  });

  return response;
}
