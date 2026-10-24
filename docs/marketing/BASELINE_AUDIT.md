# NovaMerch Growth: Baseline Audit (MKT-001)

Audited 2026-10-24 on branch `develop` (read-only; no code, config or live content changed). Plan source: `NOVAMERCH_GROWTH_MASTER_PLAN.md` (delivered as `NOVAMERCH_GROWTH_IMPLEMENTATION_KIT.zip`, untracked).

Legend: VERIFIED = observed in code or by HTTP check today. UNCERTAIN = assumed, needs evidence. ACCESS = needs an owner. RECOMMEND = proposed change.

## 1. Repository and stack

| Fact | Status | Source |
|---|---|---|
| Public site: Next.js 15.5, React 19, `output: "export"` (static), `trailingSlash: true`, images unoptimized | VERIFIED | `next.config.ts`, `package.json` |
| Public site hosted on Vercel; `/admin/*` is rewritten to `novamerch-admin.rumman-formaai.workers.dev` | VERIFIED | `vercel.json` |
| Admin: Next.js 16 on Cloudflare Workers (opennextjs-cloudflare), own tsconfig | VERIFIED | `admin-panel/package.json`, `admin-panel/wrangler.jsonc` |
| Remote `github.com/mohdrumman1/novamerch`, branch `develop`, 90 commits | VERIFIED | `git remote -v` |
| Plan said the repo was "not exposed"; it is local and complete. Historical stack description matches | VERIFIED | n/a |
| Env var NAMES used in admin: ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET, AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_OPERATIONS_BASE_ID, ALLOWED_ORIGINS, BREVO_API_KEY, BREVO_ENABLED, BREVO_SENDER_EMAIL, BREVO_WEBHOOK_SECRET, EMAILJS_PRIVATE_KEY, ORDER_LINK_SECRET, ORDER_LINKS_ENABLED, PUBLIC_ADMIN_ORIGIN, RESEND_API_KEY, NEXT_PUBLIC_BASE_PATH. Values not read | VERIFIED (names only) | `grep process.env` |
| Public site reads no env vars | VERIFIED | grep of `src/` |
| Production values of ALLOWED_ORIGINS (does it include both `novamerchau.com` and `www.`?) | UNCERTAIN / ACCESS | Cloudflare dashboard |

### Working-tree hygiene (affects deploy safety)
- `src/app/case-studies/` and `public/case-studies/` are **untracked** but the page is **live** (`/case-studies/cooks-hill-united/` returns 200 with 570-tee copy). Production is being deployed from a working tree, not from a committed state. RECOMMEND: commit after owner review so the live site is reproducible.
- Uncommitted edits in `layout.tsx`, `sitemap.ts`, `sports-clubs/page.tsx`, `Nav.tsx`, `Footer.tsx`, `industries/[slug]/page.tsx`. Not touched by this audit.

## 2. Routes (built output, `next build` OK)

Static: `/`, `/free-mockup`, `/mockup-builder`, `/products`, `/sports-clubs`, `/case-studies/cooks-hill-united`, `/robots.txt`, `/sitemap.xml`. SSG: `/products/[slug]` (8 slugs), `/industries/[slug]` (5 slugs). All of these returned HTTP 200 live (checked 14 URLs).

Plan paths not present: `/guides/*`, `/solutions/*`, `/blog/*`. Existing `industries` slugs: construction-trades, gyms-fitness, corporate, real-estate, schools-events. Product slugs in plan (`embroidered-caps`, `custom-hoodies`, `branded-polos`, `branded-workwear`) all exist.

Product and industry pages are generated from inline objects (`src/app/products/[slug]/page.tsx`), each with a short description plus a "considerations" list. VERIFIED thin; matches plan's concern.

## 3. Enquiry funnel (end to end)

```
Page CTA (?utm_source, utm_campaign, copy_version)
  -> src/components/QuoteForm.tsx (client)
  -> POST https://novamerch-admin.rumman-formaai.workers.dev/admin/api/public/lead-intake   (hardcoded URL)
  -> admin-panel/src/app/api/public/lead-intake/route.ts
  -> Airtable table "Leads" (create, or append to Notes if email already exists)
  -> client shows "Request received" state
```

VERIFIED:
- Origin allow-list (403 otherwise), JSON validation, email regex, required consent value `yes`, 500-char field cap, honeypot field `website`.
- Client generates `requestId` (crypto.randomUUID) for idempotency.
- Captured attribution: only `utm_source`/`source`, `utm_campaign`/`campaign`, `copy_version`, `landing_page`. Missing: `utm_medium`, `utm_content`, `utm_term`, `gclid`, `gbraid`, `wbraid`, `fbclid`, referrer, first/last touch time, consent version.
- Attribution is mapped to Airtable fields `Campaign ID` and `Copy Version`; `source` and `landingPage` live only inside the `Notes` JSON string. Therefore source is not a queryable field.
- A repeat email overwrites `Campaign ID` and `Copy Version` with the latest touch and appends to Notes. First touch is lost from structured fields.
- Success is client-side `res.ok` only. No thank-you URL, no conversion event.
- Consent text: "I agree that NovaMerch may contact me about this request. I can opt out at any time." Stored as `consentCapturedAt` in Notes. No marketing opt-in, no consent version.
- Rate limiter and idempotency cache are in-memory `Map`s inside a Workers isolate. They reset per isolate and are not shared across isolates. UNCERTAIN how effective in production; do not rely on them for dedupe of future conversion events.
- Two other public routes exist and were not traced in depth: `quote-requests` (776 lines) and `inbound-enquiries`. RECOMMEND tracing before MKT-006 (lead to quote to Orders linkage).
- Brevo: `api/webhooks/brevo` and Brevo env names exist. Which events fire on lead intake was not traced. UNCERTAIN.

## 4. Analytics and tagging

VERIFIED: **no analytics of any kind in the public site.** No GA4, GTM, Google Ads, Meta pixel, Clarity, Vercel Analytics, `dataLayer`, `gtag` or consent banner anywhere in `src/` or `admin-panel/src/`. So there is no double-tagging risk today and no historical traffic or conversion baseline from the site itself.

ACCESS: Search Console, GA4, Bing Webmaster, Google Ads, Meta, Google Business Profile ownership unknown. Not checked (no credentials; not attempted).

## 5. Technical SEO (live checks)

| Check | Result | Status |
|---|---|---|
| `http://novamerchau.com/` | 308 to `https://novamerchau.com/` | VERIFIED |
| `https://novamerchau.com/` and `https://www.novamerchau.com/` | **Both 200**, no redirect between them | VERIFIED |
| Canonical on both hosts | `https://novamerchau.com/` (bare). Plan assumed `www`; code and sitemap use bare | VERIFIED |
| `robots.txt` | 200; allows `/`, disallows `/admin`, `/api/`; lists sitemap | VERIFIED |
| `sitemap.xml` | 200; 19 URLs, all bare host, trailing slash | VERIFIED |
| Sitemap `lastModified` | `new Date()` at build for every URL (changes every build) | VERIFIED (violates plan rule) |
| `meta robots` | `index, follow` | VERIFIED |
| JSON-LD on home | Organization, WebSite, ContactPoint, FAQPage (5 Q) | VERIFIED |
| JSON-LD on case study | `Article` | VERIFIED |
| Unique per-page titles/descriptions on product, industry, sports-club pages | Not yet checked page by page | UNCERTAIN |
| Core Web Vitals / Lighthouse | Not run | UNCERTAIN |
| FAQPage schema | Present; plan notes no rich-result expectation for this site type. Harmless, do not count on it | RECOMMEND note |

RECOMMEND (needs approval, shared state): choose one host. Options: Vercel domain setting to 301 `www` to bare (matches current canonical, sitemap, robots). Do not change DNS/Vercel without approval.

## 6. Tests and quality gates

| Command | Result |
|---|---|
| `npm run lint` (root) | Reports 4,539 errors / 64,498 warnings. **All from generated or foreign dirs**: `.claude/worktrees`, `admin-panel/.next`, `admin-panel/.open-next`, `.next-recovery-20261009`, `local-catalogues/scripts`. `npx eslint src` is **clean (0 problems)**. Root eslint config does not ignore these. |
| `npx next build` (root) | Passes; static export generated, all routes listed above |
| `cd admin-panel && npm test` | 29 pass, 0 fail (acquisition, brevo, calc, inbound-enquiry, operations, outreach-control, schema-validation, signed-links) |
| Tests for public site | None. No SEO/metadata/sitemap/form tests |

The lint noise is a repo-config problem (LEARNINGS.md tsconfig-leakage class). RECOMMEND adding those paths to eslint `ignores` so `npm run lint` is a usable gate.

## 7. Existing internal docs that overlap this plan
`docs/acquisition-audit-2026-09-11.md`, `docs/SEO_IMPLEMENTATION.md`, `docs/WEBSITE_AUDIT.md`, `docs/growth-os-10k-profit-plan-2026-10-08.md`, `docs/cooks-hill-benchmark-card-2026-10-09.md`. Not reconciled with the new plan in this pass (UNCERTAIN whether they contradict). RECOMMEND a short reconcile before MKT-015.

## 8. Required access (owner-dependent)
Search Console, GA4/GTM, Bing, Google Ads, Meta, GBP; Cloudflare `ALLOWED_ORIGINS` value check; Vercel domain redirect setting; Airtable Leads/Orders schema export (field names, source and margin fields); supplier minimums, lead times and decoration methods; Cooks Hill paid-ad permission; 3-6 months of anonymised lead/order export (not read: PII).

## 9. Implementation gaps vs the plan
1. No analytics or conversion events (MKT-003/005).
2. Attribution thin, first touch lost, source/landing not queryable (MKT-004).
3. No lead to quote to Orders link verified (MKT-006, needs Airtable schema).
4. Contradictory claims live (see `CLAIMS_REGISTER.md`) (MKT-007).
5. www/bare duplicate host, build-time sitemap dates (MKT-009/010).
6. Thin product pages (MKT-012).
7. No blog system (MKT-014).
8. Live site deployed from uncommitted files.
9. Lint gate unusable.

## 10. Recommended first two engineering changes
See `PROGRESS_TRACKER.md`, section "Next two tasks".
