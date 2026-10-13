import { NextResponse } from "next/server";
import { createOrderLinkToken } from "@/lib/signed-links";

/** Staff-only issuance endpoint; customer pages receive only the resulting token. */
export async function POST(request: Request) {
  if (process.env.ORDER_LINKS_ENABLED !== "true") return NextResponse.json({ error: "Order links are disabled" }, { status: 503 });
  const body = await request.json().catch(() => ({}));
  if (!["approval", "tracking", "feedback"].includes(body.kind) || typeof body.orderId !== "string") {
    return NextResponse.json({ error: "kind and orderId are required" }, { status: 400 });
  }
  const secret = process.env.ORDER_LINK_SECRET;
  if (!secret) return NextResponse.json({ error: "Order link secret is not configured" }, { status: 503 });
  const token = await createOrderLinkToken(body.kind, body.orderId, secret);
  return NextResponse.json({ token, expiresInSeconds: 60 * 60 * 24 * 30 });
}
