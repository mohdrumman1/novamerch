import assert from "node:assert/strict";
import test from "node:test";
import { sanitiseAttribution } from "../src/lib/lead-attribution.ts";

test("keeps whitelisted first and last touch fields", () => {
  const result = sanitiseAttribution({
    first: { source: "google", medium: "cpc", campaign: "clubs", gclid: "Cj0KCQ_abc-1", at: "2026-10-24T01:02:03.000Z" },
    last: { source: "sports-clubs", landingPage: "/sports-clubs/" },
    leadEventId: "evt_12345678",
  });
  assert.equal(result.first?.gclid, "Cj0KCQ_abc-1");
  assert.equal(result.first?.medium, "cpc");
  assert.equal(result.last?.landingPage, "/sports-clubs/");
  assert.equal(result.leadEventId, "evt_12345678");
});

test("drops unknown keys, email-like values and bad click ids", () => {
  const result = sanitiseAttribution({
    first: { source: "jane@example.com", campaign: "ok", gclid: "bad id;drop", extra: "x", at: "yesterday" },
    leadEventId: "short",
  });
  assert.deepEqual(result.first, { campaign: "ok" });
  assert.equal(result.leadEventId, undefined);
});

test("handles non-object input safely and caps length", () => {
  assert.deepEqual(sanitiseAttribution(null), {});
  assert.deepEqual(sanitiseAttribution("x"), {});
  const long = sanitiseAttribution({ last: { campaign: "a".repeat(500) } });
  assert.equal(long.last?.campaign?.length, 120);
});
