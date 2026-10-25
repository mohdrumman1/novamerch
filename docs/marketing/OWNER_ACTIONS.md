# Owner actions: step by step (what only you can do)

## Done on 2026-10-25 (via your signed-in browser)
- Search Console: Domain property `novamerchau.com` created and **verified** with a DNS TXT record I added in Cloudflare (record must stay).
- Sitemap `https://novamerchau.com/sitemap.xml` submitted: Success, 26 pages discovered.
- Indexing requested for: /solutions/custom-merchandise-newcastle/, /sports-clubs/ (already indexed, re-crawl requested), /guides/, /products/.
- A second, unverified URL-prefix property `https://novamerchau.com/` also exists in Search Console from a verification attempt; you can delete it in Settings, or ignore it.
- Not possible for me: Google Analytics (analytics.google.com showed a browser error page in the automated browser) and Bing Webmaster Tools (needs a sign-in or new account, which I will not do for you). Do steps 2 and 3 below yourself.

Updated 2026-10-25. Order matters: do 1 to 3 first, they unlock the rest.

## 1. Google Search Console (about 10 minutes)
1. Go to https://search.google.com/search-console and sign in with the Google account that should own the site.
2. Add property, choose **Domain**, enter `novamerchau.com`.
3. Google shows a TXT record. Add it where your DNS is managed (Vercel: Domains, novamerchau.com, DNS Records, Add TXT; or your registrar). Wait a few minutes, click Verify.
4. Sitemaps (left menu), enter `https://novamerchau.com/sitemap.xml`, Submit.
5. URL Inspection (top bar): paste each of these, click **Request indexing**:
   - https://novamerchau.com/solutions/custom-merchandise-newcastle/
   - https://novamerchau.com/sports-clubs/
   - https://novamerchau.com/guides/
   - https://novamerchau.com/products/
6. Settings, Users and permissions: add the email you want me to be able to read exports from (optional). Send me a CSV export of Performance (last 3 months) later, never passwords.

## 2. Bing Webmaster Tools (3 minutes)
https://www.bing.com/webmasters, sign in, Import from Google Search Console. This also feeds ChatGPT search and others that use Bing.

## 3. Google Analytics 4 (10 minutes)
1. https://analytics.google.com, Admin, Create property named NovaMerch, time zone Sydney, currency AUD.
2. Create a Web data stream for `https://novamerchau.com`. Copy the **Measurement ID** (looks like `G-XXXXXXXXXX`). It is not secret.
3. Vercel: project `novamerch`, Settings, Environment Variables, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` = your ID, environments Production and Preview.
4. Deployments tab, open the latest production deployment, menu, **Redeploy** (the variable is applied at build time).
5. Visit the site in a private window: a consent banner should appear. Click Accept, then submit nothing yet.
6. In GA4: Admin, Events. After your first real enquiry an event `generate_lead` appears. Mark it as a **key event**.
7. Send me the Measurement ID in chat if you want me to confirm it in the build.

## 4. Admin app (Cloudflare) needs a decision from you
Fact: `main` has admin code that does not compile (merge damage in `admin-panel`: duplicate `outstandingInvoices` in the dashboard, duplicate `recordToSupplierOrder` in the Airtable mappers, and a failing supplier-cost test). The live admin was last deployed 2026-10-13 from an unknown commit.
What I need: tell me one of
- "Reconcile it": I merge the supplier-settlement work and the operations work properly, test, and prepare a staging deploy. This touches money calculations, so you review the dashboard numbers after.
- "Deploy from a known-good commit": tell me which commit or branch you last deployed from.
Until then the website keeps working (the form posts to the live admin) but the new attribution columns in Airtable stay empty.

## 5. Cooks Hill United permission (email)
Send the club (Siennah or the club contact) something like:
> Hi, thanks again for the feedback. Can we confirm in writing that NovaMerch may (1) quote you on our website as: "We appreciate the timeliness and the communication, it was all perfect.", and (2) keep your club name and the project photo on our case study page? Reply "yes" to confirm. Happy to adjust the wording.
Forward the reply to me and I restore the quote. For paid ads, ask separately.
Siennah's earlier feedback (sizing and colour): check the admin Feedback page to see whether it was submitted. Do not publish part of it.

## 6. Supplier facts so I can publish a timing table
A simple sheet with one row per product: product, decoration method, minimum quantity, typical production days after artwork approval, shipping days to Newcastle and to other states, anything you must not promise. Only confirmed numbers. I will publish them as ranges with "confirmed per quote".

## 7. Reviews and trust
- Create a Google Business Profile only if you meet customers in person (it is for businesses with in-person contact). If yes: https://www.google.com/business, add service area Newcastle and Hunter.
- Ask 3 happy customers for a short written review and permission to publish with their name or role. Send me the text.

## 8. Privacy policy
The page is live at /privacy/. Have a lawyer or a legal template service check it. Tell me the changes and I will update it.

## 9. Order checks (from the sizing and colour feedback)
Tell me how you currently confirm artwork, colours and sizes before production. I will write a short true "how we check your order" section. If there is no step, consider adding: written approval of mockup, size list confirmation, one sample for colour-critical jobs.
