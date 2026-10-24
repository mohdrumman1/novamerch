# NovaMerch Growth Engine: Progress Tracker

Updated 2026-10-24. Source plan: `NOVAMERCH_GROWTH_MASTER_PLAN.md`.

## Task status

| ID | Task | Status | Evidence |
|---|---|---|---|
| MKT-001 | Repo/access/stack baseline audit | DONE (code, live HTTP); account access items BLOCKED on owner | `BASELINE_AUDIT.md` |
| MKT-002 | Claims and permissions register | DONE (register only; no copy changed) | `CLAIMS_REGISTER.md` |
| MKT-003 | Search Console / GA4 / Bing access | BLOCKED: owner access | audit section 4, 8 |
| MKT-004 | First-touch attribution + UTMs | READY | see below |
| MKT-005 | `generate_lead` event | waits on 004 and GA4 access |
| MKT-006 | Lead to quote to Orders link | waits on Airtable schema export |
| MKT-007 | Claims copy edits | BLOCKED: owner decisions on supplier minimums |

## Next two tasks (ready, small, no spend, no publishing)

### Task A: MKT-004 first-touch attribution capture
- Client: small helper in `src/lib/attribution.ts` capturing utm_medium/content/term, gclid, gbraid, wbraid, fbclid, referring domain, landing path, first and last touch timestamps, stored in sessionStorage/localStorage with try/catch. Wire into `src/components/QuoteForm.tsx`. Generate a non-PII `leadEventId`.
- Server: extend `admin-panel/src/app/api/public/lead-intake/route.ts` to validate (length-capped, charset-checked) and write the new fields inside the existing `Notes` JSON. No new Airtable fields (unverified schema), no new endpoint, no new CRM. Preserve first touch when the email already exists.
- Acceptance: three differently tagged submissions yield one Leads record each with all fields in Notes; invalid values dropped; no email/name in URLs or logs; existing 29 admin tests still pass plus new unit tests for the sanitiser.
- Tests: node test in `admin-panel/tests/` for the sanitiser and note builder; manual run against local `next dev` only.
- Rollback: revert one commit; Notes JSON is additive, old readers unaffected.
- Approval: none for code PR; deploy needs your go-ahead.

### Task B: MKT-009 slice, SEO guard and repo hygiene
- Add `scripts/seo-smoke.mjs` (npm script `test:seo`) that reads `out/` after build and asserts: canonical present and bare-host, sitemap URLs map to built pages, robots lists the sitemap, JSON-LD parses, unique titles, noindex absent on money pages.
- Add `.claude/worktrees/**`, `admin-panel/**`, `.next-recovery-*/**`, `local-catalogues/**` to root `eslint.config.mjs` ignores so `npm run lint` is a real gate (matches CLAUDE.md isolation rule).
- Make sitemap `lastModified` stable (fixed per-page date constants) instead of build time.
- Acceptance: `npm run lint` and `npm run test:seo` pass on a clean build; sitemap output unchanged except dates.
- Rollback: revert commit; no production behaviour changes.
- Not included, needs approval: www to bare 301 in Vercel, committing the untracked case-study files.

## Approvals requested
1. Confirm Task A and B proceed.
2. Supplier-confirmed minimums and any real turnaround, to unblock MKT-007.
3. Written Cooks Hill permission status for ad use.
4. Grant (or confirm absence of) Search Console, GA4, Ads, Meta access.
