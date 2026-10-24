/**
 * Sanitises the marketing attribution a public enquiry may carry.
 * Only whitelisted, length-capped, non-PII values survive. Anything that
 * looks like an email address is dropped so contact data can never leak
 * into the CRM attribution record via a tampered or mis-tagged URL.
 */

export interface TouchAttribution {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  referrer?: string;
  landingPage?: string;
  at?: string;
}

export interface LeadAttribution {
  first?: TouchAttribution;
  last?: TouchAttribution;
  leadEventId?: string;
}

const TEXT_KEYS = ["source", "medium", "campaign", "content", "term", "referrer", "landingPage"] as const;
const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "fbclid"] as const;
const TEXT_MAX = 120;
const CLICK_ID_MAX = 200;
const EMAIL_LIKE = /[^\s@]+@[^\s@]+/;
const CLICK_ID = /^[A-Za-z0-9_-]+$/;
const EVENT_ID = /^[a-zA-Z0-9_-]{8,120}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/;

function cleanText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.replace(/[\u0000-\u001f]/g, "").trim().slice(0, TEXT_MAX);
  if (!trimmed || EMAIL_LIKE.test(trimmed)) return undefined;
  return trimmed;
}

function cleanTouch(raw: unknown): TouchAttribution | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const input = raw as Record<string, unknown>;
  const out: TouchAttribution = {};
  for (const key of TEXT_KEYS) {
    const v = cleanText(input[key]);
    if (v) out[key] = v;
  }
  for (const key of CLICK_ID_KEYS) {
    const v = input[key];
    if (typeof v === "string" && v.length <= CLICK_ID_MAX && CLICK_ID.test(v)) out[key] = v;
  }
  if (typeof input.at === "string" && ISO_DATE.test(input.at)) out.at = input.at;
  return Object.keys(out).length ? out : undefined;
}

export function sanitiseAttribution(raw: unknown): LeadAttribution {
  if (!raw || typeof raw !== "object") return {};
  const input = raw as Record<string, unknown>;
  const result: LeadAttribution = {};
  const first = cleanTouch(input.first);
  const last = cleanTouch(input.last);
  if (first) result.first = first;
  if (last) result.last = last;
  if (typeof input.leadEventId === "string" && EVENT_ID.test(input.leadEventId)) result.leadEventId = input.leadEventId;
  return result;
}
