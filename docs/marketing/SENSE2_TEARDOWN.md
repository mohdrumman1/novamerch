# Sense2 Teardown: how they do it, and how NovaMerch does it better (2026-10-24)

Method: public pages, robots.txt, sitemaps and their own `llms.txt` only. Their server returns 403 to automated scraping of some pages and points machines to `llms.txt`; I respected that and did not bypass it. The `reverse-engineer-anything` skill (morluto/rea) was installed as instructions only. It targets binaries and shipped apps, so most of its tooling is not needed for a public marketing site, and its MCP server was NOT registered.

## How Sense2 does it
| Lever | What they do | Evidence |
|---|---|---|
| Platform | Vercel, Next.js style routes, www to bare 301, strict HSTS and CSP headers | response headers, robots |
| Scale | About 1,140 static URLs plus 4,229 product and 681 category URLs, split into 4 sitemaps | sitemap index |
| Programmatic pages | 385 `/browse`, 374 `/collections`, 109 `/brands`, 89 `/campaigns` (budget, quantity, occasion), 54 `/edit`, 27 `/featured`, 26 `/resources`, 25 `/locations`, 22 `/industries` | sitemap-static |
| Buyer-question content | Resources on cost, lead times, supplier choice, drinkware, onboarding, gifting | resources URLs |
| AEO | `llms.txt` with entity disambiguation, curated citation targets, ItemList/CollectionPage/FAQ schema, selective AI-bot rules, `/api/mcp` for agents | llms.txt, robots |
| Conversion | Online quote, AI shortlist assistant, free digital mockups, AU$17 refundable samples, claimed 2-hour quote reply | site pages, llms.txt |
| Trust | ABN, reviews page, press, recommended-by, credentials, Sedex, Modern Slavery statement | sitemap-static, homepage |
| Published timing | Express 1 to 4 days, standard 7 to 15 business days | llms.txt |

## Where NovaMerch can be better (and what I did)
| Sense2 weakness or gap | NovaMerch move | Status |
|---|---|---|
| National and catalogue-led, not local to Newcastle | Dedicated Newcastle page, real local project, Newcastle in llms.txt | Branch `feat/mkt-newcastle-page` |
| Generic breadth, impersonal | Human-curated free three-product mockup pack kept central | existing |
| Heavy programmatic scale (thin risk) | Fewer, deeper pages; each product page has real buying guidance | `feat/competitive-gap-fixes` |
| Entity confusion (they disambiguate "Sense2") | `llms.txt` disambiguation for NovaMerch | this branch |
| Content depth on cost and timing | Cost-drivers and lead-time guides, honest conditional (no invented numbers) | this branch |
| Security headers | Added HSTS, nosniff, referrer, frame, permissions headers in `vercel.json` | this branch (deploy-gated) |
| Page weight | 27 mockup PNGs cut from 53.5MB to 19.1MB, same dimensions | `perf/optimise-images` |
| Their claims are self-reported | Keep every NovaMerch claim verified | claims register |

## Cannot match yet (needs owner or time)
Reviews and ratings, ABN and credentials, named client logos, 30-year history, published MOQ/timing table (needs supplier data), sample policy, quote reply SLA, AI shortlist tool (not recommended: our edge is human review).

## Not recommended
Copying their copy, images, product data or structure wholesale; mass-producing thousands of thin pages; blocking AI bots. Our robots.txt already allows search and answer-engine crawlers.
