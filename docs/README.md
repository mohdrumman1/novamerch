# NovaMerch operating documentation

Last reconciled: 16 September 2026. This index records completed work and proposed work; it is not a live system-health dashboard.

## Current documents

| Document | Purpose and status |
|---|---|
| [Acquisition audit](acquisition-audit-2026-09-11.md) | Evidence behind zero sends, intake failures and operational risks. Historical inspection snapshot; unresolved faults have not been repaired. |
| [Acquisition strategy](acquisition-research-and-hermes-plan.md) | Targeting, channels and low-cost acquisition rollout. Its initial Hermes outline is superseded by the detailed admin plan. |
| [Hermes admin implementation plan](hermes-admin-implementation-plan.md) | Current design for inbox drafts, supplier research, order updates, catalogues and process improvement. Design reference — see the deployment doc below for what's actually running. |
| [Hermes deployment and access](hermes-deployment-and-access.md) | What's actually live (host, model provider, Composio integrations, Telegram bot), why, and how to reach each piece. Updated 2026-09-12. |
| [Hermes Monid guardrails](hermes-monid-guardrails.md) | Rules for Noah's use of Monid: discovery only, one approved query per paid run, spend limits, data handling, lead status routing. Deployed to the server's `AGENTS.md`. |
| [Hermes hosting decision log](hermes-hosting-decision-log.md) | Running log of the hosting-cost back-and-forth (Hetzner vs. free alternatives). Mostly superseded — see the deployment doc for current state. |
| [Published email copy](outreach-copy-2026-09-11.md) | Four initial templates and two follow-ups published in three n8n workflows. [Expression source](outreach-copy-2026-09-11.json) is a copy snapshot, not a complete workflow backup. |
| [Daily report correction](daily-report-node-draft.js) | Locally prepared draft; not deployed. |
| [Local SEO and AEO content plan](seo-aeo-content-plan-2026-09-27.md) | Jev fit, SEO/AEO baseline, deployment gap and six free local content pieces. |
| [Social account launch plan](novamerch-social-account-launch-plan-2026-09-27.md) | One-account-per-day setup, security, content rhythm and image-generation workflow. |
| [CRM and storage options](crm-storage-options-2026-09-27.md) | Admin-panel-first CRM architecture, Airtable assessment and lower-cost migration plan. |
| [Email enrichment automation research](email-enrichment-automation-research-2026-09-15.md) | n8n enrichment workflow design between lead discovery and review, with Hunter-first vendor research, import artifacts and safety gates. |
| [Lead discovery provider research](lead-discovery-provider-research-2026-09-16.md) | Low-cost options for replacing or repairing the broken Google Places lead finder. |
| [PHYX reply](phyx-response-draft.md) | Internal draft; not sent. Re-read the latest customer thread before using it. |

## Implementation status

- **Completed:** pipeline inspection, acquisition research, Hermes design, and publication of six revised email templates. Expressions passed rendering checks; no live workflow was manually executed as a test.
- **Still unresolved:** Google discovery 403, lead-base capacity, Brevo event ingestion/mailbox reply suppression and inconsistent signature phone numbers.
- **Implemented locally (2026-09-14):** acquisition safety rules were added to `admin-panel/src/lib/acquisition.ts` with tests covering approval/consent eligibility, duplicate dispatch keys, 10-send pilot caps, Sydney business-day follow-up timing, opt-out suppression and truthful report wording. This is local executable logic, not a live workflow cutover.
- **Published in n8n (2026-09-14):** the daily email report's `Build Report1` node was replaced with truthful wording that says Email Found leads require review and are not scheduled to send. The initial sender's `Get Ready to Email Leads` Airtable query now has `Return All` off and `Limit` set to 10. Follow-up 1 and Follow-up 2 were inspected and already had `Return All` off with `Limit` set to 30.
- **Verified no initial sends recorded (2026-09-16):** direct Airtable check found `0` records with `Date Emailed` on 2026-09-16, `0` records matching `Ready to Email` plus nonblank email, and `308` records still in `Email Found`. Tomorrow's sender will also send zero unless records are reviewed and explicitly promoted to `Ready to Email`.
- **Airtable queue promoted (2026-09-16):** at the owner's request, `308` records in `Email Found` with a nonblank `Email` and blank `Date Emailed` were updated to `Ready to Email`. Two `Replied` records with email and blank `Date Emailed` were deliberately left unchanged. The initial sender was previously capped to `10`, so this queue should be released gradually if the published sender remains active.
- **Dry run (2026-09-16):** direct Airtable dry run of the sender formula `AND({Status} = 'Ready to Email', {Email} != '')` returned `308` records, all with blank `Date Emailed`; the published sender UI still showed `Nova Merch - 2 Send Initial Emails` as `Published` with `Daily 9am Weekdays` and downstream Brevo send nodes. Expected next scheduled run: select up to `10` records, send via Brevo, then mark those records as emailed. This verifies queue selection, not Brevo delivery acceptance.
- **Prepared locally (2026-09-16):** a scheduled Hunter enrichment workflow artifact was added at `n8n-nova-merch-email-enrichment-review-queue-scheduled.workflow.json`. It runs weekdays at 07:30 after import/activation, reads at most 10 candidates, writes `Email Found` review records, and does not send email or mark leads `Ready to Email`.
- **Live n8n enrichment edit attempted (2026-09-16):** workflow `OeIp2iPEe9P2hHMK` was edited in n8n to add a `Schedule Trigger` with cron `0 30 7 * * 1-5` and connect it to `Get Enrichment Candidates`. The workflow list showed it updated "just now", but the header still showed disabled `Publish` rather than `Published`, and the workflow list did not show a `Published` label. Treat the schedule as saved but not verified active until n8n shows the workflow as `Published` or an automated execution appears.
- **Partially implemented (2026-09-12):** Hermes deployed on a Hetzner VM with a free-tier model provider, Composio (Gmail/GitHub/Brevo), and a Telegram bot — see [hermes-deployment-and-access.md](hermes-deployment-and-access.md). Telegram pairing not yet completed for either owner; Brevo blocked pending an IP-allowlist decision.
- **Not implemented:** mailbox draft broker, admin queue, order mapping, automated PDF exporter, private catalogue sync and customer-update automation — the agent has no drafting/workflow logic wired up yet, only infrastructure access.
- **Not established:** improved delivery or conversion, a complete mailbox/CRM reconciliation, or a reliable end-to-end acquisition pipeline.

## Next work in order

1. Recheck active buying conversations and open orders, including PHYX and Swell, against the latest mailbox and order records.
2. Confirm the monitored mailbox, current signature/phone, task owners and order/shipment mappings.
3. Wire reply/bounce/unsubscribe ingestion into Airtable or the replacement prospect store, then resolve discovery, capacity and review handoff before increasing outreach.
4. Build the local Hermes read/draft pilot, then replay representative messages and test recovery.
5. Harden the existing catalogue generator and implement reviewed PDF output and private asset backups.
6. Select production hosting from measured usage. Consider automatic routine customer updates only after the pilot meets the admin plan's acceptance criteria.

The current Hermes planning allowance is US$15–30/month incremental operating spend for a controlled hosted pilot, not an approved purchase or a guaranteed bill. It supersedes the earlier tentative A$30 experiment envelope. Existing subscriptions, tax, labour, samples and orders are excluded. See the admin plan for sourced price comparisons and assumptions.

Production changes and subsequent verification should be recorded here and in the relevant document. Preserve dated audit evidence rather than rewriting old observations as if they were freshly verified.
