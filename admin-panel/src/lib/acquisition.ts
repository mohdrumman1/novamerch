export type Segment = "fitness" | "construction" | "property" | "sports" | "generic";

export type ResearchStatus =
  | "Unreviewed"
  | "Email Found"
  | "Qualified"
  | "No Email Found"
  | "Rejected";

export type SalesStage =
  | "Research"
  | "Awaiting Review"
  | "Ready to Email"
  | "Emailed"
  | "Follow-up 1"
  | "Follow-up 2"
  | "Replied"
  | "Quote Requested"
  | "Won"
  | "Lost";

export type ConsentStatus = "None" | "Requested Material" | "Existing Customer" | "Opted Out";
export type CampaignStep = "initial" | "followup1" | "followup2";

export interface Prospect {
  id: string;
  businessName: string;
  email?: string;
  phone?: string;
  website?: string;
  segment: Segment;
  researchStatus: ResearchStatus;
  salesStage: SalesStage;
  consentStatus: ConsentStatus;
  consentEvidence?: string;
  consentDate?: string;
  suppressed?: boolean;
  suppressionReason?: string;
  owner?: string;
  campaignId?: string;
  dateEmailed?: string;
  followup1SentAt?: string;
  followup2SentAt?: string;
  lastReplyAt?: string;
  bouncedAt?: string;
  providerMessageIds?: Partial<Record<CampaignStep, string>>;
}

export interface SendActivity {
  prospectId: string;
  campaignId: string;
  step: CampaignStep;
  providerMessageId?: string;
  acceptedAt?: string;
}

export interface AcquisitionReportCounts {
  initialSent: number;
  fu1Sent: number;
  fu2Sent: number;
  repliesToday: number;
  emailFoundPending: number;
  approvedQueue: number;
  discoveryErrors?: number;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  dispatchKey?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OPT_OUT_RE = /\b(no thanks|unsubscribe|stop emailing|remove me|do not contact|don't contact)\b/i;

export function normalizeEmail(email?: string): string {
  return (email ?? "").trim().toLowerCase();
}

export function normalizeDomain(website?: string): string {
  if (!website) return "";
  try {
    const withProtocol = /^https?:\/\//i.test(website) ? website : `https://${website}`;
    return new URL(withProtocol).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return website.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0].toLowerCase();
  }
}

export function prospectDedupeKey(prospect: Pick<Prospect, "email" | "website" | "phone" | "businessName">): string {
  const email = normalizeEmail(prospect.email);
  if (email) return `email:${email}`;

  const domain = normalizeDomain(prospect.website);
  if (domain) return `domain:${domain}`;

  const phone = (prospect.phone ?? "").replace(/\D/g, "");
  if (phone) return `phone:${phone}`;

  return `name:${prospect.businessName.trim().toLowerCase().replace(/\s+/g, " ")}`;
}

export function dispatchKey(prospect: Pick<Prospect, "id" | "campaignId">, step: CampaignStep): string {
  return `${prospect.id}:${prospect.campaignId ?? "default"}:${step}`;
}

export function isBusinessDaySydney(date: Date): boolean {
  const weekday = new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    timeZone: "Australia/Sydney",
  }).format(date);
  return weekday !== "Sat" && weekday !== "Sun";
}

export function addSydneyBusinessDays(startIsoDate: string, days: number): string {
  const date = new Date(`${startIsoDate.slice(0, 10)}T12:00:00+10:00`);
  let remaining = days;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (isBusinessDaySydney(date)) remaining -= 1;
  }
  return date.toISOString().slice(0, 10);
}

function hasConsent(prospect: Prospect): boolean {
  return prospect.consentStatus === "Requested Material" || prospect.consentStatus === "Existing Customer";
}

export function evaluateSendEligibility(
  prospect: Prospect,
  step: CampaignStep,
  activities: SendActivity[] = [],
  todayIsoDate = new Date().toISOString().slice(0, 10),
): EligibilityResult {
  const reasons: string[] = [];
  const key = dispatchKey(prospect, step);
  const email = normalizeEmail(prospect.email);

  if (!email || !EMAIL_RE.test(email)) reasons.push("missing_or_invalid_email");
  if (prospect.suppressed) reasons.push("suppressed");
  if (prospect.consentStatus === "Opted Out") reasons.push("opted_out");
  if (!hasConsent(prospect)) reasons.push("missing_consent");
  if (prospect.lastReplyAt) reasons.push("human_reply_pauses_sequence");
  if (prospect.bouncedAt) reasons.push("bounced");
  if (activities.some((activity) => `${activity.prospectId}:${activity.campaignId}:${
    activity.step
  }` === key)) reasons.push("duplicate_dispatch_key");

  if (step === "initial") {
    if (prospect.salesStage !== "Ready to Email") reasons.push("not_ready_to_email");
    if (prospect.dateEmailed) reasons.push("already_sent_initial");
  }

  if (step === "followup1") {
    if (prospect.salesStage !== "Emailed") reasons.push("not_emailed");
    if (!prospect.dateEmailed) reasons.push("missing_initial_sent_date");
    if (prospect.followup1SentAt) reasons.push("already_sent_followup1");
    if (prospect.dateEmailed && todayIsoDate < addSydneyBusinessDays(prospect.dateEmailed, 4)) {
      reasons.push("followup1_not_due");
    }
  }

  if (step === "followup2") {
    if (prospect.salesStage !== "Follow-up 1") reasons.push("missing_followup1_stage");
    if (!prospect.followup1SentAt) reasons.push("missing_followup1_sent_date");
    if (prospect.followup2SentAt) reasons.push("already_sent_followup2");
    if (prospect.followup1SentAt && todayIsoDate < addSydneyBusinessDays(prospect.followup1SentAt, 6)) {
      reasons.push("followup2_not_due");
    }
  }

  return { eligible: reasons.length === 0, reasons, dispatchKey: key };
}

export function selectInitialPilotBatch(
  prospects: Prospect[],
  activities: SendActivity[] = [],
  cap = 10,
  todayIsoDate = new Date().toISOString().slice(0, 10),
): Prospect[] {
  const seen = new Set<string>();
  const selected: Prospect[] = [];

  for (const prospect of prospects) {
    const dedupeKey = prospectDedupeKey(prospect);
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    if (evaluateSendEligibility(prospect, "initial", activities, todayIsoDate).eligible) {
      selected.push(prospect);
      if (selected.length >= cap) break;
    }
  }

  return selected;
}

export function shouldSuppressFromReply(body: string): boolean {
  return OPT_OUT_RE.test(body);
}

export function applyReplySuppression(prospect: Prospect, replyBody: string, replyDateIso: string): Prospect {
  if (!shouldSuppressFromReply(replyBody)) {
    return { ...prospect, lastReplyAt: replyDateIso, salesStage: "Replied" };
  }

  return {
    ...prospect,
    lastReplyAt: replyDateIso,
    salesStage: "Lost",
    consentStatus: "Opted Out",
    suppressed: true,
    suppressionReason: "Opt-out reply",
  };
}

export function buildAcquisitionReport(counts: AcquisitionReportCounts, todayLabel: string): string {
  const totalEmailsToday = counts.initialSent + counts.fu1Sent + counts.fu2Sent;
  const discoveryLine = typeof counts.discoveryErrors === "number"
    ? `  Discovery errors: ${counts.discoveryErrors}`
    : "  Discovery health: not measured by this report";

  return `NovaMerch Daily Report -- ${todayLabel}

EMAILS RECORDED SENT TODAY: ${totalEmailsToday}
  Initial emails: ${counts.initialSent}
  Follow-up 1: ${counts.fu1Sent}
  Follow-up 2: ${counts.fu2Sent}

PIPELINE
  Replies today: ${counts.repliesToday}
  Email found, awaiting review: ${counts.emailFoundPending}
  Approved Ready to Email queue: ${counts.approvedQueue}
${discoveryLine}

${counts.emailFoundPending > 0
  ? `ACTION: Review the ${counts.emailFoundPending} Email Found leads. These leads are NOT scheduled to send. Only eligible, approved Ready to Email leads are selected by the weekday sender.`
  : "No Email Found leads awaiting review were returned by the report query."}

${totalEmailsToday === 0
  ? "CHECK: No sends were recorded today. Check the approved queue and sender executions; zero sends alone does not establish the cause."
  : "Counts are based on accepted send records, not confirmed delivery."}`;
}
