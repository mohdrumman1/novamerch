# Airtable migration plan

## Read-only verification completed 2026-10-10

- Base 1 schema verified for outbound Leads, Search Queue, Products, Customers, Proposals, Quotes, Orders, Invoices, and Shipments.
- Base 2 schema verified for Customers, Quotes, Orders, Invoices, Shipments, and Supplier Orders.
- Base 2 currently contains two Orders records and zero Shipments records.
- Swell Fitness `#O1001` is linked to two supplier orders, contains seven polos and seven softshell jackets, has Goods Status `Pending`, Invoice Status `Paid Full`, and no shipment.
- No records were created, updated, deleted, or commented on during verification.

This plan implements the verified Airtable addendum without recreating existing tables or mutating production data before review.

## Phase 0  -  Read-only verification and backup

1. Confirm the deployed admin revision and actual `AIRTABLE_BASE_ID`/secret bindings.
2. Obtain read-only schema snapshots for Base 1 and Base 2: table IDs, field IDs/types, select options, linked-record fields, record counts and sample record IDs.
3. Export Base 1 Leads, Customers, Quotes, Orders, Invoices, Shipments and relevant Base 2 operational tables to an access-controlled backup location. Keep record IDs and timestamps.
4. Verify `#O1001` and its linked records without editing them. Record the Swell reconciliation task separately.
5. Create a mapping document from Base 1 entities to Base 2 entities. Do not merge by company name alone.

## Phase 1  -  Additive Base 2 schema

Add only missing tables/fields in Base 2 after the schema snapshot is reviewed:

- **Inbound Enquiries:** enquiry ID, source-system ID, contact details, business identity, requested products, quantity, budget, deadline, UTM/source, consent timestamp, status, assigned owner, created/updated timestamps and dedupe key.
- **Order Status Events:** order ID, previous status, next status, source, evidence reference, actor, occurred-at, notification policy and correlation ID.
- **Issues & Returns:** order ID, affected JSON line-item IDs/quantities, complaint, evidence, issue state, resolution, owner, return fields and supplier-recovery fields.
- **Refunds:** issue/order ID, requested/approved amounts, approval actor, payment-system reference, processed date, GST note and state. This table records accounting state only; it does not execute payments.
- **Quality Checks:** order/line-item IDs, checks performed, evidence, pass/fail, actor and timestamp.
- **Feedback:** order/customer IDs, scheduled/sent/completed dates, answers, permission, issue state and follow-up task fields.
- **Communication History:** event ID, related entity, channel, template, provider message ID, delivery state, suppression reason and timestamps.

Keep existing Customers, Quotes, Orders, Invoices, Shipments and Supplier Orders. Preserve existing record IDs and readable line-item JSON. Add structured line-item records only as a later, dual-read migration if reporting needs justify it.

## Phase 2  -  Application read/write adapter

1. Replace the single `AIRTABLE_BASE_ID` assumption with explicit server-only base configuration: `AIRTABLE_LEADS_BASE_ID` and `AIRTABLE_OPERATIONS_BASE_ID`.
2. Add table-ID configuration and schema guards so a missing/renamed field fails closed with an actionable error.
3. Route new inbound enquiries to Base 2 Inbound Enquiries. Keep outbound Leads in Base 1 and store stable cross-base identifiers (`sourceBase`, `sourceRecordId`, `operationalCustomerId`).
4. Move operational reads to Base 2 only after parity tests pass for Customers, Quotes, Orders, Invoices, Shipments and Supplier Orders.
5. Replace destructive status overwrite with append-only Order Status Events plus a current-status projection.
6. Add Issues/Returns/Refunds/Quality Checks/Feedback/Communication History APIs behind the existing admin session middleware.

## Phase 3  -  Controlled migration and reconciliation

- Run a dry-run mapper that reports missing links, duplicate candidates, invalid JSON and status conflicts without writes.
- Review every duplicate candidate by stable identifiers and legal-entity context.
- Import only approved records using original IDs where Airtable permits; otherwise preserve the source ID in an immutable external-ID field.
- Reconcile existing orders/invoices before enabling notifications. Never replay old status events or send historical order emails.
- Validate Swell Fitness `#O1001` manually and mark its notification suppression explicitly.

## Phase 4  -  Automation, only after end-to-end tests

1. Add a durable job/idempotency store appropriate to the Cloudflare deployment.
2. Add supplier update adapters that produce unverified events first; staff approval is required before customer-visible status changes.
3. Add Brevo transactional sending with provider message IDs, webhook verification, retries and Communication History logging.
4. Schedule feedback seven days after a verified delivery event.
5. Suppress ordinary feedback while an issue/return/refund remains unresolved; use a separate service-recovery survey for refunded orders.
6. Add manual retry and suppression visibility in `/admin/automations/`.

## Required migration tests

- Existing order and invoice records round-trip through new mappers without changing IDs or readable line-item JSON.
- Swell `#O1001` status correction produces no historical customer notification.
- Separate businesses sharing a contact email remain separate until a human approves a merge.
- Duplicate public submissions are idempotent across retries.
- Unverified supplier events cannot trigger customer messages.
- Failed Brevo sends are logged and safely retryable.
- Delivery feedback is scheduled exactly once and suppressed when an issue is open.

## Approval gate

No production schema changes, base switch, customer email automation or refund execution should start until the Phase 0 schema snapshot, backups, mapping review and read/write parity tests are approved by the system owner.
