import { NextResponse } from "next/server";
import { listRecords } from "@/lib/airtable";
import {
  recordToCustomer, recordToQuote, recordToOrder,
  recordToInvoice, recordToShipment,
} from "@/lib/airtable-mappers";

export async function GET() {
  try {
    const [custRecs, quoteRecs, orderRecs, invRecs, shipRecs] = await Promise.all([
      listRecords("Customers"),
      listRecords("Quotes"),
      listRecords("Orders"),
      listRecords("Invoices"),
      listRecords("Shipments"),
    ]);
    return NextResponse.json({
      customers: custRecs.map(recordToCustomer),
      quotes: quoteRecs.map(recordToQuote),
      orders: orderRecs.map(recordToOrder),
      invoices: invRecs.map(recordToInvoice),
      shipments: shipRecs.map(recordToShipment),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
