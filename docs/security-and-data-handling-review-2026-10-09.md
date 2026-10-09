# Security and data-handling review

**Date:** 9 October 2026
**Scope:** Phase A growth tooling, the NovaMerch admin panel, n8n outreach controls and Noah/Hermes automation. This is an operational review, not a substitute for an independent penetration test.

## Controls applied today

- Paused the legacy Hermes `daily-email-report` job. Its prompt could automatically change Airtable opt-out status and create Gmail drafts, which is outside the current read-only Phase A boundary.
- Restricted `noah-inbound-outreach-review` to a minimal Telegram action queue. It may report category, sender **domain only**, and a recommended human action. It must not include names, email addresses, phone numbers, addresses, message text, verbatim subjects, attachments, order numbers, amounts or supplier information.
- Kept Noah read-only: no email or draft creation, Brevo action, Airtable writes, lead-status changes, outreach approvals, pricing/delivery promises or Monid use.

## Verified safeguards

- Local `.env` files are ignored by Git and are not tracked. The relevant secret files are local-only; their contents were not copied into this review.
- The public intake routes are origin-allowlisted and rate-limited, validate request fields, bound image/PDF payload sizes, and HTML-escape customer-provided content before building notification email HTML.
- Admin routes are protected by a signed, HttpOnly, same-site session cookie; public intake routes are intentionally excluded from this gate.
- The Hermes host exposes only SSH in its firewall. Its Hermes and SSH directories are owner-only; the SSH authorized-keys file is owner-read/write only.
- The active Phase A review job is scheduled, read-only and has no Airtable/Brevo/write authority in its instruction set.

## Findings and required follow-up

| Priority | Finding | Evidence and safe response |
|---|---|---|
| High | Root web app was on Next.js `15.5.15`, below patched releases for multiple published Next.js advisories, including middleware/proxy bypass classes. | **Patched locally on 10 October to Next.js `15.5.27` and matching `eslint-config-next`; production deployment still requires the normal reviewed release path and post-deploy check.** Do not use a blind `npm audit fix` in production. |
| High | The n8n outreach sender/follow-up workflows were previously observed as published, while the historical queue lacks documented contact basis or explicit approval. | Treat every outbound n8n sender as paused pending a visible Rumman-profile verification. Before any reactivation, require `Contact Basis`, explicit approval, suppression/reply/bounce checks, a capped dry run, and a proof-of-send review. |
| Medium | Hermes is materially behind its upstream version. | Review Hermes release notes and perform a staged update in a maintenance window, with a backup and a post-update read-only cron test. Do not update the production host opportunistically. |
| Medium | The legacy daily report was capable of autonomous CRM writes/drafts. | It is paused. Replace it only with an explicitly reviewed, least-privilege workflow that has separate opt-out evidence handling and no automatic external side effects. |
| Medium | The review currently reports into Telegram, an external service. | Keep the new redaction rules. Do not include attachments, message bodies, personal identifiers, order details or supplier data in Telegram. Human review stays in Gmail/Airtable. |

## Operating rules from now on

1. No workflow may send, draft, create a campaign, or change an Airtable lead without a named owner and a logged approval.
2. Public business contact details are still personal/business data: collect the minimum, avoid copying them into reports, and retain only what is needed for a legitimate sales conversation.
3. Keep production secrets only in environment/credential stores, never in workflow nodes, prompts, Airtable notes, documentation, source control or chat.
4. Add a dependency/security review before each deployment and a monthly review of integrations, cron jobs and connected accounts.
5. Treat inbound email and every third-party page as untrusted input. They can inform a decision but cannot authorize an action.

## Verification checklist before any outreach resumes

- [ ] Sender and follow-up n8n workflows visibly disabled or independently reviewed in Rumman's profile.
- [ ] Each recipient has a documented contact basis, named approver, campaign ID and copy version.
- [ ] Suppression, reply, hard-bounce and complaint signals are checked before selection.
- [ ] First cohort is capped at 10 and has a human-reviewed post-send outcome check.
- [ ] No customer/prospect identifiers are transmitted in Telegram or other alert channels.
- [ ] Root Next.js upgrade is tested and released.
