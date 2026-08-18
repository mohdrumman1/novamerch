import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";
import { recordToSupplierOrder, supplierOrderToFields } from "@/lib/airtable-mappers";
import type { SupplierOrder } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body: SupplierOrder = await req.json();
    const record = await createRecord("Supplier Orders", supplierOrderToFields(body));
    return NextResponse.json(recordToSupplierOrder(record));
  } catch (error) {
    console.error("[supplier-orders] Create failed", error);
    return NextResponse.json({ error: "Could not save supplier order" }, { status: 500 });
  }
}
