# Order reconciliation runbook

Use this checklist before changing any order status or dashboard figure.

## Rules

1. Read the live Airtable record and linked invoices, supplier orders, and shipments first.
2. Preserve the original order and invoice record IDs; reconcile fields and append clear notes.
3. A refunded order must not remain `Goods Status = Pending`. Use `Cancelled` when production is stopped and record the refund/recovery narrative in `Comments`.
4. A refund reduces customer revenue; it does not erase supplier costs. Record supplier recovery separately for each returned item.
5. A zero transport cost is a recorded value, not an unknown value. Only a blank/null transport cost is “not recorded.”
6. Never invent delivery dates, refund amounts, or payment dates. If missing, leave the field blank and flag it for confirmation.
7. After every correction, refresh the dashboard and verify pending value, costs, net cash, and profit against the source records.

## Swell Fitness precedent

`#O1001` is reconciled as cancelled/refunded. Jackets were returned and their supplier cost recovered; shirts/polos were outside the supplier’s 30-day return window and their cost was not recovered. The original paid invoice remains intact.

## Required verification

- Run `npm test`.
- Open `/admin/dashboard`, `/admin/orders`, and `/admin/issues`.
- Confirm cancelled/refunded orders are excluded from pending value.
- Confirm supplier costs remain visible and refunds reduce net revenue only.
