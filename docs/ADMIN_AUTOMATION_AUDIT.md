# Admin, CRM & automation audit

Date: 9 October 2026

## Confirmed repository architecture

- **Admin app:** `admin-panel/`, Next.js 16.2.6, React 19, TypeScript, deployed through OpenNext/Cloudflare Workers.
- **Authentication:** password-backed signed session cookie in `admin-panel/src/lib/admin-session.ts`; middleware protects admin routes and explicitly allows the two public intake endpoints.
- **Airtable client:** `admin-panel/src/lib/airtable.ts` reads `AIRTABLE_BASE_ID` and `AIRTABLE_API_KEY` only on the server. It supports list, create, patch and delete operations.
- **Configured base:** `admin-panel/wrangler.jsonc` sets `AIRTABLE_BASE_ID=appxYYtl9qnkcgUVx` (Nova Merch Leads / Base 1). No Base 2 identifier is present in application configuration.
- **Current mappers:** Customers, Quotes, Orders, Invoices and Shipments are mapped in `admin-panel/src/lib/airtable-mappers.ts`. Order and invoice line items remain JSON strings.
- **Admin bootstrap reads:** `GET /api/bootstrap` loads Customers, Quotes, Orders, Invoices and Shipments in parallel from the configured base.
- **Admin writes:** CRUD APIs exist for Customers, Quotes, Orders, Invoices and Shipments. Their PATCH and DELETE operations act directly on the configured base with no event log or historical status append.
- **Public lead intake:** `POST /api/public/lead-intake` deduplicates against `Leads` by email and creates/updates Base 1 Leads records. It stores attribution and enquiry details in a JSON Notes value.
- **Public mockup/quote intake:** `POST /api/public/quote-requests` creates or reuses a Base 1 Customer, then creates a Base 1 Quote. It includes EmailJS/Resend notification code; no Brevo transactional adapter or communication-history write was found.
- **Supplier orders:** Type definitions and calculation helpers mention supplier-order data, but no Airtable Supplier Orders API/bootstrap source is wired in the current admin app.
- **Background jobs:** no durable job queue, scheduled worker, idempotency store or webhook handler exists in this checkout. Current rate limits/idempotency maps are process-local.

## Read/write path map

| Capability | Current source / destination | Status |
| --- | --- | --- |
| Public website quote | website → `admin/api/public/lead-intake` → Base 1 `Leads` | Active |
| Mockup Builder quote | builder → `admin/api/public/quote-requests` → Base 1 `Customers`, `Quotes` | Active |
| Admin dashboard hydration | browser → `/api/bootstrap` → Base 1 `Customers`, `Quotes`, `Orders`, `Invoices`, `Shipments` | Active |
| Admin CRUD | admin browser → resource API → configured `AIRTABLE_BASE_ID` | Active |
| Supplier order updates | no repository API/adapter found | Missing |
| Delivery event ingestion | manual Shipment CRUD only; no verified event mechanism | Missing |
| Brevo delivery webhooks | no handler found | Missing |
| Feedback scheduling | no scheduler or feedback API found | Missing |
| Issues, returns and refunds | no table mapper or admin API found | Missing |

## Airtable ownership decision

Use Base 2 (`appkQYN4Gcb1pSzu1`, NovaMerch Orders) as the target operational system of record for inbound enquiries and future operational entities. Retain Base 1 (`appxYYtl9qnkcgUVx`, Nova Merch Leads) for outbound prospecting and campaign management.

This is a planned migration, not an approved production switch. The repository does not contain live schema introspection or credentials for a read-only Base 2 inspection, so field names, record counts and links supplied in the verified implementation addendum must be checked against a read-only export before migration code is enabled.

## Reconciliation guardrail

`#O1001` / Swell Fitness must be treated as a historical exception. Do not overwrite the order or trigger status emails when its records are corrected. Create an internal reconciliation task covering supplied items, delivery date/address, sizing, logo-colour mismatch, complaint evidence, refund/payment confirmation, returns, supplier recovery and post-resolution feedback.

## Risks found before implementation

1. Switching `AIRTABLE_BASE_ID` alone would point existing CRUD code at the wrong schema and could create malformed records.
2. Current PATCH handlers overwrite status fields and have no append-only Order Status Events record.
3. Current public intake deduplicates by email, which is insufficient to identify separate legal businesses sharing a contact address.
4. Process-local idempotency and rate-limit maps do not provide durable guarantees across Workers instances.
5. Existing notification code is not a Brevo event log and must not be treated as delivery truth.
6. Existing Supplier Orders data is not loaded by the admin bootstrap, so order status cannot yet be verified end-to-end.
