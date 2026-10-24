# Measurement Plan and CRM Linkage (MKT-003 to MKT-006 design)

Read-only schema review of Airtable on 2026-10-24 (field names and types only; no records read, no changes made).

## What exists
Two bases:
- **Leads base** (`appxYYtl9qnkcgUVx`): `Leads` (website intake writes here), Search Queue, Products, Customers, Proposals, Quotes, Orders, Invoices, Shipments, Settings, Ops Log, Templates. Leads has `Campaign ID`, `Copy Version`, `Quote Value`, `Quoted Gross Profit`, `Won Gross Profit`, `Status`, `Notes`, and links to Customers and Proposals. This base also holds older copies of Customers, Quotes, Orders, Invoices and Shipments.
- **Admin base** (`appkQYN4Gcb1pSzu1`, system of record per CLAUDE.md): Customers, Quotes (has `Source`), Orders, Invoices, Shipments, Supplier Orders. Orders link to Customer and Quote; Quotes carry `Total Revenue AUD`, `Total Cost AUD`, `Margin Percent`. Orders carry `Total Cost AUD`, `Transport Cost AUD`, `Amount Received AUD`.

## Gaps for source-to-order attribution
1. **No cross-base key.** Admin-base Customers and Quotes have no Lead ID or marketing source field, so an order cannot be tied back to the website lead that started it.
2. **Attribution lives in free text.** Website source, landing page and (new) first/last touch sit inside `Leads.Notes` JSON; only `Campaign ID` and `Copy Version` are fields.
3. **Two sets of commercial tables** in the Leads base duplicate the admin base. Risk of reporting from the wrong one.
4. **No lead-stage fields for qualified or disqualified reason**, needed for qualified CPL.

## Proposed schema changes (NOT applied, need your approval because they change shared Airtable)
| Table (base) | Field | Type | Purpose |
|---|---|---|---|
| Leads (Leads base) | Lead Event ID | single line text | Server id from the enquiry (already sent as `leadEventId`) |
| Leads | First Touch Source / Medium / Campaign | single line text | Query attribution without parsing Notes |
| Leads | Last Touch Source / Medium / Campaign | single line text | Same |
| Leads | Qualification | single select (Qualified, Disqualified, Unreviewed) | Qualified CPL |
| Leads | Disqualified Reason | single select | Diagnostics |
| Customers (Admin base) | Source Lead ID | single line text | Join to the Leads record id |
| Quotes (Admin base) | Marketing Source | single line text | Copied from lead at quote time |

Order contribution is then computed in `admin-panel/src/lib/calc.ts` from Quote revenue less Order costs and transport, ex GST, per the master plan formula. Unknown values stay unknown (never coerced to $0), as required by the project instructions.

## Event plan (MKT-005, blocked)
Fire `generate_lead` once, from the server-confirmed success state, with the non-PII `leadEventId` for dedupe. Needs: GA4 property and measurement ID, consent decision, no PII in events. Not implemented because no identifier or consent mechanism exists.

## Access still needed
Search Console, GA4/GTM, Bing, Google Ads, Meta: owner grants. Until then there is no traffic baseline; the first measurable numbers will be leads by source from Airtable.
