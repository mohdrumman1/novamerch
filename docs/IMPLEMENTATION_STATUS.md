# Implementation status — 2026-10-09

## Brevo staging verification — 2026-10-10

- Local API v3 credentials validated against `GET /v3/account` (HTTP 200).
- Controlled transactional delivery test sent only to `novamerch.au@gmail.com` (HTTP 201; Brevo message ID returned).
- Mailbox receipt manually confirmed by the user.
- No customer or Siennah email was sent.
- Production remains disabled pending mailbox receipt and webhook reconciliation.

## Operational data update — 2026-10-10

- Cooks Hill `#O1002` was updated in NovaMerch Orders to `Goods Status = Completed`; shipment date is 26/09/2026 and actual delivery is 06/10/2026.
- The linked delivered shipment record now contains both verified dates.
- Swell Fitness `#O1001` was not overwritten. Its refund, partial-return, sizing, and supplier-recovery details remain an internal issue/reconciliation task because the staging D1 issue store is not connected to the local dev server.
- Swell Fitness `#O1001` Comments now record that the full customer refund was paid, the jackets were returned and their cost recouped, and the shirts/polos were not returnable after the supplier's 30-day window; original order and paid invoice fields were preserved. The current Airtable Orders schema has no dedicated refund-status field.
- Dashboard cost calculations now hydrate linked Supplier Orders, so recorded supplier payments/projected costs can populate profit cards instead of showing `Not recorded`.
- Fixed zero-value transport-cost mapping: Airtable `0` is now treated as a recorded cost, allowing supplier costs to flow through to dashboard projected costs and profit.

## Completed in this run

- Public website redesign, route fixes, colour restoration, FAQ spacing, and dynamic hero video.
- Admin Airtable ownership/configuration helpers and schema validation.
- Migration source-reference convention and rollback documentation.
- D1 job/event ledger migration SQL.
- Signed order-scoped approval/tracking token generation and verification.
- Validated inbound-enquiry contract requiring name, email, phone, selections, and an idempotency key.
- Read-only Airtable verification completed for both configured bases. Base 2 contains Customers, Quotes, Orders, Invoices, Shipments, and Supplier Orders with the expected links and JSON line items.
- Confirmed Base 2 currently has two orders and no shipment records. Swell Fitness `#O1001` remains Pending goods / Paid Full with two supplier links and no shipment.
- Created a read-only Base 2 JSON backup at `backups/airtable/2026-10-10-base2/` before any migration write.
- Provisioned the staging D1 database `novamerch-admin-staging` and applied migration `0001_job_state.sql` remotely.
- Wired the staged inbound-enquiry endpoint to D1 with a unique idempotency key; production remains on the legacy mode.
- Applied D1 migration `0002_customer_operations.sql` for artwork versions, fulfilment events, issues/returns/refunds, feedback jobs, and staff audit logs.
- Added signed customer artwork approval and order tracking APIs, issue/refund intake, seven-day feedback scheduling, supplier-release guard logic, and the admin Action Centre.
- Connected customer tracking and artwork approval lookups to the live operational Airtable Orders table; approval state remains in D1.
- Added Brevo transactional adapter and authenticated webhook event ledger route; sending remains disabled until staging credentials are configured.
- Added admin Approvals and Issues & Refunds screens.
- Feature flags keep migrations, Brevo, automation, and order-link issuance disabled.
- Existing quote-request and CRUD paths remain intact.

## Verification

- `admin-panel/npm test`: 19 passed, 0 failed.
- `admin-panel/npm run build`: passed; 24 routes generated.

## Remaining work before production

- Provision a staging D1 database and bind it in Wrangler.
- Deploy and smoke-test the staging Worker with its required secrets (admin password/session secret and Airtable API key).
- Add the Inbound Enquiries table and durable quote-request persistence.
- Connect approval/tracking APIs to the verified order and shipment records, and add complete admin editing screens.
- Add the real Brevo adapter, webhook reconciliation, and Workflow retry execution.
- Replace shared admin password with individually identifiable staff accounts, roles, MFA, revocation, and sensitive-action audit logs.
- Implement and stage Brevo delivery reconciliation without sending real messages.

No production Airtable records were changed and no customer email was sent.
