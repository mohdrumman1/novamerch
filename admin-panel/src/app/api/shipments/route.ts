import { NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable";
import { recordToShipment, shipmentToFields } from "@/lib/airtable-mappers";
import type { Shipment } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body: Shipment = await req.json();
    const record = await createRecord("Shipments", shipmentToFields(body));
    return NextResponse.json(recordToShipment(record));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
