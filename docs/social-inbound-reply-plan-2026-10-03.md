# NovaMerch social inbound replies — controlled rollout

**Status:** design and verification plan. No autonomous social replies are enabled by this document.

## Connection check — 3 October 2026

In the Mohammed Chrome profile, the NovaMerch Composio workspace currently shows:

- **Facebook:** one active connection with conversation/message read actions and Page `Send Message` available.
- **Instagram:** one active connection with `List All Messages`, `Get Conversation` and `Send Text Message` available. The action explicitly requires an existing conversation and an open Meta messaging window.
- **LinkedIn:** no LinkedIn messaging connection or toolkit was visible in the workspace; keep Page messages human-only for now.

The visible connection names (`spiral-pliny` and `caries-balt`) are Composio aliases, not proof of the selected social handles. Before enabling any reply, run an account-specific read and confirm the returned Page/Instagram identity is NovaMerch. Do not infer identity from the alias.

## Noah hourly job update — 3 October 2026

The deployed `social-inbox-monitor` cron (job `5cc37ee78f7b`) now runs every 60 minutes with continuity enabled. Its prompt was tightened so Noah:

- replies only to new messages with plausible merch-buying intent;
- ignores seen/read receipts, non-buying conversation, generic reactions and spam;
- does not follow up when NovaMerch has already replied;
- suppresses opt-outs without replying;
- treats LinkedIn as human-only;
- observes Meta’s messaging window and never retries a closed-window send;
- caps automatic replies at 10 per run and 20 per rolling day; and
- reports uncertain, sensitive, complaint or exact-pricing requests for human handling.

The job is configured, but its first production reply still depends on the account-specific identity check and the platform returning a live inbound conversation. No outbound test message was sent during this change.

### Temporary test-only flag

Until the integration is proven, the live cron is restricted to the exact sender identity `rxmmn_7`. Every other sender is ignored with no reply, follow-up or CRM change. The test cap is three replies per run and five per rolling day. Remove this flag only after the owner explicitly asks for broader processing.

### Test result — `rxmmn_7`

Noah’s manual test run found the exact Instagram message (`Hi, what do you do?`) from `rxmmn_7` to `@novamerch.au`. The verified `INSTAGRAM_SEND_TEXT_MESSAGE` call was attempted once and Meta returned HTTP 403, code 10/subcode 2534022: the message was outside the permitted response window. No retry was made. A new inbound message is required to reopen the window before another send attempt.

## Recommendation

Use Noah as the reply worker behind a small, durable inbox queue. Start with Facebook Messenger and Instagram DMs through Meta’s official messaging APIs (or their Composio actions), using the existing Hermes host and the existing low-cost model. Keep LinkedIn Page messages in LinkedIn’s inbox until a supported Page-messaging partner is deliberately selected.

The first release should be **auto-acknowledgement plus human handoff**, not an unrestricted sales bot:

1. Receive an inbound message and deduplicate it.
2. Classify it as enquiry, quote request, existing order, support, complaint, spam or opt-out.
3. Send one short, friendly acknowledgement only when the platform permits it.
4. Put the full thread, suggested reply and evidence in the admin CRM.
5. Escalate prices, delivery promises, complaints, refunds, personal data, unclear intent and any request to stop contacting them.

## Why the Instagram test failed

The most likely causes are:

- the connected Composio account was not the `@novamerch.au` Business account selected during Facebook Login;
- the Meta app/account webhook or permission was not fully enabled; or
- the message was outside Meta’s 24-hour response window.

Meta’s Send API requires the recipient to have messaged the professional account, and the normal response path is time-limited. Composio documents the same 24-hour restriction and exposes `INSTAGRAM_LIST_ALL_MESSAGES` and `INSTAGRAM_SEND_TEXT_MESSAGE`. A fresh DM from the personal test account should be used for the first diagnostic, not an old thread.

## Channel decision

| Channel | Low-cost path | Initial automation | Important limitation |
|---|---|---|---|
| Instagram DMs | Composio Instagram toolkit, or a small Meta Graph API webhook on the existing Worker | Acknowledge and draft; enable reply after a fresh test passes | Business/Creator account, correct Facebook Login selection, `instagram_business_manage_messages`, and Meta’s response window |
| Facebook Messenger | Composio/Meta Messenger webhook to the same Worker and queue | Same classifier and reply policy as Instagram | Page access token, webhook subscription and Meta app permissions must be verified |
| LinkedIn Page | Enable Page messaging and use LinkedIn Page inbox; evaluate an approved partner only if volume justifies it | Notify Noah/owner and draft; no unofficial browser automation | LinkedIn currently lists Bird CRM, Brandwatch, Hootsuite, Oktopost, Sprinklr and Zoho Recruit as Page-messaging API partners |

Do not use personal-account scraping, browser click bots, replacement Meta ad accounts or unofficial LinkedIn automation. Those approaches are fragile, violate platform rules, and could damage the new accounts.

## Reply voice

Noah should write as NovaMerch, not claim to be Nick or Rumman, and not mention automation. Use plain language, one question at a time and no hard sell. Example acknowledgement:

> Hey, thanks for reaching out to NovaMerch — happy to help. Is this for a club, business or event, and roughly how many items do you need?

For a quote request, collect only what is needed: item, quantity, artwork status, decoration preference, delivery suburb and deadline. Link to the free mock-up form when useful. Never invent a price, stock position or delivery date.

## Hard guardrails

- Never send outside the platform’s permitted window.
- Never send a second reply while a human has replied or the thread is marked `Needs Human`.
- A message containing `stop`, `unsubscribe`, `no thanks`, `remove me` or an equivalent must suppress future outreach immediately; do not debate it.
- Complaints, legal threats, payment/refund requests, safety issues, personal-data requests and angry sentiment go straight to a human.
- Do not expose supplier names, supplier links, internal margin, customer records or private notes.
- Do not make a customer-specific case-study claim without recorded permission.
- Maximum one automatic acknowledgement per thread per 24 hours; maximum two unanswered nudges total, then handoff.
- Record provider message ID, thread ID, source, timestamp, classification, reply text, model, outcome and human owner.
- Treat Composio triggers as at-least-once delivery: deduplicate by provider message/event ID before invoking Noah.

## Cheapest implementation sequence

### 1. Verify connections (no spend)

In Composio, confirm that the connected account is the NovaMerch Facebook Page and `@novamerch.au`, not a personal or Hannah account. List available Instagram/Facebook actions and triggers. For Instagram, run `LIST_ALL_MESSAGES`, then send one fresh message from a personal test account and check that the same thread appears. Do not send a production reply yet.

### 2. Add one inbound queue

Use the existing admin Worker as the webhook receiver and Airtable as the current adapter. Store an immutable event row, then enqueue a bounded Noah job. Add a visible source field (`instagram`, `messenger`, `linkedin`) and a `reply_mode` field (`draft`, `ack_only`, `human_only`). A D1-backed queue can replace Airtable later without changing the admin screens.

### 3. Run a 10-message shadow pilot

For five business days, Noah classifies and drafts replies but a human sends them. Measure duplicate events, missed messages, classifications, edits, response time and model/tool cost. Include an opt-out, complaint, quote request, attachment, old thread and duplicate webhook fixture.

### 4. Enable acknowledgement only

After the shadow pilot passes, allow one deterministic acknowledgement for simple new enquiries on Instagram/Facebook. Keep quote pricing, fulfilment, complaints and all LinkedIn messages in human review. Stop automatically if webhook signatures fail, the account changes, the reply window is closed or the daily cap is reached.

### 5. Expand carefully

Promote only specific reply classes after five consecutive business days with zero duplicate sends, zero missed opt-outs and no material human corrections. Review the inbox and suppression ledger every day.

## Cost expectation

Meta’s messaging APIs do not require a separate per-message licence for this small use case; the practical cost is the existing host, webhook and model usage. Reusing Hermes/freellmapi keeps the incremental cost close to zero apart from the Hetzner host already being paid for. Composio may impose plan or execution limits, so verify the connected workspace’s allowance before relying on it. Do not buy a social inbox subscription until message volume proves the free path is insufficient.

## Acceptance test

The feature is not “done” until all of these pass with a fresh test account:

- Instagram inbound event arrives within two minutes and is visible in the CRM.
- Facebook inbound event follows the same path.
- Duplicate delivery creates one event, not two replies.
- A simple acknowledgement is sent once inside the permitted window.
- An opt-out suppresses the thread and prevents every later automatic reply.
- A price/delivery question creates a draft and human task, not an automatic promise.
- LinkedIn Page messages are visible to the owner and clearly marked `human_only`.
- Every reply can be traced to a provider message ID and a CRM event.

## Sources

- [Composio Instagram toolkit guidance](https://docs.composio.dev/kb/guide/toolkits-instagram)
- [Composio trigger delivery and deduplication](https://docs.composio.dev/kb/guide/platform-triggers)
- [Meta Instagram Send API reference](https://www.postman.com/meta/instagram/folder/uxudqu0/send-api)
- [LinkedIn Page messaging and partner integrations](https://www.linkedin.com/help/billing/answer/a6246714)
