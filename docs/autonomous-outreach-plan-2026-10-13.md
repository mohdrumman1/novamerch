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
| Per-domain cap in sender 2 | Done 2026-10-14: `Domain Cap` node keeps one lead per business domain per run, free-mail exempt. No 90-day domain history check yet. Follow-ups unchanged | n8n `DePrEszDYXp5xgHL` |
| Templates table read, wedding variant in senders | Not built | |
| Qualifier (evidence gate, `Auto Promote`) | Started 2026-10-14: evidence fields added to Leads (`Evidence URL`, `Evidence Snippet`, `Relevance Tag`, `MX Valid`, `Qualified At`). Shadow workflow `e4nVghJRkqwkgfk2` imported inactive (repo JSON has no credentials; reselect the Airtable credential on import), tested on 10 leads (evidence only, no Status change). Active 2026-10-14, weekdays 09:30, 20 leads per run. `Auto Promote` is FALSE and nothing reads it. Leads `Status` has no `Proposed` choice yet | Airtable Leads `tbl1p7cvWR84ZjoKD` |
| Free discovery | Partly built 2026-10-14: n8n `Z4UxKs41HEMGtQAC` scrapes Northern NSW Football club contact pages weekly (25 clubs, created as `New`, tested, not yet activated). OSM Overpass checked: about 18 usable leads, not built. Other associations (netball, cricket) publish no club emails | n8n `Z4UxKs41HEMGtQAC` |
| Weekly improvement report | Built 2026-10-14 as n8n `AsOD8SQT5cCUN76F` (Mon 08:30, emails owner, logs to `Ops Log`, recommendations only, applies nothing). Manual run succeeded. Active | n8n `AsOD8SQT5cCUN76F` |
| Daily digest and alerts to the owner | Done: existing 6pm report email (workflow 6) plus new `Alert Gate` and `Alert Owner` nodes in workflow 8 that email on auto-pause or when Brevo event ingest is silent over 96h. Alert send accepted by Brevo in test; delivered per Brevo | n8n `xsWNfGMfMB6RL3hF` |
| Google Places lead finder (403) | Owner decision 2026-10-14: skipped | |

### Behaviour to know
- The three senders run `Get Settings`, then `Kill Switch Gate` (Code), then their original search. If the `Sending Enabled` row is missing, duplicated, or not exactly `TRUE`, the run throws and sends nothing.
- Health check pauses sending (writes `FALSE`, logs an `Ops Log` row of type `Pause`) when 7-day `hard_bounce` plus `blocked` events reach `Pause Hard Bounces Per 50 Sends` (2) or any `spam` event appears. It is a 7-day window, a deliberately conservative stand-in for "last 50 sends". Resume by setting `Sending Enabled` to `TRUE` after investigating.
- The synthetic hard-bounce test row was deleted by the owner on 2026-10-14.
- Brevo webhook URL path contains the shared secret. It is not recorded here; read it from the n8n workflow.
- The webhook workflow only logs hard bounce, soft bounce, blocked, spam, unsubscribe, invalid, deferred and error events; it suppresses the matching Lead for hard bounce, blocked, spam, unsubscribe and invalid.

## Out of scope
Fixing the Google Cloud 403 (owner), pricing, payments, fulfilment.

## Update 2026-10-14 (late)
- Feedback loop: n8n `IIXOVFIjd0YKbb0g` "12 Feedback Loop" (Mon 08:45). Aggregates the last 30 days of contacted leads by `Copy Version`, `Relevance Tag` and discovery source (reply, bounce, opt-out counts), writes the snapshot to `Ops Log`, emails the owner. Recommendations only; compares cohorts only once each has 15 or more contacts. Tested, not yet activated.
- Pending owner approval (blocked by the auto mode classifier as a safety weakening): activate workflows 9 (promotion gate) and 11 (NNSW discovery); waive the `Reply Ingest` unlock condition; set `Auto Promote` TRUE.
- Any unlock-condition waiver must be explicit and recorded in `Settings`, not implied.

## Update 2026-10-14 (owner authorisation)
Owner explicitly authorised, in chat: activate workflows 9, 11 and 12; waive unlock condition 2 (reply ingestion); set `Auto Promote` TRUE with a 5 per day cap. All done 2026-10-14.
- Workflows 9, 11, 12 active. Workflow 9 gate reads `Reply Ingest Waived` (Settings row, TRUE). Set it FALSE to restore the check.
- `Auto Promote` is TRUE. The gate promotes at most 5 leads a day, only `Club` or `Events` tagged leads with `MX Valid` and an evidence URL.
- The gate stays closed while any hard bounce, block or spam event exists in the last 7 days (Aqua Legal bounce on 2026-10-13 keeps it closed until about 2026-10-20).
- To stop everything: set `Auto Promote` FALSE (stops promotion) or `Sending Enabled` FALSE (stops all sends).
