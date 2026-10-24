// First and last touch campaign context for the enquiry form.
// Stores only campaign parameters, click ids, referring domain and landing
// path. Never stores or reads contact details. Storage access is wrapped
// because it can throw in private windows or when blocked.

export interface Touch {
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
  at: string;
}

const FIRST_KEY = "nm_first_touch";
const LAST_KEY = "nm_last_touch";

function pick(params: URLSearchParams, ...names: string[]): string | undefined {
  for (const name of names) {
    const v = params.get(name);
    if (v) return v;
  }
  return undefined;
}

export function readTouch(search: string, referrer: string, pathname: string, now = new Date()): Touch | null {
  const p = new URLSearchParams(search);
  let referringDomain: string | undefined;
  try {
    const host = referrer ? new URL(referrer).hostname : "";
    referringDomain = host && host !== "novamerchau.com" && host !== "www.novamerchau.com" ? host : undefined;
  } catch {
    referringDomain = undefined;
  }
  const touch: Touch = {
    source: pick(p, "utm_source", "source"),
    medium: pick(p, "utm_medium"),
    campaign: pick(p, "utm_campaign", "campaign"),
    content: pick(p, "utm_content"),
    term: pick(p, "utm_term"),
    gclid: pick(p, "gclid"),
    gbraid: pick(p, "gbraid"),
    wbraid: pick(p, "wbraid"),
    fbclid: pick(p, "fbclid"),
    referrer: referringDomain,
    landingPage: pathname,
    at: now.toISOString(),
  };
  const meaningful = touch.source || touch.medium || touch.campaign || touch.gclid || touch.gbraid || touch.wbraid || touch.fbclid || touch.referrer;
  return meaningful ? touch : null;
}

function load(key: string): Touch | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Touch) : null;
  } catch {
    return null;
  }
}

function save(key: string, touch: Touch) {
  try {
    window.localStorage.setItem(key, JSON.stringify(touch));
  } catch {
    /* storage unavailable: attribution simply falls back to the current page */
  }
}

/** Records the current visit and returns the first and last meaningful touch. */
export function captureAttribution(): { first?: Touch; last?: Touch } {
  const current = readTouch(window.location.search, document.referrer, window.location.pathname);
  let first = load(FIRST_KEY) ?? undefined;
  let last = load(LAST_KEY) ?? undefined;
  if (current) {
    if (!first) {
      first = current;
      save(FIRST_KEY, current);
    }
    last = current;
    save(LAST_KEY, current);
  }
  return { first, last };
}
