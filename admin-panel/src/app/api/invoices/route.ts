import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";
import { recordToInvoice, invoiceToFields } from "@/lib/airtable-mappers";
import type { Invoice } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body: Invoice = await req.json();
    const record = await createRecord("Invoices", invoiceToFields(body));
    return NextResponse.json(recordToInvoice(record));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
