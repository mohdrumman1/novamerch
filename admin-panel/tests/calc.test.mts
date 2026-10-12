import assert from "node:assert/strict";
import test from "node:test";
import { calcPL, orderExpectedProfit, orderNetRevenue, pendingOrdersValue, sumRecordedMoney } from "../src/lib/calc.ts";
import type { Order } from "../src/lib/types.ts";

function order(overrides: Partial<Order> = {}): Order {
  return {
    id: "order-1",
    ref: "#O1001",
    customerId: "customer-1",
    goodsStatus: "Ordered",
    invoiceStatus: "Invoiced",
    transportType: "Agent Sea",
    transportCost: 20,
    fy: "FY2026/27",
    orderedAt: "2026-10-09",
    lineItems: [{ id: "line-1", description: "Polo", qty: 10, unitPrice: 50, costPerUnit: 25 }],
    ...overrides,
  };
}

test("profit stays unknown when a supplier or transport cost is missing", () => {
  assert.equal(orderExpectedProfit(order({ lineItems: [{ id: "line-1", description: "Polo", qty: 10, unitPrice: 50 }] })), undefined);
  assert.equal(orderExpectedProfit(order({ transportCost: undefined })), undefined);
});

test("P&L does not turn an unrecorded cost into zero", () => {
  const result = calcPL([order(), order({ id: "order-2", transportCost: undefined })]);

  assert.equal(result.totalRevenue, 1000);
  assert.equal(result.totalCost, undefined);
  assert.equal(result.grossProfit, undefined);
  assert.equal(result.marginPct, undefined);
  assert.equal(result.gstPaid, undefined);
});

test("recorded money aggregation remains available when every value is known", () => {
  assert.equal(sumRecordedMoney([100, 20, 0]), 120);
  assert.equal(sumRecordedMoney([100, undefined]), undefined);
});

test("cancelled refunded orders are excluded from pending value", () => {
  assert.equal(pendingOrdersValue([
    order({ goodsStatus: "Pending" }),
    order({ id: "refunded", goodsStatus: "Cancelled", refundAmountAud: 500 }),
  ]), 500);
});

test("refund reduces expected profit without erasing supplier cost", () => {
  const refunded = order({ refundAmountAud: 500, refundStatus: "Paid" });
  assert.equal(orderExpectedProfit(refunded), -270);
});

test("cancelled refunded order contributes no revenue", () => {
  assert.equal(orderNetRevenue(order({ goodsStatus: "Cancelled", amountReceived: 385 })), 0);
  assert.equal(orderNetRevenue(order({ goodsStatus: "Completed", amountReceived: 6840 })), 6840);
});
