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
