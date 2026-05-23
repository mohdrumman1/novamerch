import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";
import { recordToOrder, orderToFields } from "@/lib/airtable-mappers";
import type { Order } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body: Order = await req.json();
    const record = await createRecord("Orders", orderToFields(body));
    return NextResponse.json(recordToOrder(record));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
