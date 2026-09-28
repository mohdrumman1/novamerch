# NovaMerch CRM and storage options

27 September 2026 · Australia/Sydney

## Decision in one sentence

Keep the **admin panel as the CRM interface**. Treat Airtable as the current data adapter, not as the product. Test a lower-cost backend behind the same admin-panel screens before changing the live source of truth.

## What is already built

- The public website now has a dedicated `/free-mockup` conversion page as well as the homepage quote form and `/mockup-builder`.
- The quote form captures name, organisation, email, phone, suburb/delivery area, required-by date, product, quantity, budget and consent.
- It also records `source`, `campaign`, `landing_page` and initial `pipeline_status = New` as hidden form fields.
- The form currently submits through the existing Formspree endpoint. It is not yet a direct admin-panel/Airtable API integration.
- **Updated this turn:** the form now posts to the new admin-panel `/api/public/lead-intake` endpoint, with origin allowlisting, rate limiting, consent validation, email validation and idempotency. The endpoint writes a `New` customer record to Airtable and stores intake attribution/details in the Notes field.
- The mock-up builder already has a separate public quote-request endpoint in the admin app; that endpoint writes to the existing operational systems when its production configuration is present.
- `admin-panel/src/lib/outreach-control.ts` contains the local approval, suppression, dispatch-key and event-ledger rules. Its tests pass, but those rules are not yet the live sender cutover.
- Production build passes after the new route and form changes.

## Options

| Option | Ongoing software cost | Fit for NovaMerch | Main trade-off |
|---|---:|---|---|
| Airtable Free/paid | $0 on Free for small use; paid plans vary by seat and limits | Fastest continuation because the current mappers and workflows already use it | Cost can grow with editors, records, automations and attachments; current schema still needs hardening |
| Baserow | Free cloud and self-hosted options | Closest spreadsheet-style replacement for a small team | Another hosted/self-hosted system to secure; migration of formulas and automations required |
| NocoDB | Free self-hosted community edition; hosting still has a cost | Good Airtable-like UI over Postgres and suitable for a small internal team | Operational responsibility, backups and upgrades move to us |
| Supabase Postgres | Free tier for a small pilot; paid as usage grows | Strong relational foundation for leads, events, quotes, orders and row-level access | Requires building the CRM views and auth/data rules rather than importing Airtable views |
| Cloudflare D1 + R2 | Low/no software cost at small volume on the existing Cloudflare stack | Natural fit for the admin app already hosted on Workers; D1 for records, R2 for assets/backups | More engineering work and less spreadsheet-like editing for non-technical users |

Pricing and limits change, so confirm the selected provider immediately before migration. Current references: [Airtable pricing](https://airtable.com/pricing), [Baserow pricing](https://baserow.io/pricing), [NocoDB pricing](https://nocodb.com/pricing), and [Supabase pricing](https://supabase.com/pricing).

## Recommendation

Use a two-stage decision:

1. **Short term:** keep Airtable as the source of truth while we connect the website intake and event ledger correctly. Do not pay for a migration before the fields and workflow are stable.
2. **Pilot:** add a storage interface to the admin panel and mirror a small, redacted/test dataset into **Supabase Postgres** or **Cloudflare D1**. Choose Supabase if the priority is easier relational querying and backups; choose D1 if minimising vendors and keeping the app on Cloudflare matters more.
3. **Do not use Baserow/NocoDB as a second live CRM** during the pilot. They are good alternatives, but running two editable systems creates duplicate ownership and reconciliation risk.

The preferred long-term architecture is:

```text
Website + social + approved outreach
          -> admin-panel intake/API
          -> CRM storage adapter (Airtable now; pilot DB next)
          -> admin-panel pipeline, tasks, quotes and order history
          -> event ledger + reporting
```

## Migration plan

### Phase 0 — make the existing path authoritative (1–3 days)

- Decide whether Formspree remains only a temporary notification fallback.
- Add a public admin-panel intake endpoint for the simple website form, with origin checks, rate limiting, honeypot/Turnstile hook, idempotency and structured fields.
- Write every request to the admin-panel CRM and return a request ID to the website.
- Set every new record to `New`, not `Needs Review`.
- Add `source`, `campaign`, `landing_page`, `consent`, `owner`, `next_action_at` and `last_event_at` to the CRM record.
- Confirm one test submission appears in the admin panel and one notification arrives. Do not use a real customer record for this test.

### Phase 1 — separate the UI from Airtable (3–5 days)

- Define a typed repository interface for leads, contacts, activities, suppression, quotes and orders.
- Keep the existing Airtable implementation behind that interface.
- Add contract tests for create, update, dedupe, suppression, event append and list/filter behaviour.
- Make the admin panel and public intake use the repository, not Airtable-specific field names.

### Phase 2 — pilot the cheaper backend (5–10 days)

- Create a separate pilot database with no production secrets.
- Import a small synthetic dataset plus a redacted copy of 20–50 historical records.
- Recreate the exact admin views: New, Contacted, Interested, Quote Requested, Won, Lost, Suppressed and Exceptions.
- Replay intake, dedupe, suppression and event-ledger tests against both adapters.
- Measure backup/restore, latency, permissions and operator usability.

### Phase 3 — dual-write and reconcile (5 business days)

- Keep Airtable authoritative, but write new test submissions to both stores.
- Compare record counts, normalized emails, statuses, timestamps, suppression and event IDs daily.
- Stop immediately on any mismatch affecting consent, suppression, quote amount, delivery date or customer identity.

### Phase 4 — cut over (only after sign-off)

- Export and archive a dated Airtable snapshot.
- Switch the repository default to the selected backend.
- Keep Airtable read-only for a defined rollback window.
- Verify one complete path: website request → CRM record → owner task → quote → outcome → report.
- Remove the old adapter only after the rollback window and reconciliation report are complete.

## Cost controls

- Keep one CRM, one authoritative owner and one event ledger.
- Store images/documents in object storage or links, not repeated database attachments.
- Retain only the fields needed for outreach, quotes, fulfilment and suppression.
- Use daily export/backups even on a free tier.
- Set provider spend alerts and hard limits before enabling automations.
- Do not add paid Monid, SEO or advertising spend to compensate for an unreliable CRM.

## Next steps now

1. ~~Deploy the website changes.~~ Completed 28 September 2026: the storefront is live on Vercel and the admin endpoint is live, with `ALLOWED_ORIGINS` set to `https://novamerchau.com`.
2. Run a synthetic end-to-end test and confirm one test record appears in the admin panel as `New`; delete or archive the test record after verification. This has not been run yet because it writes to Airtable.
3. Add the repository interface while Airtable remains the adapter.
4. Choose Supabase or Cloudflare D1 for a no-cost pilot after measuring the current record volume, attachments and admin users.
5. Keep Formspree only as a monitored fallback during the first deployment window; do not automatically dual-submit and create duplicates.
6. Do not increase outreach volume until the CRM, suppression and event ledger pass the existing send gate.
