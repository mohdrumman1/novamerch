import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/d1";
import { verifyOrderLinkToken } from "@/lib/signed-links";
import { airtableFormula, listOperationsRecords } from "@/lib/airtable-operations";

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const secret = process.env.ORDER_LINK_SECRET;
  const token = await verifyOrderLinkToken((await params).token, "approval", secret ?? "");
  if (!token) return NextResponse.json({ error: "Invalid or expired approval link" }, { status: 401 });
  const db = getDatabase();
  const liveOrders = await listOperationsRecords("Orders", `({Order Number}=${airtableFormula(token.orderId)})`).catch(() => []);
  const live = liveOrders[0]?.fields ?? {};
  if (!db) return NextResponse.json({ orderRef: live["Order Number"] || token.orderId, status: "Pending Customer Approval", products: live["Line Items JSON"] || "[]", versions: [] });
  const rows = await db.prepare("SELECT * FROM artwork_versions WHERE order_ref = ? ORDER BY version DESC").bind(token.orderId).first();
  return NextResponse.json({ orderRef: token.orderId, current: rows ?? null });
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const secret = process.env.ORDER_LINK_SECRET;
  const token = await verifyOrderLinkToken((await params).token, "approval", secret ?? "");
  if (!token) return NextResponse.json({ error: "Invalid or expired approval link" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (body.decision !== "approve" && body.decision !== "request_changes") return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
  const db = getDatabase();
  if (!db) return NextResponse.json({ error: "Approval storage is not provisioned" }, { status: 503 });
  await db.prepare("UPDATE artwork_versions SET status = ?, approved_by = ?, approved_at = ?, requested_changes = ? WHERE order_ref = ? AND version = ?")
    .bind(body.decision === "approve" ? "Approved" : "Changes Requested", body.identity ?? "customer-link", body.decision === "approve" ? new Date().toISOString() : null, body.changes ?? null, token.orderId, Number(body.version)).run();
  return NextResponse.json({ ok: true, status: body.decision === "approve" ? "Approved" : "Changes Requested" });
}
