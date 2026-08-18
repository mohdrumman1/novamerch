import type { LineItem, Order, Invoice, Quote, SupplierOrder } from "./types";
import { GST_RATE } from "./constants";

/** Sum line items total (qty * unitPrice) */
export function lineItemsTotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
}

/** Supplier cost total when every line has a recorded cost. */
export function lineItemsCost(items: LineItem[]): number | undefined {
  if (items.some((item) => item.costPerUnit === undefined)) return undefined;
  return items.reduce((sum, item) => sum + item.qty * item.costPerUnit!, 0);
}

function linkedSupplierOrder(order: Order, supplierOrders: SupplierOrder[]): SupplierOrder | undefined {
  return supplierOrders.find((supplierOrder) => supplierOrder.relatedOrderId === order.id);
}

function supplierProjectedCost(supplierOrder: SupplierOrder): number | undefined {
  return supplierOrder.projectedCostAud;
}

/** Goods-only cost (excludes transport): linked supplier header cost, else manual line-item cost. */
export function orderGoodsCost(order: Order, supplierOrders: SupplierOrder[] = []): number | undefined {
  const supplierOrder = linkedSupplierOrder(order, supplierOrders);
  return supplierOrder ? supplierProjectedCost(supplierOrder) : lineItemsCost(order.lineItems);
}

export function orderProjectedCost(order: Order, supplierOrders: SupplierOrder[] = []): number | undefined {
  const goodsCost = orderGoodsCost(order, supplierOrders);
  if (goodsCost === undefined || order.transportCost === undefined) return undefined;
  return goodsCost + order.transportCost;
}

export function orderBookedSupplierPayment(order: Order, supplierOrders: SupplierOrder[] = []): number | undefined {
  return linkedSupplierOrder(order, supplierOrders)?.bookedPaymentAud;
}

export function orderPendingSupplierBalanceAud(order: Order, supplierOrders: SupplierOrder[] = []): number | undefined {
  const supplierOrder = linkedSupplierOrder(order, supplierOrders);
  if (!supplierOrder) return undefined;
  if (supplierOrder.pendingBalanceEstimatedAud !== undefined) {
    return supplierOrder.pendingBalanceEstimatedAud;
  }

  const projectedCost = orderProjectedCost(order, supplierOrders);
  const bookedPayment = supplierOrder.bookedPaymentAud;
  if (projectedCost === undefined || bookedPayment === undefined) return undefined;
  return Math.max(0, projectedCost - bookedPayment);
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

/** Calculate expected profit for an order when projected cost is recorded. */
export function orderExpectedProfit(order: Order, supplierOrders: SupplierOrder[] = []): number | undefined {
  const cost = orderProjectedCost(order, supplierOrders);
  return cost === undefined ? undefined : lineItemsTotal(order.lineItems) - cost;
}

/** Calculate actual profit when both revenue received and booked supplier payment are recorded. */
export function orderActualProfit(order: Order, supplierOrders: SupplierOrder[] = []): number | undefined {
  const payment = orderBookedSupplierPayment(order, supplierOrders);
  if (payment === undefined || order.amountReceived === undefined) return undefined;
  return order.amountReceived - payment;
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

export function sumRecordedMoney(values: (number | undefined)[]): number | undefined {
  if (values.some((value) => value === undefined)) return undefined;
  return values.reduce<number>((sum, value) => sum + value!, 0);
}

export interface PLResult {
  totalRevenue: number;
  totalCost: number | undefined;
  grossProfit: number | undefined;
  marginPct: number | undefined;
  gstCollected: number;
  gstPaid: number | undefined;
  netGst: number | undefined;
}

/** P&L aggregation where unrecorded costs keep dependent values unknown. */
export function calcPL(
  orders: Order[],
  supplierOrders: SupplierOrder[] = []
): PLResult {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + lineItemsTotal(order.lineItems),
    0
  );
  const totalCost = sumRecordedMoney(
    orders.map((order) => orderProjectedCost(order, supplierOrders))
  );
  const grossProfit =
    totalCost === undefined ? undefined : totalRevenue - totalCost;
  const marginPct =
    grossProfit === undefined ? undefined :
    totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const gstCollected = gstOf(totalRevenue);
  const gstPaid = totalCost === undefined ? undefined : gstOf(totalCost);

  return {
    totalRevenue,
    totalCost,
    grossProfit,
    marginPct,
    gstCollected,
    gstPaid,
    netGst: gstPaid === undefined ? undefined : gstCollected - gstPaid,
  };
}
