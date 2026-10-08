import assert from "node:assert/strict";
import test from "node:test";
import {
  addSydneyBusinessDays,
  applyReplySuppression,
  buildAcquisitionReport,
  evaluateSendEligibility,
  prospectDedupeKey,
  selectInitialPilotBatch,
  type Prospect,
} from "../src/lib/acquisition.ts";

function prospect(overrides: Partial<Prospect> = {}): Prospect {
  return {
    id: "prospect-1",
    businessName: "Example Business",
    email: "owner@example.com",
    website: "https://example.com",
    segment: "fitness",
    researchStatus: "Qualified",
    salesStage: "Ready to Email",
    consentStatus: "Requested Material",
    consentEvidence: "Phone call with owner",
    consentDate: "2026-09-14",
    campaignId: "pilot",
    ...overrides,
  };
}

test("Email Found records are not eligible without approval and consent", () => {
  const result = evaluateSendEligibility(prospect({
    researchStatus: "Email Found",
    salesStage: "Awaiting Review",
    consentStatus: "None",
  }), "initial", [], "2026-09-14");

  assert.equal(result.eligible, false);
  assert.match(result.reasons.join(","), /missing_consent/);
  assert.match(result.reasons.join(","), /not_ready_to_email/);
});

test("initial pilot batch enforces cap, consent and duplicate suppression", () => {
  const prospects = Array.from({ length: 14 }, (_, index) => prospect({
    id: `prospect-${index}`,
    businessName: `Business ${index}`,
    email: `buyer${index}@example.com`,
    website: `https://business-${index}.com.au`,
  }));
  prospects[2] = prospect({ id: "duplicate-email", email: "buyer1@example.com" });
  prospects[3] = prospect({ id: "no-consent", email: "no-consent@example.com", consentStatus: "None" });

  const selected = selectInitialPilotBatch(prospects, [], 10, "2026-09-14");

  assert.equal(selected.length, 10);
  assert.equal(selected.some((item) => item.id === "duplicate-email"), false);
  assert.equal(selected.some((item) => item.id === "no-consent"), false);
});

test("dispatch key blocks repeated campaign step", () => {
  const candidate = prospect();
  const result = evaluateSendEligibility(candidate, "initial", [{
    prospectId: candidate.id,
    campaignId: "pilot",
    step: "initial",
    acceptedAt: "2026-09-14T09:00:00+10:00",
  }], "2026-09-14");

  assert.equal(result.eligible, false);
  assert.match(result.reasons.join(","), /duplicate_dispatch_key/);
});

test("follow-ups shift by Sydney business days", () => {
  assert.equal(addSydneyBusinessDays("2026-09-11", 4), "2026-09-17");

  const early = evaluateSendEligibility(prospect({
    salesStage: "Emailed",
    dateEmailed: "2026-09-11",
  }), "followup1", [], "2026-09-16");
  const due = evaluateSendEligibility(prospect({
    salesStage: "Emailed",
    dateEmailed: "2026-09-11",
  }), "followup1", [], "2026-09-17");

  assert.equal(early.eligible, false);
  assert.match(early.reasons.join(","), /followup1_not_due/);
  assert.equal(due.eligible, true);
});

test("reply and opt-out suppression pause future campaign steps", () => {
  const suppressed = applyReplySuppression(prospect({ salesStage: "Emailed", dateEmailed: "2026-09-14" }), "No thanks, please remove me.", "2026-09-15");
  const result = evaluateSendEligibility(suppressed, "followup1", [], "2026-09-21");

  assert.equal(suppressed.suppressed, true);
  assert.equal(suppressed.consentStatus, "Opted Out");
  assert.equal(result.eligible, false);
  assert.match(result.reasons.join(","), /suppressed/);
});

test("dedupe key prefers normalized email, then domain", () => {
  assert.equal(prospectDedupeKey(prospect({ email: " Buyer@Example.COM " })), "email:buyer@example.com");
  assert.equal(prospectDedupeKey(prospect({ email: "", website: "https://www.NovaMerchAU.com/path" })), "domain:novamerchau.com");
});

test("daily report is truthful about Email Found backlog", () => {
  const report = buildAcquisitionReport({
    initialSent: 0,
    fu1Sent: 0,
    fu2Sent: 0,
    repliesToday: 2,
    emailFoundPending: 305,
    approvedQueue: 0,
    discoveryErrors: 1,
  }, "Monday 14 September");

  assert.match(report, /305 Email Found leads/);
  assert.match(report, /NOT scheduled to send/);
  assert.doesNotMatch(report, /sent tomorrow/i);
});
