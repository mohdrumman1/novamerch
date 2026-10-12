import { NextResponse } from "next/server";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { validateInboundEnquiry } from "@/lib/inbound-enquiry";
import { getDatabase } from "@/lib/d1";

/**
 * Staging contract for the new inbound enquiry workflow. Persistence is enabled
 * only when the operations adapter is explicitly enabled; legacy quote requests
 * remain unchanged until the Airtable schema is verified.
 */
export async function POST(request: Request) {
  const input = await request.json().catch(() => ({}));
  const validation = validateInboundEnquiry(input);
  if (!validation.valid) return NextResponse.json({ error: "Invalid enquiry", fields: validation.errors }, { status: 400 });
  const config = getRuntimeConfig();
  if (config.inboundQuoteMode !== "operations") {
    return NextResponse.json({ error: "Inbound operations workflow is not enabled" }, { status: 503, headers: { "Retry-After": "0" } });
  }
  const db = getDatabase();
  if (!db) return NextResponse.json({ accepted: false, error: "Operations storage is not provisioned" }, { status: 503 });
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const result = await db.prepare(`
    INSERT INTO inbound_enquiries
      (id, idempotency_key, name, email, phone, company, selections_json, attribution_json, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?)
    ON CONFLICT(idempotency_key) DO NOTHING
  `).bind(
    id, input.idempotencyKey.trim(), input.name.trim(), input.email.trim().toLowerCase(), input.phone.trim(),
    input.company?.trim() || null, JSON.stringify(input.selections), input.attribution ? JSON.stringify(input.attribution) : null, now, now,
  ).run() as { meta?: { changes?: number } };
  const duplicate = result.meta?.changes === 0;
  return NextResponse.json({ accepted: true, duplicate, idempotencyKey: input.idempotencyKey.trim() }, { status: duplicate ? 200 : 201 });
}
