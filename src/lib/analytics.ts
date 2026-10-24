// Consent-gated GA4. Inert unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set at
// build time AND the visitor has accepted. No contact details are ever sent.

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const CONSENT_KEY = "nm_analytics_consent";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export const analyticsConfigured = GA_ID !== "";

export function getConsent(): "granted" | "denied" | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: "granted" | "denied") {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable: choice applies to this page view only */
  }
  if (value === "granted") loadAnalytics();
}

export function loadAnalytics() {
  if (!analyticsConfigured || getConsent() !== "granted" || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag requires the arguments object, not an array
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

/** Fires generate_lead once per server-confirmed lead. Carries only the non-PII event id. */
export function trackLead(leadEventId: string) {
  if (!analyticsConfigured || getConsent() !== "granted" || !window.gtag) return;
  const sentKey = `nm_lead_sent_${leadEventId}`;
  try {
    if (window.sessionStorage.getItem(sentKey)) return;
    window.sessionStorage.setItem(sentKey, "1");
  } catch {
    /* proceed; dedupe is best effort without storage */
  }
  window.gtag("event", "generate_lead", { lead_event_id: leadEventId });
}
