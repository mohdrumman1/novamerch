# NovaMerch acquisition and admin plan

**Status update, 11 September 2026:** use the [Hermes admin implementation plan](hermes-admin-implementation-plan.md) for the expanded admin scope, hosting/model comparison, budget and rollout criteria. The acquisition recommendations below remain applicable. Six revised [email templates](outreach-copy-2026-09-11.md) were subsequently published; the acquisition infrastructure has not been repaired. See [current implementation status](README.md).

## Recommendation

Prioritise existing buying conversations, then expand through independent fitness studios, Newcastle trades and selected Sydney businesses. Keep n8n as the workflow engine. Introduce Hermes as an admin assistant that prepares work, maintains a queue of next actions and surfaces exceptions. More lead volume should follow reliable reply handling and quote turnaround.

This recommendation incorporates the September 11 account audit and mailbox evidence. It changes the earlier segment ranking: independent fitness businesses deserve the first controlled test because Swell has order conversations and PHYX has a current, specific equipment enquiry. Builders remain a useful second test. Property agencies are a hypothesis to test, not an established winning segment.

The immediate commercial priority is **PHYX Newcastle**. Sheena replied on September 10 confirming interest in equipment after researching and ordering samples elsewhere. Her July 9 message specifies branded resistance bands and Pilates balls. The existing conversation already contains a 10% discount offer from NovaMerch. Before quoting, account for that offer and obtain actual supplier specifications, samples, landed costs and feasible dates.

The preferred first fortnight requires no new lead-data subscription. Existing hosting, AI, phone and staff time still cost money. Hermes software is MIT-licensed, but inference, tools, hosting and maintenance are separate costs.[1] A pilot spending ceiling is a management choice, not a vendor price or a guarantee of sufficient capacity.

## Evidence from the existing business

| Finding | Evidence and interpretation | Action |
|---|---|---|
| Live buying interest | PHYX thread, September 10: still interested; not satisfied with options sampled elsewhere. July 9 specifies equipment. Full thread read. | Prepare a needs-specific response and supplier comparison first. |
| Missed commercial reply | NovaMerch's September 8 reply says the earlier PHYX email was found in spam. The original website request was answered July 7; the July 9 equipment follow-up was delayed. | Include spam review and unanswered inbound messages in admin triage. |
| Existing fitness demand | Swell search results show an August 2 coaches' order and an August 5 invoice email for seven polos and seven jackets, total $385. | Reconcile fulfilment/payment in the orders system; assess the proposed second member order. Search snippets do not establish payment or delivery. |
| Older proposals | Blue Horizon Projects and DAL Constructions threads show logo receipt and catalogue replies. | Review the complete thread and current CRM state before deciding whether reactivation is appropriate. |
| Additional club demand | Cooks Hill July 2 snippet asks for material; other club threads include proposals. | Reconcile against the existing customer/order record; do not treat an existing customer as a fresh cold lead. |
| Negative replies | Search results include explicit refusals from Harcourts Newcastle and Manbir Mann; Snap Jesmond says it uses authorised partners, then another thread contains a later refusal. | Reconcile suppression across duplicate records and campaigns. The snippets alone do not establish the exact automation that sent each message. |
| Invalid contacts | Seven matching bounce threads surfaced, including two Burwood addresses, an invalid Australian Asian Netball domain, Woodport, Samaritans and a WesTrac-related address. Daracon's group rejects outside senders. | Verify full diagnostics and suppress failed addresses; distinguish nonexistent mailboxes from restricted groups. This is not a complete bounce rate. |
| Google project suspension | May 4 notice from google-cloud-compliance@google.com states that `nova-merch-n8n` was suspended for repeated terms violations. A search found an appeal receipt that day and no reinstatement message in those results. | Check current Cloud console status and the key's project. This is a material diagnostic lead, not proof of today's 403 cause. |

The report's “2 replies/interested” is a count of selected CRM states, not a complete account of conversations or sales. Mailbox evidence includes replies, refusals, proposals and orders outside that simple figure. A historical reconstruction must match threads to lead IDs and customer IDs before calculating conversion.

The earlier audit remains applicable: discovery errors, Airtable capacity, and the `Email Found` → `Ready to Email` handoff are separate blockers. There are 1,241 leads and 305 records in `Email Found`; today's sender found no eligible `Ready to Email` records. Promoting all 305 would be particularly unwise because the initial query currently returns all eligible records without an explicit initial-send cap.

## Channels ranked for this business

These rankings are business judgments based on the observed pipeline, not externally established conversion benchmarks.

| Priority | Channel | Why it merits time | First test and cost |
|---|---|---|---|
| 1 | Current enquiries and existing customers | Demonstrated needs and existing conversations reduce discovery work. | PHYX, Swell order reconciliation, open quotes; no new data subscription. |
| 2 | Customer introductions and complementary partners | A local designer, signwriter, gym consultant or event organiser can introduce multiple relevant buyers. | Five individually researched partners; ask for an introduction, not their customer database. Time and any agreed commercial arrangement are costs. |
| 3 | Selected business calls and local meetings | Useful for establishing the right buyer, timing and permission to send requested options. | Ten qualified Newcastle accounts/day; actual conversations determine email volume. Phone, travel and samples cost money. |
| 4 | Permission-based email and quote follow-up | Best for delivering material a buyer wants and keeping decisions moving. | Short, threaded messages with a named owner and next action. |
| 5 | Local proof and inbound enquiries | Real customer work and a clear offer help prospects validate NovaMerch after an introduction or call. | Two permission-approved case studies and segment pages; existing website infrastructure. |
| 6 | Paid search or paid databases | Potentially useful after the offer converts, but neither fixes missed replies. | Defer until source-attributed quotes and margins justify a bounded experiment. |

Australian government small-business guidance supports networking, referrals and complementary partnerships as routes to new customers, but does not establish a specific return for NovaMerch.[2] Start with introductions without inventing discounts or commissions. Use customer logos and testimonials only with appropriate permission.

Do not place generic promotional messages into every contact form or move bulk outreach to social DMs to avoid email restrictions. A contact route is not automatically an invitation to receive marketing. Participation in a relevant local discussion, an introduction and a requested follow-up are more useful starting points.

## Who to target and what to sell

**Independent gyms, Pilates and strength studios:** begin in Newcastle, Redhead and Lake Macquarie, then test a similarly sized Sydney group. Look for owner involvement, an existing member community, a challenge/event or a merchandise range. Offer either a small staff/member apparel range or branded accessories. Keep equipment separate from apparel: resistance bands and balls require product-quality and intended-use checks, and there is no basis to promise medical suitability. PHYX's official website confirms its physiotherapy, Pilates and strength services; Swell's site confirms its Redhead fitness operation.[3][4]

**Builders and trades:** focus on independent operators with a reachable owner or office manager. Test caps, shirts and bottles as a repeatable team kit. Useful triggers include hiring, a new branch, rebranding or a specific team event. A website showing a large workforce is fit evidence; it is not proof that uniforms are being purchased now. Jedabuild and P & D Kay are previously verified backlog candidates, not approved recipients.

**Property agencies:** test a smaller group of independent Newcastle and Sydney agencies. The proposition is a consistent client handover pack with repeat-order simplicity. First establish whether purchasing is local or controlled by a franchise. Arnold Property is a verified backlog candidate. Harcourts Newcastle's refusal must be respected rather than recycled into this test.

**Sports clubs:** retain warm conversations and existing customers, but avoid another broad club blast initially. Committee ownership, season timing and supplier arrangements can make decisions slower. Preorders may help establish demand before production, but payment, quantities and fulfilment commitments need an agreed process.

For the next 50 newly qualified companies, use a provisional allocation of 25 independent fitness businesses, 15 trades/builders and 10 property agencies. Allocate about 70% to Newcastle/Hunter and 30% to Sydney. These are experiment allocations, not estimated market shares. Review after actual conversations and quotes; do not keep a category merely to meet the allocation.

## Lead discovery and contact research

Work the existing 305 records in small batches after checking historical contact and suppression. Treat the 380 no-email records reported by Claude as classified prospects rather than a mandate to keep searching indefinitely. A business phone and a good fit can be sufficient to start a permitted conversation.

For new companies, use official business websites, CBD Sydney Chamber's directory, North Sydney Business Chamber's directory and Business Hunter's public events/network information.[5][6][7] Event listings can reveal sponsors and organisers with a merchandising use case. Check the event's actual future date and participation terms before prioritising it. Directory availability does not imply free membership, unrestricted extraction or permission to market.

Record business identity, location, official website, buying trigger, buyer role and evidence URL/date. Reject a lead when geography is wrong, procurement is inaccessible, it is a duplicate, it has opted out, or there is no plausible current use case. Review site terms before automating collection. Avoid automated email-address harvesting; company discovery and permission to contact are separate decisions.

A simple prioritisation score can assign 0–2 each for segment fit, visible buying trigger, buyer accessibility and operational feasibility, plus 0–3 for existing positive engagement. Suppression overrides every score. AI can propose scores with evidence; it cannot manufacture a trigger, name, consent or buying intent.

Where a buyer requests material, confirm their preferred address directly. If an old address is uncertain, use a verifier as an additional check. Hunter's current free plan offers 50 shared credits/month across its tools; this is not 50 guaranteed found-and-verified prospects.[8] Unknown and accept-all results remain uncertain, and verification is time-sensitive.[9] A valid mailbox is not evidence of consent.

## Tool choices and costs

| Tool or approach | Current evidence | Decision |
|---|---|---|
| Existing Airtable | Live base exceeds its free record allowance. | Review in place now; plan a backed-up prospect-only migration if avoiding an upgrade. |
| Google Sheets + n8n | Recommended small-pilot design; account capacity and credentials need validation. | Low incremental subscription cost, familiar review queue. One writer and explicit IDs; Sheets is not a transactional dispatch database. |
| Hunter Free | 50 shared credits/month, verification/finding and other features.[8] | Optional selective verification; do not buy before contact quality becomes the bottleneck. |
| Snov trial | 50 credits, 100 recipients; excludes API/webhooks, export and several bulk/integration features.[10] | Poor foundation for a free automated n8n pipeline. No reason to add it alongside Hunter now. |
| Apollo | Public pricing/API documentation reviewed; precise usable allowance depends on plan/account and endpoint.[11] | Optional later coverage test on the same local-company sample. No evidence here that its Australian SME coverage beats direct research. |
| Brevo | Free plan advertises 300 sends/day; contact policy excludes scraped and third-party email lists.[12][13] | Retain for eligible requested/permission-based communications; volume ceiling is not a recommended send target. |
| Google Places | Current workflow fails; suspension evidence needs reconciliation. | Remove it as a dependency of the first pilot. Diagnose and resolve the account issue rather than creating replacement projects to sidestep it. |
| Hermes | Open source; external inference/tools/hosting may be billable.[1] | Small admin pilot with measured cost and narrow access. |

**Suggested budget policy:** A$0 for new prospect-data subscriptions during the first fortnight. The expanded [Hermes admin plan](hermes-admin-implementation-plan.md) supersedes the earlier tentative A$30 experiment envelope with a US$15–30/month planning allowance for a controlled hosted pilot. This is neither an approved spend nor a vendor bundle. Confirm currency, tax and billing controls before activation; existing subscriptions, labour, samples and orders are excluded. Reduce or stop optional work when the chosen budget is reached.

Measure dollars and staff minutes per qualified conversation, quote and won order. Only adopt a paid finder if a common sample demonstrates additional reachable, relevant buyers at an acceptable cost. Do not compare vendors using database-size marketing claims.

## Outreach and response handling

Australian marketing messages require a valid consent basis, sender identification and an effective unsubscribe process. ACMA says not to send an electronic marketing message merely to ask for consent; opt-outs must be actioned within five working days. Build immediate suppression into this pipeline. Public availability alone is not sufficient proof of consent.[14] Brevo separately excludes copied public-address and third-party lists, so merely changing a CRM status does not make the existing list suitable for that provider.[13]

Business calls must follow the applicable telemarketing standard, including identification, permitted times and ending when requested; check Do Not Call eligibility for mixed-use/mobile numbers. Use weekday business hours for the pilot.[15] Record the actual permission and its scope, rather than a default checkbox inferred by AI.

Call opener for a relevant new account:

> Hi, this is [actual name] from NovaMerch in Newcastle. Who looks after your [team clothing/member merchandise]? We help with [one relevant use case]. Are you reviewing that at the moment?

If useful, ask whether they would like specific options by email and confirm the address, quantity and intended date. If not, record the answer and stop. A five-minute useful conversation can eliminate days of irrelevant enrichment.

Requested follow-up:

> Thanks for speaking with me. Based on [need], I’ll prepare [two specific options]. What quantity and target date should I work to? I’ll confirm pricing and lead time before you commit.

Use one clear question and a real sender signature. Keep the same monitored reply identity throughout the thread. The inspected messages contain different phone numbers and sender names across time; standardise these only after confirming the current representative and number. Preserve the established customer conversation.

Prioritise business outcomes over opens. Opens can be distorted and are not purchase intent. Maintain accepted sends, delivered messages, failures, human replies, positive replies, quote requests, quotes, wins and gross margin as separate measures. Brevo API sends need provider events; absence from Gmail Sent does not demonstrate that no API email was sent. Google recommends authentication and clear, accurate sending practices; verify SPF, DKIM and DMARC alignment before any scaled pilot.[16]

## Hermes admin design

This section preserves the initial architecture rationale. The [detailed admin plan](hermes-admin-implementation-plan.md) now governs inbox drafts, supplier research, order notifications, catalogue generation, permissions, cost assumptions and acceptance tests.

Assumption: Hermes means Nous Research's Hermes Agent. It supports persistent memory, skills, different model providers and scheduled work.[1] These features suit repeatable admin procedures, but remembered text should not replace customer/order records.

Keep **n8n responsible for schedules, event ingestion, retries and sending rules**. Let **Hermes interpret exceptions, research selected companies, prepare responses and draft quotes**. Keep **the CRM responsible for prospect state and the existing orders base responsible for fulfilment**. This separation prevents two schedulers and two agents from contacting the same customer independently.

The preferred integration is a small set of constrained n8n tools exposed to Hermes. Hermes supports MCP and per-server tool filtering.[17] Proposed tools are `list_unanswered_threads`, `get_thread`, `list_due_actions`, `get_order`, `prepare_reply`, `propose_crm_update` and `get_pipeline_health`. These are proposed interfaces to implement, not tools already installed. Do not expose general workflow publishing or unrestricted database writes just because an integration supports them.

Start with read and draft capabilities. Permit deterministic suppression and logging through validated n8n rules. Financial commitments, purchase orders, refunds, payments, discounts and final customer promises require the business representative's approval. The existing PHYX discount is already part of the conversation and must be presented accurately; Hermes should not invent a second concession.

A customer's email is business data, not an instruction to alter the agent's operating rules. Keep payment and account credentials outside the model-visible workspace. Enforce access in connector permissions and tools, not solely in a prompt. Hermes documents approval modes, isolation options and default denial for dangerous unattended commands; these controls are useful but do not themselves create a complete business-permission system.[18]

### Why not just connect the default email gateway?

Hermes distinguishes its email conversation gateway from mailbox-management tooling. The gateway replies in-thread to allowed senders, marks existing inbox messages seen on startup, and ignores automated senders including bounce traffic. That would miss key NovaMerch admin duties and could cause unintended customer replies. Use a dedicated owner-control channel if needed; use explicit mailbox ingestion for customer triage and delivery events.[19]

Its Himalaya-based mailbox skill is another supported option, but requires a separate CLI/configuration and permits mailbox operations through terminal tools.[20] For NovaMerch, a narrowly scoped connector or n8n interface is the better initial design. Existing Chrome login does not automatically grant a remote Hermes installation mailbox access.

### Runtime and reliability

Begin with a local supervised pilot using sanitised or narrowly scoped business inputs. A sleeping personal computer is not a reliable unattended admin host. Production requires an available host, persistent storage, backups and a restart supervisor. Reusing the existing Railway environment is worth checking, but its capacity and cost were not verified and Hermes must not consume resources needed by the existing workflows.

Hermes cron depends on its gateway daemon.[21] For this design, let n8n remain the only scheduler for shared business tasks; enable Hermes cron only for tasks with a distinct owner and no overlapping workflow. Provider compatibility does not establish free usage: verify the selected model's actual authentication and billing arrangement rather than assuming the Claude subscription covers Hermes.[22]

Process new or changed messages since a stored checkpoint. Reconcile a bounded recent window for missed events, including spam and archived mail; never use unread state alone as the work queue. Record message ID, thread ID, sender, received time, last customer message, last business response, action owner and due time. Exclude NovaMerch's own bot reports and supplier newsletters from sales-reply counts.

### Daily admin duties

| Frequency | Duty | Reviewable output |
|---|---|---|
| Every 15 minutes during business hours | Ingest new replies/events and pause affected sequences | Updated activity ledger and suppression, with message evidence |
| 08:30 | Review overdue enquiries, due quotes and orders | Five most urgent actions with owner and source links |
| Twice daily | Review possible customer messages in spam | Candidate recovery queue; no automatic mass spam release |
| 12:30 | Process selected lead research and prepare requested proposals | Evidence-backed drafts and missing-information list |
| 16:30 | Check supplier updates, artwork approvals and delivery exceptions | Order actions; no invented payment/delivery status |
| 18:00 | Reconcile workflow runs and commercial outcomes | Truthful counts, failures and unresolved customer requests |

Suggested operating SLA: a business owner sees a new buying enquiry within two business hours, and the buyer receives an approved acknowledgement the same business day. These are proposed targets, not current service guarantees. Alert on missed SLA, failed ingestion or ambiguous sends; unchanged health should not generate repeated noise.

## First fortnight and acceptance

Day one: prepare the PHYX response, confirm supplier feasibility, reconcile Swell's next order and triage older open quotes. Do this alongside technical work so a storage migration does not delay an active buyer.

Days two to three: repair the report wording, create the reply/suppression ledger and validate the monitored support-address route into Gmail. Investigate current Google project status without assuming the old suspension explains the active key. Export and verify the prospect base before any cutover. Preserve the separate orders base and all opt-out history.

Days four to five: test the first ten qualified Newcastle accounts, record real conversations and deliver requested options. Trial Hermes on a fixed set of historical threads containing an enquiry, refusal, bounce, supplier invoice, bot report and attachment. Compare its output with the actual messages. It must not count quoted old text as a new request or mark an invoice paid without evidence.

Week two: continue the best-performing segment and add a small Sydney sample. Extend Hermes to live read/draft work only after the historical trial succeeds. Review time saved, missed items, classification corrections and actual inference cost. Promote specific reliable actions individually rather than granting broad “admin” authority.

Before sending automation is enabled, test duplicate imports, overlapping runs, the daily cap, a reply arriving immediately before send, an opt-out, an invalid address and a provider timeout. Use a persistent unique dispatch key such as prospect + campaign + step. If Sheets is the review interface, enforce serial dispatch and keep the send ledger in storage that can prevent duplicate keys; a spreadsheet check alone is insufficient under concurrency.

Success means enquiries are handled, promised quotes are delivered, opt-outs stop outreach and profitable orders can be attributed to a source. Fifty calls or ten sends are input limits, not promises of customers. A small sample with no conversations warrants changing targeting or the approach; conversations without quote requests warrant changing the offer; quotes without orders warrant investigating price, timing, trust and fulfilment.

## Limits and source notes

This is a researched operating design, not an installed Hermes deployment or a live pipeline replacement. During the research stage, no customer messages were sent, subscriptions purchased, records promoted or production workflows changed. Subsequently, six email templates were published in the initial and follow-up workflows; see the [copy change record](outreach-copy-2026-09-11.md). This did not repair the pipeline. Mailbox searches were selective: only PHYX and the suspension notice were read in full in that extension; other commercial and bounce findings above are labelled as search-result evidence. Payment, fulfilment, full campaign conversion, current DNS authentication, Brevo account health and the active Google key/project relationship remain unverified.

Private evidence: Nova Merch Leads Airtable base and saved n8n executions described in `acquisition-audit-2026-09-11.md`; Gmail account `novamerch.au@gmail.com`, subjects “Re: branded merch idea” (PHYX), “SWELL Merch”, “SWELL Merch Order”, “Re: Quick merch idea for Blue Horizon Projects”, “Re: Quick merch idea for DAL Constructions - Home Builders & Renovations”, and the May 4 Google suspension notice. These are private business records accessed September 11, 2026.

## Sources

All web sources accessed September 11, 2026. Undated product documentation and plans can change.

1. Nous Research, [Hermes Agent repository and MIT licence](https://github.com/NousResearch/hermes-agent).
2. Australian Government, [5 ways to reach new customers](https://business.gov.au/news/5-ways-to-reach-new-customers), February 12, 2025.
3. PHYX Newcastle, [About](https://phyxnewcastle.com.au/about/).
4. Swell Fitness, [Official website](https://swellfitness.com.au/).
5. CBD Sydney Chamber, [Business Directory](https://business.cbdsydneychamber.com.au/list).
6. North Sydney Business Chamber, [Member Directory](https://northsydneybusinesschamber.org.au/member-directory).
7. Business Hunter, [Events](https://www.businesshunter.com/hunter-business-events/our-events).
8. Hunter, [What's included in the Free Plan](https://help.hunter.io/en/articles/11060999-what-s-included-in-hunter-s-free-plan).
9. Hunter, [Email Verification FAQs](https://help.hunter.io/en/articles/15899247-email-verification-faqs).
10. Snov.io, [Pricing and trial limitations](https://snov.io/pricing).
11. Apollo, [Pricing](https://www.apollo.io/pricing) and [API pricing](https://docs.apollo.io/docs/api-pricing).
12. Brevo, [Free plan limits](https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan).
13. Brevo, [Legitimate contacts database policy](https://help.brevo.com/hc/en-us/articles/213405965-Build-a-legitimate-contacts-database-for-optimal-deliverability-and-compliance).
14. ACMA, [Avoid sending spam](https://www.acma.gov.au/avoid-sending-spam).
15. Australian Do Not Call Register, [Industry standards](https://www.donotcall.gov.au/industry/industry-overview/industry-standards/).
16. Google, [Email sender guidelines](https://support.google.com/mail/answer/81126?hl=en).
17. Nous Research, [Hermes MCP integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp).
18. Nous Research, [Hermes security](https://hermes-agent.nousresearch.com/docs/user-guide/security).
19. Nous Research, [Email gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/email).
20. Nous Research, [Agent email address and Himalaya](https://hermes-agent.nousresearch.com/docs/guides/agent-email-address).
21. Nous Research, [Scheduled tasks](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron).
22. Nous Research, [Model providers](https://hermes-agent.nousresearch.com/docs/integrations/providers).
