import assert from "node:assert/strict";
import test from "node:test";
import {
  orderBookedSupplierPayment,
  orderPendingSupplierBalanceAud,
  orderProjectedCost,
  orderExpectedProfit,
  calcPL,
  sumRecordedMoney,
} from "../src/lib/calc.ts";
import { recordToOrder, recordToSupplierOrder } from "../src/lib/airtable-mappers.ts";

const cooksHillOrder = {
  id: "receLbd69zNxYT6fD",
  ref: "#O1002",
  customerId: "recHSQqCG3Juq03ya",
  goodsStatus: "Pending" as const,
  invoiceStatus: "Paid Full" as const,
  transportType: "Agent Air" as const,
  transportCost: 0,
  fy: "FY2026/27",
  orderedAt: "2026-08-07",
  lineItems: [{ id: "line-1", description: "Training Tee", qty: 570, unitPrice: 12 }],
};

const cooksHillSupplierOrder = {
  id: "recSupplierOrder",
  orderNumber: "309939247501026460",
  orderDate: "2026-08-06",
  supplierName: "Jinan Runhang Textile Co., Ltd.",
  itemSubtotalUsd: 1584.6,
  shippingFeeUsd: 1000,
  totalUsd: 2584.6,
  projectedCostAud: 3754.18,
  bookedPaymentAud: 1904.67,
  bookedPaymentDate: "2026-08-12",
  pendingBalanceUsd: 1292.3,
  pendingBalanceEstimatedAud: 1849.51,
  paymentStatus: "Partially Paid" as const,
  relatedOrderId: "receLbd69zNxYT6fD",
  relatedCustomerId: "recHSQqCG3Juq03ya",
  items: [{ id: "partial-item", productName: "Captured only", unitPriceUsd: 1, qty: 1, totalUsd: 1 }],
};

test("linked supplier header cost wins over incomplete item rows", () => {
  assert.equal(orderProjectedCost(cooksHillOrder, [cooksHillSupplierOrder]), 3754.18);
  assert.equal(orderExpectedProfit(cooksHillOrder, [cooksHillSupplierOrder]), 3085.82);
});

test("supplier payment values remain distinct from projected supplier cost", () => {
  assert.equal(orderBookedSupplierPayment(cooksHillOrder, [cooksHillSupplierOrder]), 1904.67);
  assert.equal(orderPendingSupplierBalanceAud(cooksHillOrder, [cooksHillSupplierOrder]), 1849.51);
});

test("missing manual unit cost stays unknown", () => {
  assert.equal(orderProjectedCost(cooksHillOrder, []), undefined);
  assert.equal(orderExpectedProfit(cooksHillOrder, []), undefined);
});

test("linked supplier order without approved AUD cost stays unknown", () => {
  const supplierOrder = { ...cooksHillSupplierOrder, projectedCostAud: undefined };
  assert.equal(orderProjectedCost(cooksHillOrder, [supplierOrder]), undefined);
});

test("complete manual costs retain explicit zero", () => {
  const order = {
    ...cooksHillOrder,
    transportCost: 0,
    lineItems: [{ ...cooksHillOrder.lineItems[0], costPerUnit: 0 }],
  };
  assert.equal(orderProjectedCost(order, []), 0);
});

test("missing transport cost stays unknown", () => {
  const order = { ...cooksHillOrder, transportCost: undefined };
  assert.equal(orderProjectedCost(order, [cooksHillSupplierOrder]), undefined);
});

test("Airtable mapper preserves explicit zero and absent money", () => {
  const withZero = recordToOrder({
    id: "recOrder",
    fields: {
      "Order Number": "#O1",
      Customer: ["recCustomer"],
      "Goods Status": "Pending",
      "Invoice Status": "Need to Invoice",
      "Transport Type": "Agent Air",
      "Transport Cost AUD": 0,
      "Amount Received AUD": 0,
      FY: "FY2026/27",
      "Date Placed": "2026-08-01",
      "Line Items JSON": "[]",
    },
  });
  const withoutMoney = recordToOrder({
    id: "recOrder",
    fields: {
      "Order Number": "#O1",
      Customer: ["recCustomer"],
      "Goods Status": "Pending",
      "Invoice Status": "Need to Invoice",
      "Transport Type": "Agent Air",
      FY: "FY2026/27",
      "Date Placed": "2026-08-01",
      "Line Items JSON": "[]",
    },
  });

  assert.equal(withZero.transportCost, 0);
  assert.equal(withZero.amountReceived, 0);
  assert.equal(withoutMoney.transportCost, undefined);
  assert.equal(withoutMoney.amountReceived, undefined);
});

test("supplier mapper keeps linked record IDs and payment fields", () => {
  const supplierOrder = recordToSupplierOrder({
    id: "recSupplierOrder",
    fields: {
      "Alibaba Order Number": "309939247501026460",
      "Related Order": ["receLbd69zNxYT6fD"],
      "Related Customer": ["recHSQqCG3Juq03ya"],
      "Supplier Name": "Jinan Runhang Textile Co., Ltd.",
      "Order Date": "2026-08-06",
      "Item Subtotal USD": 1584.6,
      "Shipping Fee USD": 1000,
      "Total USD": 2584.6,
      "Projected Cost AUD": 3754.18,
      "Booked Payment AUD": 1904.67,
      "Booked Payment Date": "2026-08-12",
      "Pending Balance USD": 1292.3,
      "Pending Balance Estimated AUD": 1849.51,
      "Payment Status": "Partially Paid",
      "Items JSON": "[]",
    },
  });

  assert.equal(supplierOrder.relatedOrderId, "receLbd69zNxYT6fD");
  assert.equal(supplierOrder.relatedCustomerId, "recHSQqCG3Juq03ya");
  assert.equal(supplierOrder.bookedPaymentAud, 1904.67);
  assert.equal(supplierOrder.pendingBalanceEstimatedAud, 1849.51);
});

test("financial aggregate remains unknown when any order cost is unrecorded", () => {
  const result = calcPL([cooksHillOrder]);

  assert.equal(result.totalRevenue, 6840);
  assert.equal(result.totalCost, undefined);
  assert.equal(result.grossProfit, undefined);
  assert.equal(result.marginPct, undefined);
  assert.equal(result.gstPaid, undefined);
  assert.equal(result.netGst, undefined);
});

test("financial aggregate uses linked supplier projected cost", () => {
  const result = calcPL([cooksHillOrder], [cooksHillSupplierOrder]);

  assert.equal(result.totalRevenue, 6840);
  assert.equal(result.totalCost, 3754.18);
  assert.equal(result.grossProfit, 3085.82);
  assert.equal(result.marginPct, (3085.82 / 6840) * 100);
  assert.equal(result.gstCollected, 684);
  assert.equal(result.gstPaid, 375.418);
  assert.equal(result.netGst, 308.582);
});

test("money aggregate preserves unknown values and explicit zero", () => {
  assert.equal(sumRecordedMoney([0, 1904.67]), 1904.67);
  assert.equal(sumRecordedMoney([0, undefined]), undefined);
});
