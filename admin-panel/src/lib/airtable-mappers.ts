import type {
  Customer, Quote, Order, Invoice, Shipment,
  QuoteStatus, OrderGoodsStatus, OrderInvoiceStatus,
  TransportType, InvoiceStatus, InvoiceKind, ShipmentStatus, ShippingMethod,
  LineItem, ShipmentItem,
} from "./types";

type AirtableRecord = { id: string; fields: Record<string, unknown> };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function str(v: unknown): string { return (v as string) || ""; }
function num(v: unknown): number { return (v as number) || 0; }
function bool(v: unknown): boolean { return (v as boolean) || false; }
function link(v: unknown): string { return ((v as string[]) || [])[0] || ""; }
function links(v: unknown): string[] { return (v as string[]) || []; }
function parseJSON<T>(v: unknown, fallback: T): T {
  try { return v ? JSON.parse(v as string) : fallback; } catch { return fallback; }
}

// ─── Customers ───────────────────────────────────────────────────────────────

export function recordToCustomer(rec: AirtableRecord): Customer {
  const f = rec.fields;
  return {
    id: rec.id,
    name: str(f["Contact Name"]),
    company: str(f["Business Name"]),
    email: str(f["Email"]),
    phone: str(f["Phone"]),
    abn: str(f["ABN"]) || undefined,
    billingAddress: str(f["Address"]),
    shippingAddress: str(f["Shipping Address"]) || undefined,
    createdAt: str(f["Date Converted"]) || new Date().toISOString().split("T")[0],
    notes: str(f["Notes"]) || undefined,
  };
}

export function customerToFields(c: Customer): Record<string, unknown> {
  return {
    "Business Name": c.company,
    "Contact Name": c.name,
    "Email": c.email,
    "Phone": c.phone,
    "ABN": c.abn || "",
    "Address": c.billingAddress,
    "Shipping Address": c.shippingAddress || "",
    "Notes": c.notes || "",
    "Date Converted": c.createdAt ? c.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
  };
}

// ─── Quotes ──────────────────────────────────────────────────────────────────

export function recordToQuote(rec: AirtableRecord): Quote {
  const f = rec.fields;
  return {
    id: rec.id,
    ref: str(f["Quote Number"]),
    customerId: link(f["Customer"]),
    status: (str(f["Status"]) || "Draft") as QuoteStatus,
    issuedAt: str(f["Date Created"]),
    validUntil: str(f["Expiry Date"]),
    lineItems: parseJSON<LineItem[]>(f["Line Items JSON"], []),
    freightCost: num(f["Freight Cost AUD"]) || undefined,
    imageUrl: str(f["Image URL"]) || undefined,
    comments: str(f["Comments"]) || undefined,
  };
}

export function quoteToFields(q: Quote): Record<string, unknown> {
  const revenue = q.lineItems.reduce((s, li) => s + li.qty * li.unitPrice, 0);
  const cost = q.lineItems.reduce((s, li) => s + li.qty * (li.costPerUnit ?? 0), 0);
  return {
    "Quote Number": q.ref,
    "Customer": q.customerId ? [q.customerId] : [],
    "Status": q.status,
    "Date Created": q.issuedAt ? q.issuedAt.split("T")[0] : null,
    "Expiry Date": q.validUntil ? q.validUntil.split("T")[0] : null,
    "Line Items JSON": JSON.stringify(q.lineItems),
    "Freight Cost AUD": q.freightCost ?? 0,
    "Image URL": q.imageUrl || "",
    "Comments": q.comments || "",
    "Total Revenue AUD": revenue,
    "Total Cost AUD": cost,
    "Margin Percent": revenue > 0 ? (revenue - cost) / revenue : 0,
  };
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function recordToOrder(rec: AirtableRecord): Order {
  const f = rec.fields;
  return {
    id: rec.id,
    ref: str(f["Order Number"]),
    customerId: link(f["Customer"]),
    quoteId: link(f["Quote"]) || undefined,
    goodsStatus: (str(f["Goods Status"]) || "Pending") as OrderGoodsStatus,
    invoiceStatus: (str(f["Invoice Status"]) || "Need to Invoice") as OrderInvoiceStatus,
    transportType: (str(f["Transport Type"]) || "Agent Sea") as TransportType,
    transportCost: num(f["Transport Cost AUD"]) || undefined,
    fy: str(f["FY"]),
    orderedAt: str(f["Date Placed"]),
    lineItems: parseJSON<LineItem[]>(f["Line Items JSON"], []),
    freightPaid: bool(f["Freight Paid"]),
    freightPaidDate: str(f["Freight Paid Date"]) || undefined,
    trackingAgentToK2: str(f["Tracking Agent to K2"]) || undefined,
    trackingK2ToCustomer: str(f["Tracking K2 to Customer"]) || undefined,
    amountReceived: num(f["Amount Received AUD"]) || undefined,
    comments: str(f["Comments"]) || undefined,
  };
}

export function orderToFields(o: Order): Record<string, unknown> {
  return {
    "Order Number": o.ref,
    "Customer": o.customerId ? [o.customerId] : [],
    "Quote": o.quoteId ? [o.quoteId] : [],
    "Goods Status": o.goodsStatus,
    "Invoice Status": o.invoiceStatus,
    "Transport Type": o.transportType,
    "FY": o.fy,
    "Date Placed": o.orderedAt ? o.orderedAt.split("T")[0] : null,
    "Line Items JSON": JSON.stringify(o.lineItems),
    "Freight Paid": o.freightPaid ?? false,
    "Freight Paid Date": o.freightPaidDate ?? null,
    "Tracking Agent to K2": o.trackingAgentToK2 || "",
    "Tracking K2 to Customer": o.trackingK2ToCustomer || "",
    "Amount Received AUD": o.amountReceived ?? 0,
    "Transport Cost AUD": o.transportCost ?? 0,
    "Comments": o.comments || "",
    "Total Cost AUD": o.lineItems.reduce((s, li) => s + li.qty * (li.costPerUnit ?? 0), 0),
  };
}

// ─── Invoices ────────────────────────────────────────────────────────────────

export function recordToInvoice(rec: AirtableRecord): Invoice {
  const f = rec.fields;
  return {
    id: rec.id,
    ref: str(f["Invoice Number"]),
    orderId: link(f["Order"]) || undefined,
    customerId: link(f["Customer"]),
    kind: (str(f["Kind"]) || "Full") as InvoiceKind,
    pairedInvoiceId: str(f["Paired Invoice ID"]) || undefined,
    status: (str(f["Status"]) || "Draft") as InvoiceStatus,
    issuedAt: str(f["Date Issued"]),
    dueAt: str(f["Due Date"]),
    paidAt: str(f["Payment Date"]) || undefined,
    subtotal: num(f["Amount Excl GST AUD"]),
    gst: num(f["GST AUD"]),
    total: num(f["Total Incl GST AUD"]),
    amountReceived: num(f["Amount Received AUD"]) || undefined,
    lineItems: parseJSON<LineItem[]>(f["Line Items JSON"], []),
    comments: str(f["Notes"]) || undefined,
  };
}

export function invoiceToFields(inv: Invoice): Record<string, unknown> {
  return {
    "Invoice Number": inv.ref,
    "Order": inv.orderId ? [inv.orderId] : [],
    "Customer": inv.customerId ? [inv.customerId] : [],
    "Kind": inv.kind,
    "Paired Invoice ID": inv.pairedInvoiceId || "",
    "Status": inv.status,
    "Date Issued": inv.issuedAt ? inv.issuedAt.split("T")[0] : null,
    "Due Date": inv.dueAt ? inv.dueAt.split("T")[0] : null,
    "Payment Date": inv.paidAt ? inv.paidAt.split("T")[0] : null,
    "Amount Excl GST AUD": inv.subtotal,
    "GST AUD": inv.gst,
    "Total Incl GST AUD": inv.total,
    "Amount Received AUD": inv.amountReceived ?? 0,
    "Line Items JSON": JSON.stringify(inv.lineItems),
    "Notes": inv.comments || "",
  };
}

// ─── Shipments ───────────────────────────────────────────────────────────────

function toShipmentStatus(s: string): ShipmentStatus {
  if (s === "Delivered") return "Arrived";
  if (s === "Exception") return "Delayed";
  return "In Transit";
}

function fromShipmentStatus(s: ShipmentStatus): string {
  if (s === "Arrived") return "Delivered";
  if (s === "Delayed") return "Exception";
  return "In Transit";
}

export function recordToShipment(rec: AirtableRecord): Shipment {
  const f = rec.fields;
  return {
    id: rec.id,
    ref: str(f["Ref"]),
    orderId: link(f["Order"]) || undefined,
    customerId: links(f["Customer"])[0] || link(f["Order"]),
    status: toShipmentStatus(str(f["Status"])),
    shippingMethod: (str(f["Shipping Method"]) || "Agent Sea") as ShippingMethod,
    trackingAgentToK2: str(f["Tracking Agent to K2"]) || undefined,
    trackingSupplierToAgent: str(f["Tracking Supplier to Agent"]) || undefined,
    shippedAt: str(f["Ship Date"]) || undefined,
    expectedArrival: str(f["ETA"]) || undefined,
    arrivedAt: str(f["Actual Delivery"]) || undefined,
    items: parseJSON<ShipmentItem[]>(f["Items JSON"], []),
    notes: str(f["Notes"]) || undefined,
  };
}

export function shipmentToFields(s: Shipment): Record<string, unknown> {
  return {
    "Ref": s.ref,
    "Order": s.orderId ? [s.orderId] : [],
    "Customer": s.customerId ? [s.customerId] : [],
    "Status": fromShipmentStatus(s.status),
    "Shipping Method": s.shippingMethod,
    "Tracking Agent to K2": s.trackingAgentToK2 || "",
    "Tracking Supplier to Agent": s.trackingSupplierToAgent || "",
    "Ship Date": s.shippedAt ?? null,
    "ETA": s.expectedArrival ?? null,
    "Actual Delivery": s.arrivedAt ?? null,
    "Items JSON": JSON.stringify(s.items),
    "Notes": s.notes || "",
  };
}
