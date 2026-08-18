## 2026-08-18 - Admin dashboard showed $0 costs/profit despite real supplier data existing in Airtable (Supplier Orders never wired to app)

**Tags:** admin-panel, airtable, supplier-orders, dashboard, calc, data-provider, bootstrap, orphaned-record
**Status:** Fixed

**Issue:** `admin-panel` dashboard (`/dashboard`) showed $0.00 for Total Costs, Expected Profit, Costs Paid, and Actual Profit for orders that had real, known supplier costs (e.g. Cooks Hill #O1002, Swell Fitness #O1001). Airtable's `Supplier Orders` table actually had the correct-ish data for Cooks Hill, but it never reached the dashboard.

**Root cause (5 layers, all had to be fixed together):**
1. `admin-panel/src/lib/airtable-mappers.ts` had **no mapper functions at all** for the `Supplier Orders` table — Airtable field names (`Projected Cost AUD`, `Booked Payment AUD`, `Related Order`, etc.) had no path into the app's TypeScript model.
2. `admin-panel/src/app/api/bootstrap/route.ts` never fetched the `Supplier Orders` table — even a correct mapper would go unused.
3. `admin-panel/src/context/DataProvider.tsx` sourced `supplierOrders` state from a **local seed file** (`src/data/supplierOrders.ts`) + `localStorage`, fully disconnected from Airtable, regardless of what was in the base.
4. `admin-panel/src/app/dashboard/page.tsx` never consumed `supplierOrders` from `useData()` — all cost math came only from `Order.lineItems[].costPerUnit` (always unset for real orders) and `Order.transportCost` (always 0), which is why every cost figure was exactly $0.
5. The one existing Supplier Orders Airtable record for Cooks Hill (`recZWqE1XlqCJLMIa`) was **orphaned** — its `Related Order`/`Related Customer` link fields were empty, so even a fully-wired app couldn't have traversed to it from the Order.

**Fix:**
- `airtable-mappers.ts`: added `recordToSupplierOrder` / `supplierOrderToFields`, keyed on exact Airtable field names (see the file for the mapping — e.g. `f["Projected Cost AUD"]` → `projectedCostAud`).
- `api/bootstrap/route.ts`: added `{ key: "supplierOrders", table: "Supplier Orders", mapper: recordToSupplierOrder }` to the `sources` array.
- `context/DataProvider.tsx`: `supplierOrders` now hydrates only from the `/api/bootstrap` `HYDRATE_REMOTE` payload; removed the local-seed/localStorage path (`src/data/supplierOrders.ts` is now unused dead seed data — do not resurrect it as a data source).
- `lib/calc.ts`: added `supplierOrdersForOrder`, `orderProjectedCost`, `orderBookedCost` — these look up `SupplierOrder[]` by `relatedOrderId` and fall back to the old `lineItemsCost()`/`transportCost` behavior only when an order has no linked Supplier Order record. `orderExpectedProfit`, `orderActualProfit`, and `calcPL` now take an optional `supplierOrders` param and use these helpers.
- `app/dashboard/page.tsx`: now destructures `supplierOrders` from `useData()` and uses `orderProjectedCost`/`orderBookedCost` instead of raw `lineItemsCost()` for Total Costs, Expected Profit, Costs Paid, and In-Transit Cost.
- Airtable data: PATCHed `recZWqE1XlqCJLMIa` to set `Related Order`/`Related Customer` links and correct `Pending Balance Estimated AUD`/`Projected Cost AUD`; created 2 new linked Supplier Orders records for Swell Fitness (`#O1001`).

**Verify:**
```
# Confirm every Order that should have a cost has a linked, non-orphaned Supplier Orders record:
node -e '
require("dotenv").config({ path: "admin-panel/.env.local" });
const key = process.env.AIRTABLE_API_KEY, base = process.env.AIRTABLE_BASE_ID;
fetch(`https://api.airtable.com/v0/${base}/Supplier%20Orders`, { headers: { Authorization: `Bearer ${key}` } })
  .then(r => r.json())
  .then(d => d.records.forEach(r => console.log(r.id, r.fields["Related Order"], r.fields["Related Customer"])));
'
```
Every record should show a non-empty `Related Order` and `Related Customer` array. Then hit `/api/bootstrap` (see "If it recurs" below for the login step — it's cookie-gated) and confirm `supplierOrders` is non-empty and `orders[].id` values appear as `relatedOrderId` on at least one supplier order.

**If it recurs — checklist:**
1. **New order with a real supplier cost shows $0 on the dashboard** → check, in this order: (a) does a Supplier Orders record exist in Airtable for it at all? (b) is its `Related Order` link field actually populated (Airtable link fields can read back empty for ~1-2s after a write — re-fetch before concluding it failed, this happened twice in this session and was a transient read lag, not a real bug)? (c) does `orderProjectedCost`/`orderBookedCost` in `calc.ts` find it via `relatedOrderId`?
2. **Adding a NEW field to the Supplier Orders Airtable table** → it will silently be dropped until you add it to both `recordToSupplierOrder` and `supplierOrderToFields` in `airtable-mappers.ts`. Field name strings must match Airtable exactly (case, spacing) — check via `GET /v0/meta/bases/{base}/tables` if unsure, don't guess.
3. **Testing `/api/bootstrap` directly with curl** → the admin panel is behind cookie auth and served under the `/admin` base path. Log in first: `POST /admin/api/auth/login` as `application/x-www-form-urlencoded` (NOT JSON) with `username`/`password`/`next` fields, capture the `Set-Cookie` header, then pass it on subsequent requests. Hitting `/api/bootstrap` (no `/admin` prefix, no cookie) returns the wrong app's 404 page or a 307 redirect — both look like failures but aren't the real bug.
4. **The Supplier Orders page (`/supplier-orders`) Add/Edit/Delete UI is still local-only** — it dispatches to `DataProvider`'s in-memory reducer state only, with NO Airtable write. This is a known, intentional gap, not a regression. If a user asks to edit a Supplier Order from that page and expects it to persist/show on the dashboard after reload, it currently won't — wiring that page's CRUD to Airtable (mirroring how Customers/Orders/Quotes already do it) is unstarted follow-up work, not a bug to "fix" by guessing.

---

## 2026-08-18 - New catalogue built from a copied template inherited stale brand colours + cropped product images (Alliance Group)

**Tags:** catalogue, local-catalogues, colour-scheme, object-fit, image-cropping, template-copy, checklist
**Status:** Fixed

**Issue:** Building `local-catalogues/Alliance Group/` by copying `business-catalogue.css` produced two visible defects: (1) the cover page had a green glow behind the title on a black/orange brand, and (2) product photos looked "too zoomed in" with edges cut off.

**Root cause:**
1. **Stale hardcoded colour, not just unset variables.** `business-catalogue.css` is not a clean template — it still carries the previous client's (Green Thumbs) colours in two places: the `:root` variables (expected, meant to be overridden) AND a hardcoded `rgba(22,101,52,0.4)` inside `.page-cover::after` (the cover accent glow), which does NOT reference `var(--primary)`. Overriding only the `:root` block leaves this glow silently green regardless of brand. `grep -i` for the old hex (`166534`, `052E16`, `4ADE80`) after any colour swap would have caught it; I only skimmed the `:root` block.
2. **Source images had way more white-space padding than the CSS assumed.** `.img-box img { object-fit: cover }` assumes supplier photos are already tightly cropped to the product (true for the Cooks-Hill/blue-horizon style photos). These 4 images (product mockups with logo overlaid) had 30-50% empty white canvas around the product and widely varying aspect ratios (checked with Pillow: content fill ranged 50-71%, aspect ratios from 0.78 to 2.35). `object-fit: cover` on a box with a fixed ~1.3 aspect crops to fill, which on a portrait or very-wide source image cuts into the product itself.

**Fix:**
- Cropped each image to its content bounding box (whitespace trimmed, +8% padding) using Pillow (`ImageChops.difference` against a white canvas to find the bbox).
- Changed `.img-box img` from `object-fit: cover` to `object-fit: contain` and added `padding: 4mm` to `.img-box`, so the whole product is always visible regardless of source aspect ratio, letterboxed on the box's existing `#F5F5F5` background.
- Replaced the hardcoded `rgba(22,101,52,0.4)` in `.page-cover::after` with the new brand's primary colour as rgba.

**Verify:**
```
grep -n "rgba(" "local-catalogues/Alliance Group/alliance-group-catalogue.css" | grep -v "255,255,255\|0,0,0"
```
Should only show the current brand's colour, not a prior client's.
```python
from PIL import Image, ImageChops
# diff each product image against a white canvas; getbbox() should be
# noticeably smaller than the full image size before shipping the crop
```

**If it recurs — checklist before shipping any new catalogue:**
1. After copying a template CSS, `grep -niE "#[0-9a-f]{6}|rgba\(" <new-file>.css` and check EVERY hit resolves to the new brand, not just the `:root` block — templates carry stale hardcoded colours outside `:root`.
2. Before dropping product photos into `img-box`, check each image's content-to-canvas fill ratio and aspect ratio (Pillow bbox trick above). If fill% is low (lots of white padding) or aspect ratios vary widely across the set, either pre-crop the whitespace or use `object-fit: contain` instead of `cover` — don't assume supplier-photo conventions hold for mockup-generator images.
3. Always render a headless Chrome screenshot of the finished catalogue (`chrome --headless --screenshot`) and actually look at it before calling the catalogue done — do not just trust that CSS variables were swapped correctly.

---

## 2026-06-24 - Em-dashes hidden in HTML en-dash entities on Swell Fitness catalogue files

**Tags:** em-dash, en-dash, html-entity, ndash, swell-fitness, catalogue, content-pseudo-element
**Status:** Fixed

**Issue:** En-dash HTML entities (&ndash;) were used as punctuation separators in product names and size-range labels across two Swell Fitness catalogue HTML files. They rendered as en-dashes in the browser but were invisible to plain-text grep for literal UTF-8 em-dash characters.

**Investigation:** Ran four grep passes per file: (1) literal UTF-8 em-dash byte sequence, (2) HTML entity forms (&mdash;, &#8212;, &#x2014;), (3) Unicode codepoint forms via perl regex, (4) en-dash entity forms (&ndash;, &#8211;, &#x2013;). The first three passes returned NO MATCHES on all files. Only pass 4 found hits. Also checked the shared business-catalogue.css for CSS content: pseudo-elements and CSS-escaped \2014; all were clean (empty strings and " per unit" plain text, no dashes).

**Root cause:** 
- `local-catalogues/Swell Fitness/swell-fitness-siennah-brief-catalogue.html` lines 147, 178, 211, 282: `XS&ndash;3XL` used in Sizes meta rows and a list item.
- `local-catalogues/Swell Fitness/swell-fitness-catalogue.html` lines 225, 255, 303, 330: `&ndash;` used as a separator in product names ("Hoodie &ndash; Teal Print", etc.).

**Fix:**
- `swell-fitness-siennah-brief-catalogue.html`: replaced all 4 instances of `&ndash;` with a plain hyphen `-`. Context was alphanumeric size ranges (XS-3XL), not pure numeric ranges, so plain hyphen is correct.
- `swell-fitness-catalogue.html`: replaced all 4 instances of `&ndash;` with a plain hyphen `-`. Context was product name separators ("Hoodie - Teal Print").
- `business-catalogue.css`: no changes needed.

**Verify:**
```
grep -nE "&ndash;|&#8211;|&#x2013;" "/Users/rumman/Desktop/Coding Projects/novamerch/local-catalogues/Swell Fitness/swell-fitness-siennah-brief-catalogue.html"
grep -nE "&ndash;|&#8211;|&#x2013;" "/Users/rumman/Desktop/Coding Projects/novamerch/local-catalogues/Swell Fitness/swell-fitness-catalogue.html"
grep -n $'\xe2\x80\x94' "/Users/rumman/Desktop/Coding Projects/novamerch/local-catalogues/Swell Fitness/swell-fitness-siennah-brief-catalogue.html"
```
All should return no output.

**If it recurs:** check HTML entity forms (&ndash;, &mdash;) before claiming the file is clean. Literal UTF-8 grep will miss HTML-entity-encoded dashes. Also check shared CSS content: pseudo-elements and CSS-escaped \2014 in business-catalogue.css.

---

## 2026-06-24: Catalogue/quote storage pattern in novamerch

**Tags:** catalogue, swell-fitness, quote-system, local-catalogues, proposal, airtable
**Status:** Discovery (documented)

**Discovery:** Customer catalogues and quotes in this repo live as standalone A4-portrait HTML files under `local-catalogues/<Business Name>/` (folder is gitignored and never deployed). There is no dynamic route, JSON store, or admin-panel page that renders catalogues; preview is via opening the HTML in Chrome and printing to PDF.

**Investigation:**
1. Repo root contains `local-catalogues/` with a `README.md` explaining the workflow: a Node CLI (`scripts/generate-proposal.js`) scaffolds `[slug]-catalogue.html` + `[slug]-catalogue.css` per customer from two base templates (`business-catalogue.html` for trades/business, `sports-club-catalogue.html` for clubs).
2. Two folders match the Swell Fitness brief: `Swell Fitness/` (9-product catalogue at `swell-fitness-catalogue.html` + an issued quote at `swell-fitness-quote-150-socks.html`). Brand teal hard-coded as `#1AAEB7` (NOT the generic `#2DD4BF`, always check repo first).
3. Admin panel (`admin-panel/`) is a separate Next.js project on port 3001. It wires to Airtable (Products, Customers, Quotes, Orders, Invoices, Shipments) via `/api/bootstrap`. No `/catalogues` or `/proposals` route exists yet; proposals are tracked in Airtable directly and the gap is acknowledged in `local-catalogues/PROPOSAL-AUTOMATION-ROADMAP.md`.
4. Mockup Builder is a customer-facing tool at `admin-panel/src/app/mockup-builder/` (also surfaced on the main site at `/mockup-builder`). It POSTs quote requests to `admin-panel/src/app/api/public/quote-requests/route.ts`, which writes to Airtable and fires an admin email via Resend/EmailJS. It is independent from the local-catalogues PDF workflow.
5. `admin-panel/src/data/*.ts` (customers, quotes, etc.) are mock arrays NOT used at runtime. `DataProvider` reads Airtable bootstrap. Roadmap flags these as candidates for removal.

**Root cause (schema):** Each catalogue HTML follows a fixed structure: cover page, 1+ three-up product pages, optional brand-notes page, thank-you page. Each product row uses `.img-box` + `.product-details` with `.product-name`, `.product-rule`, `.product-price`, `.product-desc`, and a `.product-meta` block listing Colour / Sizes / Logo (extendable to MOQ / Supplier / SKU). Brand colour override lives inline in the page `<style>` block, NOT in the shared CSS. Slug pattern: lowercased hyphenated business name, used as both folder name and file prefix.

**Fix (Swell Fitness Siennah brief):**
- Created `local-catalogues/Swell Fitness/swell-fitness-siennah-brief-catalogue.html` with 3 items (Heavyweight Tee, Crewneck Sweater, Embroidered Hoodie). All unit prices = `TBC, awaiting supplier confirmation`. Brand teal pulled from existing `#1AAEB7` token (not invented).
- Added `local-catalogues/Swell Fitness/CUSTOMER.md` capturing contact, brand tokens, brief summary, and open questions.
- Preserved the legacy 9-product `swell-fitness-catalogue.html` and the issued quote. Did not overwrite.
- Did NOT push to Airtable (per director instruction).

**Verify:** Open `file:///Users/rumman/Desktop/Coding Projects/novamerch/local-catalogues/Swell Fitness/swell-fitness-siennah-brief-catalogue.html` in Chrome. No dev-server route renders it. Print to PDF (A4 portrait, no margins, background graphics on) per `local-catalogues/README.md`.

**If it recurs (gotchas for next catalogue build):**
- Brand teal `#1AAEB7` is the Swell Fitness token; do NOT swap in `#2DD4BF` from generic brand guidance.
- `local-catalogues/` is gitignored, files won't show in `git status`. Confirm with `ls` not `git status`.
- Pricing convention: never invent. Use `TBC, awaiting supplier confirmation` until supplier confirms.
- Mockup Builder ≠ catalogue. The Builder is a customer-facing PDP-style quote request UI; catalogues are static PDF proposals sent by Nic.
- Customer email NOT to be fabricated; mark as `TODO: confirm` with a clearly fake placeholder domain (e.g. `*.placeholder`).
- Root `tsconfig.json` excludes `local-catalogues`. Do not import from it into the Next app.

---

## 2026-06-19: Orange swatch hexes overwritten by blue during brand recolour

**Tags:** swatches, colors, mockup-builder, brand-refresh, data-vs-theme
**Status:** Fixed

**Issue:** On the mockup builder, the "Orange" colour swatch dot was rendered blue on every product that had an Orange option, while the tooltip and the actual product mockup image were still orange. Bug was purely in the swatch circle's hex value.

**Investigation:** Grepped `public/mockup-builder-customer.js` for `orange` and found multiple product colour arrays where `{ name: 'orange', hex: '<blue>' }` had the hex pointing to a blue value. The pattern showed a previous global search-replace had treated DATA hexes as if they were THEME tokens.

**Root cause:** A bulk orange-to-blue brand refresh swept hex literals indiscriminately. Theme tokens, CSS variables, and UI accent classes were the intended targets, but the swatch DATA (which catalogues physical product colours customers can order) was caught in the same sweep. The swatch label stayed "Orange" but the hex became blue.

**Fix:** Restored each affected orange swatch hex to `#F97316`. See diff: `public/mockup-builder-customer.js`.

**Verify:** Open `http://localhost:3000/mockup-builder`, switch through T-shirt, Cap, Beanie, Shorts, Insulated Bottle, Travel Cup, and confirm the swatch dot labelled "Orange" is visibly orange and matches the product render.

**If it recurs:** Any future brand recolour MUST distinguish theme tokens from data. Never run a bulk find-replace on hex literals across `public/mockup-builder-customer.js` or any product/swatch data file. Touch only `tailwind.config.*`, `globals.css`, theme token files, and component className lists. Data hexes are immutable catalogue values.

---

## 2026-06-18: Dark swatches invisible on dark sidebar + customer logos dropped from quote email

**Tags:** mockup-builder, swatch, color, visibility, quote, logo, email, airtable
**Status:** Fixed

**Issue:** (1) Dark color swatches (Black, Dark Gray, Navy, Forest, Dark Grey) were invisible against the dark sidebar background (`#0D1526`). Dark Gray specifically had a malformed hex `#94A3B8555` (extra `555` suffix), causing the swatch to render an invalid/unexpected color. (2) When a customer uploads logos and submits a quote request, the logos were completely absent from the admin notification email and Airtable record.

**Investigation:** (1) Swatch border was set to the color's own hex value, identical to the swatch fill, giving zero contrast against the dark sidebar. Dark Gray hex had a typo (`#94A3B8555`). (2) `submitQuoteRequest()` in `mockup-builder-customer.js` built the `items` array without including `logoFrontSrc`/`logoBackSrc` fields. The server `IntakeItem` type had no logo fields. Email HTML had no logo rendering.

**Root cause:** (1) `public/mockup-builder-customer.js` line 757: `hex: '#94A3B8555'` (typo). Lines 804-812: border logic only special-cased white/dual-color swatches; all others used their own hex as border. (2) `submitQuoteRequest()` in `mockup-builder-customer.js` lines 1569-1582 omitted logo fields from the POST payload. Server route `admin-panel/src/app/api/public/quote-requests/route.ts` `IntakeItem` had no logo fields.

**Fix:**
- `public/mockup-builder-customer.js` line 757: corrected `dark-gray` hex to `#444B55`
- `public/mockup-builder-customer.js` lines 803-822: border logic now uses `rgba(255,255,255,0.30)` for any swatch whose hex has R/G/B all < 80 (dark colors), keeping the cyan `outline-color` selected state intact
- `public/mockup-builder-customer.js` lines 1581-1607: added `logoFrontSrc`/`logoBackSrc` (capped at 300 KB base64) and size fields to the POST payload
- `admin-panel/src/app/api/public/quote-requests/route.ts`: added logo fields to `IntakeItem`, added `sanitizeLogo()` validator, added inline `<img>` thumbnails in the email HTML

**Verify:** `npx tsc --noEmit` in both `/novamerch` and `/novamerch/admin-panel`. Both pass clean.

**If it recurs:** If logos still don't appear in email, check: (a) the logo size. Images larger than 300 KB (base64) are silently dropped; resize before uploading. (b) EmailJS template. Confirm `{{{items_html}}}` is triple-curly (unescaped HTML) in the template. (c) Some email clients block base64 inline images. Consider switching to a hosted image URL approach.

---

## 2026-06-05: Root `npm run build` failed because root tsconfig pulled in `admin-panel/` sub-project files

**Tags:** build, tsconfig, monorepo, admin-panel, mockup-builder
**Status:** Fixed

**Issue:** Running `npm run build` from the repo root failed with `Type error: Cannot find module '@/lib/admin-session'` pointing at `admin-panel/src/app/api/auth/login/route.ts`. The failure was reproducible before any new changes were applied, so it predates the mockup builder integration.

**Investigation:** The repo contains two Next.js projects side by side: the root site under `src/` and a separate admin tool under `admin-panel/`. Each has its own `tsconfig.json` with `paths: { "@/*": [...] }` pointing at its own `src/`. The root `tsconfig.json` declared `"include": ["**/*.ts", "**/*.tsx", ...]` which globs into `admin-panel/` (and `graphify-out/`, `local-catalogues/`, `out/`) but with the root's `@/*` mapping, so imports like `@/lib/admin-session` inside `admin-panel/` couldn't be resolved during type-checking.

**Root cause:** Missing exclusions in `/Users/rumman/Desktop/Coding Projects/novamerch/tsconfig.json`. The root project should not type-check files belonging to sibling Next.js projects or build outputs.

**Fix:** Updated the root tsconfig `exclude` array to skip the sibling/build directories:
```jsonc
"exclude": ["node_modules", "admin-panel", "graphify-out", "out", "local-catalogues"]
```
File: `tsconfig.json:26`.

**Verify:** `npm run build` from the repo root now compiles, type-checks, and exports successfully. The build summary should include `/mockup-builder` as a static route.

**If it recurs:** A new sibling project or build-output directory has been added. Add it to the root tsconfig `exclude` list. Do not relax the `@/*` mapping or add per-directory tsconfig hacks; each sub-project should remain self-contained.
