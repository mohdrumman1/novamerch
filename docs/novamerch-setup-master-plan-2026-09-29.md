# NovaMerch complete setup plan

29 September 2026 · Working checklist for the next days and weeks

## Purpose

This is the single practical view of what NovaMerch has, what is live, what still needs building, and the order to do it in. The goal is a reliable local growth system: people can find NovaMerch, request a mock-up or quote, receive a fast useful response, and become a well-managed order.

## The simple picture

```text
Local search, referrals, content and approved outreach
                    ↓
Website and Google Business Profile
                    ↓
New lead in Airtable and admin workflow
                    ↓
Same-day human response, mock-up or quote
                    ↓
Order, production updates, delivery and review
                    ↓
Case study, referrals and repeat order
```

Do not add more sending volume or advertising until each arrow is visible, owned and measured.

## What is built and live

| Area | Current state | Evidence or location |
|---|---|---|
| Public website | Live | [novamerchau.com](https://novamerchau.com) is deployed on Vercel. |
| Conversion pages | Live | Homepage quote form, `/free-mockup`, mock-up builder and sports-club path exist. |
| Website lead intake | Live and tested | Website intake posts to the Cloudflare admin Worker. A synthetic test on 29 September created a `New` lead and was then deleted. |
| CRM storage | Live, interim | Airtable is the current source of truth. Website enquiries now enter the **Leads** table, not the converted Customers table. |
| Admin panel | Live | Hosted on Cloudflare Workers at `/admin`, with protected login. |
| Intake safeguards | Live | Origin allowlist, validation, consent check, rate limit and short idempotency window are deployed. |
| SEO foundation | Built and deployed | Sitemap, robots rules and core metadata are in the storefront. |
| Google Business Profile | Submitted | NovaMerch profile has Newcastle and Maitland service areas, website, description and hours. Google verification is pending. No residential address is publicly attached. |
| Outreach infrastructure | Partly live | Airtable lead base, n8n schedules, Brevo templates and Hermes/Noah exist. The safe scale gate is not complete. |
| Noah/Hermes | Live with limits | Telegram, Gmail, GitHub, Brevo, supplier research and Monid discovery access are documented. Noah is draft/research/triage only for customer-facing work. |
| Monid | Installed with guardrails | Discovery/enrichment only; never sends, approves or promotes leads. |

## Non-negotiable operating rules

- A website enquiry starts as `New`. It must never be set to `Needs Review` merely because it is new.
- `Needs Review` is only for a specific unresolved problem, recorded in Notes with an owner and next action.
- No outreach send occurs without a verified contact basis, approval evidence, suppression check and campaign match.
- Noah may research, draft, classify and report. Noah must not autonomously send, promise pricing or delivery, publish advertising, or move leads into sending status.
- Every enquiry gets an owner and a same-business-day acknowledgement target.
- Customer logos, quotes, delivery times, product claims and reviews need human confirmation before publication.

## The next 72 hours

| Priority | Work | Owner | Done when |
|---|---|---|---|
| 1 | Confirm Google Business Profile verification | Rumman | Profile is publicly visible in Google Search and Maps. |
| 2 | Finish the lead workflow in the admin panel | Build owner | Every new website lead has owner, next action, source, campaign, consent and last activity visible in one view. |
| 3 | Add a real business phone number and 5–10 approved photos to GBP | Rumman | Listing communicates trust without exposing a home address. |
| 4 | Create the Cooks Hill case-study asset | Rumman + club approval | Written permission, verified 570-shirt fact, approved photos and no unverified turnaround claims. |
| 5 | Check the operational response path | Sales owner | A real enquiry can be acknowledged, qualified, quoted and assigned without relying on memory or scattered inbox threads. |
| 6 | Repair the outreach decision gate | Workflow owner | One approval view, one suppression list and reply/bounce/opt-out events are authoritative before the next campaign. |

## Week one build list

### 1. CRM and customer handling

- Add lead fields and views: owner, next action date, last activity date, consent/contact basis, source, campaign, landing page, enquiry type and suppression status.
- Create views for `New`, `Awaiting response`, `Mockup requested`, `Quote requested`, `Quote sent`, `Won`, `Lost`, `Suppressed` and `Exceptions`.
- Add an activity/event ledger for inbound replies, bounces, opt-outs, calls, quotes and status changes. It must preserve history rather than overwrite it.
- Add one daily alert for new unowned leads and leads not touched within one business day.
- Ensure conversion from Lead to Customer is deliberate and linked, not an automatic duplicate record.
- Keep Airtable as the current data store, but start a small no-production-data pilot of Cloudflare D1 or Supabase behind a storage interface. Do not migrate live records until dual-write reconciliation passes.

### 2. Website conversion and fulfilment

- Confirm the primary offer: a free three-product mock-up pack with rough pricing, targeted separately for clubs, businesses and events.
- Add one plain confirmation screen/email that explains what happens next and the expected response window without promising an unverified production date.
- Add a short qualification checklist for logo files, required date, product use, quantity, sizes, sponsor requirements and delivery location.
- Add a reusable quote brief and an approved artwork/specification record for painless reorders.
- Make order milestones visible: artwork approval, supplier confirmation, production, dispatch, delivery and issue resolution.

### 3. Local proof and Google visibility

- Complete GBP verification, add photos and publish the first update about Cooks Hill United FC once permission is received.
- Ask the club and selected past customers for honest Google reviews; never script or incentivise reviews.
- Publish only two evidence-backed local pages first: Newcastle sports-club merchandise and Maitland business uniforms. Avoid thin suburb pages.
- Publish the Cooks Hill project note after approval, then use it as a website page, GBP update and social source asset.
- Connect Search Console and submit the sitemap; record baseline impressions, queries and pages indexed.

### 4. Content and social accounts

- Create accounts in this order: Instagram Professional, Facebook Page + Meta Business Suite, LinkedIn Company Page, YouTube Brand Channel. Defer TikTok/Pinterest/WhatsApp until the first four have a stable workflow.
- Reserve the same handle, use the same logo, website, service area, contact email and recovery details everywhere.
- Create an asset library with rights/approval status, source, caption, channel variants and publish date.
- Start with three content pillars: proof (completed work), help (ordering advice) and process (how mock-ups/orders work).
- Create one weekly batch; a human approves the source facts and first template. Scheduling may be automated after approval.

### 5. Outreach safety and pipeline repair

- Reconcile the Airtable statuses with the actual n8n sender filter; do not assume `Email Found` will send.
- Make reply, bounce and opt-out events write to the activity ledger and suppression list before the sender runs.
- Build an approval record that captures why the contact is relevant, source, contact basis, reviewer and approved campaign.
- Dry-run one small group and compare selected leads to the approval/suppression gate.
- Only then run the existing capped pilot. Do not increase daily volume until five clean business days reconcile correctly.
- Use Monid only for an explicitly approved, small discovery query when existing sources cannot answer the question. Track spend and outcomes.

## Weeks two to four

| Week | Focus | Required outcome |
|---|---|---|
| 2 | Local authority | One approved Cooks Hill proof asset, two useful local pages, GBP photos and first social profiles live. |
| 3 | Controlled demand test | One segment, one offer, one landing page and a fixed small budget or no-cost referral test. Capture source through to quote. |
| 4 | Repeat what works | Compare qualified enquiries, quotes, wins, margin, response time and fulfilment issues. Keep only the best channel/segment. |

## Newcastle and Maitland first

Start with needs NovaMerch can reliably serve:

| Audience | Their problem | NovaMerch offer |
|---|---|---|
| Sports clubs | Sizes, sponsors, kit coordination and deadlines are difficult to organise | Structured brief, mock-ups, quantity options and a reusable reorder record. |
| Trades and local businesses | Staff uniforms are inconsistent or need replacing as teams grow | Practical uniform starter pack with clear product/use recommendations. |
| Property and professional services | Need branded settlement/client gifts or staff merchandise | Curated branded pack options with clear quantities and budget assumptions. |
| Schools, community groups and events | Need something people will actually use, without a complex procurement process | Simple event or group pack with artwork and delivery checklist. |

Sydney is a later test, not the next bulk launch. Begin one Sydney segment only after local response time, margins, delivery reliability and tracking are proven for 90 days.

## Advertising plan: low cost before paid scale

1. **No-cost first:** GBP posts, customer reviews, club/sponsor introductions, local Facebook groups where rules allow, LinkedIn outreach to warm local contacts, case-study content and event/community relationships.
2. **One low-cost experiment:** run a 14-day Newcastle/Maitland campaign with one offer, one landing page and a hard spend cap. Optimise for qualified mock-up requests, not clicks or followers.
3. **Required tracking:** campaign, landing page, cost, lead, qualification result, quote, order, revenue, gross margin and delivery outcome.
4. **Stop rule:** pause when no qualified leads or no viable margin appear by the agreed checkpoint. Never automate budget increases.
5. **Scale rule:** repeat only a channel that produces qualified enquiries which can be answered on time and fulfilled profitably.

## What is deliberately not automated

- Account recovery, two-factor authentication and permission changes.
- Approval of customer claims, testimonials, logos, prices, delivery dates or supplier terms.
- Outreach sending, status promotion, spend changes and publishing customer work.
- Handling qualified buying conversations, final quotes and production commitments.

## Decisions still needed from Rumman

1. Who owns new lead follow-up each business day, including when unavailable?
2. What business phone number should appear on Google and social profiles?
3. Does Cooks Hill United FC approve use of its name, logo, photos and the 570-shirt result?
4. Which one segment gets the first 14-day demand test: clubs, trades, property, or events?
5. What is the maximum test advertising budget in AUD?
6. When should the Airtable-to-D1/Supabase pilot begin, and which operator needs access?

## Weekly scorecard

Review this every Friday:

- New leads by source and campaign
- % acknowledged within one business day
- Qualified leads, mock-up requests and quotes sent
- Quotes won, revenue and gross margin
- Outstanding production/delivery risks
- Unsubscribes, bounces, complaints and suppression events
- GBP calls, website clicks, direction requests, reviews and Search Console impressions
- Content published and assets awaiting approval
- Monid spend, if any, and outcome per approved run

## Detailed supporting documents

- [Outreach scale-control plan](outreach-scale-control-plan-2026-09-25.md)
- [CRM and storage options](crm-storage-options-2026-09-27.md)
- [Local SEO and AEO plan](seo-aeo-content-plan-2026-09-27.md)
- [Social-account launch plan](novamerch-social-account-launch-plan-2026-09-27.md)
- [Hermes deployment and access](hermes-deployment-and-access.md)
- [Hermes Monid guardrails](hermes-monid-guardrails.md)
