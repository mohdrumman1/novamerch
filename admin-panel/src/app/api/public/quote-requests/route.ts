// Resend: set RESEND_API_KEY secret and verify sending domain novamerchau.com
import { NextResponse } from "next/server";
import { createRecord, listRecords } from "@/lib/airtable";
import { quoteToFields, customerToFields } from "@/lib/airtable-mappers";
import type { Quote, Customer, LineItem } from "@/lib/types";

// Public intake endpoint for the customer-facing Mockup Builder.
//
// Trust model:
//   1. Origin header must be in ALLOWED_ORIGINS env (comma-separated). The
//      browser cannot hold a secret, so we rely on the browser-enforced
//      Origin header + CORS to gate cross-origin POSTs from untrusted pages.
//   2. Per-IP rate limit (3 req / minute) on top of that.
//   3. TODO: future Turnstile/captcha hook (add a check between origin
//      and rate-limit steps; reject if token is missing/invalid).
//
// This route runs on Cloudflare via OpenNext. We accept Workers' standard
// `cf-connecting-ip` header for accurate per-client IP attribution.

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_ITEMS = 50;
const MAX_STR_LEN = 2000;
const MAX_QTY = 100_000;
const MAX_UNIT_PRICE = 100_000;
const MAX_TOTAL = 100_000_000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_MAP_CAP = 5000;

const IDEMPOTENCY_TTL_MS = 5 * 60 * 1000; // 5 minutes
const IDEMPOTENCY_CAP = 1000;

const FETCH_TIMEOUT_MS = 10_000;

const EMAILJS_SERVICE_ID = "service_fs3k0qg";
const EMAILJS_TEMPLATE_ID = "template_9whbuxm";
const EMAILJS_PUBLIC_KEY = "vW_7lZvAVXxPXaAcV";
const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const RECIPIENT_EMAIL = "novamerch.au@gmail.com";

// ── Types ────────────────────────────────────────────────────────────────────

interface IntakeItem {
  product?: string;
  label?: string;
  style?: string;
  colour?: string;
  size?: string;
  plFront?: string;
  plBack?: string;
  decoration?: string;
  sockText?: string;
  notes?: string;
  qty: number;
  unitPrice: number;
  // Optional logo data-URIs from the mockup builder canvas.
  // Included so the admin email can display the actual uploaded logos.
  logoFrontSrc?: string;
  logoFrontSize?: number;
  logoBackSrc?: string;
  logoBackSize?: number;
}

interface IntakePayload {
  customer: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  items: IntakeItem[];
  notes?: string;
  // Client-generated UUID for idempotency. Generated once when the customer
  // info modal opens; regenerated on successful submission. The server uses
  // it to short-circuit duplicate POSTs from a retried button click.
  requestId?: string;
  // Optional base64-encoded PDF of the quote mockup. Used by the Resend path
  // to attach the PDF to the admin notification email.
  quotePdfBase64?: string | null;
}

interface SuccessResponse {
  success: true;
  email: boolean;
  airtable: boolean;
  partial?: boolean;
  duplicate?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function clampString(v: unknown, max = MAX_STR_LEN): string {
  if (typeof v !== "string") return "";
  return v.length > max ? v.slice(0, max) : v;
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

/**
 * Escape Airtable filterByFormula string-literal content. Backslash MUST be
 * escaped FIRST, then single-quote - otherwise the backslashes we insert for
 * quotes get re-escaped, breaking the formula.
 *
 *   email = "a\\'@b.com"
 *   replace \\ -> \\\\:  "a\\\\'@b.com"
 *   replace ' -> \\':    "a\\\\\\'@b.com"      ✓ correct
 */
function airtableEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/**
 * HTML-escape user-supplied content before string-concatenating into items_html.
 */
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}

function badRequest(error: string, origin: string | null) {
  return withCors(NextResponse.json({ error }, { status: 400 }), origin);
}

// ── CORS ─────────────────────────────────────────────────────────────────────

function getAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS || "";
  return raw
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter((s) => s.length > 0);
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const normalised = origin.replace(/\/$/, "");
  return getAllowedOrigins().includes(normalised);
}

function withCors(res: NextResponse, origin: string | null): NextResponse {
  if (origin && isOriginAllowed(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin");
  }
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "content-type");
  res.headers.set("Access-Control-Max-Age", "600");
  return res;
}

// ── Rate limit (per-IP, in-memory) ──────────────────────────────────────────
// Best-effort only: each Worker/process keeps its own Map, so distributed
// deployments leak limits across instances. For prod-scale rate limiting,
// swap for Cloudflare KV / Durable Object / Upstash.

const rateLimitMap = new Map<string, number[]>();

function rateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const hits = (rateLimitMap.get(ip) || []).filter((t) => t > cutoff);
  if (hits.length >= RATE_LIMIT_MAX) {
    const oldest = hits[0];
    return { allowed: false, retryAfterMs: RATE_LIMIT_WINDOW_MS - (now - oldest) };
  }
  hits.push(now);
  // Hard-cap the map to RATE_LIMIT_MAP_CAP entries. If we are about to
  // exceed it, evict the oldest insertion (Map iteration is insertion-ordered)
  // before storing the new entry.
  if (!rateLimitMap.has(ip) && rateLimitMap.size >= RATE_LIMIT_MAP_CAP) {
    const oldestKey = rateLimitMap.keys().next().value;
    if (oldestKey !== undefined) rateLimitMap.delete(oldestKey);
  }
  rateLimitMap.set(ip, hits);
  return { allowed: true };
}

function clientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip")
    ?? req.headers.get("x-real-ip")
    ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown"
  );
}

// ── Idempotency (in-memory, time-windowed) ──────────────────────────────────

interface IdempotencyEntry {
  expiresAt: number;
  response: SuccessResponse;
}
const idempotency = new Map<string, IdempotencyEntry>();

function getIdempotent(requestId: string | undefined): SuccessResponse | null {
  if (!requestId) return null;
  const hit = idempotency.get(requestId);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    idempotency.delete(requestId);
    return null;
  }
  return hit.response;
}

function setIdempotent(requestId: string | undefined, response: SuccessResponse): void {
  if (!requestId) return;
  if (idempotency.size >= IDEMPOTENCY_CAP) {
    // Evict oldest insertion to keep the map bounded.
    const oldestKey = idempotency.keys().next().value;
    if (oldestKey !== undefined) idempotency.delete(oldestKey);
  }
  idempotency.set(requestId, {
    expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
    response,
  });
}

// ── Description builder ────────────────────────────────────────────────────

function composeDescription(it: IntakeItem): string {
  const label = clampString(it.label || it.product || "Item", 200);
  const attrParts = [
    clampString(it.colour || "", 100),
    clampString(it.size || "", 50),
    clampString(it.decoration || "", 200),
  ].filter((s) => s.length > 0);
  const placements = `(front: ${clampString(it.plFront || "-", 100)}, back: ${clampString(it.plBack || "-", 100)})`;
  let out = `${label}`;
  if (attrParts.length > 0) out += ` - ${attrParts.join(", ")}`;
  out += ` ${placements}`;
  if (it.sockText) out += `, text: ${clampString(it.sockText, 200)}`;
  if (it.notes) out += `; notes: ${clampString(it.notes, 500)}`;
  return out
    .replace(/\s+/g, " ")
    .replace(/,\s*,/g, ",")
    .replace(/-\s*,/g, "-")
    .replace(/\s*-\s*$/g, "")
    .trim();
}

// ── Email body builder ────────────────────────────────────────────────────────
// Shared by both the Resend and EmailJS paths so the HTML is built once.

interface EmailBodyInput {
  quoteNumber: string;
  customer: { name: string; email: string; phone: string; company: string };
  items: IntakeItem[];
  notes: string;
}

interface EmailBody {
  itemsHtml: string;
  itemsText: string;
  message: string;
  total: number;
  date: string;
}

function buildEmailBody(input: EmailBodyInput): EmailBody {
  const { quoteNumber, customer, items, notes } = input;

  const date = new Date().toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const total = items.reduce((s, it) => s + it.qty * it.unitPrice, 0);

  // Validate a logo src: must be a base64 data-URI for a known image type.
  // We do NOT forward arbitrary strings as <img src> values into the email.
  function isValidLogoSrc(src: unknown): src is string {
    if (typeof src !== "string") return false;
    return /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(src);
  }

  const rowsHtml = items
    .map((it) => {
      const label = escapeHtml(it.label || it.product || "Item");
      const detailLines = [
        it.style ? `Style: ${escapeHtml(it.style)}` : null,
        it.colour ? `Colour: ${escapeHtml(it.colour)}` : null,
        it.size ? `Size: ${escapeHtml(it.size)}` : null,
        it.plFront ? `Front placement: ${escapeHtml(it.plFront)}` : null,
        it.plBack ? `Back placement: ${escapeHtml(it.plBack)}` : null,
        it.decoration ? `Logo style: ${escapeHtml(it.decoration)}` : null,
        it.sockText ? `Sock text: ${escapeHtml(it.sockText)}` : null,
        it.notes ? `Notes: ${escapeHtml(it.notes)}` : null,
      ].filter(Boolean);
      const details = detailLines.join("<br>");
      const lineTotal = (it.qty * it.unitPrice).toFixed(2);

      // Build inline logo preview thumbnails for the email.
      // Only embed validated base64 data-URIs; skip anything that looks wrong.
      const logoHtml = [
        isValidLogoSrc(it.logoFrontSrc)
          ? `<div style="margin-top:6px"><div style="font-size:10px;color:#888;margin-bottom:2px">Front logo:</div><img src="${it.logoFrontSrc}" style="max-height:60px;max-width:120px;border:1px solid #e2e8f0;border-radius:4px;background:#f8fafc;padding:3px;display:block"></div>`
          : null,
        isValidLogoSrc(it.logoBackSrc)
          ? `<div style="margin-top:6px"><div style="font-size:10px;color:#888;margin-bottom:2px">Back logo:</div><img src="${it.logoBackSrc}" style="max-height:60px;max-width:120px;border:1px solid #e2e8f0;border-radius:4px;background:#f8fafc;padding:3px;display:block"></div>`
          : null,
      ].filter(Boolean).join("");

      return `<tr style="border-bottom:1px solid #F1F5F9">
  <td style="padding:10px 12px;font-weight:700">${label}${logoHtml}</td>
  <td style="padding:10px 12px;font-size:11px;color:#444;line-height:1.7">${details}</td>
  <td style="padding:10px 12px;text-align:center">${it.qty}</td>
  <td style="padding:10px 12px;text-align:right">$${it.unitPrice.toFixed(2)}</td>
  <td style="padding:10px 12px;text-align:right;font-weight:700">$${lineTotal}</td>
</tr>`;
    })
    .join("");

  const itemsHtml = `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px">
<thead><tr style="background:#F8FAFC;text-align:left">
  <th style="padding:10px 12px">Item</th>
  <th style="padding:10px 12px">Details</th>
  <th style="padding:10px 12px;text-align:center">Qty</th>
  <th style="padding:10px 12px;text-align:right">Unit Price</th>
  <th style="padding:10px 12px;text-align:right">Line Total</th>
</tr></thead>
<tbody>${rowsHtml}</tbody>
</table>`;

  const itemsText = items
    .map((it, i) => {
      const label = it.label || it.product || "Item";
      const attrs = [it.colour, it.size, it.decoration].filter(Boolean).join(", ");
      const placements = `(front: ${it.plFront || "-"}, back: ${it.plBack || "-"})`;
      let s = label;
      if (attrs) s += ` - ${attrs}`;
      s += ` ${placements}`;
      if (it.sockText) s += `, text: ${it.sockText}`;
      if (it.notes) s += `; notes: ${it.notes}`;
      const lineTotal = (it.qty * it.unitPrice).toFixed(2);
      return `${i + 1}. ${s}\n   Qty: ${it.qty} @ $${it.unitPrice.toFixed(2)} = $${lineTotal}`;
    })
    .join("\n\n");

  const message = [
    `Quote: ${quoteNumber}`,
    `Submitted: ${date}`,
    "",
    "CUSTOMER",
    `Name: ${customer.name}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone || "Not provided"}`,
    `Company: ${customer.company || "Not provided"}`,
    "",
    "REQUESTED PRODUCTS",
    itemsText,
    "",
    `Quoted total: $${total.toFixed(2)}`,
    "",
    "NOTES",
    notes || "None",
  ].join("\n");

  return { itemsHtml, itemsText, message, total, date };
}

// ── EmailJS dispatch ─────────────────────────────────────────────────────────

interface EmailDispatchInput {
  quoteNumber: string;
  customer: { name: string; email: string; phone: string; company: string };
  items: IntakeItem[];
  notes: string;
}

async function sendEmail(input: EmailDispatchInput): Promise<{ ok: boolean; status?: number; error?: string }> {
  const { quoteNumber, customer, items, notes } = input;

  if (!EMAILJS_PRIVATE_KEY) {
    console.error("[quote-requests] EMAILJS_PRIVATE_KEY is not configured");
    return { ok: false, error: "emailjs_not_configured" };
  }

  const { itemsHtml, itemsText, message, total, date } = buildEmailBody({ quoteNumber, customer, items, notes });

  const body = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    accessToken: EMAILJS_PRIVATE_KEY,
    template_params: {
      title: quoteNumber,
      name: customer.name,
      email: customer.email,
      time: date,
      message,
      from_name: escapeHtml(customer.name),
      from_email: escapeHtml(customer.email),
      phone: escapeHtml(customer.phone || "Not provided"),
      company: escapeHtml(customer.company || "Not provided"),
      quote_number: quoteNumber,
      date,
      items_html: itemsHtml,
      items_text: itemsText,
      total: `$${total.toFixed(2)}`,
      notes: notes ? escapeHtml(notes) : "None",
      to_email: RECIPIENT_EMAIL,
    },
  };

  try {
    const res = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[quote-requests] EmailJS error", res.status, text.slice(0, 500));
      return { ok: false, status: res.status, error: "emailjs_failed" };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    console.error("[quote-requests] EmailJS exception:", e);
    return { ok: false, error: "emailjs_exception" };
  }
}

// ── Airtable persistence ────────────────────────────────────────────────────

interface AirtablePersistInput {
  quoteNumber: string;
  customer: { name: string; email: string; phone: string; company: string };
  items: IntakeItem[];
  notes: string;
}

interface AirtablePersistResult {
  ok: boolean;
  error?: string;
  quoteId?: string;
  customerId?: string;
}

async function persistToAirtable(input: AirtablePersistInput): Promise<AirtablePersistResult> {
  const { quoteNumber, customer, items, notes } = input;
  const { name, email, phone, company } = customer;
  try {
    // 1. Find or create the Customer.
    let customerId: string;
    const escapedLowerEmail = airtableEscape(email.toLowerCase());
    const existing = await listRecords("Customers", {
      filterByFormula: `LOWER({Email}) = '${escapedLowerEmail}'`,
      maxRecords: 1,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (existing.length > 0) {
      customerId = existing[0].id;
    } else {
      const newCustomer: Customer = {
        id: "",
        name,
        company: company || name,
        email,
        phone: phone || "",
        billingAddress: "",
        createdAt: new Date().toISOString(),
      };
      const customerFields = {
        ...customerToFields(newCustomer),
        Status: "Active",
      };
      const created = await createRecord("Customers", customerFields, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      customerId = created.id;

      // H4: customer-upsert race detection. If a concurrent request also
      // created a Customer for the same email, pick the OLDEST and proceed
      // with it (the orphan we just created will be picked up by the next
      // request and we accept a small duplicate row in Customers as the
      // best-effort outcome).
      try {
        const recheck = await listRecords("Customers", {
          filterByFormula: `LOWER({Email}) = '${escapedLowerEmail}'`,
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (recheck.length > 1) {
          const oldest = recheck
            .slice()
            .sort((a, b) => {
              const aT = String((a as unknown as { createdTime?: string }).createdTime ?? "");
              const bT = String((b as unknown as { createdTime?: string }).createdTime ?? "");
              return aT.localeCompare(bT);
            })[0];
          console.warn("[quote-requests] customer race detected, using oldest record", {
            email,
            count: recheck.length,
          });
          customerId = oldest.id;
        }
      } catch (e) {
        // Re-check is best-effort. If it fails, fall through with the row
        // we just created.
        console.warn("[quote-requests] race recheck failed; proceeding with new record", e);
      }
    }

    // 2. Create the Quote.
    const now = new Date();
    const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const lineItems: LineItem[] = items.map((it) => ({
      id: crypto.randomUUID(),
      description: composeDescription(it),
      qty: it.qty,
      unitPrice: it.unitPrice,
    }));

    const quote: Quote = {
      id: "",
      ref: quoteNumber,
      customerId,
      status: "Draft",
      issuedAt: now.toISOString(),
      validUntil: validUntil.toISOString(),
      lineItems,
      comments: notes || undefined,
      source: "Mockup Builder",
    };

    const createdQuote = await createRecord("Quotes", quoteToFields(quote), {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    return { ok: true, quoteId: createdQuote.id, customerId };
  } catch (err) {
    console.error("[quote-requests] airtable persist error:", err);
    return { ok: false, error: "airtable_failed" };
  }
}

// ── OPTIONS (CORS preflight) ────────────────────────────────────────────────

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  const res = new NextResponse(null, { status: 204 });
  return withCors(res, origin);
}

// ── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  // 1. Origin allowlist (replaces INTAKE_SECRET). Browser-enforced same-origin
  //    policy means an attacker page cannot forge this header in a real
  //    browser. Server-to-server attacks can; rate limit + downstream
  //    validation still apply.
  if (!isOriginAllowed(origin)) {
    return withCors(
      NextResponse.json({ error: "forbidden_origin" }, { status: 403 }),
      origin,
    );
  }

  // 2. Rate limit per IP.
  const ip = clientIp(req);
  const rl = rateLimit(ip);
  if (!rl.allowed) {
    const res = NextResponse.json(
      { error: "rate_limited", retryAfterMs: rl.retryAfterMs },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.retryAfterMs || RATE_LIMIT_WINDOW_MS) / 1000)),
        },
      },
    );
    return withCors(res, origin);
  }

  // 3. Parse body.
  let body: IntakePayload;
  try {
    body = (await req.json()) as IntakePayload;
  } catch {
    return badRequest("invalid json", origin);
  }

  if (!body || typeof body !== "object") return badRequest("invalid body", origin);
  if (!body.customer || typeof body.customer !== "object") return badRequest("missing customer", origin);

  const requestId = clampString(body.requestId || "", 100).trim() || undefined;

  // 4. Idempotency short-circuit.
  const cached = getIdempotent(requestId);
  if (cached) {
    return withCors(NextResponse.json({ ...cached, duplicate: true }), origin);
  }

  // 5. Validate.
  const name = clampString(body.customer.name).trim();
  const email = clampString(body.customer.email).trim();
  const phone = clampString(body.customer.phone || "").trim();
  const company = clampString(body.customer.company || "").trim();
  const notes = clampString(body.notes || "", MAX_STR_LEN);

  if (!name) return badRequest("name required", origin);
  if (!email || !EMAIL_REGEX.test(email)) return badRequest("valid email required", origin);

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return badRequest("items required", origin);
  }
  if (body.items.length > MAX_ITEMS) {
    return badRequest(`items exceed max ${MAX_ITEMS}`, origin);
  }

  const items: IntakeItem[] = [];
  let runningTotal = 0;
  for (const raw of body.items) {
    if (!raw || typeof raw !== "object") return badRequest("invalid item", origin);
    if (!isFiniteNumber(raw.qty)) return badRequest("qty must be a number", origin);
    if (!Number.isInteger(raw.qty)) return badRequest("qty must be an integer", origin);
    if (raw.qty < 1 || raw.qty > MAX_QTY) {
      return badRequest(`qty must be between 1 and ${MAX_QTY}`, origin);
    }
    if (!isFiniteNumber(raw.unitPrice)) return badRequest("unitPrice must be a number", origin);
    if (raw.unitPrice <= 0 || raw.unitPrice > MAX_UNIT_PRICE) {
      return badRequest(`unitPrice must be > 0 and <= ${MAX_UNIT_PRICE}`, origin);
    }
    runningTotal += raw.qty * raw.unitPrice;
    if (runningTotal > MAX_TOTAL) {
      return badRequest(`total exceeds max ${MAX_TOTAL}`, origin);
    }
    // Validate logo src: must be a base64 data-URI (≤ 350 KB chars) for a known image type.
    const MAX_LOGO_CHARS = 350 * 1024;
    const LOGO_DATA_URI_RE = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/;
    function sanitizeLogo(v: unknown): string | undefined {
      if (typeof v !== "string" || v.length === 0) return undefined;
      if (v.length > MAX_LOGO_CHARS) return undefined;
      return LOGO_DATA_URI_RE.test(v) ? v : undefined;
    }

    items.push({
      product: clampString(raw.product || "", 200),
      label: clampString(raw.label || "", 200),
      style: clampString(raw.style || "", 200),
      colour: clampString(raw.colour || "", 100),
      size: clampString(raw.size || "", 50),
      plFront: clampString(raw.plFront || "", 100),
      plBack: clampString(raw.plBack || "", 100),
      decoration: clampString(raw.decoration || "", 200),
      sockText: clampString(raw.sockText || "", 200),
      notes: clampString(raw.notes || "", 500),
      qty: raw.qty,
      unitPrice: raw.unitPrice,
      logoFrontSrc: sanitizeLogo(raw.logoFrontSrc),
      logoFrontSize: typeof raw.logoFrontSize === "number" ? raw.logoFrontSize : undefined,
      logoBackSrc: sanitizeLogo(raw.logoBackSrc),
      logoBackSize: typeof raw.logoBackSize === "number" ? raw.logoBackSize : undefined,
    });
  }

  // 6. Build a quote number and dispatch the two side-effects in parallel.
  const quoteNumber = `QT-${Date.now().toString().slice(-6)}`;
  const safeCustomer = { name, email, phone, company };

  // PDF attachment handling: validate and size-guard the optional base64 PDF.
  let pdfBase64 = (body.quotePdfBase64 ?? null) as string | null;
  if (pdfBase64 && Math.floor(pdfBase64.length * 0.75) > 5 * 1024 * 1024) {
    console.warn(JSON.stringify({ event: "quote_pdf_dropped_oversize", requestId, sizeBytes: Math.floor(pdfBase64.length * 0.75) }));
    pdfBase64 = null;
  }

  // Hybrid email path: try Resend first (supports PDF attachment), fall back to EmailJS.
  async function dispatchEmail(): Promise<{ ok: boolean; status?: number; error?: string }> {
    if (RESEND_API_KEY) {
      const { itemsHtml } = buildEmailBody({ quoteNumber, customer: safeCustomer, items, notes });

      const attachments = pdfBase64
        ? [{ filename: `quote-${quoteNumber}.pdf`, content: pdfBase64 }]
        : undefined;

      const resendPayload: Record<string, unknown> = {
        from: "NovaMerch Quotes <quotes@novamerchau.com>",
        to: [RECIPIENT_EMAIL],
        subject: `New Quote Request - ${quoteNumber}`,
        html: itemsHtml,
        ...(attachments ? { attachments } : {}),
      };

      if (email) resendPayload.reply_to = email;

      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resendPayload),
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });

        if (!resendRes.ok) {
          const bodyText = (await resendRes.text()).slice(0, 500);
          console.warn(JSON.stringify({ event: "resend_failed_fallback_emailjs", requestId, status: resendRes.status, body: bodyText }));
          // Fall through to EmailJS fallback below.
        } else {
          return { ok: true, status: resendRes.status };
        }
      } catch (err) {
        console.warn(JSON.stringify({ event: "resend_error_fallback_emailjs", requestId, error: String(err) }));
        // Fall through to EmailJS fallback below.
      }
    }

    // EmailJS fallback: used when RESEND_API_KEY is not set OR when Resend fails
    // (e.g. domain not yet verified).
    return sendEmail({ quoteNumber, customer: safeCustomer, items, notes });
  }

  const [emailResult, airtableResult] = await Promise.allSettled([
    dispatchEmail(),
    persistToAirtable({ quoteNumber, customer: safeCustomer, items, notes }),
  ]);

  const emailOk = emailResult.status === "fulfilled" ? emailResult.value.ok : false;
  const airtableOk = airtableResult.status === "fulfilled" ? airtableResult.value.ok : false;
  const airtableValue = airtableResult.status === "fulfilled" ? airtableResult.value : undefined;

  if (!emailOk && !airtableOk) {
    console.error("[quote-requests] both subsystems failed", {
      email: emailResult.status === "fulfilled" ? emailResult.value : emailResult.reason,
      airtable: airtableResult.status === "fulfilled" ? airtableResult.value : airtableResult.reason,
    });
    const res = NextResponse.json(
      { success: false, email: false, airtable: false, error: "both_failed" },
      { status: 502 },
    );
    return withCors(res, origin);
  }

  const partial = !(emailOk && airtableOk);
  if (partial) {
    console.error("[quote-requests] partial failure", {
      emailOk,
      airtableOk,
      error: airtableValue?.error,
    });
  }

  const response: SuccessResponse = {
    success: true,
    email: emailOk,
    airtable: airtableOk,
    ...(partial ? { partial: true } : {}),
  };
  setIdempotent(requestId, response);
  return withCors(NextResponse.json(response), origin);
}
