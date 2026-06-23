import { NextResponse } from "next/server";
import { listRecords } from "@/lib/airtable";
import {
  recordToCustomer, recordToQuote, recordToOrder,
  recordToInvoice, recordToShipment,
} from "@/lib/airtable-mappers";

export async function GET() {
  type BootstrapRecord = Parameters<typeof recordToCustomer>[0];
  type BootstrapSource = {
    key: string;
    table: string;
    mapper: (record: BootstrapRecord) => unknown;
  };

  const sources: BootstrapSource[] = [
    { key: "customers", table: "Customers", mapper: recordToCustomer },
    { key: "quotes", table: "Quotes", mapper: recordToQuote },
    { key: "orders", table: "Orders", mapper: recordToOrder },
    { key: "invoices", table: "Invoices", mapper: recordToInvoice },
    { key: "shipments", table: "Shipments", mapper: recordToShipment },
  ];

  const results = await Promise.allSettled(
    sources.map(({ table }) => listRecords(table)),
  );

  const payload: Record<string, unknown> = {};
  const issues: string[] = [];

  results.forEach((result, index) => {
    const { key, table, mapper } = sources[index];
    if (result.status === "fulfilled") {
      payload[key] = result.value.map(mapper);
    } else {
      payload[key] = [];
      issues.push(table);
      console.error(`[bootstrap] Failed to load ${table}`, result.reason);
    }
  });

  return NextResponse.json({ ...payload, issues });
}
