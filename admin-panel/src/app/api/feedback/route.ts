import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/d1";
import { feedbackDueAt } from "@/lib/operations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.orderRef || !body.deliveredAt) return NextResponse.json({ error: "orderRef and deliveredAt are required" }, { status: 400 });
  const db = getDatabase();
  if (!db) return NextResponse.json({ error: "Operations storage is not provisioned" }, { status: 503 });
  const id = crypto.randomUUID();
  await db.prepare("INSERT INTO feedback_jobs (id, order_ref, due_at) VALUES (?, ?, ?)").bind(id, body.orderRef, feedbackDueAt(body.deliveredAt)).run();
  return NextResponse.json({ id, dueAt: feedbackDueAt(body.deliveredAt), status: "Pending" }, { status: 201 });
}
