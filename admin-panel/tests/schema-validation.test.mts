import assert from "node:assert/strict";
import test from "node:test";
import { buildSourceReference, validateTableSchema } from "../src/lib/schema-validation.ts";
import { assertConfiguredBaseId, getRuntimeConfig } from "../src/lib/runtime-config.ts";

test("operational schema validation reports missing tables and fields", () => {
  const result = validateTableSchema({ Customers: ["Name"] });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(";"), /missing field: Customers.Email/);
  assert.match(result.errors.join(";"), /missing table: Quotes/);
});

test("source references preserve the original base and record ID", () => {
  assert.equal(buildSourceReference("appLeads", "rec123"), "appLeads:rec123");
});

test("runtime config keeps migration disabled by default", () => {
  const config = getRuntimeConfig({ AIRTABLE_BASE_ID: "appLegacy" });
  assert.equal(config.leadsBaseId, "appLegacy");
  assert.equal(config.inboundQuoteMode, "legacy");
  assert.equal(config.automationEnabled, false);
  assertConfiguredBaseId(config.leadsBaseId, "leads");
});
