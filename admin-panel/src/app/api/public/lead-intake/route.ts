import { NextResponse } from "next/server";
import { createRecord, listRecords, updateRecord } from "@/lib/airtable";
import { customerToFields } from "@/lib/airtable-mappers";
import type { Customer } from "@/lib/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 500;
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const rateLimits = new Map<string, number[]>();
const idempotency = new Map<string, { expiresAt: number; response: IntakeResponse }>();

interface IntakeBody {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  suburb?: unknown;
  neededBy?: unknown;
  product?: unknown;
  quantity?: unknown;
  budget?: unknown;
  message?: unknown;
  source?: unknown;
  campaign?: unknown;
  landingPage?: unknown;
  consent?: unknown;
  requestId?: unknown;
  website?: unknown;
}

interface IntakeResponse {
  success: true;
  customerId: string;
  status: "New";
  duplicate?: boolean;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.slice(0, MAX_LEN).trim() : "";
}

function allowedOrigins(): string[] {
  return (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

function cors(response: NextResponse, origin: string | null): NextResponse {
  if (origin && allowedOrigins().includes(origin.replace(/\/$/, ""))) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "content-type");
  return response;
}

function json(body: unknown, status: number, origin: string | null): NextResponse {
  return cors(NextResponse.json(body, { status }), origin);
}

function ip(req: Request): string {
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function rateLimited(client: string): boolean {
  const now = Date.now();
  const recent = (rateLimits.get(client) || []).filter((stamp) => stamp > now - WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    rateLimits.set(client, recent);
    return true;
  }
  recent.push(now);
  rateLimits.set(client, recent);
  return false;
}

function requestKey(value: string): string | undefined {
  return value && /^[a-zA-Z0-9_-]{8,120}$/.test(value) ? value : undefined;
}

function intakeNotes(input: Required<Pick<IntakeBody, "suburb" | "neededBy" | "product" | "quantity" | "budget" | "message" | "source" | "campaign" | "landingPage" | "website">>): string {
  return JSON.stringify({
    pipelineStatus: "New",
    suburb: text(input.suburb),
    neededBy: text(input.neededBy),
    product: text(input.product),
    quantity: text(input.quantity),
    budget: text(input.budget),
    message: text(input.message),
    source: text(input.source) || "website",
    campaign: text(input.campaign) || "direct",
    landingPage: text(input.landingPage) || "/free-mockup",
    website: text(input.website),
    consentCapturedAt: new Date().toISOString(),
  });
}

export async function OPTIONS(req: Request) {
  return cors(new NextResponse(null, { status: 204 }), req.headers.get("origin"));
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const normalisedOrigin = origin?.replace(/\/$/, "") || "";
  if (!origin || !allowedOrigins().includes(normalisedOrigin)) return json({ error: "forbidden_origin" }, 403, origin);
  if (rateLimited(ip(req))) return json({ error: "rate_limited" }, 429, origin);

  let body: IntakeBody;
  try {
    body = (await req.json()) as IntakeBody;
  } catch {
    return json({ error: "invalid_json" }, 400, origin);
  }

  const name = text(body.name);
  const company = text(body.company);
  const email = text(body.email).toLowerCase();
  const phone = text(body.phone);
  if (!name || !email || !EMAIL_REGEX.test(email)) return json({ error: "name_and_valid_email_required" }, 400, origin);
  if (text(body.consent).toLowerCase() !== "yes") return json({ error: "contact_consent_required" }, 400, origin);

  const key = requestKey(text(body.requestId));
  const cached = key ? idempotency.get(key) : undefined;
  if (cached && cached.expiresAt > Date.now()) return json({ ...cached.response, duplicate: true }, 200, origin);

  const notes = intakeNotes({
    suburb: body.suburb,
    neededBy: body.neededBy,
    product: body.product,
    quantity: body.quantity,
    budget: body.budget,
    message: body.message,
    source: body.source,
    campaign: body.campaign,
    landingPage: body.landingPage,
    website: body.website,
  });

  try {
    const existing = await listRecords("Customers", {
      filterByFormula: `LOWER({Email}) = '${email.replace(/'/g, "\\'")}'`,
      maxRecords: 1,
    });

    let customerId: string;
    if (existing.length > 0) {
      customerId = existing[0].id;
      const previous = typeof existing[0].fields.Notes === "string" ? `${existing[0].fields.Notes}\n` : "";
      // Keep an existing customer's operational status; the new enquiry is
      // recorded in Notes without moving an active order backwards.
      await updateRecord("Customers", customerId, { Notes: `${previous}${notes}`.slice(-4000) });
    } else {
      const customer: Customer = {
        id: "",
        name,
        company: company || name,
        email,
        phone,
        billingAddress: text(body.suburb),
        createdAt: new Date().toISOString(),
        notes,
      };
      const created = await createRecord("Customers", { ...customerToFields(customer), Status: "New" });
      customerId = created.id;
    }

    const response: IntakeResponse = { success: true, customerId, status: "New" };
    if (key) idempotency.set(key, { expiresAt: Date.now() + 5 * 60_000, response });
    return json(response, 200, origin);
  } catch (error) {
    console.error("[lead-intake] persistence failed", error);
    return json({ error: "crm_unavailable" }, 503, origin);
  }
}
