import { NextResponse } from "next/server";
import { deleteRecord, updateRecord } from "@/lib/airtable";
import { recordToSupplierOrder, supplierOrderToFields } from "@/lib/airtable-mappers";
import type { SupplierOrder } from "@/lib/types";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: SupplierOrder = await req.json();
    const record = await updateRecord("Supplier Orders", id, supplierOrderToFields(body));
    return NextResponse.json(recordToSupplierOrder(record));
  } catch (error) {
    console.error("[supplier-orders] Update failed", error);
    return NextResponse.json({ error: "Could not save supplier order" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteRecord("Supplier Orders", id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[supplier-orders] Delete failed", error);
    return NextResponse.json({ error: "Could not delete supplier order" }, { status: 500 });
  }
}
