# Test results

## Run in this change

- `admin-panel/npm test` — passed, 25 tests, 0 failures.
- `admin-panel/npm run lint` — passed with 0 errors and 27 warnings confined to legacy mockup-builder code and one unused supplier-order constant.
- `admin-panel/npm run build` — passed; Next.js generated all 31 admin routes.
- Brevo mailbox delivery — manually received at the NovaMerch mailbox; no customer email was sent.
- Manual browser acceptance (local admin): authenticated dashboard, Action Centre, Approvals, and Issues & Refunds screens loaded successfully. Approvals displayed live `#O1001` and `#O1002` records as pending approval; Action Centre displayed queue counts; Issues & Refunds rendered the staging-empty state without errors.
- Public approval/tracking token journeys were not mutated or faked: token issuance remains disabled by default, so those journeys require a staging-issued signed token before they can be exercised end to end.

- `npm run build` — passed. Next.js compiled, type-checked and statically generated all 24 routes on 9 October 2026.
- Manual local preview — reviewed the redesigned homepage at desktop and a 390 × 844 mobile viewport. Hero navigation, headline, primary actions and imagery remained readable with no visible horizontal overflow.

## Not run / not represented as complete

- Lighthouse, because the project has no local Lighthouse installation or saved baseline.
- Playwright browser journeys, because no test suite or browser configuration exists in this checkout.
- External lead endpoint integration, because it is a live third-party service and no staging contract was supplied.
- iOS Safari and Android Chrome device testing.

## Recommended acceptance checks

1. Complete both mockup and quote submissions on staging.
2. Test navigation, carousel controls and form completion using keyboard only.
3. Test widths 320, 360, 375, 390, 430, 768, 1024, 1440 and 1920px.
4. Record mobile and desktop Lighthouse reports after deployment preview.
