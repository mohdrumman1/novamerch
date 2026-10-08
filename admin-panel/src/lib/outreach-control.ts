import {
  dispatchKey,
  evaluateSendEligibility,
  normalizeEmail,
  type CampaignStep,
  type Prospect,
  type SendActivity,
} from "./acquisition.ts";

export type InboundEventType = "delivered" | "bounce" | "blocked" | "reply" | "opt_out";

export interface OutreachEvent {
  id: string;
  type: InboundEventType;
  prospectId: string;
  recipient: string;
  occurredAt: string;
  providerMessageId?: string;
  body?: string;
  source: "brevo" | "gmail" | "agentmail" | "manual";
}

export interface ApprovalEvidence {
  basis: string;
  evidence: string;
  approvedBy: string;
  approvedAt: string;
  campaignId: string;
  copyVersion: string;
}

export interface LedgerEntry {
  eventId: string;
  prospectId: string;
  recipient: string;
  campaignId: string;
  step: CampaignStep;
  occurredAt: string;
  outcome: "eligible" | "blocked" | "accepted" | "delivered" | "bounced" | "replied" | "opted_out";
  providerMessageId?: string;
  reason?: string;
}

export interface ControlledProspect extends Prospect {
  approval?: ApprovalEvidence;
  normalizedDomain?: string;
  suppressedAt?: string;
}

export interface ControlledPilotConfig {
  campaignId: string;
  segment: Prospect["segment"];
  maxAccounts: number;
}

const VALID_BASIS = new Set(["express_consent", "existing_customer", "requested_material"]);

/**
 * A strict live-send gate. Discovery and enrichment may populate a mailbox,
 * but only this function can approve it for a campaign step.
 */
export function evaluateControlledSend(
  prospect: ControlledProspect,
  step: CampaignStep,
  activities: SendActivity[] = [],
  todayIsoDate = new Date().toISOString().slice(0, 10),
): { eligible: boolean; reasons: string[]; dispatchKey: string } {
  const result = evaluateSendEligibility(prospect, step, activities, todayIsoDate);
  const reasons = [...result.reasons];
  const approval = prospect.approval;

  if (!approval) reasons.push("missing_approval_evidence");
  if (approval && !VALID_BASIS.has(approval.basis)) reasons.push("invalid_contact_basis");
  if (approval && !approval.evidence.trim()) reasons.push("missing_consent_evidence");
  if (approval && !approval.approvedBy.trim()) reasons.push("missing_approver");
  if (approval && !approval.approvedAt) reasons.push("missing_approval_timestamp");
  if (approval && !approval.campaignId.trim()) reasons.push("missing_campaign_id");
  if (approval && !approval.copyVersion.trim()) reasons.push("missing_copy_version");
  if (approval && prospect.campaignId && approval.campaignId !== prospect.campaignId) {
    reasons.push("campaign_mismatch");
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    dispatchKey: result.dispatchKey ?? dispatchKey(prospect, step),
  };
}

export function makeLedgerEntry(
  event: Pick<OutreachEvent, "id" | "prospectId" | "recipient" | "occurredAt" | "providerMessageId">,
  campaignId: string,
  step: CampaignStep,
  outcome: LedgerEntry["outcome"],
  reason?: string,
): LedgerEntry {
  return {
    eventId: event.id,
    prospectId: event.prospectId,
    recipient: normalizeEmail(event.recipient),
    campaignId,
    step,
    occurredAt: event.occurredAt,
    outcome,
    providerMessageId: event.providerMessageId,
    ...(reason ? { reason } : {}),
  };
}

/** Apply an inbound event idempotently to the prospect state. */
export function applyInboundEvent(
  prospect: ControlledProspect,
  event: OutreachEvent,
): ControlledProspect {
  const normalizedRecipient = normalizeEmail(event.recipient);
  if (normalizedRecipient && normalizedRecipient !== normalizeEmail(prospect.email)) return prospect;

  if (event.type === "reply") {
    return { ...prospect, lastReplyAt: event.occurredAt, salesStage: "Replied" };
  }

  if (event.type === "opt_out") {
    return {
      ...prospect,
      lastReplyAt: event.occurredAt,
      suppressed: true,
      suppressedAt: event.occurredAt,
      suppressionReason: "Opt-out event",
      consentStatus: "Opted Out",
      salesStage: "Lost",
    };
  }

  if (event.type === "bounce" || event.type === "blocked") {
    return {
      ...prospect,
      bouncedAt: event.occurredAt,
      suppressed: true,
      suppressedAt: event.occurredAt,
      suppressionReason: event.type === "bounce" ? "Hard bounce" : "Provider blocked",
      salesStage: "Lost",
    };
  }

  return prospect;
}

export function safeDispatchKey(prospect: Prospect, step: CampaignStep): string {
  return dispatchKey(prospect, step);
}

/**
 * Select a bounded, single-segment pilot. This is deliberately stricter than
 * the generic sender: only records already carrying matching human approval
 * can enter the pilot, and duplicates are removed before the campaign cap is
 * applied. It does not send or mutate CRM data.
 */
export function selectControlledPilotBatch(
  prospects: ControlledProspect[],
  config: ControlledPilotConfig,
  activities: SendActivity[] = [],
  todayIsoDate = new Date().toISOString().slice(0, 10),
): ControlledProspect[] {
  const selected: ControlledProspect[] = [];
  const seenRecipients = new Set<string>();

  for (const prospect of prospects) {
    if (prospect.segment !== config.segment) continue;
    if (prospect.campaignId !== config.campaignId) continue;

    const recipient = normalizeEmail(prospect.email);
    if (!recipient || seenRecipients.has(recipient)) continue;
    seenRecipients.add(recipient);

    if (evaluateControlledSend(prospect, "initial", activities, todayIsoDate).eligible) {
      selected.push(prospect);
      if (selected.length >= config.maxAccounts) break;
    }
  }

  return selected;
}
