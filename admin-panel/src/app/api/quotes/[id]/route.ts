import { NextResponse } from "next/server";
import { updateRecord, deleteRecord } from "@/lib/airtable";
import { recordToQuote, quoteToFields } from "@/lib/airtable-mappers";
import type { Quote } from "@/lib/types";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: Quote = await req.json();
    const record = await updateRecord("Quotes", id, quoteToFields(body));
    return NextResponse.json(recordToQuote(record));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteRecord("Quotes", id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
