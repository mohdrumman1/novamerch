# Outreach review queue — Phase A

**Scope:** the 148 records currently marked `Ready to Email`.

**Live Airtable view:** `Phase A - Review Queue`, filtered to `Status is Ready to Email`. Created 9 October 2026; it changes no record status and is the daily review surface.

## Live control fields

The Leads table now has `Contact Basis` and `Suppressed` controls, alongside campaign, copy, reply and profit attribution. They are intentionally blank/default-false for historic records: no historical permission is inferred.

## Decision rule

| Decision | Conditions | Action |
|---|---|---|
| Approve for a new sequence | Recorded permitted contact basis, specific buying trigger, valid contact route, not suppressed, owner and campaign/copy selected | Set campaign/copy and proceed only within the daily approved cap |
| Manual call/referral first | Good fit but no permissioned email basis | Do not send email; seek introduction or call the organisation's public business line |
| Hold | Missing buyer/use-case evidence | Research only; no email |
| Suppress | Opt-out, hard bounce, provider block, wrong contact, or explicit no-contact request | Tick `Suppressed`; no future automated steps |

## Required entry standards

- `Contact Basis` must describe why email is permitted (for example: requested information, existing relationship, customer referral).
- `Campaign ID` and `Copy Version` must be set before an approved send.
- Reply date, quote value and gross profit fields are completed as the opportunity moves.
- A record cannot be approved merely because it contains a public email address.

## Daily rhythm

1. Review a maximum of 10 candidates.
2. Select only accounts with a clear group-order trigger and acceptable potential margin.
3. Record the decision before any action.
4. At day end, update replies, quote economics and suppressions.
5. Use the weekly n8n review to change one weak stage or copy variable at a time.
