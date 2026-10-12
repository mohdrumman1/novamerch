import { NextResponse } from "next/server";
import { verifyOrderLinkToken } from "@/lib/signed-links";
import { safeCustomerOrderView } from "@/lib/operations";
import { airtableFormula, listOperationsRecords } from "@/lib/airtable-operations";

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const token = await verifyOrderLinkToken((await params).token, "tracking", process.env.ORDER_LINK_SECRET ?? "");
  if (!token) return NextResponse.json({ error: "Invalid or expired tracking link" }, { status: 401 });
  const orders = await listOperationsRecords("Orders", `({Order Number}=${airtableFormula(token.orderId)})`).catch(() => []);
  const order = orders[0];
  const fields = order?.fields ?? {};
  const products = (() => { try { return JSON.parse(String(fields["Line Items JSON"] || "[]")); } catch { return []; } })();
  return NextResponse.json(safeCustomerOrderView({ orderRef: fields["Order Number"] || token.orderId, status: fields["Goods Status"] || "Pending", products, shipments: [], updates: [] }));
}
