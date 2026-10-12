import assert from "node:assert/strict";
import test from "node:test";
import { createOrderLinkToken, verifyOrderLinkToken } from "../src/lib/signed-links.ts";

test("signed order links are scoped and tamper resistant", async () => {
  const token = await createOrderLinkToken("tracking", "recOrder1", "test-secret", 60);
  assert.deepEqual((await verifyOrderLinkToken(token, "tracking", "test-secret"))?.orderId, "recOrder1");
  assert.equal(await verifyOrderLinkToken(token, "approval", "test-secret"), null);
  const tampered = token.replace("recOrder1", "recOrder2");
  assert.equal(await verifyOrderLinkToken(tampered, "tracking", "test-secret"), null);
});
