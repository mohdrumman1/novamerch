# NovaMerch — Project Instructions for Agents

This repo holds **three separate things** that share a folder but not a build:

| Path | What it is | Stack | Deploy |
|---|---|---|---|
| `src/` (root) | Public marketing/mockup-builder site | Next.js 15, React 19 | Vercel |
| `admin-panel/` | Internal admin tool (customers, quotes, orders, invoices, shipments, supplier orders, dashboard) | Next.js 16, React 19, own `tsconfig.json` | Cloudflare (opennextjs-cloudflare) |
| `local-catalogues/` | Local-only PDF proposal generator for sales leads | Node script + HTML/CSS templates | **Not deployed, gitignored** |

Each has its own `package.json`, `tsconfig.json`, and `@/*` import alias pointing at its own `src/`. **Never** let the root project's `tsconfig` glob into `admin-panel/` or `local-catalogues/` — see `LEARNINGS.md` (2026-06-05 entry) for what breaks when it does.

## Before debugging anything in this repo

**Read `LEARNINGS.md` first and grep it for keywords related to your symptom.** It is the project's incident log — root cause, fix, and a "if it recurs" checklist for every non-obvious bug found so far (Airtable field-mapping gaps, catalogue template colour bleed, tsconfig monorepo leakage, em-dash/en-dash entity bugs, etc.). Do not re-diagnose something already solved there. When you fix something new and non-obvious, **add an entry in the same format** (Tags / Status / Issue / Root cause / Fix / Verify / If it recurs) — prepend it under the most recent entry, don't append to the bottom.

## admin-panel — data flow and gotchas

Airtable (base `appkQYN4Gcb1pSzu1`) is the source of truth for `customers`, `quotes`, `orders`, `invoices`, `shipments`, `supplierOrders`. `goods` and `settings` are intentionally local-only (localStorage + seed file) — don't try to move those to Airtable without being asked.

The read path for any Airtable table, end to end, is:
```
Airtable table → recordTo<X>() mapper in src/lib/airtable-mappers.ts
              → fetched in src/app/api/bootstrap/route.ts's `sources` array
              → dispatched via HYDRATE_REMOTE in src/context/DataProvider.tsx
              → consumed via useData() in a page/component
              → any cost/profit/margin math goes through src/lib/calc.ts
```
**A new Airtable field or table is invisible to the app until all five links in that chain exist.** If a number is $0 or missing on a page that should have data, check each link in order before assuming the Airtable data itself is wrong — see the 2026-08-18 "Admin dashboard showed $0" entry in `LEARNINGS.md` for a worked example (Supplier Orders table existed and had good data, but was missing from all five layers).

Field-name mapping (`airtable-mappers.ts`) uses **exact Airtable field name strings** (case, spacing) as object keys — don't guess them. Confirm via:
```
GET https://api.airtable.com/v0/meta/bases/{base}/tables   (Authorization: Bearer <AIRTABLE_API_KEY>)
```
This also lists valid `singleSelect` choices — writing a value not in that list silently fails the field, so check before assuming a status/enum field.

Airtable linked-record fields (`Related Order`, `Related Customer`, etc.) can read back **empty for a second or two after a write** — this is read replica lag, not a failed write. Re-fetch 1-2 times before concluding a link write failed.

`admin-panel` is served under the `/admin` base path and gated by a cookie session, not a bearer token. To hit its API routes directly (e.g. for verification scripts), log in first:
```js
POST /admin/api/auth/login
Content-Type: application/x-www-form-urlencoded   // NOT JSON — plain JSON returns 500
body: username=...&password=...&next=/admin/dashboard
```
capture the `Set-Cookie` header and send it on subsequent requests. Hitting a route without `/admin` prefix or without the cookie returns a misleading 404/307 that looks like the route is broken when it isn't.

The Supplier Orders page's Add/Edit/Delete UI (`/supplier-orders`) persists through `/api/supplier-orders` to Airtable. Keep `SupplierOrder` financial fields optional end to end: use `undefined` in app state and `null` in Airtable writes for unrecorded money; never coerce it to `$0`.

## local-catalogues — creating a client catalogue/proposal

**This is the canonical process — follow it exactly, don't improvise a new one:**

1. Read `local-catalogues/README.md` in full before starting. It documents the script, its flags, the two templates (business vs sports club), and the file-naming convention.
2. Run `node scripts/generate-proposal.js <lead-id-or-name> [options]` from `local-catalogues/`. This fetches the lead from Airtable, scrapes brand color/logo, fills the right template, and creates a Draft Proposal record. Do not hand-copy the HTML/CSS template yourself when the script can do it — the script is what keeps color/placeholder substitution consistent.
3. Add product images to the generated assets folder and update `img src` paths.
4. **Before telling the user the catalogue is done, run this validation checklist — do not skip it, this is exactly the class of bug that has recurred before (see `LEARNINGS.md` 2026-08-18 Alliance Group entry and 2026-06-24 Swell Fitness entry):**
   - `grep -niE "#[0-9a-f]{6}|rgba\(" <new-file>.css` and confirm **every** hit resolves to the new brand's colour, not a previous client's — templates carry stale hardcoded colours (e.g. inside `::after` pseudo-elements) outside the `:root` block that a colour swap can miss.
   - Check each product image's content-to-canvas fill ratio and aspect ratio before trusting `object-fit: cover` (Pillow `ImageChops.difference` bbox trick, documented in the Alliance Group `LEARNINGS.md` entry). If images have significant white padding or wildly varying aspect ratios, switch that image box to `object-fit: contain` — don't assume all supplier photos are pre-cropped tight.
   - `grep -nE "&ndash;|&#8211;|&#x2013;|&mdash;|&#8212;|&#x2014;"` across the generated HTML files — HTML dash entities render fine visually but are invisible to a plain-text em-dash grep, and have shipped before.
   - Render a headless screenshot of the finished HTML and actually look at it — do not conclude "done" from source diffs alone.
   - No unconfirmed prices, no "Australian made" claims, no delivery-time guarantees (per `local-catalogues/README.md` Notes section).
5. Only after that checklist passes, hand off the PDF-export steps (Chrome print, A4 portrait, no margins, background graphics on) and the `NovaMerch_[Template]_[ClientName]_[MonthYear].pdf` naming convention from `local-catalogues/README.md`.

If the user asks for a "catalog" without specifying which of the above (a new client proposal vs. something else), ask — don't assume.
