import assert from "node:assert/strict";
import test from "node:test";
import { sendBrevoTransactional } from "../src/lib/brevo.ts";

test("Brevo adapter is a no-op while disabled", async () => {
  const original = process.env.BREVO_ENABLED;
  delete process.env.BREVO_ENABLED;
  const result = await sendBrevoTransactional({ to: "novamerch.au@gmail.com", subject: "staging", htmlContent: "test" });
  assert.deepEqual(result, { sent: false, disabled: true });
  if (original) process.env.BREVO_ENABLED = original;
});
