# Email enrichment automation research

15 September 2026 · Australia/Sydney

## Live verification update

16 September 2026: Airtable was checked directly for Nova Merch Leads (`appxYYtl9qnkcgUVx` / `tbl1p7cvWR84ZjoKD`). There were `0` records with `Date Emailed` on 2026-09-16, `0` records eligible for the initial sender filter `AND({Status} = 'Ready to Email', {Email} != '')`, and `308` records in `Email Found`. This means the initial sender had no approved queue to send today. The `Email Found` backlog still requires review before any record can be promoted to `Ready to Email`.

## Current state

n8n does not appear to have a separate NovaMerch workflow dedicated to email finding. The active acquisition workflows are:

- `Nova Merch - Simple Daily Lead Finder` (`JqsHoiKlwSjUwdHb`), scheduled every 12 hours.
- `Nova Merch - 2 Send Initial Emails`.
- `Nova Merch - 3 Follow-up 1 (Day 4)`.
- `Nova Merch - 4 Follow-up 2 (Day 10)`.
- `Nova Merch - 6 Daily Email Report`.

The lead finder is published, but its recent executions fail in `Find Leads From Google` with HTTP 403. The node is a Code node that calls Google Places API New directly. Until that is fixed, fresh company discovery is not working. Separately, the daily report shows `Email Found` records awaiting review; those records are not eligible for the sender unless reviewed and promoted to `Ready to Email`.

## Recommendation

Build a new n8n workflow called `Nova Merch - 1B Email Enrichment Review Queue` between lead discovery and sending. It should enrich selected company records, write evidence back to Airtable or the replacement prospect store, and stop at `Email Found` or `No Email Found`. It should not set `Ready to Email` automatically.

Use Hunter first for a small controlled pilot because n8n has a built-in Hunter node for domain search, email finder and email verification. Keep Apollo and Snov.io as later comparison paths if Hunter coverage is poor for Australian SMEs.

## Vendor research

| Option | Fit | Notes |
|---|---|---|
| Hunter via n8n built-in node | Best first option | n8n supports Hunter operations to get emails by domain, generate/retrieve the likely email from name + domain, and verify deliverability. Hunter's API also exposes Domain Search, Email Finder and Email Verifier. |
| Hunter via HTTP Request | Good fallback | Useful if the built-in node cannot express all needed fields, sources or score handling. Authentication can use query parameter, `X-API-KEY`, or bearer header. |
| Apollo | Good later test | Apollo people enrichment works best with person-level input such as email, name plus company domain, or Apollo person ID. It can return no enrichment even with HTTP 200 when input is too general. Bulk people enrichment is limited to 10 people per request. |
| Snov.io | Possible later test | Snov.io supports name + domain and verification APIs, with bulk batches of up to 10 prospects in the newer API flow. Free-plan API access may require test access/demo, so it is not the lowest-friction first step. |
| Website scraping for emails | Not recommended as an auto-promotion path | Public email discovery can help identify a contact route, but Brevo policy and the existing acquisition docs caution against treating scraped public emails as marketing consent. |

## Proposed workflow

Trigger:

- Weekdays, once per day at 07:30 Sydney time, before the 09:00 sender and after the overnight discovery run.
- Manual trigger for testing one record.

Input query:

- `Status` or `Research Status` is one of `Needs Review`, `Website Found`, or equivalent.
- `Email` is blank.
- `Website` or normalized domain is present.
- Not suppressed, not opted out, not previously hard-bounced.
- `Email Finder Attempts` is blank or below a small cap such as 2.
- Limit 10 records/day for the first week.

Steps:

1. Normalize website to root domain.
2. Skip free-hosted or social-only domains unless manually approved.
3. Hunter Domain Search for the domain.
4. Prefer role/person evidence in this order:
   - named owner, manager, principal or operations contact from the record or official site;
   - generic business address only if it is a clear business address such as `info@`, `admin@`, `hello@`, `sales@`, and the record remains review-only;
   - reject personal webmail unless manually confirmed.
5. Hunter Email Verifier on candidate addresses.
6. Write back:
   - `Email`
   - `Email Confidence`
   - `Email Verification Status`
   - `Email Source`
   - `Email Source URL`
   - `Email Found At`
   - `Email Finder Attempts`
   - `Research Status = Email Found` or `No Email Found`
   - `Review Required = true`
7. Add an activity ledger row for every enrichment attempt.
8. Do not send, do not subscribe in Brevo, and do not set `Ready to Email`.

Review gate:

- A human checks fit, source, previous contact, suppression, and the reason for contact.
- Only after a valid contact basis is recorded should the record move to `Ready to Email`.
- Sending workflows must re-check suppression and consent/review fields immediately before each send.

## Field changes needed

Add or standardize these prospect fields:

- `Normalized Domain`
- `Email Confidence`
- `Email Verification Status`
- `Email Source`
- `Email Source URL`
- `Email Found At`
- `Email Finder Attempts`
- `Review Required`
- `Consent Status`
- `Consent Evidence`
- `Suppressed`
- `Suppression Reason`

If Airtable remains over its record limit, do not rely on this new workflow being able to write successfully. Either upgrade, archive/migrate old records carefully, or move prospecting to a separate store before turning enrichment on.

## Guardrails

- Never retry unknown failures indefinitely.
- Treat `accept_all`, `unknown`, disposable, webmail, and low-confidence results as review-only.
- Suppression overrides every enrichment or send state.
- Do not enrich records marked `Do Not Contact`, bounced, unsubscribed, or replied.
- Do not infer consent from a found mailbox.
- Keep API keys in n8n credentials or environment variables, not hardcoded Code nodes.
- Keep daily enrichment low enough to manually review the resulting queue.

## Test plan

1. Create the workflow disabled or paused.
2. Pin one synthetic Airtable record and one real low-risk business record.
3. Dry-run the domain normalization and vendor call.
4. Confirm it writes `Email Found` but not `Ready to Email`.
5. Confirm bad/unknown verification results go to `No Email Found` or `Needs Manual Review`.
6. Confirm suppressed records are skipped.
7. Publish only after one full dry run matches expected Airtable rows.

## Draft artifact

An importable draft workflow is saved at `docs/n8n-nova-merch-email-enrichment-review-queue.workflow.json`.

The draft uses the existing n8n credential names `Hunter account` and `Airtable Personal Access Token account`, reads at most 10 leads with a website and blank email, runs Hunter Domain Search, selects one review candidate, and updates only `Email`, `Status = Email Found`, and `Notes`. It has no schedule trigger, is inactive, and does not send email or mark records `Ready to Email`.

A scheduled variant is saved at `docs/n8n-nova-merch-email-enrichment-review-queue-scheduled.workflow.json`. It adds a weekday 07:30 Schedule Trigger and retains the manual trigger for test runs. It is also inactive as an import artifact and still does not send email, subscribe contacts in Brevo, or promote records to `Ready to Email`.

## Sources

- n8n Hunter node documentation: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.hunter
- Hunter API reference: https://hunter.io/api-documentation/v2
- Apollo people enrichment documentation: https://docs.apollo.io/reference/people-enrichment
- Apollo bulk people enrichment documentation: https://docs.apollo.io/reference/bulk-people-enrichment
- Snov.io API overview: https://snov.io/api
- Snov.io API enrichment guide: https://snov.io/knowledgebase/how-to-enrich-your-data-via-snov-io-api/
