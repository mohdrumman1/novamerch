# NovaMerch Claims and Permissions Register (MKT-002)

Audited 2026-10-24. Nothing here has been edited on the live site. "Needs approval" means a human (Rumman/Nick) must confirm facts with supplier or client evidence before copy changes (MKT-007).

Status values: VERIFIED-OK (consistent with plan rules), CONFLICT, UNSUPPORTED, NEEDS APPROVAL.

| # | Claim (exact text) | Where | Status | Problem | Proposed safe wording (draft only) |
|---|---|---|---|---|---|
| 1 | "No minimums" (hero strip) | `src/app/sports-clubs/page.tsx:182`; live `/sports-clubs/` | CONFLICT | Homepage FAQ says minimum "depends on the product and decoration method" (`src/app/layout.tsx:21-23`). Plan forbids universal no-minimum | "Minimums vary by item" |
| 2 | "No Minimums. Need 10 caps or 500 bottles? We work with your quantity" | `sports-clubs/page.tsx:207`; live | CONFLICT / UNSUPPORTED | Needs supplier-confirmed minimums per item | "Tell us your quantity and we will confirm suitable options." |
| 3 | "We match your club's branding exactly: right colours, right placement, right finish." | `sports-clubs/page.tsx:208`; live | UNSUPPORTED | Homepage FAQ correctly says exact match depends on material and process. A past customer complained about sizing and colour (per plan) | "We work from your club logo and colour references and confirm the closest achievable result on each product before production." |
| 4 | "Low minimum quantities... We can match these to your club colours." | `sports-clubs/page.tsx:420` | NEEDS APPROVAL | "Low minimum" unquantified | Remove "low minimum" or state verified number |
| 5 | "No upfront cost" | `sports-clubs/page.tsx:182` | NEEDS APPROVAL | True for the mockup pack only if that is the intent. Could be read as no deposit | "Free mockup pack, no commitment" |
| 6 | "your 3 branded mockup ideas and rough pricing within 24–48 hours" | `QuoteForm.tsx:305` (success state) | UNSUPPORTED | Plan: do not invent a 24-hour SLA until capacity established. Operations must confirm it is met | "We will review your brief and reply with options." (or a verified SLA) |
| 7 | "Ships Australia-wide" / "Do you deliver Australia-wide? Yes." | `sports-clubs/page.tsx:182`, `layout.tsx` FAQ | VERIFIED-OK (assumed) | Consistent with plan; confirm shipping to all states incl. remote | keep |
| 8 | Homepage FAQ: minimums depend on product; colour match depends on material/process | `layout.tsx:20-37` | VERIFIED-OK | This is the plan's target wording. Use as the reference | keep |
| 9 | "NovaMerch supplied a 570-tee custom training apparel order for Cooks Hill United Football Club" and "demonstrates the scale of club merchandise we can help coordinate" | live `/case-studies/cooks-hill-united/` | NEEDS APPROVAL | Public already. No evidence in repo of written client permission for name/crest/photos. Plan: public page does not prove paid-ad rights. Page is untracked in git | Keep page; **do not use name, crest, people or photos in paid ads** until written permission |
| 10 | Case-study imagery in `public/case-studies/` | untracked | NEEDS APPROVAL | Real photo vs illustrative mockup not labelled in files; provenance unknown | Label each image real-photo or illustrative |
| 11 | "Free 3-product mockup pack" | multiple | NEEDS APPROVAL | Define: three conceptual directions with indicative pricing, no commitment, human-approved | Add one-line definition near form |
| 12 | Mockup images generally (`public/mockups`, `*-mockup.png`) | site-wide | NEEDS APPROVAL | Plan: label illustrative concepts so they are not read as delivered items | Add "Illustrative concept" caption |
| 13 | Org JSON-LD: `areaServed` includes Newcastle, NSW | home page JSON-LD | VERIFIED-OK | Fine; do not add suburbs or LocalBusiness without real basis | keep |
| 14 | Industry hook "The unfair advantage" / "Make your brand feel bigger than it is" | `industries/[slug]/page.tsx` | NEEDS APPROVAL | Puffery, not a factual claim, but "unfair advantage" invites substantiation | Owner tone call |
| 15 | Consent: "I agree that NovaMerch may contact me about this request." | `QuoteForm.tsx:~474` | VERIFIED-OK (scope) | Covers contact about the request only. Not marketing opt-in (plan section 4). No consent version stored | Add separate optional marketing checkbox in MKT-004 scope; legal review of privacy text |

## Searches run with zero hits (good)
`australian made`, `eco-friendly`, `lowest price`, `same day`, `guarantee` in `src/`: none found.

## Permissions needed before any paid or new use
| Asset | Needed | Owner |
|---|---|---|
| Cooks Hill United name, crest, photos, quotes in ads or new pages | Written client permission | Nick |
| Customer logos on site | Written permission each | Nick |
| Supplier minimums, lead times, decoration methods per product | Supplier-confirmed table | Operations |
| Colour-match policy and proofing steps | Written internal policy | Nick/Rumman |
| Privacy policy and marketing consent wording | Australian legal check | Rumman |

## Not in scope here
No wording above has been applied. Copy edits are MKT-007 and need your approval of the supplier facts first.
