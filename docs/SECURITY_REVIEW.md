# Skeptical production safety review — 2026-10-10

## Checks completed

- `git diff --check` passed.
- Admin lint completed with 0 errors and 27 pre-existing warnings in the legacy mockup builder.
- Admin test suite: 24 passed, 0 failed.
- Public website build passed.
- Admin production build passed with 31 routes.
- Airtable access was used read-only for schema and backup verification.
- Production automation flags remain disabled.
- Customer approval and tracking links are signed, expiring, and scoped by order.
- Customer tracking responses omit supplier costs, margins, staff notes, and internal fields.
- Brevo webhook requires an HMAC signature and records event IDs idempotently in D1.
- Brevo sending is disabled unless `BREVO_ENABLED=true` and a key is present.

## Release blockers

- Brevo staging credentials, sender-domain authentication, template ID, and webhook secret are not configured.
- Manual email delivery test to `novamerch.au@gmail.com` has not been sent.
- Admin still uses the existing shared password session; individual staff roles and MFA remain outside this review.
- Staging deployment smoke test remains pending; no production deployment or branch push was performed.

## Email test gate

The first real message must be sent only to the NovaMerch mailbox, with a staging template and a unique test idempotency key. Inspect the provider message ID and webhook event before any Siennah recipient is considered.
