import assert from "node:assert/strict";
import test from "node:test";
import { canReleaseToSupplier, feedbackDueAt, safeCustomerOrderView } from "../src/lib/operations.ts";

test("supplier release requires an approved specification version", () => {
  assert.equal(canReleaseToSupplier("Pending Customer Approval", 1), false);
  assert.equal(canReleaseToSupplier("Approved", 1), true);
});
test("feedback is scheduled seven days after delivery", () => {
  assert.equal(feedbackDueAt("2026-10-10T00:00:00.000Z"), "2026-10-17T00:00:00.000Z");
});
test("customer order view excludes internal financial data", () => {
  const view = safeCustomerOrderView({ orderRef: "#O1", status: "In Transit", supplierCost: 99 });
  assert.equal("supplierCost" in view, false);
});
