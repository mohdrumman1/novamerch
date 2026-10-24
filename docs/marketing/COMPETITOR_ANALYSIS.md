# Competitor Analysis and Gap Plan (2026-10-24)

Sources: public pages fetched today. Competitor claims are self-reported and unverified.

## Competitors
| | Sense2 | Frame Promotional Products | Grenada Promotional Products |
|---|---|---|---|
| Base | Byron Bay HQ, delivers Australia-wide, has a Newcastle location page | 129 Brunker Rd, Adamstown (directory listings) | Newcastle, local owner |
| Age and scale | Founded 1995, 30,000+ orders, 4,000+ products | Established; **listed for sale, owner retiring** (BSale listing) | Since 1998, small team |
| Website | Strong: AI concierge, quote form, colour finder, 88 buyer-mission pages, guides, credentials | **No own website found** (directory listings only) | Promotify template site, phone and email only |
| Quote path | Online quote, reply in 2 business hours (claimed), free digital mockups, samples AU$17 refundable on 100+ | Phone/showroom | **No online quote form** |
| Trust | 4.9 Google rating, NSW Govt directory, Sedex, Modern Slavery statement, named brand logos, ABN, phone | Local presence, councils and tourism | Local, long-running, colour-variance disclaimer |
| Published MOQ and timing | Yes: MOQs from 10, express 1 to 4 days on 400+ lines, standard 7 to 15 days | No | **None** |
| Weakness | Not local; claims unverified; generic breadth | No web presence; ownership change | No quote form, no pricing/timing, thin content, copy errors |

## Where NovaMerch can win
1. **Local, human-curated, fast first step.** Sense2 is national and catalogue-led. Grenada has no form. Frame has no site. A clear "free three-product mockup pack" plus an online form is a real local edge.
2. **Be the best Newcastle web page.** Frame and Grenada are weak online. Newcastle page, product pages, guides now exist (draft).
3. **Specific sports-club and trades expertise** with a real local project (Cooks Hill United, 570 tees), subject to permission.
4. **Transparent buying guidance** (Grenada and Frame publish none; Sense2 publishes MOQs and timing).

## What changed on branch `feat/competitive-gap-fixes` (not deployed)
| Gap | Fix |
|---|---|
| Product pages were a 3-bullet stub with no nav or footer | All 8 rebuilt from `src/data/products.ts`: answer-first summary, who it suits, how to choose, decoration methods, what to send, FAQs, related products, FAQ and breadcrumb schema, mockup CTA tagged by product |
| Products index had no navigation, light page under dark nav | Nav, footer, dark theme, link to Newcastle page |
| No educational content | `/guides/` with club merch ordering checklist and embroidery vs screen printing vs DTF (reviewed date, schema) |
| No privacy policy while collecting personal data | `/privacy/` written from actual data flows, linked from the form consent line. **Needs legal review before deploy** |
| Sitemap | 24 URLs, all pass `npm run test:seo` |

## Still needs the owner (cannot be done in code)
| Gap vs competitors | Needed |
|---|---|
| Trust: no phone, ABN, address, reviews, logos | Provide ABN, phone, real reviews with consent, client logo permissions, Google Business Profile if eligible |
| No published MOQ and timing | Supplier-confirmed minimums and lead times per product (then publish a table like Sense2) |
| No sampling offer or proof promise | Decide policy: paid or refundable samples, and "nothing goes to production until you approve" (only if operationally true) |
| No response-time promise | Decide a realistic reply time and staff for it |
| Pricing transparency | Decide whether to show "from" prices |
| Industries pages still have no nav/footer | Those files have your uncommitted edits (`src/app/industries/[slug]/page.tsx`); say go and I will apply the same fix on top |
| Search Console, GA4, consent, www redirect, deploy | As in tracker |

## Ideas worth copying later (need approval or data)
- Colour finder (Pantone/hex) like Sense2, only if supplier colour data exists.
- Buyer-mission landing pages (budget, quantity, deadline) for real recurring briefs.
- Compliance page (ABN, supplier standards) once facts exist.
- Split-shipping and express options, if suppliers support them.
