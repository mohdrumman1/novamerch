import assert from "node:assert/strict";
import test from "node:test";
import { validateInboundEnquiry } from "../src/lib/inbound-enquiry.ts";

test("inbound enquiry requires contact details before quote submission", () => {
  const result = validateInboundEnquiry({ selections: [{ sku: "polo" }] });
  assert.equal(result.valid, false);
  assert.deepEqual(result.errors, ["name_required", "email_invalid", "phone_required", "idempotency_key_required"]);
});

test("inbound enquiry accepts complete, retry-safe input", () => {
  assert.equal(validateInboundEnquiry({
    name: "A Customer", email: "customer@example.com", phone: "0400000000",
    selections: [{ sku: "polo", qty: 10 }], idempotencyKey: "req-1",
  }).valid, true);
});
