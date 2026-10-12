import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/d1";

export async function POST(request: Request) {
  const raw = await request.text();
  const secret = process.env.BREVO_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret is not configured" }, { status: 503 });
  const signature = request.headers.get("x-sib-signature") || request.headers.get("x-brevo-signature") || "";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
  const expected = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  if (signature !== expected) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  const event = JSON.parse(raw) as { id?: string; event?: string; messageId?: string; [key: string]: unknown };
  const db = getDatabase();
  if (db && event.id) await db.prepare("INSERT OR IGNORE INTO event_ledger (event_id, event_type, aggregate_type, aggregate_id, provider_id, status, payload_hash, occurred_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(event.id, event.event || "brevo", "email", event.messageId || event.id, event.messageId || null, "received", expected, new Date().toISOString(), new Date().toISOString()).run();
  return NextResponse.json({ ok: true });
}
