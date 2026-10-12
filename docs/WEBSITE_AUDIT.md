# NovaMerch website audit

Date: 9 October 2026

## Stack and routes

- **Frontend:** Next.js 15 App Router, React 19, TypeScript and Tailwind CSS v4.
- **Rendering:** public pages are statically renderable. There is no application database or server-side API in this repository.
- **Public routes found:** `/`, `/sports-clubs`, `/free-mockup`, `/mockup-builder`; `/products` was added as an index route during this redesign.
- **Lead workflow:** `QuoteForm` posts JSON to the externally hosted `novamerch-admin.../admin/api/public/lead-intake` endpoint. That integration was retained unchanged.
- **Mockup builder:** a public client-side builder exists at `/mockup-builder`. Its source mentions an external admin quote-request endpoint; the repository does not establish whether it is intended for staff, customers, or both.
- **Authentication/admin:** no auth, user management, admin UI, database schema, upload service, analytics SDK or CI workflow is present in this repository. The admin is an external system and needs separate review before changes there.

## Existing functionality retained

- Homepage lead form, UTM fields, consent field, honeypot and request id.
- Free mockup and mockup-builder routes.
- Sports club landing page and its existing URL.
- Existing local merchandise images and logo assets.

## UX and design findings

- The inherited homepage relied on a full-screen background video before the primary value proposition. It had no poster, pause control, or intentional mobile fallback.
- Navigation exposed the mockup builder publicly without confirming its intended audience.
- The previous homepage carried a large number of visually similar sections, which diluted the main action.
- The redesigned homepage uses an HTML-first hero, responsive product composition, visible CTAs, a touch/keyboard-friendly rail, and reduced-motion fallback styles.

## SEO findings

- Canonical base URL, robots and a sitemap were already present.
- The sitemap included `/mockup-builder`, despite its role being unclear. It is retained for now to avoid silently changing public discoverability; confirm its intended status before production.
- Global metadata has been improved. Product detail routes, redirects and breadcrumb data require verified product/source content before publication.
- Removed global FAQPage schema because it was generic site-wide markup and FAQ rich results are not a suitable implementation target.

## Security and privacy findings

- The quote form transmits customer data cross-origin. Production verification must confirm CORS policy, server-side validation, rate limiting, notification delivery and idempotency at that service.
- The form currently has no logo-upload input. Do not add one until the receiving endpoint supports authenticated or signed uploads, server-side type/size validation and private storage.
- No admin authentication code exists in this repository; do not assume the external admin is protected based on this checkout.

## Performance baseline and media

- Playwright is installed, but no browser/Lighthouse baseline artifacts or configuration were present. Lighthouse is not installed in this project.
- `ffprobe` is unavailable in the local environment, so video codec, duration and bitrate were not asserted.
- The inherited hero video remains in `public/videos/` but is no longer used by the new homepage. Existing raster product assets should be converted to responsive WebP/AVIF variants before production where source quality permits.

## Technical debt / production gates

1. Confirm external admin ownership, auth roles and customer/staff mockup-builder intent.
2. Run real lead submissions against staging and verify acknowledgement/admin notification.
3. Obtain approved client-project imagery, client permissions, genuine testimonials and product data before adding proof/case-study claims.
4. Establish a redirect inventory once replacement product and industry routes are approved.
5. Run Lighthouse and manual Safari/Android testing in staging; this repository audit does not claim those measurements.
