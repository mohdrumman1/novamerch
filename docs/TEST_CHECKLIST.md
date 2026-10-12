# Pre-merge test checklist

No branch is pushed or merged until this checklist is reviewed.

## Public website

- `http://localhost:3000/` — homepage, previous navy/cyan/violet palette, hero video controls, reduced-motion fallback.
- `http://localhost:3000/products/` — product index and product detail links.
- `http://localhost:3000/industries/real-estate/` — dynamic industry route renders without a server error.
- `http://localhost:3000/#faq` — FAQ spacing, readable questions, and answer text.
- Submit the mockup/quote form with name, email, and phone; verify the success/error state without using a real customer.

## Admin application

Run from `admin-panel/`:

```bash
npm test
npm run build
npm run dev
```

Then check `http://localhost:3001/admin/login` and the Customers, Quotes, Orders, Invoices, Shipments, Financials, and Mockup Builder pages with staging/test credentials.

## Staging workflow

- POST a complete request to `/admin/api/public/inbound-enquiries` twice with the same `idempotencyKey`; the second response must report `duplicate: true`.
- POST incomplete contact data; the endpoint must return `400` and list validation fields.
- Confirm the request appears in the staging D1 `inbound_enquiries` table.
- Confirm order-link issuance remains disabled until explicitly enabled.

## Airtable safeguards

- Confirm the Base 2 backup in `backups/airtable/2026-10-10-base2/` is readable.
- Confirm no production record changed during testing.
- Test only with fake customer/order data and staging credentials.

## Release gate

Record screenshots, test results, and any defects here before requesting review. Do not push to `main` or `master` until the owner approves the results.
