# Supplier order settlement: Cooks Hill Alibaba upsert

## What this is

`scripts/upsert-cooks-hill-alibaba-settlement.mjs` writes confirmed Cooks Hill
Alibaba settlement fields into Airtable `Supplier Orders`. Airtable is canonical
for supplier cost after migration.

## Confirmed source facts

- Alibaba order number: `309939247501026460`
- Supplier: Jinan Runhang Textile Co., Ltd.
- Total supplier obligation: USD 2,584.60 (item subtotal USD 1,584.60 + shipping USD 1,000.00)
- Projected cost: AUD 3,754.18
- Booked deposit: AUD 1,904.67, paid 2026-08-12
- Pending balance: USD 1,292.30, estimated AUD 1,849.51
- Payment status: Partially Paid
- Linked records: Order `receLbd69zNxYT6fD`, Customer `recHSQqCG3Juq03ya`

Alibaba item capture is incomplete. Header totals are authoritative. Neither
migration nor app derives cost from captured `Items JSON` rows.

## Managed fields

| Airtable field | Value |
|---|---|
| Alibaba Order Number | `309939247501026460` |
| Related Order | link to `receLbd69zNxYT6fD` |
| Related Customer | link to `recHSQqCG3Juq03ya` |
| Supplier Name | Jinan Runhang Textile Co., Ltd. |
| Order Date | 2026-08-06 |
| Item Subtotal USD | 1584.6 |
| Shipping Fee USD | 1000 |
| Total USD | 2584.6 |
| Projected Cost AUD | 3754.18 |
| Booked Payment AUD | 1904.67 |
| Booked Payment Date | 2026-08-12 |
| Pending Balance USD | 1292.3 |
| Pending Balance Estimated AUD | 1849.51 |
| Payment Status | Partially Paid |

`Items JSON` and `Notes` remain untouched on updates. Manual context and partial
item capture survive migration.

## Running it

Credentials come from environment only. Script never prints or persists Airtable
PAT.

```bash
export AIRTABLE_API_KEY="<PAT with read/write access>"
export AIRTABLE_BASE_ID="appkQYN4Gcb1pSzu1"

# Dry run. Writes nothing.
node scripts/upsert-cooks-hill-alibaba-settlement.mjs

# Apply only after dry-run review.
node scripts/upsert-cooks-hill-alibaba-settlement.mjs --apply
```

## Safety rules

- Preflight reads exact Order and Customer record IDs.
- Preflight aborts unless Order links expected Customer.
- Lookup matches either linked Order or Alibaba order number.
- More than one match aborts with no writes.
- Existing record aborts if Alibaba number, linked Order, or linked Customer conflicts.
- Comparison checks managed settlement fields only, so unrelated Airtable fields do
  not prevent idempotency.
- `--apply` is required for create or update.
- API failure reports operation and HTTP status only. Airtable response bodies are
  not printed.

## Verification after apply

1. Check exact `Supplier Orders` record links Cooks Hill Order and Customer.
2. Check managed fields match table above.
3. Confirm `Items JSON` and `Notes` retain existing values if record was updated.
4. In admin panel, check Cooks Hill order shows projected cost AUD 3,754.18.
5. Check Dashboard booked supplier payments includes AUD 1,904.67.
6. Check unknown money renders `Not recorded`, not zero.

## Rollback

Use Airtable record history to restore prior managed field values. No automated
rollback exists.
