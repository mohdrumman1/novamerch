# Lead discovery provider research

16 September 2026 · Australia/Sydney

## Decision

Keep Airtable for now and repair discovery with a low-cap external maps-data provider. Do not move the CRM database yet. Airtable is now paid, the sender/report workflows already target it, and replacing storage would add migration risk before the acquisition loop is working.

Use the existing Google Places workflow only if the Google Cloud project/key can be repaired without changing the account's risk profile. The current n8n `Find Leads From Google` Code node still returns HTTP 403, and the May 2026 Google project suspension note remains a material warning sign. If the key/project cannot be fixed quickly, switch discovery to a provider that is already designed for Google Maps extraction and control the daily result cap in n8n.

## Lowest-cost path

1. Keep the current n8n search queue and Airtable leads table.
2. Add a replacement discovery workflow that reads one ready search term, requests at most 25 to 50 places, dedupes by website/name/phone, and creates records as `Website Found` or `Needs Review`.
3. Run enrichment separately through Hunter into `Email Found`.
4. Keep sending gated by `Ready to Email`; never let discovery or enrichment create send-eligible records directly.

## Provider comparison

| Provider | Fit | Cost posture | Notes |
|---|---|---|---|
| Outscraper Google Maps Data | Best low-cost trial | No monthly fees, first 500 Google Maps businesses free, then published pricing around US$3 per 1,000 extra Maps records; email/contact enrichment is billed separately | Cheapest practical discovery test because it has a real free allowance and API access. Use it for company discovery only; keep email enrichment/review separate unless explicitly budgeted. |
| Apify Google Maps Scraper | Strong alternative | Low/no monthly commitment, API and scheduling support; commonly listed around US$4 per 1,000 places depending on Actor/pricing model | Better if we want an n8n/API-friendly actor ecosystem and monitoring. Cost depends on the exact Actor and billing model, so set small run caps. |
| Google Places API repair | Best if already approved and working | Official API, but the current project/key returns 403 | Repair only if Google Cloud console shows a clean project, enabled Places API, billing, and allowed key restrictions. Do not blindly disable restrictions or spend time on a suspended project. |
| Clay | Useful enrichment bench, not the cheapest automated discovery path | Free tier exists, but scaling usually becomes credit/monthly-plan driven | Good for testing waterfall enrichment quality; less attractive than direct n8n + Airtable + Outscraper/Apify for a low-cost owned pipeline. |
| SerpApi / generic SERP API | Not first choice | More expensive for NovaMerch's need | Useful for web search, but the pipeline needs local business/place records, websites and phone/address data. SerpApi pricing starts at a monthly plan, which is unnecessary for a small pilot. |

## Email enrichment and sending alternatives

| Tool | Fit | Current cost signal | Recommendation |
|---|---|---|---|
| Brevo | Keep for sending | Official free-plan help still lists 300 email sends/day | Keep the 10/day pilot cap. Brevo delivery/suppression events still need to be wired into Airtable before scaling. |
| Hunter | Keep for enrichment pilot | Official pricing is credit-based; recent public summaries vary between 25-50 free monthly credits and paid tiers around US$34-49/month depending on billing | Use the existing Hunter credential for small enrichment runs. Rotate the exposed key later. |
| Snov.io | Backup enrichment test | Trial/free allowance exists, but API access and exact credit allowance vary by plan/account | Do not add unless Hunter coverage is poor. |
| Apollo | Backup enrichment/source test | Free tier exists but usable API/export limits vary; paid plans commonly start around US$49/user/month | Test later only if person-level targeting becomes more important than company-level discovery. |

## n8n implementation shape

Create `Nova Merch - 1A Lead Discovery Replacement`:

- Schedule: weekdays, low-volume run before enrichment.
- Input: one `Ready` search queue row.
- Provider call: search term + location + max results.
- Normalize: company name, website, phone, address, category, source query, provider place ID.
- Dedupe: skip if website, place ID, or normalized company/location already exists.
- Airtable create: `Status = Website Found` when a website is present, otherwise `Needs Review`.
- Mark search queue row attempted with count and timestamp.
- Hard cap: 25 to 50 provider results per day until reply handling and review are reliable.

This workflow must not include Brevo, must not set `Ready to Email`, and must not send any email.

## Current blockers

- A provider API key is still required for a live replacement. The existing Hunter key solves enrichment, not lead discovery.
- The current Google Places workflow remains blocked by HTTP 403.
- The approved send queue is empty: on 2026-09-16, Airtable had `0` `Ready to Email` records with an email and `308` `Email Found` records awaiting review.

## Sources

- Apify marketplace: https://apify.com/
- Apify Google Maps scraper comparison: https://blog.apify.com/best-google-maps-scrapers-for-marketers/
- Outscraper homepage/API/pricing entry points: https://outscraper.com/
- Outscraper pricing: https://outscraper.com/pricing/
- Google Places API pricing: https://developers.google.com/maps/documentation/places/web-service/usage-and-billing
- Google Maps Platform pricing list: https://developers.google.com/maps/billing-and-pricing/pricing
- n8n Schedule Trigger documentation: https://docs.n8n.io/
- SerpApi pricing reference: https://serpapi.com/pricing
- Brevo free-plan limits: https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan
- Hunter pricing: https://hunter.io/pricing
- Snov.io API/pricing entry point: https://snov.io/api
- Clay pricing: https://www.clay.com/
