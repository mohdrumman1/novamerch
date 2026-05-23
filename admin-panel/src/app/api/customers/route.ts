import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";
import { recordToCustomer, customerToFields } from "@/lib/airtable-mappers";
import type { Customer } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body: Customer = await req.json();
    const record = await createRecord("Customers", customerToFields(body));
    return NextResponse.json(recordToCustomer(record));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
