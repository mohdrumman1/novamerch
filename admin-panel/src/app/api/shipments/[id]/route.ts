import { NextResponse } from "next/server";
import { updateRecord, deleteRecord } from "@/lib/airtable";
import { recordToShipment, shipmentToFields } from "@/lib/airtable-mappers";
import type { Shipment } from "@/lib/types";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: Shipment = await req.json();
    const record = await updateRecord("Shipments", id, shipmentToFields(body));
    return NextResponse.json(recordToShipment(record));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteRecord("Shipments", id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
