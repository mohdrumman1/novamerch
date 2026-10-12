import assert from "node:assert/strict";
import test from "node:test";
import {
  applyInboundEvent,
  evaluateControlledSend,
  makeLedgerEntry,
  selectControlledPilotBatch,
  type ControlledProspect,
} from "../src/lib/outreach-control.ts";

function prospect(overrides: Partial<ControlledProspect> = {}): ControlledProspect {
  return {
    id: "p-1",
    businessName: "Example Business",
    email: "owner@example.com",
    website: "https://example.com",
    segment: "construction",
    researchStatus: "Qualified",
    salesStage: "Ready to Email",
    consentStatus: "Requested Material",
    consentEvidence: "Owner asked for a quote by phone",
    consentDate: "2026-09-20",
    campaignId: "pilot-2026-09",
    approval: {
      basis: "requested_material",
      evidence: "Owner asked for a quote by phone",
      approvedBy: "rumman",
      approvedAt: "2026-09-20T09:00:00+10:00",
      campaignId: "pilot-2026-09",
      copyVersion: "construction-v2",
    },
    ...overrides,
  };
}

test("controlled send requires recorded approval evidence", () => {
  const result = evaluateControlledSend(prospect({ approval: undefined }), "initial", [], "2026-09-20");
  assert.equal(result.eligible, false);
  assert.match(result.reasons.join(","), /missing_approval_evidence/);
});

test("controlled send rejects a campaign mismatch", () => {
  const result = evaluateControlledSend(prospect({ approval: {
    basis: "requested_material",
    evidence: "phone",
    approvedBy: "rumman",
    approvedAt: "2026-09-20T09:00:00+10:00",
    campaignId: "other-campaign",
    copyVersion: "v1",
  } }), "initial", [], "2026-09-20");
  assert.equal(result.eligible, false);
  assert.match(result.reasons.join(","), /campaign_mismatch/);
});

test("opt-out and bounce suppress future sends", () => {
  const optedOut = applyInboundEvent(prospect(), {
    id: "evt-1",
    type: "opt_out",
    prospectId: "p-1",
    recipient: "OWNER@EXAMPLE.COM",
    occurredAt: "2026-09-21T10:00:00+10:00",
    source: "gmail",
    body: "No thanks, unsubscribe me",
  });
  assert.equal(optedOut.suppressed, true);
  assert.equal(optedOut.consentStatus, "Opted Out");
  assert.equal(evaluateControlledSend(optedOut, "followup1", [], "2026-09-25").eligible, false);

  const bounced = applyInboundEvent(prospect(), {
    id: "evt-2",
    type: "bounce",
    prospectId: "p-1",
    recipient: "owner@example.com",
    occurredAt: "2026-09-21T10:00:00+10:00",
    source: "brevo",
  });
  assert.equal(bounced.suppressed, true);
  assert.equal(bounced.bouncedAt, "2026-09-21T10:00:00+10:00");
});

test("ledger entries normalize recipients and preserve provider IDs", () => {
  const entry = makeLedgerEntry({
    id: "evt-3",
    prospectId: "p-1",
    recipient: " Owner@Example.COM ",
    occurredAt: "2026-09-21T10:00:00+10:00",
    providerMessageId: "msg-123",
  }, "pilot-2026-09", "initial", "accepted");
  assert.equal(entry.recipient, "owner@example.com");
  assert.equal(entry.providerMessageId, "msg-123");
});

test("controlled pilot is single-segment, campaign-bound, deduplicated and capped", () => {
  const candidates = Array.from({ length: 26 }, (_, index) => prospect({
    id: `p-${index}`,
    email: `buyer-${index}@example.com`,
    campaignId: "pilot-2026-10-clubwear",
    segment: "sports",
    approval: {
      basis: "requested_material",
      evidence: "Requested a clubwear information pack",
      approvedBy: "rumman",
      approvedAt: "2026-10-09T09:00:00+11:00",
      campaignId: "pilot-2026-10-clubwear",
      copyVersion: "clubwear-v1",
    },
  }));
  candidates[1] = prospect({
    id: "wrong-segment",
    email: "wrong-segment@example.com",
    campaignId: "pilot-2026-10-clubwear",
    segment: "fitness",
  });
  candidates[2] = prospect({
    id: "wrong-campaign",
    email: "wrong-campaign@example.com",
    campaignId: "another-campaign",
    segment: "sports",
  });
  candidates[3] = prospect({
    id: "no-approval",
    email: "no-approval@example.com",
    campaignId: "pilot-2026-10-clubwear",
    segment: "sports",
    approval: undefined,
  });
  candidates[4] = prospect({
    id: "duplicate-recipient",
    email: "buyer-0@example.com",
    campaignId: "pilot-2026-10-clubwear",
    segment: "sports",
  });

  const selected = selectControlledPilotBatch(candidates, {
    campaignId: "pilot-2026-10-clubwear",
    segment: "sports",
    maxAccounts: 20,
  }, [], "2026-10-09");

  assert.equal(selected.length, 20);
  assert.equal(selected.every((item) => item.segment === "sports"), true);
  assert.equal(selected.every((item) => item.campaignId === "pilot-2026-10-clubwear"), true);
  assert.equal(selected.some((item) => item.id === "duplicate-recipient"), false);
});
