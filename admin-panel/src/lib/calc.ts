import type { LineItem, Order, Invoice, Quote } from "./types";
import { GST_RATE } from "./constants";

/** Sum line items total (qty * unitPrice) */
export function lineItemsTotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
}

/** Supplier cost total */
export function lineItemsCost(items: LineItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.qty * (item.costPerUnit ?? 0),
    0
  );
}

/** Calculate GST on an ex-GST amount */
export function gstOf(exGst: number): number {
  return exGst * GST_RATE;
}

/** Add GST to get inc-GST total */
export function withGst(exGst: number): number {
  return exGst * (1 + GST_RATE);
}

/** Split a total into deposit and final amounts */
export function depositSplit(
  total: number,
  depositPct = 50
): { deposit: number; final: number } {
  const deposit = total * (depositPct / 100);
  return { deposit, final: total - deposit };
}

/** Calculate expected profit for an order */
export function orderExpectedProfit(order: Order): number {
  const revenue = lineItemsTotal(order.lineItems);
  const cost = lineItemsCost(order.lineItems) + (order.transportCost ?? 0);
  return revenue - cost;
}

/** Calculate actual profit (based on amount received) */
export function orderActualProfit(order: Order): number {
  const cost = lineItemsCost(order.lineItems) + (order.transportCost ?? 0);
  return (order.amountReceived ?? 0) - cost;
}

/** Profit margin as percentage */
export function profitMarginPct(revenue: number, cost: number): number {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
}

/** Calculate volumetric weight (cm) */
export function volWeight(
  widthCm: number,
  lengthCm: number,
  depthCm: number
): number {
  return (widthCm * lengthCm * depthCm) / 6000;
}

/** Chargeable weight = max(actual, volumetric) */
export function chargeableWeight(
  actualKg: number,
  widthCm: number,
  lengthCm: number,
  depthCm: number
): number {
  return Math.max(actualKg, volWeight(widthCm, lengthCm, depthCm));
}

/** Get shipping rate for a given weight from tiered rates */
export function getShippingRate(
  weightKg: number,
  rates: { minKg: number; rateUsdPerKg: number }[]
): number {
  const sorted = [...rates].sort((a, b) => b.minKg - a.minKg);
  for (const tier of sorted) {
    if (weightKg >= tier.minKg) return tier.rateUsdPerKg;
  }
  return sorted[sorted.length - 1]?.rateUsdPerKg ?? 0;
}

/** Quote total (line items + freight) */
export function quoteTotal(quote: Quote): number {
  return lineItemsTotal(quote.lineItems) + (quote.freightCost ?? 0);
}

/** Invoice total check */
export function invoiceTotal(invoice: Invoice): number {
  return invoice.total;
}

/** Outstanding amount on an invoice */
export function invoiceOutstanding(invoice: Invoice): number {
  return Math.max(0, invoice.total - (invoice.amountReceived ?? 0));
}

export interface PLResult {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  marginPct: number;
  gstCollected: number;
  gstPaid: number;
  netGst: number;
}

/** Simple P&L aggregation over a set of orders */
export function calcPL(orders: Order[]): PLResult {
  const totalRevenue = orders.reduce(
    (sum, o) => sum + lineItemsTotal(o.lineItems),
    0
  );
  const totalCost = orders.reduce(
    (sum, o) =>
      sum + lineItemsCost(o.lineItems) + (o.transportCost ?? 0),
    0
  );
  const grossProfit = totalRevenue - totalCost;
  const marginPct =
    totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const gstCollected = gstOf(totalRevenue);
  const gstPaid = gstOf(totalCost);
  return {
    totalRevenue,
    totalCost,
    grossProfit,
    marginPct,
    gstCollected,
    gstPaid,
    netGst: gstCollected - gstPaid,
  };
}
