# NovaMerch Monid guardrails

## Purpose
Use Monid only for bounded business discovery or company research when the existing Google Places workflow, Composio search, or Hunter cannot do the job. It is never an email-sending, lead-approval, or CRM-promotion tool.

## Authority
- Never send email, SMS, WhatsApp, or social messages from Monid output.
- Never create or change a Brevo campaign.
- Never set a lead to Ready to Email.
- Never alter consent, suppression, opt-out, bounced, replied, or sales-stage fields.
- Never use personal-email or phone-enrichment endpoints.
- Do not replace existing Hunter enrichment or Brevo sending workflows.

## Before any Monid run
1. Check whether an existing NovaMerch tool already covers the need. Use it if it does.
2. Run `monid discover`, then `monid inspect`; never guess an endpoint schema.
3. Check `monid balance`.
4. Require one approved Search Queue item containing: query, location, segment, business rationale, and owner.
5. Run one query only. No arrays of locations, search terms, domains, or URLs.

## Spend controls
- No scheduled or unattended Monid runs.
- Require explicit owner approval before every paid run.
- Maximum one Maps run per approval.
- Treat the Maps provider minimum as 20 records / US$0.09, even if a smaller limit is requested.
- Stop and report if a provider returns more records or costs more than expected.
- Do not run when the balance is below US$0.10.
- After every run, report: endpoint, query, run ID, result count, billed units, cost, and remaining balance.

## Data handling
- Store only public business facts needed for qualification: business name, address, website, public phone, category, Maps place ID, source query, source URL, run ID, and retrieval date.
- Dedupe by Maps place ID first, then normalized domain, phone, and business/location.
- Never overwrite an existing lead's manual fields or status.
- Do not treat a public email, phone number, or website as consent to contact.

## Status routing
- Website present and deduplicated: `Website Found`.
- No website or insufficient identity data: `Rejected Source`, with reason.
- Do not use `Needs Review` unless the record has a named resolver, a due date, and only two outcomes: `Website Found` or `Rejected Source`.
- Hunter, not Monid, may move `Website Found` to `Email Found` or `No Email Found`.
- Only a human may move a record to `Ready to Email`, with documented fit, consent basis, approver, timestamp, campaign ID, and no suppression/reply/bounce flags.

## Safety stop conditions
Stop and notify the owner if:
- a provider is degraded/outage or returns unexpected volume;
- duplicate rate is high;
- the record cannot be confidently identified;
- the lead is suppressed, opted out, bounced, or has replied;
- Brevo event ingestion/suppression is not confirmed working;
- any run would exceed the approved budget.

Never expose Monid API keys in prompts, logs, Airtable notes, n8n nodes, or Git.

---
Deployed to Noah 2026-09-19 as a section of `/root/.hermes/AGENTS.md` on `novamerch-hermes` (the server-local context file Hermes reads). This file is the repo copy; if the rules change, update both together.
