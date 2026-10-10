# NovaMerch Growth OS: path to A$10k monthly profit

**Created:** 8 October 2026
**Status:** Phase A measurement system is live and validated in production. The website sports-club CTA and admin intake endpoint were verified end-to-end on 9 October 2026. Noah's DNC review runs separately with least-privilege suppression access. No automated customer messaging has been enabled by this plan.

**Noah operating loop added (10 October 2026):** Hermes job `noah-weekly-growth-review` (`3a771b1d6b25`) now runs weekly on Monday morning Sydney time and delivers a redacted, read-only growth review to Telegram. It reports what changed, the earliest weak funnel stage and evidence, one highest-leverage next action, and safety/data blockers. It cannot send or draft messages, publish content, approve leads, edit Airtable, change statuses, use Monid, or expose customer identifiers or internal pricing/profit data. The existing weekday inbound/opt-out review remains separate.

**Inbound operations loop added (10 October 2026):** Hermes job `noah-inbound-enquiry-ops` (`ef73cce62e85`) now runs twice each business day (08:00 and 15:00 Sydney time during daylight saving). It checks new enquiries and buying conversations, prepares human-review reply/mockup/quote briefs, identifies 48-hour and seven-day follow-up due items, and reports missing attribution fields and next actions. It is draft-only and redacted: it cannot send, create Gmail drafts, edit Airtable, approve leads or change status. Same-day reply and one-business-day quote remain the owner’s send/approval step until a reviewed quote ledger and approval path are implemented.

**Permission-first prospect review (10 October 2026):** Airtable was inspected without changing records. The sports-club/academy search returned 25 non-suppressed candidates, but the current records contain no verified referral or requested-material basis; many are historical follow-up stages and some are already marked Do Not Contact. Ten high-fit call/introduction candidates can be selected from the non-suppressed set, but they remain `Contact permission pending` and must not be emailed or enrolled automatically. The next human action is to make permission-first phone calls or obtain introductions, then record the evidence before any material is sent.

**Profitability data guardrail (9 October 2026):** Internal profitability reporting now treats an absent supplier or transport cost as unknown. It displays `Not recorded` for dependent cost, profit, margin and GST fields rather than assuming a zero cost. This protects the A$10k profit goal from being managed against false margins.

## Implementation log — 8–9 October 2026

### Completed and verified

- Imported `NovaMerch - Weekly Growth Review (Read Only)` into n8n as workflow `HfQB0t06GPOArf2d`.
- Attached the existing Airtable credential and executed it manually. It reads Lead records only; it does not send email or modify any lead.
- The execution scanned **1,241** Lead records and produced a truthful baseline: 148 `Ready to Email`, 2 `Replied`, zero recorded quote requests/wins, and zero recorded quoted/won gross profit.
- Verified the local acquisition gates and inbound-control tests: **11 passing**. They cover consent/approval gating, duplicate dispatch prevention, business-day follow-ups, reply pause, opt-out/hard-bounce suppression and truthful reporting.
- Added the six missing fields to the live Airtable `Leads` table without changing any lead data: `Replied Date`, `Campaign ID`, `Copy Version`, `Quote Value`, `Quoted Gross Profit` and `Won Gross Profit`. Currency fields are formatted in A$.
- Updated and re-ran the read-only n8n review on 9 October. It completed successfully across **1,241** records and now reports that attribution fields are configured (with zero attributed records so far), rather than treating blank Airtable values as missing columns.
- Reconciled Cooks Hill across both bases: the Leads-table entry is only a historic `Follow-up 2` record, but the operations base verifies a separate 570-shirt paid order with A$6,218.18 revenue excl. GST and A$3,771.03 booked supplier cost. The benchmark card records the remaining cost and acquisition-evidence gaps.
- Added `Contact Basis` and `Suppressed` controls to the live Leads table. They default to blank/false, so no historic record is silently granted permission to receive email.

### Remaining Phase A operational gate

The measurement system is in place, but there are currently zero attributed quote or win records. The next legitimate quote, reply and won order must be recorded against its campaign and copy before the loop can identify a profitable channel. This is operational evidence to collect, not a system build defect.

### Next build: DNC v2 (scheduled only after shadow validation)

The previous Hermes daily-email job could identify opt-outs and set a lead to `Do Not Contact`, but it also created drafts and did not provide a reliable per-change audit trail. It was paused on 9 October 2026. Do not reactivate it.

Build the replacement as a dedicated, narrow workflow:

1. Read recent inbound messages only and classify only explicit opt-out language.
2. Match exactly one existing lead by normalised email address; ambiguous/no-match cases go to human review.
3. Before changing a record, re-check `Suppressed`, `Replied Date`, and status to make the operation idempotent.
4. Set `Status = Do Not Contact`, tick `Suppressed`, and append a timestamped source/thread reference. Make no other Airtable change.
5. Emit a redacted operator summary: count and outcome only, never customer content or identifiers.
6. First run is shadow mode: it produces candidate counts only. Compare those candidates manually with Gmail/Airtable, then enable write mode only after the owner accepts the result.

This is the next operational control to complete before any outreach volume increases.

### Controlled 20-account pilot — prepared 9 October 2026

The first campaign is defined in [the controlled pilot runbook](controlled-20-account-pilot-2026-10-09.md): `pilot-2026-10-clubwear`, a maximum of 20 individually approved sports-club accounts, with one factual offer and one copy version for the first 10. The local admin-panel selector now enforces matching segment, campaign, approval evidence, deduplication and the 20-account ceiling. It is intentionally not connected to a sender yet.

The first 10 accounts may be reviewed but **must not be dispatched** until DNC v2 has a least-privilege Airtable path and a successful shadow-to-write reconciliation. This preserves the user’s suppression-first rule while allowing research and campaign preparation to proceed.

The exact access boundary, prohibited actions and acceptance test are recorded in the [DNC v2 Airtable access specification](dnc-v2-airtable-access-spec-2026-10-09.md). The dedicated token is deployed only to the DNC helper, which is now the sole Airtable write path for Noah’s explicit opt-out handling. It passed a no-match read-only acceptance run and a live scheduled-job delivery check; the first unique explicit opt-out will validate the idempotent write path.

### Permission-first inbound funnel — built 9 October 2026

The public `lead-intake` endpoint now records the timestamped contact basis **Requested material via website enquiry** on each new inbound lead. It deliberately keeps the lead at `New`; it does not clear suppression, promote it to `Ready to Email`, or start an email sequence. This creates the cleanest near-term path to qualified sports-club opportunities while outbound permission evidence is collected.

The sports-clubs CTA now routes to the quote form with `utm_source=sports-clubs`, `utm_campaign=pilot-2026-10-clubwear`, and `copy_version=sports-clubs-v1`. The intake endpoint records the campaign and copy version with each new lead, so the weekly review can connect inbound demand to quote and win outcomes.

Both website and admin-panel production builds pass, and all 15 outreach and financial-integrity tests pass. On 9 October 2026, the sports-club CTA and admin intake endpoint were released to production. A labelled synthetic website enquiry returned successfully, was created in Airtable as `New` with its required contact basis, campaign and copy version, and was then deleted. No customer outreach was sent as part of this verification.

**DNC v2 acceptance — 10 October 2026:** To avoid using a prospect, a temporary `NovaMerch INTERNAL DNC TEST — DELETE` lead was created with a non-deliverable internal test address. The dedicated helper returned `suppressed`; verification showed only the allowlisted status/suppression/reply-date/audit-note changes. The record was then deleted and verified absent. This completes the helper’s shadow-to-write acceptance without touching a prospect. The first genuine opt-out will still be monitored separately for classification and idempotency evidence; cold email remains paused until the broader contact-basis and reply checks are also satisfied.

### What must not happen before the operational gate is cleared

- Do not publish the weekly workflow—it is deliberately kept unpublished until its destination/reporting route is agreed.
- Do not increase sending volume or automatically advance researched emails to `Ready to Email`.
- Do not treat the 148 existing `Ready to Email` records as approved under the new permission-first model without reviewing their contact basis and suppression state.

## Executive decision

Do not optimise for email sends. Optimise for **gross profit from repeatable, well-qualified orders**.

The existing automation reliably runs, but it is not a complete growth loop. It finds leads, sends initial messages and two follow-ups, and reports activity. It does not yet reliably: establish a permitted contact basis, stop after an inbound reply/bounce/opt-out, identify which campaign produced a quote, or measure order profit. More volume before those controls will mostly create more noise and risk.

The first growth wager is to reproduce orders with the economics and buying conditions of Cooks Hill. Cooks Hill is a benchmark, not a claim that every prospect is the same. Do not use its name, results, logo or images in sales material unless its permission has been confirmed.

## The financial model

Use gross profit after product, decoration, freight, payment fees, samples and directly attributable fulfilment costs. Do not call revenue profit.

```
orders needed per month = 10,000 / average gross profit per won order
pipeline gross profit needed = 10,000 / win rate from quote to won
```

Examples:

| Average gross profit/order | Orders/month for A$10k gross profit | Quotes/month at 25% quote-to-win |
|---:|---:|---:|
| A$500 | 20 | 80 |
| A$1,000 | 10 | 40 |
| A$2,000 | 5 | 20 |

Within two business days, complete the Cooks Hill benchmark card: revenue, all variable costs, gross profit, quantity, products, buyer role, purchasing trigger, lead source, sales cycle, objections, decision reason and expected reorder/referral value. Until that is done, the true order target remains unknown.

## Three simultaneous attacks

These attacks share one scorecard but should be measured separately. Do not let a high send count conceal a weak channel.

### Attack 1: reproduce the high-value order

Build a list of 30–50 **Cooks Hill lookalikes**: organisations with the same purchase trigger, approximate order size, local buying authority and realistic repeat potential. For each account, identify the use case first—season launch, staff onboarding, event, club registration, sponsorship, office opening, team refresh or client-handover program.

Use a one-page offer with a real next step: “Send your logo, approximate quantity and deadline; NovaMerch will return three viable options and landed-price ranges.” No invented delivery claims, price claims or unapproved customer proof.

Success metric: qualified quote requests and quoted gross profit, not opens.

### Attack 2: permission-first account outreach

The saved audit shows that found public email addresses are not sufficient permission for marketing in the current Brevo setup. Keep enrichment for research and routing, but make the first contact a permitted business call, introduction, inbound form, event conversation or customer referral. Only then record the specific contact basis and send agreed material.

Use a short call opener:

> Hi, this is [real representative] from NovaMerch in Newcastle. We help teams organise branded gear. Who normally looks after [relevant use case]? If they are reviewing it, would a couple of options and pricing by email be useful?

Required system behaviour:

- A lead cannot become `Ready to Email` without approved contact-basis evidence.
- Any reply pauses the entire sequence for human review.
- An opt-out, hard bounce or provider block suppresses every future campaign step.
- Every accepted send has a prospect ID, campaign ID, copy version, provider message ID and timestamp.
- Start at a maximum of 10 approved initial messages per business day. Raise the cap only after deliverability and response handling are demonstrably healthy.

Success metric: permissioned conversations that turn into a quote, rather than cold-list throughput.

### Attack 3: repeat, referral and partner distribution

This is the lowest-cost way to increase order quality.

- Ask every happy customer for two relevant introductions after delivery and again when the result is visible.
- Create a 60/90/180-day reorder prompt based on the buyer’s use case: new staff, season registration, event calendar, client gifting or uniform refresh.
- Establish referral relationships with event organisers, design studios, signwriters, web agencies, local business networks and sports administrators. Give each partner a clear, profitable use case—not a generic “send us leads” request.
- Track partner name, referred account, quote value, won revenue, gross profit and any referral cost. Pay or promise nothing until the arrangement and margin are approved.

Success metric: gross profit per acquired customer and reorder pipeline.

## The first 14 days

| Day | Outcome | Minimum human work | Automation/system work |
|---|---|---|---|
| 1–2 | Profit baseline and target order profile | Complete Cooks Hill card; set minimum gross-profit floor | Create scorecard rows; produce weekly snapshot |
| 1–3 | Safe prospect record | Confirm fields and one owner | Import disabled weekly review workflow; map credential |
| 3–5 | Viable initial offer | Approve two segment/use-case offers and real sender details | Store campaign/copy IDs; eligibility gate blocks unsafe sends |
| 5–7 | High-value account pilot | Research 30–50 lookalikes and make permitted first contacts | Deduplicate, track outcome and next action |
| 8–10 | Quote-speed test | Respond to all requests same business day; send quotes within one business day | Daily queue highlights unreplied/overdue records |
| 11–14 | Double-down decision | Review calls, quotes, margin and losses | Weekly review ranks channels/segments and names bottleneck |

## Required prospect and deal fields

Keep research, permission and sales outcomes distinct. `Email Found` is research status; it is not permission and it is not a sales stage.

| Field | Why it exists |
|---|---|
| Prospect ID; company; website/domain; location; segment; buying trigger; source URL/date | Qualification and dedupe |
| Contact name/role; contact channel; contact-basis type; evidence; date; scope; approved by | Contact control |
| Campaign ID; copy version; sender; provider message ID; activity timestamp | Attribution and safe retries |
| Sales stage; owner; last action; next action/date; reply type | Operational follow-through |
| Quote ID; quoted revenue; quoted gross profit; likelihood; close date | Forecasting |
| Won revenue; direct cost; gross profit; loss reason; reorder date | Profit learning |

Minimum stages:

`Research → Contact permission pending → Ready to Email → Emailed → Replied / Quote Requested → Quote Sent → Won / Lost / Nurture`

Suppress rather than recycle any record with a hard bounce, opt-out, do-not-contact status or a human reply awaiting review.

## Offers and controlled message tests

Test one variable per cohort. Keep the contact basis, segment, sender and send time stable while testing the subject/offer/CTA. Use 10–20 eligible contacts per cell before reading too much into a result.

| Test | Hypothesis | CTA |
|---|---|---|
| Outcome offer | A buyer responds better to a use-case solution than product range | “Would two options with landed-price ranges help?” |
| Deadline offer | A real event/season deadline increases relevance | “What date are you working toward?” |
| Low-friction mockup | A concrete branded visual reduces decision effort | “Send a logo and rough quantity; I’ll return three viable directions.” |
| Proof offer | Relevant, approved proof creates trust | “Would a comparable order plan be useful?” |

Never fabricate urgency, product availability, customer results, pricing or delivery dates.

## Funnel targets and decisions

Initial targets are operating thresholds, not predictions. Review them after the first 20–30 permissioned conversations.

| Funnel stage | Track | Decision if weak |
|---|---|---|
| Research | accounts qualified; duplicate rate; trigger evidence | Narrow the segment or improve sources |
| Permissioned contact | contact-to-permission rate | Improve call opener, partner/referral route or target buyer |
| Conversation | positive replies; meetings; response time | Improve relevance and CTA; reduce generic copy |
| Quote | quote requests; quote sent within one business day | Improve discovery and quote process |
| Win | quote-to-win; quoted GP; won GP | Fix offer, proof, price, payment terms or follow-up |
| Expansion | reorder/referral opportunities | Add a post-delivery and calendar-based sequence |

## Daily and weekly cadence

### Daily (45–120 minutes)

1. Work every active reply first; target a same-business-day response.
2. Review the due queue: calls, quotes, quote follow-ups, reorder prompts.
3. Research/qualify a small batch of high-fit accounts or partner prospects.
4. Record only factual outcomes, next action and expected gross profit.
5. Review the automated snapshot: zero sends is a signal to investigate, not a success condition.

### Weekly improvement loop (Monday 08:00 review; Friday decision)

1. Read the automated weekly report and score each source, segment, trigger, offer and copy version.
2. Find the earliest weak stage with enough data.
3. Write one hypothesis in this form: “For [segment with trigger], [offer/copy/process] will improve [metric] because [reason].”
4. Choose one experiment; set a cohort, owner, stop condition and date.
5. On Friday, label it `scale`, `iterate` or `stop`, with the data behind the decision.
6. Add the result to the experiment log. Preserve failures; they prevent repeated bad tests.

The system should spend 70% of capacity on the current winner, 20% on challengers and 10% on new discovery only after the funnel is functioning.

## Low-cost tool stack

| Function | Use | Incremental cost |
|---|---|---:|
| Workflow scheduler/reporting | Existing n8n on Railway | A$0 incremental |
| Prospect data during transition | Existing Airtable; migrate new activity ledger to Google Sheets only after backup/reconciliation | A$0 incremental |
| Mail delivery | Existing Brevo for approved/requested material | Existing plan |
| Call/reply handling | Existing monitored inbox and phone | A$0 incremental |
| Mockups/quote request | Existing NovaMerch mockup builder | A$0 incremental |
| Weekly scorecard | CSV template opened in Google Sheets | A$0 incremental |

Do not buy a lead database, paid ads, enrichment subscription or new CRM until a segment produces permissioned conversations, quotes and acceptable gross profit. A paid tool must displace measurable manual work or create profitable incremental orders.

## Importable automation package

This plan ships with two local files:

- `growth-os-scorecard-template.csv`: a Google Sheets-compatible scorecard.
- `n8n-novamerch-weekly-growth-review.workflow.json`: an **inactive** n8n workflow that reads the current Leads table and generates a truthful weekly operational snapshot. It does not send external communications or alter lead data.

Before activation, confirm the Airtable credential and the Lead table fields. The workflow uses existing `Status`, `Date Emailed`, `Follow-up 1 Sent`, `Follow-up 2 Sent`, `Replied Date`, `Quote Value`, `Quoted Gross Profit`, `Won Gross Profit`, `Campaign ID` and `Copy Version` fields when present. Missing fields are explicitly reported rather than silently treated as zero.

## Gates before scaling

Do not scale past the 10-per-business-day pilot until all are true:

- Contact basis and approval evidence is recorded for every send.
- Reply, bounce and opt-out handling has been tested end-to-end.
- No duplicate dispatch can occur on re-run.
- Sender identity, reply-to mailbox and phone details are current and monitored.
- Quotes show direct cost and expected gross profit.
- One segment has produced a consistent path from permissioned contact to quote.
- The weekly review is classifying results by source/campaign/segment—not only total sends.

## Phase B: Admin Panel Growth OS integration

**Decision:** This is deliberately postponed until the Phase A operating system has run successfully. Build it only after the manual/automation loop below is producing trustworthy records; a dashboard cannot recover data that was never captured correctly.

### Phase A exit criteria

Phase B starts only when all criteria have held for at least two consecutive weekly reviews:

- The permission, suppression and reply-pause controls have been tested on representative records.
- The Lead table contains consistent source, segment, campaign, copy version, owner, next action and sales-stage data.
- At least five quote outcomes have direct-cost and gross-profit data recorded.
- The weekly n8n review runs without an unaddressed field-mapping or data-quality blocker.
- The owner can explain the current funnel bottleneck from the scorecard without relying on total sends.

### Why it belongs in the panel later

The current panel's bootstrap API reads `Customers`, `Quotes`, `Orders`, `Invoices` and `Shipments`, and it already calculates downstream commercial data. It does **not** currently expose the prospect/lead pipeline. Importing raw outreach into Customers would pollute customer records and incorrectly imply a commercial relationship.

Phase B therefore adds a bounded Acquisition module:

```
Leads + Activity Ledger (Airtable)
          │ read-only bootstrap
          ▼
Admin Panel /growth
  Pipeline + due actions + experiment scorecard
          │ customer conversion only after a win
          ▼
Customers → Quotes → Orders → Invoices → Supplier costs → realised profit
```

### Minimal build scope

1. Add a `Prospect` domain type and an immutable `ProspectActivity` ledger. Reuse the existing `acquisition.ts` and `outreach-control.ts` eligibility logic rather than creating a second rule set.
2. Add Airtable mappers and a read-only bootstrap source for `Leads` and `Prospect Activities`. The panel must surface partial-load errors rather than showing zeroes as facts.
3. Add `/growth` with four views: pipeline by stage, due actions, experiment/segment scorecard, and data-quality alerts.
4. Allow an explicit `Convert to customer` operation only when a lead is won. Preserve the originating prospect ID, campaign ID and activity history as links or audit references.
5. Add a read-only weekly report endpoint for n8n. n8n remains the scheduler and event worker; the panel remains the human decision surface.

### Explicit non-goals for Phase B

- No automatic promotion from research/enrichment to `Ready to Email`.
- No autonomous sending, quoting, pricing or supplier-order creation.
- No duplicated CRM: Airtable remains system of record during the pilot.
- No paid CRM, data provider or model dependency.

### Acceptance checks before release

- A prospect with a reply, bounce or opt-out cannot appear in a sendable queue.
- Re-running an inbound event leaves one activity entry and one correct final state.
- A won prospect converts once, links to the resulting Customer/Quote/Order, and retains its acquisition attribution.
- Growth totals reconcile to Airtable and downstream won gross profit reconciles to the existing Orders/Supplier Orders data.
- Missing field/table data displays an error state—not a misleading `0`.
- Existing Customers, Quotes, Orders, financial calculations and CRUD tests remain green.

## Next decision needed from the owner

Confirm the Cooks Hill gross profit and whether NovaMerch has permission to use it as a named case study. That sets the concrete monthly order target and the first account-selection criteria.
