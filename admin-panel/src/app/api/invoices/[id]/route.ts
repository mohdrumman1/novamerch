import { NextResponse } from "next/server";
import { updateRecord, deleteRecord } from "@/lib/airtable";
import { recordToInvoice, invoiceToFields } from "@/lib/airtable-mappers";
import type { Invoice } from "@/lib/types";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: Invoice = await req.json();
    const record = await updateRecord("Invoices", id, invoiceToFields(body));
    return NextResponse.json(recordToInvoice(record));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteRecord("Invoices", id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
