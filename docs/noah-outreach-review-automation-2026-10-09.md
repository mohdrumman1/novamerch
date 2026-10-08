# Noah outreach-review automation

**Status:** deployed and manually validated 9 October 2026 as a daily, read-only inbox triage. Hermes cron job `19dc832a9724` runs at `0 21 * * 0-4` UTC, which is Monday–Friday 08:00 in Sydney daylight time, and delivers to Rumman's paired Telegram chat. It complements the Airtable review queue; it does not replace it.

## What Noah does automatically

Each weekday morning, Noah reads recent NovaMerch Gmail conversations and returns a short Telegram brief of messages that indicate:

- a reply to outreach;
- a quote or pricing request;
- an opt-out, wrong contact or deliverability problem; or
- an order, delivery or customer-service exception needing a person.

For each item, it reports only the sender **domain**, evidence-based classification and recommended Airtable decision: `reply/quote`, `manual review`, or `suppress`. The underlying message remains in Gmail for human review.

## Hard boundaries

- Read and report only: no email, Brevo message, Gmail draft, Airtable write, lead promotion, status change, quote, price, delivery promise or supplier commitment.
- Telegram output must not contain names, full email addresses, phone numbers, postal addresses, message bodies, verbatim subjects, attachments, order numbers, amounts or supplier information.
- A public email address is not permission. Noah cannot approve a `Ready to Email` record.
- A human must record `Contact Basis`, choose a campaign/copy, or tick `Suppressed` in Airtable.
- The 148 historical `Ready to Email` records remain unapproved until reviewed individually.

## Why this is the current lowest-cost useful automation

Noah has working Gmail and Telegram access. It does not currently have a documented, authenticated connection to the Nova Merch **Leads** Airtable base, so it cannot safely select or modify the 148-record queue. The report turns inbound signals into a small daily human review instead of creating silent CRM changes.

## Upgrade path

After a separate Airtable read-only connection is configured, add a second job that receives a bounded queue snapshot and produces a 10-record evidence/recommendation brief. Keep its output advisory until a saved approval view, reply/bounce ingestion and a visible dry run are verified.

The next write-capable exception is **DNC v2**, not general CRM access. On 9 October 2026, the active Noah review was upgraded to use the dedicated `dnc-v2-airtable.sh` helper for uniquely matched, explicit opt-outs only. The helper is idempotent and can change only `Status`, `Suppressed`, `Replied Date` and `Notes`; it cannot create drafts, send messages, modify other fields or resolve ambiguous wording. Telegram receives aggregate, redacted outcomes only. The exact live prompt is retained in `noah-dnc-v2-live-prompt-2026-10-09.txt`.

**First shadow outcome:** Noah correctly classified one explicit opt-out but reported an Airtable connection failure, so no automated CRM write occurred. The matching lead was manually verified and suppressed. This is a successful safety test of the no-write boundary, not evidence that autonomous suppression is ready.

## Verification

- Hermes gateway was active at deployment.
- The legacy daily email report was later paused because it could create drafts and make automatic Airtable changes. The daily model health check remains unchanged.
- The new job is scoped to inbox triage and Telegram delivery only.
- A direct dry run completed successfully on 9 October 2026.
