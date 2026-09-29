# NovaMerch outreach scale-control plan

25 September 2026 · Australia/Sydney

## Plain-English summary

| Question | Answer |
|---|---|
| What do we have now? | A working weekday email workflow, Airtable search queue, n8n automations, Brevo delivery, and a local control module. We also have a strong local proof point: the 570-shirt Cooks Hill United FC order. |
| What is missing? | A reliable approval record, suppression/event ledger, inbox reconciliation, and a regional demand-generation system. |
| What must happen first? | Make consent/contact basis, replies, opt-outs, bounces and approvals visible and authoritative. Do not increase sending volume yet. |
| Where do we start? | Newcastle and Maitland clubs, sponsors and uniform-heavy businesses. |
| When do we expand? | After 90 days of measurable local results and five consecutive clean sending days. Then test one Sydney segment, not all of Sydney. |

## Current live finding

The current workflow is operating, but it is not ready to scale by simply increasing its send limits.

- The weekday sender recorded 10 initial emails per business day from 18–25 September and 10 first follow-ups on 21, 22 and 25 September: **90 recorded sends** across the six daily reports reviewed.
- Today's report recorded 20 sends (10 initial, 10 first follow-up), 10 `Email Found` leads awaiting review, and only 2 replies/interested leads in the CRM total. It explicitly does not measure delivery, bounces, or inbox replies that have not reached the CRM.
- The business inbox contains recent negative replies that do not appear safely reconciled to that report, including at least two explicit “no thanks” messages. Treat inbox-to-suppression ingestion as unproven.
- The `Nova Merch - 1B Email Enrichment Review Queue` workflow has a schedule trigger and a safe `Email Found` stopping point, but its recent execution history ends on 15 September and includes an error. The import artifact in this repository is intentionally inactive.
- Airtable has 185 queued discovery segments. The active Search Queue includes many `Ready` and `Run` items, but its current grid does not visibly expose the consent, suppression, verification, approval, or send-ledger fields needed to make a sender decision safely.

The immediate bottleneck is therefore **qualified, documented approval**, not finding more search terms or lifting the sender cap.

## Non-negotiable send gate

Replace the sender's current `Status = 'Ready to Email' AND Email != ''` selection with a single saved Airtable view or formula that requires all of the following immediately before each send:

1. Valid business email and a stable dedupe key (email first, then domain/phone/business-location).
2. `Research Status = Qualified` and `Sales Stage = Ready to Email`.
3. An approved, recorded contact basis: `Consent Status` plus `Consent Evidence`, date and approver. A discovered public mailbox is not consent.
4. `Suppressed != true`, no opt-out, no hard bounce, and no recorded human reply.
5. A named campaign/version, exact approval timestamp, and no existing `prospect + campaign + step` dispatch key.
6. For a follow-up, a recorded initial acceptance, the relevant business-day delay, and no new inbox event since the previous send.

If any field is absent, stale, or ambiguous, exclude the lead and create a visible exception instead of falling back to `Needs Review`.

This is consistent with the local, tested `admin-panel/src/lib/acquisition.ts` eligibility model. The live n8n sender must enforce the same conditions itself; a separate local module does not protect a Brevo send.

## Controlled pipeline

```text
Approved Search Queue item
  -> discovery (existing tool first; Monid only under its separate guardrails)
  -> Website Found | Rejected Source
  -> Hunter enrichment + verification
  -> Email Found | No Email Found
  -> human qualification and recorded contact basis
  -> Ready to Email
  -> sender re-check + ledger write
  -> initial / follow-up sequence
  -> inbox + Brevo events -> reply, bounce, opt-out suppression
```

`Needs Review` is exception-only: every use needs a resolver, owner, due date and a forced exit to `Website Found` or `Rejected Source`. Discovery and enrichment never set `Ready to Email`; Monid never changes a lead's sending, consent, suppression or sales-stage fields.

## Build order

### 1. Make events authoritative before scaling

Create an Airtable activity ledger (or equivalent separate table) with immutable rows for every discovery, enrichment, approval, send-attempt, accepted-send, reply, bounce and opt-out event. Required identifiers are lead ID, normalized recipient, campaign ID, step, provider message ID, timestamp, source, and outcome.

Wire two inbound paths into that ledger:

- Brevo accepted/delivered/bounced/blocked events.
- Gmail/AgentMail inbox events, with a deterministic matcher to the recipient address and campaign thread.

Any reply pauses all remaining sequence steps. An opt-out sets suppression and must be actioned inside five working days. Keep the sending workflow disabled for that recipient until a human resolves the event. This is an operational and legal control, not an LLM classification problem.

### 2. Repair the enrichment handoff

Replay the 15 September enrichment failure against one pinned, non-sendable test lead. Confirm the workflow produces exactly one enrichment activity row and may write `Email Found` or `No Email Found`—never `Ready to Email`.

Then enable it at **10 domains per weekday**, only after its output and the review fields have been checked. It should be an input source for human review, not a direct feeder into Brevo.

### 3. Create a real approval queue

Add/standardise these fields before any cap increase:

- `Research Status`, `Sales Stage`, `Normalized Domain`, `Dedupe Key`
- `Email Verification Status`, confidence, source URL, source date and attempts
- `Consent Status`, evidence, date, approver and expiry/recheck date
- `Suppressed`, reason, reply date, bounce date and latest provider event
- `Campaign ID`, copy version, approval timestamp and `Dispatch Key`

The review view contains only leads with complete qualification evidence; it must make unresolved items visibly unselectable, not merely label them `Needs Review`.

### 4. Introduce a measured volume ramp

Keep the current 10-new-lead cap until five consecutive business days show all of these: ledger reconciliation is complete, zero duplicate dispatches, zero unprocessed opt-outs/bounces, and delivery/reply metrics are available by campaign step.

After that, raise **new initial sends only** in steps of 5 per business day (10 → 15 → 20). Hold each step for five business days. Do not raise it if hard-bounce rate exceeds 2%, complaint/unsubscribe rate rises materially, an event is missing, or approvals cannot keep up. Follow-ups remain at their own cap and must respect the same event gate.

## Practical copy and measurement improvements

- Keep the segment-specific first message, but test one variable at a time: subject line *or* offer/CTA, never both in the same cohort.
- Persist a copy version on every send so results can be compared by segment and template.
- Report accepted, delivered, bounced, replied, positive reply, opt-out and quote-request rates separately. Do not use “sent” as a delivery claim.
- Reconcile the signature: current initial and follow-up templates contain different phone numbers. Use one confirmed business identity before new variants are published.

## Regional growth and advertising plan

The outreach system should create demand from several low-cost sources. Email is only one channel, and it must remain permission-led.

## Customer problems NovaMerch can solve

NovaMerch should sell relief from a difficult project, not simply branded products. Research into club and uniform purchasing consistently identifies the same friction: volunteers and coordinators must collect sizes, manage sponsor artwork, compare unclear quantities and pricing, get approvals, protect delivery dates and handle repeat orders. Business buyers face the equivalent problems of brand consistency, fit, staff changes and replenishment. [Club ordering challenges](https://gamedayapparel.com.au/what-clubs-should-know-before-ordering-custom-sportswear-in-australia/) · [Uniform buying challenges](https://conceptpartners.com.au/2026/06/29/choosing-a-company-uniform-supplier/) · [Artwork approval and delivery risk](https://zigaflow.com/insights/after-the-quote-why-promotional-merchandise-orders-go-late)

| Customer pain point | Plain-English NovaMerch answer | What must be true internally |
|---|---|---|
| “I do not know what to order.” | A short, practical shortlist matched to the audience, budget and use case. | Maintain a curated product shortlist by segment, not an unfiltered catalogue. |
| “I need to see it before I commit.” | Three logo mock-ups and a clear quote before an order decision. | Mock-up request is received, owned and answered quickly; record version and approval. |
| “I am coordinating sizes, players, staff and sponsors.” | One structured order brief: quantities, sizes, sponsor/logo files, names/numbers and deadline. | Use one intake checklist and one named owner; never rely on loose email threads. |
| “I cannot risk a late or wrong delivery.” | Confirm the real production and delivery plan before promising a date. Give visible milestones after approval. | Supplier availability, artwork approval and shipping status are recorded per order. Do not make unconfirmed turnaround claims. |
| “The budget is unclear.” | Quantity-break options and a clear recommendation, including what changes cost and timing. | Quotes show scope, quantity, setup/freight assumptions, expiry and exclusions. |
| “Reordering is a pain.” | Keep approved artwork, product, colour, decoration and order history so the next order starts faster. | Save an approved specification and a reusable order record after every successful job. |
| “Our brand will look inconsistent.” | Match the product and decoration method to the real use, logo and brand requirements. | Confirm artwork quality, garment/product suitability and final proof before production. |
| “I do not have time to chase suppliers.” | One accountable NovaMerch contact from brief through delivery. | A customer-visible owner, next step and status update at every order milestone. |

### Position the Cooks Hill result correctly

The completed 570-shirt Cooks Hill United FC order is proof that NovaMerch can coordinate a meaningful local club order. Turn it into a short case study focused on the customer problem solved: order scale, organisation, final result and club outcome. Obtain written permission before using names, logos, images, testimonial language or any order details beyond the approved statement.

## How customers will arrive at scale

Scale comes from a repeatable system, not from one-off messages or automatic advertising. Build the following loop, then improve one stage at a time:

```text
Local proof / referral / search / small ad
  -> one focused landing page or lead form
  -> Airtable lead record + immediate acknowledgement
  -> human qualification and booked next step
  -> mock-up + quote
  -> artwork approval + supplier-confirmed production plan
  -> delivery and status updates
  -> review, case study, repeat order and two introductions
```

### What already exists

- The public site already offers a free mock-up pack: three product ideas, logo mock-ups, rough pricing guidance and supplier handling.
- The Mockup Builder creates quote requests that are written to Airtable and sent to the NovaMerch admin inbox.
- Airtable is the operational source of truth for customers, quotes, orders, invoices, shipments and supplier orders.
- n8n and the controlled outreach code provide a base for routing and safety controls.

### What must be built or standardised

1. **One conversion path per campaign.** Every post, referral or ad points to a segment-specific page/form, for example `Club kit planning`, `Branded workwear` or `Event merchandise`.
2. **Fast lead ownership.** Airtable assigns an owner and a due time on form receipt. The owner either qualifies the request or asks the minimum needed questions within one business day.
3. **A standard brief.** Capture customer, segment, product purpose, quantity, budget, deadline, artwork, sizes/names/numbers, delivery address and approval contact.
4. **A quote-to-order checklist.** No supplier order until product, quantity, decoration, artwork proof, price, payment terms and delivery plan are approved and recorded.
5. **A delivery board.** Every paid order has a named owner and visible dates for supplier confirmation, artwork approval, production, dispatch, tracking and delivered status.
6. **A post-delivery loop.** At delivery, request a review, permission for a case study and two introductions. Save the final specification for reorders.

### Advertising automation: what it is and is not

Advertising automation should automate routing and measurement, not pretend to automate trust or judgement.

| Stage | Automated action | Human decision |
|---|---|---|
| Ad / local content | Run one approved campaign with fixed geography, audience, offer and spend cap. | Approve creative, offer, budget and stop/scale decision. |
| Lead capture | Form writes a complete Airtable record and sends a confirmation. | Check whether the request is a genuine fit and urgent. |
| Lead routing | Assign owner, create a same-day task and tag source/campaign. | Choose the right product path and next contact. |
| Follow-up | Remind the owner of unworked leads and stalled quotes. | Send a personalised response; do not auto-send marketing email without recorded basis. |
| Reporting | Record source, cost, quote, order and margin by campaign. | Decide which segment/offer to repeat, improve or stop. |

Use existing n8n/Airtable infrastructure for lead routing and reminders. Keep paid-ad targeting, creative changes and budget changes human-approved. Start with a maximum of one paid test at a time so results are understandable.

### First advertising experiment

- **Audience:** Newcastle and Maitland club decision-makers first, then one uniform-heavy business segment.
- **Offer:** “Free club/teamwear mock-up and quantity-break quote” or “Free branded uniform shortlist.”
- **Channel:** one 14-day Meta lead-form or landing-page test at A$10–20/day. Google Search comes second, once dedicated local-intent pages exist.
- **Measurement:** source → qualified enquiry → mock-up/quote → order → gross margin. Do not optimise for impressions, clicks or email addresses.
- **Decision:** keep a campaign only when it produces qualified quote opportunities at a cost that leaves room for expected gross profit. Otherwise stop it and test one changed variable.

No pricing, delivery timing, Australian-made status or product availability should appear in advertising unless confirmed for that campaign and product.

## Lessons from the linked client-acquisition video

The linked video is [“$20K–$100K/mo Agency Owners Share How They ACTUALLY Get Clients (2026)”](https://www.youtube.com/watch?v=JOCR2pL6kTI). The transcript contains useful acquisition patterns, but also tactics that are unsuitable for NovaMerch. The adaptation below is the part worth implementing.

### Use these ideas

1. **Productise the first step.** “Free mock-up pack” is easier to understand and measure than “we sell merchandise.” Give each segment one concrete first deliverable.
2. **Use warm visibility before cold scale.** Publish a clear personal LinkedIn/Instagram/Facebook post that says what NovaMerch does, who it helps and what the first step is. Ask friends, past colleagues, customers and club contacts for introductions.
3. **Choose three adjacent niches.** For the first local sprint, use sports clubs, club sponsors and uniform-heavy local businesses. They share contacts and referral paths without being identical buyers.
4. **Show the work.** Make short “build with me” demonstrations: turning a club logo into three mock-ups, preparing a sponsor pack, checking a sizing/order brief, or explaining how a 570-shirt order is coordinated. Demonstration is stronger than generic advice.
5. **Make local proof visible.** Use Cooks Hill United FC, with permission, in a Newcastle/Maitland case-study post. A local landmark, local customer and specific deliverable make a small ad or organic post feel credible.
6. **Ask for referrals at the moment of satisfaction.** After a delivered order, approved mock-up or positive check-in, ask: “Who are two clubs or local businesses that might need this?” Use a three-way introduction where possible, not a scraped contact list.
7. **Respond quickly, without making unsafe promises.** Set an internal target to acknowledge an inbound enquiry the same business day and give a clear next step. The delivery date still waits for supplier and artwork confirmation.
8. **Build a useful local resource.** A Newcastle/Hunter club-order checklist, sponsor-merch guide or sizing guide can attract search and referral traffic. It must be genuinely useful, not a thin directory made to justify unsolicited contact.
9. **Measure the whole path.** Track source → qualified brief → mock-up → quote → approved order → gross margin → review/referral. Do not copy agency revenue claims or assume their economics apply to merchandise.

### Do not copy these tactics

- scraped or inherited email lists;
- newsletters that disguise marketing as an existing subscription;
- adding businesses to a directory and then using the listing as a pretext for unsolicited messages;
- mass Instagram DMs, tagging businesses into promotional content, or “close friends” tricks designed to force a notification;
- fake scarcity, fake personalisation or free gifts that create an obligation;
- promising speed, pricing or results before checking the actual order and supplier requirements.

The strategic takeaway is **repeatable offer + local proof + useful content + warm introductions + disciplined fulfilment**, not “send more cold messages” or “automate everything.”

### Who to target first

Start with Newcastle and Maitland in this order:

1. Football, rugby, netball, basketball, cricket, AFL, dance, martial arts, surf clubs and other community sports.
2. Club sponsors and local businesses that need staff uniforms or event merchandise.
3. Trades, gyms, hospitality, childcare, healthcare, real estate, logistics and event businesses.
4. Schools, P&Cs, charities and community events.

Use the Cooks Hill United result as proof of scale. Do not use its logo, photographs or testimonial without written permission.

### The simple offer

Give each segment one clear reason to enquire:

- Clubs: free teamwear or merchandise mock-up and quote.
- Businesses: free branded-uniform mock-up and quantity-break quote.
- Events and charities: free design and order-timeline check.
- Club sponsors: a co-branded sponsor merchandise concept.

The call to action is always: **“Send your logo, quantity and deadline for a mock-up and quote.”**

### No-cost channels

- Ask every completed customer for a review, a case-study photo and two introductions.
- Build referral relationships with club committee members, sports photographers, designers, event organisers, accountants, signage businesses and local agencies.
- Post three times per week: one proof/case study, one useful ordering tip, and one local community or offer post.
- Improve the Google Business Profile and create local pages for custom teamwear Newcastle, branded workwear Maitland and club merchandise Hunter.
- Attend Maitland Business Chamber, Business Hunter, club sponsor nights and local sporting events. Aim for introductions, not hard selling.
- Build a sponsor list from local club sponsor pages and approach sponsors with a useful co-branded concept.

Maitland Business Chamber provides a searchable local member directory, and Maitland City Council identifies chamber and Business Hunter networking as active business-support channels. [Maitland Business Chamber](https://maitlandbusiness.com.au/our-members/) · [Maitland City Council](https://www.maitland.nsw.gov.au/services/business-investment/grow-my-business)

### Low-cost advertising tests

Only advertise after the landing page, proof and follow-up process are ready.

- Start with one 14-day test at A$10–20 per day.
- Test Newcastle/Maitland Meta lead ads using the Cooks Hill proof point and the free mock-up offer.
- Test Google Search only for high-intent terms such as custom teamwear Newcastle and branded workwear Maitland.
- Use a dedicated form that records organisation, role, product, quantity, deadline and permission to follow up.
- Pause a test that generates clicks but no qualified quote requests. Optimise for qualified enquiries, not impressions.

Do not run a broad “all businesses” campaign. Test one segment, one offer and one landing page at a time.

### Outreach rules

Monid may discover companies and domains and selectively enrich approved records. It must not automatically create a marketing audience, set `Ready to Email`, or send follow-ups. A verified or public email is not proof of consent. Use warm introductions, inbound forms, referrals or another documented contact basis, and record the evidence before sending.

Every reply, opt-out, bounce or block pauses the sequence. The sender must identify NovaMerch, provide contact details and offer a functional unsubscribe path. ACMA requires consent for commercial electronic messages and says unsubscribe requests must be honoured within five working days. [ACMA guidance](https://www.acma.gov.au/avoid-sending-spam)

## What happens when

| When | Work | Definition of done |
|---|---|---|
| Week 1 | Confirm sender identity/signature; create approval, suppression and activity fields; prepare Cooks Hill case study and landing page | One consistent offer, identity and schema |
| Week 2 | Replay enrichment safely; test reply, bounce and opt-out fixtures; build 30 Newcastle/Maitland referral targets | No automatic promotion or send; events create suppression rows |
| Weeks 3–4 | Contact warm/referral paths; publish three weekly posts; request reviews and introductions; attend one local network event | First permissioned enquiries and referral conversations |
| Days 31–60 | Run one small advertising test; publish two more proof pieces; measure quote conversion and margin | One winning segment/offer identified or test stopped |
| Days 61–90 | Repeat the best local channel; add club-sponsor partnerships; keep sender at the safe cap until five clean business days | Local acquisition process is repeatable and measurable |
| After day 90 | Consider Hunter expansion, then one Sydney segment | Sydney starts only with local unit economics and fulfilment proven |

## Weekly scorecard

Track these numbers every week:

- qualified leads and permissioned contacts;
- inbound enquiries and quotes sent;
- quote-to-order conversion and average order value;
- gross margin and cost per qualified enquiry;
- referral-generated revenue and repeat orders;
- accepted, delivered, bounced, replied, positive-reply and opt-out rates;
- unresolved suppression or event exceptions.

The headline number is **qualified quote requests that become profitable orders**, not emails sent.

## Owners and proof of readiness

| Gate | Owner | Proof before next gate |
|---|---|---|
| Repair enrichment replay | Workflow owner | One pinned-record replay, no automatic promotion or send |
| Event ingestion | Workflow owner | Reply, bounce and opt-out fixtures create correct ledger/suppression rows |
| Approval view | Sales owner | Ten reviewed leads with complete evidence; no ambiguous `Needs Review` entries |
| Sender parity | Workflow owner | Dry run proves every live selection matches the non-negotiable gate |
| 15/day pilot | Sales owner | Five business-day reconciliation report and threshold check |

## Compliance note

Australian commercial email requires consent, accurate sender identification/contact details, and a functional unsubscribe mechanism. The sender must be able to prove consent; a public or verified email address alone is not a sufficient basis. See ACMA’s [Avoid sending spam](https://www.acma.gov.au/avoid-sending-spam) guidance. This plan is operational guidance, not legal advice.

## Implemented in the repository

- `admin-panel/src/lib/outreach-control.ts` now provides the strict approval/campaign gate, normalized dispatch key, inbound event state transitions, and ledger-entry builder.
- `admin-panel/tests/outreach-control.test.mts` covers missing approval evidence, campaign mismatch, opt-out/bounce suppression, recipient normalization and provider-message traceability.
- The admin build passes and the full test suite passes (22 tests).

## Deployment boundary

The repository changes do not change Airtable rows, n8n workflows, Brevo campaigns, schedules, send limits or Monid balance. The live Airtable grid currently does not expose the standardized approval/suppression/ledger fields, and the activity table was not created. The first production change should therefore be the schema/table setup and event/ledger replay, followed by one visible dry run—not a sender-cap increase. Until that is completed, the existing sender remains governed by its old live filter and must not be scaled.

## CRM decision and current website path

The admin panel remains the intended CRM interface. Airtable is the current storage adapter, not a permanent architectural requirement. The website now has a dedicated `/free-mockup` landing page, the homepage quote form and the existing `/mockup-builder` flow. The simple quote form captures attribution, delivery area, timing and contact consent, but it currently submits through Formspree rather than directly into the admin panel. Therefore the website path is visible and measurable at the form level, but not yet authoritative in the CRM.

The admin-panel public intake endpoint is deployed on the Cloudflare Worker, with origin allowlisting, rate limiting, consent/email validation and idempotency. The storefront was deployed to Vercel production on 28 September 2026. Live checks passed: the free mock-up page returned `200`, its deployed JavaScript points to the public intake endpoint, the Worker CORS preflight returned `204` for `https://novamerchau.com`, and `/admin` redirected to protected login. A synthetic end-to-end test that creates one clearly labelled CRM record remains pending and requires approval at test time. See [CRM and storage options](crm-storage-options-2026-09-27.md) for the staged migration and rollback plan.
## Infrastructure audit and the next inroads

The current system is a useful foundation, but it is not yet one connected growth machine:

| Layer | What exists | What it should do next |
|---|---|---|
| Storefront | Next.js site on Vercel with a mockup builder, sports-club page and quote-request path | Make one Newcastle/Maitland offer the main conversion path; add measured local landing pages only after the offer and fulfilment brief are stable |
| Admin and fulfilment | Separate Next.js admin app on Cloudflare Workers, with Airtable as operational source of truth | Add lead ownership, approval evidence, quote-to-order handoff and delivery milestones to the same visible workflow |
| Acquisition automation | n8n schedules and Brevo templates, with local safety logic and Monid guardrails | Keep n8n as scheduler/event recorder; require a real approval and suppression check immediately before any send |
| Agent layer | Noah/Hermes has Gmail, Brevo, GitHub, supplier research and Monid access | Use Noah for research, triage, drafts, exception reports and weekly reviews; not for autonomous sends, status promotion or pricing promises |
| Discovery and authority | Newsjack skills are installed for PR angles, fact-checking, news search and AI-visibility writing | Use them for one useful local story or case study at a time, with evidence and human approval |
| Search growth | OpenSEO skills are installed for technical/local SEO and keyword research | Start with a free technical audit and Search Console/GBP evidence; do not self-host or buy DataForSEO credits until the first pages and conversion path are ready |

### Where Jev fits

No Jev integration or credentials are currently documented in this repository. Until that is clarified, treat Jev as an optional **research and QA operator**, not a second sender. The safest useful role is to review one weekly batch of evidence: local search opportunities, customer-language pain points, competitor gaps, or Newsjack candidates, then return a ranked brief for a human decision. Jev must not receive the Monid key, write `Ready to Email`, edit suppression state, publish ads, or send messages unless a separately documented connector and approval rule exists.

### Low-risk 30-day sequence

1. **Days 1–3: make the conversion path measurable.** Verify the public quote-request endpoint, add a source/campaign field to each request, confirm admin notification delivery, and record first-response owner and time.
2. **Days 4–7: make local discovery crawlable.** The storefront now emits `sitemap.xml` and `robots.txt`; next, create only the pages supported by real offers (Newcastle sports clubs, Maitland businesses, and one general branded-merchandise page). Avoid thin, duplicated suburb pages.
3. **Week 2: use proof before volume.** Ask Cooks Hill United FC for written permission to use the 570-shirt result. Publish one factual case study or project note, then repurpose it into a post, a partner introduction, and one local PR angle.
4. **Week 3: run a small local demand test.** One segment, one offer, one landing path, fixed 14-day budget, and a stop rule based on qualified enquiries and gross margin—not clicks alone.
5. **Week 4: review the whole loop.** Compare organic visits, ad leads, mockup requests, qualified opportunities, quotes, wins, fulfilment delays, unsubscribes and cost per qualified opportunity. Only then decide whether to add Sydney or more outreach volume.

### Tool boundaries

- **Newsjack:** detect and shape timely stories, fact-check claims and draft angles. It is a PR/relevance layer, not a lead scraper or email sender.
- **OpenSEO:** research search demand, local visibility and technical gaps. Its hosted/self-hosted workflows require a DataForSEO key; keep this optional until free evidence justifies spend.
- **Monid:** approved business discovery/enrichment only, with the existing one-query, balance and review gates.
- **Noah/Hermes:** coordinate drafts, evidence, inbox triage and exception handling across the above; never bypass the approval ledger.
- **Jev:** optional independent review/briefing role once its identity and connector are documented.
