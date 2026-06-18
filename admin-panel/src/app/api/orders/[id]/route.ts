import { NextResponse } from "next/server";
import { updateRecord, deleteRecord } from "@/lib/airtable";
import { recordToOrder, orderToFields } from "@/lib/airtable-mappers";
import type { Order } from "@/lib/types";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: Order = await req.json();
    const record = await updateRecord("Orders", id, orderToFields(body));
    return NextResponse.json(recordToOrder(record));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteRecord("Orders", id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
