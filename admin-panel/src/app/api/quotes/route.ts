import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";
import { recordToQuote, quoteToFields } from "@/lib/airtable-mappers";
import type { Quote } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body: Quote = await req.json();
    const record = await createRecord("Quotes", quoteToFields(body));
    return NextResponse.json(recordToQuote(record));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
