# NovaMerch acquisition audit and low-cost redesign

11 September 2026 · Australia/Sydney · Prepared from Chrome, Claude desktop, Airtable and saved n8n executions.

**Subsequent changes:** six revised [email templates](outreach-copy-2026-09-11.md) have been published. The faults documented below remain unresolved. The [Hermes admin plan](hermes-admin-implementation-plan.md) adds the detailed admin design; [the documentation index](README.md) tracks current implementation status. Counts and execution results below remain dated inspection evidence.

**Updated decision: prioritise current mailbox enquiries, then the 305 enriched leads awaiting review.** The subsequent [acquisition and Hermes research](acquisition-research-and-hermes-plan.md) adds a live PHYX equipment enquiry, Swell order evidence, refusals, bounces and a historical Google project suspension. It moves independent fitness businesses above property agencies in the first pilot. Repair intake in parallel; do not buy another lead database or increase sending volume yet. This is a redesign and rollout specification, not a deployed replacement or a claim that customers have been acquired.

## What is actually happening

| Stage | Verified evidence | Consequence |
|---|---|---|
| Lead discovery | [Lead finder execution 1357](https://primary-production-7a32.up.railway.app/workflow/JqsHoiKlwSjUwdHb/executions/1357), September 11 at 14:00: HTTP 403 in `Find Leads From Google`. All ten displayed runs September 7–11 failed. | Fresh discovery is broken. The schedule itself fires. |
| Search queue | Airtable has 185 search rows. The failed execution receives 95 rows from `Get Next Search Term`. | Search ideas remain; an empty search queue is not the immediate problem. The node name/comment implying one search does not match its 95 inputs. |
| Lead storage | [Nova Merch Leads](https://airtable.com/appxYYtl9qnkcgUVx/tbl1p7cvWR84ZjoKD/viwHneBfKrcuwvk3X) has 1,241 leads. The base explicitly says its 1,000-record limit is exceeded and new records require an upgrade. | Repairing Google alone will not restore intake. Search Queue and other tables also occupy base capacity. |
| Enrichment | Claude Cowork `Enrich leads for novamerch` is active, daily at 08:10, now running in the cloud. Today's 08:11 result says no `Needs Review` + empty-email records remained. It reports 380 records without email, already classified. | Enrichment currently has nothing eligible to process. The 380 count is Claude's report, not an independently counted export. |
| Historical enrichment reliability | Claude history includes skipped local runs and several older failures. September 10–11 ran in the cloud. | The former local-computer dependency existed, but is not today's principal blocker. No need to replace the now-cloud schedule solely to solve laptop availability. |
| Review handoff | Exact Airtable filter `Status is Email Found` shows **305 leads**. Claude's instructions explicitly prohibit automatically setting `Ready to Email`. | A human review stage exists but has accumulated a substantial backlog. |
| Initial sending | [Execution 1354](https://primary-production-7a32.up.railway.app/workflow/DePrEszDYXp5xgHL/executions/1354), September 11 at 09:00: `AND({Status} = 'Ready to Email', {Email} != '')` returns no output. | The run is marked successful although no sending nodes execute. This is the directly verified reason for zero initial sends. |
| Follow-up 1 | [Execution 1355](https://primary-production-7a32.up.railway.app/workflow/FATcH49PudVff1g9/executions/1355), 10:00: zero eligible rows. Filter requires `Emailed`, a Date Emailed, and at least 4 days elapsed. Limit 30. | No first follow-ups are sent. |
| Follow-up 2 | [Execution 1356](https://primary-production-7a32.up.railway.app/workflow/Q8ciDwZpFCcN9HZe/executions/1356), 11:00: zero eligible rows. Filter requires `Follow-up 1`, its sent date, and at least 6 days elapsed. Limit 30. | The nominal Day 10 follows the actual first follow-up by six days; weekends or delays can push it later. |
| Daily report | [Execution 1350](https://primary-production-7a32.up.railway.app/workflow/PUiEIzFs9saJBTT1/executions/1350), September 10 at 18:00: 0 initial, 0 FU1, 0 FU2, 2 replies/interested, 305 email-found pending. | The report is running and producing zeros consistent with the send executions. |
| Misleading report copy | Its code turns `emailFoundPending > 0` into “they will be sent tomorrow at 9am.” | **This is false.** `Email Found` does not satisfy the sender's `Ready to Email` filter. Friday's report would also incorrectly promise Saturday sending. |

The Google node calls Places API (New) and contains a hardcoded API key. The saved error exposes only an Axios 403 and stack trace, not Google's explanatory response body. Disabled billing, API enablement, and key restrictions are possibilities, not a proven diagnosis. Do not remove restrictions or activate billing blindly. [Google setup requirements](https://developers.google.com/maps/documentation/places/web-service/get-api-key?authuser=19).

## Additional problems to address before scaling

- **No visible automatic reply suppression:** both follow-up workflows consist of a schedule, Airtable query, loop, Brevo send, and status update. No mailbox-check step appears. Another system might update statuses, but none was verified. The revised templates retain an opt-out instruction; reliably actioning it still requires a working inbound mechanism.
- **Uncapped initial queue:** the initial Airtable search has Return All enabled. Promoting all 305 leads could release the entire batch at the next run. Follow-up limits do not protect initial sending.
- **Duplicates:** Gleeson Civil Engineering appears twice with the same email, website, phone and address. A dedupe field exists but does not guarantee deduplication across historical records.
- **Mixed data:** Category contains long scraped metadata on newer rows. Enrichment notes can contradict old metadata such as `Email: To Find Manually`. Keep category, source, enrichment status and sales stage separate.
- **Potential endless enrichment retries:** Claude's instructions return website-found/no-email records to `Needs Review`. Use `No Email Found` or `Website Found` with a future review date and attempt limit instead.
- **Reporting measures CRM markings, not delivery:** Airtable Date Emailed counts are useful but do not prove delivery or replies are complete. The reported 2 replies/interested is not enough to calculate campaign conversion.

## Recommended stack and spending

| Component | Recommendation | Cost approach |
|---|---|---|
| Automation | Keep existing n8n on Railway | Existing bill continues; verify usage before adding workloads. No second scheduler platform. |
| CRM for prospecting | Use Google Sheets for the new prospect queue and activity ledger; leave the separate orders/admin base intact | No additional CRM subscription if existing Google account capacity is sufficient. Migration is a separate, deliberate cutover. |
| Short-term backlog | Review the existing Airtable records in place | No new subscription is needed to inspect the 305 records. Verify editing remains available before relying on writes. |
| Company discovery | Existing backlog first, then small batches from business websites, chamber directories and event exhibitor/sponsor pages | Manual research has time cost, but no lead-data subscription. Do not bulk-harvest email addresses. |
| Enrichment | Keep Claude for company qualification and checking contact details supplied by interested prospects | Existing subscription/usage limits apply. Process only selected records; avoid re-reading the full base daily. |
| Email | Keep Brevo for permission-based follow-up and requested material | Its free plan currently includes 300 sends/day; use a much smaller pilot. [Brevo free plan](https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan). |
| Proposals | Reuse the existing NovaMerch mockup builder and local catalogue generator | No new design SaaS is necessary. Confirm prices, quantities and delivery feasibility with suppliers. |

**Pilot budget: A$0 in additional subscriptions.** Existing hosting, Claude, mailbox, phone and labour costs remain. Samples, postage and travel are optional costs to approve separately. A paid finder/verifier is not justified until selected companies are converting and contact verification is demonstrably the bottleneck.

Retaining Airtable on a paid plan is a valid convenience option, but it is not the lowest-cost default. Splitting or deleting records just to get under the free limit creates maintenance and suppression risks. Preserve all suppression and contact history during any migration.

Google Places can remain an optional company-discovery source after its account issue is understood. Billing depends on requested fields, and quotas should bound consumption. Its storage policies also constrain how Places content can be retained; do not assume unlimited CRM copying is permitted. [Usage and billing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing), [Places storage policies](https://developers.google.com/maps/documentation/places/web-service/policies?authuser=31&hl=en).

## Acquisition approach for Newcastle and Sydney

Start with two offers, not every business category:

| Segment | Buying situation to verify | Offer to discuss | Buyer role |
|---|---|---|---|
| Newcastle/Hunter builders and trades | Team growth, uniform replacement, project completion | A small coordinated team kit: cap, work shirt and bottle, with a repeat-order option | Owner, office manager or operations manager |
| Newcastle and Sydney independent property agencies | Settlement gifts, office rebrand, recurring client handovers | A consistent branded handover/gift pack with supplier-confirmed quantity options | Principal, operations or marketing manager |
| Secondary: commercial gyms and studios | Member challenge, event or member merchandise | Staff kit or a preorder-based member range | Owner/manager |

These are test hypotheses, not proven demand. Prefer a visible use case, a reachable decision maker and a near-term need over Google review counts. Large chains with central procurement should generally rank below independent local operators during the pilot.

Research sources for additional companies include [CBD Sydney Chamber's directory](https://business.cbdsydneychamber.com.au/list), [North Sydney Business Chamber](https://northsydneybusinesschamber.org.au/member-directory), and regional business networks. Use listings to identify relevant businesses and their official sites; directory inclusion is not permission to send marketing.

Three backlog candidates whose business activity was checked on official websites:

| Business | Verified fit | Next action |
|---|---|---|
| [Jedabuild](https://jedabuild.com.au/) | Newcastle/Hunter builder offering renovations and extensions | Check current buying contact and team-kit interest. Airtable's old website redirects; revalidate the old named email before use. |
| [Arnold Property](https://arnoldproperty.com.au/) | Newcastle property sales and rentals | Discuss whether settlement/client packs are a current need. |
| [P & D Kay](https://pdkayconstructions.com.au/) | Maitland/Hunter custom homes and renovations | Secondary geography candidate for team kits or client handover gifts. |

These are qualification candidates, not approved recipients. No new emails were sent or contacts marked ready.

## Email sourcing and outreach handoff

Brevo explicitly prohibits contacts acquired by copying publicly visible email addresses from websites or social networks. Its B2B allowance for non-personal addresses does not erase that prohibition. The current enrichment-to-Brevo design conflicts with that policy. [Brevo contact policy](https://help.brevo.com/hc/en-us/articles/213405965-Build-a-legitimate-contacts-database-for-optimal-deliverability-and-compliance).

Use company research to select accounts, then obtain a contact and permission through a permitted business call, an introduction, a meeting or a website request. Record who agreed, when, how, and the specific material requested. Public availability alone must not automatically grant `Ready to Email`. Australian marketing email requires consent, identification and an unsubscribe mechanism; do not send a marketing email merely to ask for consent. [ACMA guidance](https://www.acma.gov.au/avoid-sending-spam).

For calls, use verified business contact details, check applicable Do Not Call requirements for mobile/mixed-use numbers, identify the caller and purpose, and end when asked. Weekday business hours are the pilot default. [ACMA calling rules](https://www.acma.gov.au/say-no-to-telemarketers), [Do Not Call Register](https://www.acma.gov.au/do-not-call-register).

Suggested call opener for the actual NovaMerch representative:

> Hi, this is [name] from NovaMerch in Newcastle. We supply branded team gear. Who looks after your work shirts and caps? If you're reviewing them, would two options and pricing be useful by email?

After agreement, confirm the address and scope. A phone-only record is a potential conversation, not necessarily a failed lead. Do not recycle records marked Do Not Contact.

Suggested email after a requested follow-up:

> Subject: Team gear options for [business]
>
> Hi [name],
>
> Thanks for speaking with me. As discussed, I'll put together options for [specific use case].
>
> Roughly how many people/items do you need, and is there a date you're working towards? If you have a logo file handy, please send it through.
>
> I'll confirm the products, pricing and lead time before you commit.
>
> [Actual representative name] · NovaMerch · [monitored contact details]
>
> If you'd prefer no further follow-up, reply “no thanks.”

The existing construction template sends as Nick Milford from support@novamerchau.com. Preserve the real representative identity; do not silently switch the sender to the account owner. Monitor that mailbox. Keep initial material short, with one use case and one next step. Do not promise prices, delivery dates or completed mockups before they exist.

## Workflow redesign

Use a single prospect ID and maintain separate fields for `research_status`, `sales_stage`, `consent_status` and `suppressed`. Retain old Airtable record IDs for traceability.

Minimum fields: business name, normalized website/domain, location, segment, fit evidence URL/date, contact name/role, email, phone, contact source, consent evidence/date/scope, owner, research status, sales stage, last/next action timestamps, campaign ID, suppression reason, provider message ID.

An append-only activity ledger records attempts, accepted sends, delivery events, replies, quotes and wins. Match duplicates by normalized email and domain/phone, while retaining deliberate branch relationships. Never merge unrelated branches solely because a corporate domain matches.

1. **Discover companies:** a small weekday batch, prioritised Newcastle then Sydney. Skip existing companies and suppressed contacts. Retry transient failures with a cap; store source errors separately from “no matches”.
2. **Qualify:** process only unreviewed companies; verify geography, use case and official source. AI writes a draft qualification, never consent. Assign an owner and next action.
3. **Review/contact:** surface a manageable daily queue. Positive permission or a requested quote moves the lead into an eligible outreach state; a researched email by itself does not.
4. **Send:** one controlled dispatcher, explicit daily cap of 10 initial messages during the pilot. Re-read consent and suppression immediately before each send. Write a pending activity, send once, record provider ID and accepted time. Reconcile ambiguous timeouts rather than blindly retrying. Sending success is distinct from delivery.
5. **Replies/events:** process monitored-mailbox replies plus Brevo bounces, complaints and unsubscribe events before subsequent follow-ups. Any human reply pauses the sequence for review; opt-outs and hard bounces suppress across campaigns. Do not depend on an AI sentiment decision to honour “no”.
6. **Follow-up:** no more than two relevant reminders for the agreed material, subject to consent scope, due date and no reply. Pilot timing: four days, then six more days, shifted to business days. Requested quotes get an owner and agreed next action instead of generic nurturing.
7. **Report:** at 18:00 Sydney time show discovery health, added leads, research backlog, awaiting approval, approved queue, accepted/delivered/failed sends, replies today, quote requests, quotes sent and wins. Error alerts must identify the failed stage and owner. Zero is a valid count, not a healthy-pipeline verdict.

Correct report wording now:

> 305 leads have an email found and require review. They are not scheduled to send. The sender only selects approved “Ready to Email” leads. Today's initial send query found none. Lead discovery is failing with HTTP 403, and Airtable is over its record limit.

The accompanying `daily-report-node-draft.js` is a drop-in draft for the existing Build Report node that fixes the misleading approval claim without pretending to measure discovery health, delivery or the ready queue. It has not been installed or published.

## First five business days

| When | Work | Measurable output |
|---|---|---|
| Day 1 | Review the two CRM replies/interested first. Triage 30 of the 305 enriched records for Newcastle builders/property agencies. Check duplication and previous contact. | 10 prioritised accounts with an owner and specific next action; warm opportunities answered by the representative. |
| Day 2 | Make permitted business calls or seek introductions; capture requested material and consent. Prepare two tightly scoped offers using existing products. | Actual conversations and requests recorded; no assumed conversion target. |
| Days 2–3 | Deliver requested mockups/quotes, confirm supplier costs, and agree the next follow-up. | Quote requests and response time measured; aim to acknowledge within the same business day. |
| Days 3–4 | Implement the capped dispatcher, reply suppression and truthful reporting in a disabled draft; migrate prospecting storage with validation. | Dry-run results and counts reconciled before cutover. |
| Day 5 | Review conversations, requested quotes, margin and orders by segment. Add 10–20 Sydney accounts only if the offer and fulfilment process work. | Choose the next segment based on outcomes, not emails sent. |

Operating targets are inputs, not guarantees: review about 10 qualified accounts/day, keep the new-send pilot at 10/day, and reserve time for quote turnaround. Customers and revenue cannot be guaranteed by automation. Do not buy paid traffic until the offer and response handling are working.

## Acceptance checks and rollout gates

- Export and reconcile all 1,241 lead records, all 185 search records, links, consent/suppression information and activity dates before storage cutover. The UI CSV download was requested during this audit, but a complete local backup was not verified.
- Keep existing production sending unchanged during draft work. Never run a whole live workflow as a test.
- Duplicate import twice produces one prospect and no duplicate outreach.
- `Email Found`, missing consent, blank email, suppressed, replied, bounced and already-sent test records are ineligible.
- 305 queued records cannot exceed the explicit daily cap. Concurrent or repeated runs cannot resend the same campaign step.
- Simulated provider timeout enters reconciliation; it does not trigger a blind second send.
- A “no thanks” reply prevents all future campaign steps and is honoured across duplicates.
- Empty queues still produce a truthful report. A lookup failure is surfaced as an error, not converted to zero.
- Verify Australia/Sydney scheduling across weekdays and daylight saving. Do not rely on the lead finder's node label for its actual timezone.
- Validate one approved test recipient, accepted ID, delivery event, reply and suppression before enrolling real prospects. This external test send has not been authorised or performed in this audit.
- Preserve the orders/admin Airtable base and its application mappings. Prospect migration must not accidentally replace order fulfilment storage.

## Scope and remaining uncertainty

Inspected: all five NovaMerch n8n workflows, saved discovery/sending/report executions, Claude schedule/history/instructions/latest run, Airtable lead and search tables, current construction email, and local product/quotation process documentation. Airtable's temporary inspection filter was removed and the original 1,241-row view restored.

Subsequent mailbox review found a May 4 suspension notice for `nova-merch-n8n` and an appeal receipt, plus current and historical commercial conversations. The key-to-project relationship and current suspension status remain unverified, so the exact 403 cause is still open. See the linked follow-on research for details. Full mailbox-to-CRM reconciliation, Brevo account health/deliverability, total duplicate count, campaign conversion/revenue, complete backup and other integrations remain unverified. No messages were sent, paid tools purchased, workflows published or leads approved during the audit stage. Later work published six revised email templates only; that publication is recorded separately and does not establish restored sending.
