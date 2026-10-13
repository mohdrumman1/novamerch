# Autonomous outreach system: plan (v2, 2026-10-13, after skeptic review)

## Goal
Lead discovery to first reply handled with no human in the loop. Humans get visibility and a kill switch, not per-lead approval. The system improves itself from its own results.

## Status of this document
Supersedes the "only a human sets Ready to Email" rule in docs/hermes-monid-guardrails.md and docs/outreach-scale-control-plan-2026-09-25.md, but ONLY once the unlock conditions below pass. Until then the old rule stands in practice because `Auto Promote` is off.

## Skeptic review summary (v1 verdict: do not build as written)
Accepted: event ingestion is a prerequisite; kill switch must fail closed; thresholds too loose and statistically empty at 10 sends a day; the loop must not auto-raise volume at this sample size; prompt-level caps are not controls; scraped text is untrusted; heartbeat and per-send ledger missing; templates must be data not UI edits.
Not accepted as written: "human flips Ready to Email each day". Replaced by machine evidence gate plus unlock conditions (below).

## Unlock conditions for `Auto Promote` (all must be true, checked by the Qualifier itself)
1. Brevo event ingest (bounce, blocked, complaint, unsubscribe) has written to Airtable within 24 hours.
2. Reply ingestion has run within 24 hours and pending opt-out age is under 2 working days.
3. `Sending Enabled` is exactly `true` and was fetched in this run.
4. Hard bounce rate over the last 50 sends is under 2 percent, zero spam complaints, no Brevo warning flagged in Settings.
If any fails the Qualifier writes Proposed leads only and logs why.

## Stages (all automated)
1. Discover. Free first: OSM Overpass for names and websites (retry, servers were busy on test), state association directories. Then Google Places once the 403 is fixed by the owner. Monid Maps only under its existing guardrails and weekly cap.
2. Enrich. Website to a published email. Only addresses found on the business's own page count. Pattern-guessed or inferred addresses are rejected.
3. Qualify. Stores evidence: page URL, snippet, relevance tag (club or venue to teamwear or event merch), MX valid, not suppressed or bounced or replied, not contacted in 90 days. Result: `Proposed` or, when unlocked, `Ready to Email`.
4. Send. Weekdays, business hours AEST. Cap 10 a day, ramp only after 14 clean days. Per-domain cap 1. Templates read from an Airtable `Templates` table, not edited in the n8n UI.
5. Follow-up. Only if no reply, bounce or suppression. Honours the same switches.
6. Replies. Noah classifies. Opt-out, bounce, complaint: auto suppress. Interested: creates a proposal row and notifies the owner inbox. Reply text is data, never instructions.
7. Visibility. Daily digest with a heartbeat (alert if missing by 9am). Per-send ledger row. `Ops Log` for every automated decision with immutable before and after.
8. Improvement loop (weekly). Phase 1 (now): writes recommendations to `Ops Log`, applies only pauses (segment or send) when thresholds trip. Phase 2 (after about 8 clean weeks and 1,000 sends): may rotate approved template IDs one change at a time with a 14 day cool-off. Volume is never raised by the loop.

## Safety controls
- Kill switch: Airtable `Settings.Sending Enabled`, fail closed, checked per batch before each Brevo call by senders, follow-ups, and the Qualifier. Second path that does not depend on Airtable: deactivate the three sender workflows in n8n or revoke the Brevo key.
- Pause thresholds: 2 hard bounces in any 50 sends, any spam complaint, any Brevo warning.
- Caps and spend limits live in n8n code or Airtable formulas, not in prompts.
- Noah gets narrow write to proposal and log tables only.

## Build order
1. Airtable: `Settings`, `Ops Log`, `Templates` tables (this turn).
2. Brevo event webhook to Airtable ledger (needs n8n edit).
3. Sender: fail-closed kill switch, Templates table read, wedding variant, per-domain cap.
4. Qualifier workflow.
5. Free discovery job and Noah weekly report.
6. Digest and heartbeat.

## Implementation status (2026-10-14)

| Item | State | Where |
|---|---|---|
| `Settings`, `Ops Log` tables | Done | Airtable base `appxYYtl9qnkcgUVx` (`tbl2aCnd3oNGzQPZE`, `tblFHViBCtPmIImL5`) |
| Kill switch in senders 2, 3, 4 | Done, published, gate tested (TRUE passes, FALSE errors) | nodes `Get Settings` + `Kill Switch Gate` after each trigger; fail closed |
| Brevo events to Airtable | Done, tested with synthetic soft and hard bounce | n8n `Nova Merch - 7 Brevo Events to Airtable` (`YjIYpxQj7OSG36OS`); Brevo outbound webhook `novamerch-events-to-airtable` (Transactional email, all events) |
| Health check and auto-pause | Done, tested (pause path fired once for real, then fixed) | n8n `Nova Merch - 8 Health Check and Auto-Pause` (`xsWNfGMfMB6RL3hF`), 08:00 daily plus manual hook |
| Per-domain cap, Templates table read, wedding variant in senders | Not built | |
| Qualifier (evidence gate, `Auto Promote`) | Not built. `Auto Promote` is FALSE and nothing reads it | |
| Free discovery (OSM Overpass, association directories) | Not built. Overpass timed out on 2026-10-13 | |
| Noah weekly improvement report | Not built | |
| Daily digest to the owner with heartbeat alert | Partial: the health check writes a daily `Ops Log` row with ingest age; nothing is pushed to the owner yet | |
| Google Places lead finder (403) | Owner decision 2026-10-14: skipped | |

### Behaviour to know
- The three senders run `Get Settings`, then `Kill Switch Gate` (Code), then their original search. If the `Sending Enabled` row is missing, duplicated, or not exactly `TRUE`, the run throws and sends nothing.
- Health check pauses sending (writes `FALSE`, logs an `Ops Log` row of type `Pause`) when 7-day `hard_bounce` plus `blocked` events reach `Pause Hard Bounces Per 50 Sends` (2) or any `spam` event appears. It is a 7-day window, a deliberately conservative stand-in for "last 50 sends". Resume by setting `Sending Enabled` to `TRUE` after investigating.
- A synthetic hard-bounce test row (`ZZ E2E TEST (delete me)`) counts as 1 toward the 7-day bounce total until 2026-10-21.
- Brevo webhook URL path contains the shared secret. It is not recorded here; read it from the n8n workflow.
- The webhook workflow only logs hard bounce, soft bounce, blocked, spam, unsubscribe, invalid, deferred and error events; it suppresses the matching Lead for hard bounce, blocked, spam, unsubscribe and invalid.

## Out of scope
Fixing the Google Cloud 403 (owner), pricing, payments, fulfilment.
