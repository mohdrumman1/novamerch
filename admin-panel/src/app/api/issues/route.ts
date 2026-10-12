import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/d1";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.orderRef || !body.details || !["Issue", "Return", "Refund"].includes(body.kind)) return NextResponse.json({ error: "orderRef, kind and details are required" }, { status: 400 });
  const db = getDatabase();
  if (!db) return NextResponse.json({ error: "Operations storage is not provisioned" }, { status: 503 });
  const id = crypto.randomUUID();
  await db.prepare("INSERT INTO issues_returns_refunds (id, order_ref, kind, amount_aud, details, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id, body.orderRef, body.kind, body.amountAud ?? null, JSON.stringify(body.details), new Date().toISOString()).run();
  return NextResponse.json({ id, status: "Open" }, { status: 201 });
}
