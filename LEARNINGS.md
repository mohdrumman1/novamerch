## 2026-06-18 — Dark swatches invisible on dark sidebar + customer logos dropped from quote email

**Tags:** mockup-builder, swatch, color, visibility, quote, logo, email, airtable
**Status:** Fixed

**Issue:** (1) Dark color swatches (Black, Dark Gray, Navy, Forest, Dark Grey) were invisible against the dark sidebar background (`#0D1526`). Dark Gray specifically had a malformed hex `#94A3B8555` (extra `555` suffix), causing the swatch to render an invalid/unexpected color. (2) When a customer uploads logos and submits a quote request, the logos were completely absent from the admin notification email and Airtable record.

**Investigation:** (1) Swatch border was set to the color's own hex value — identical to the swatch fill, giving zero contrast against the dark sidebar. Dark Gray hex had a typo (`#94A3B8555`). (2) `submitQuoteRequest()` in `mockup-builder-customer.js` built the `items` array without including `logoFrontSrc`/`logoBackSrc` fields. The server `IntakeItem` type had no logo fields. Email HTML had no logo rendering.

**Root cause:** (1) `public/mockup-builder-customer.js` line 757: `hex: '#94A3B8555'` (typo). Lines 804-812: border logic only special-cased white/dual-color swatches; all others used their own hex as border. (2) `submitQuoteRequest()` in `mockup-builder-customer.js` lines 1569-1582 omitted logo fields from the POST payload. Server route `admin-panel/src/app/api/public/quote-requests/route.ts` `IntakeItem` had no logo fields.

**Fix:**
- `public/mockup-builder-customer.js` line 757: corrected `dark-gray` hex to `#444B55`
- `public/mockup-builder-customer.js` lines 803-822: border logic now uses `rgba(255,255,255,0.30)` for any swatch whose hex has R/G/B all < 80 (dark colors), keeping the cyan `outline-color` selected state intact
- `public/mockup-builder-customer.js` lines 1581-1607: added `logoFrontSrc`/`logoBackSrc` (capped at 300 KB base64) and size fields to the POST payload
- `admin-panel/src/app/api/public/quote-requests/route.ts`: added logo fields to `IntakeItem`, added `sanitizeLogo()` validator, added inline `<img>` thumbnails in the email HTML

**Verify:** `npx tsc --noEmit` in both `/novamerch` and `/novamerch/admin-panel` — both pass clean.

**If it recurs:** If logos still don't appear in email, check: (a) the logo size — images larger than 300 KB (base64) are silently dropped; resize before uploading. (b) EmailJS template — confirm `{{{items_html}}}` is triple-curly (unescaped HTML) in the template. (c) Some email clients block base64 inline images — consider switching to a hosted image URL approach.

---

## 2026-06-05 — Root `npm run build` failed because root tsconfig pulled in `admin-panel/` sub-project files

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
