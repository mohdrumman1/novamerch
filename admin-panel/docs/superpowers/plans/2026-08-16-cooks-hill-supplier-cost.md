# Cooks Hill Supplier Cost Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist Cooks Hill Alibaba supplier order in Airtable and show its booked deposit, pending balance, projected cost, and financial effect consistently across NovaMerch admin.

**Architecture:** Airtable `Supplier Orders` becomes source of truth, linked by Airtable record ID to live Cooks Hill `Orders` record. Supplier header values remain authoritative because captured line items are incomplete. Projected cost and booked cash stay separate: total USD2,584.60, booked deposit AUD1,904.67, pending balance USD1,292.30 estimated AUD1,849.51.

**Tech Stack:** Next.js App Router, TypeScript, React, Airtable REST API, existing fetch helpers, ESLint, Next build.

**Spec:** `docs/superpowers/specs/2026-08-16-cooks-hill-supplier-cost-design.md`

## Global Constraints

- Do not expose Airtable credentials to browser or documentation.
- Do not derive total from six captured line items; supplier header total is authoritative.
- Do not link static seed `#O1002`; migration must resolve one live Cooks Hill order and use returned Airtable record ID.
- Costs with no recorded value must display as unknown, never `$0.00`.
- Projected supplier cost, booked cash paid, and remaining balance are distinct values.
- No new runtime dependencies.
- Commit and push only after lint, build, migration verification, and local browser checks pass.
- Deploy only after committed SHA is pushed; repeat production checks after deploy.

---

## File Structure

- `src/lib/types.ts` — typed Airtable supplier-order links, AUD cost fields, and status.
- `src/lib/airtable-mappers.ts` — supplier-order Airtable schema mapping and safe money parsing.
- `src/lib/calc.ts` — shared projected and booked-cost resolver; unknown-cost handling.
- `src/app/api/supplier-orders/route.ts` and `src/app/api/supplier-orders/[id]/route.ts` — server-only Supplier Orders CRUD.
- `src/app/api/bootstrap/route.ts` — remote supplier-order hydration.
- `src/context/DataProvider.tsx` — canonical supplier state and confirmed mutation/rollback flow.
- `src/app/supplier-orders/page.tsx` — order-link selector, source totals, payment fields, confirmed save feedback.
- `src/app/dashboard/page.tsx`, `src/app/financials/page.tsx`, `src/app/orders/page.tsx`, `src/components/modals/OrderModal.tsx`, `src/components/modals/CustomerDetailModal.tsx` — shared cost display semantics.
- `scripts/upsert-cooks-hill-alibaba-settlement.mjs` — idempotent, dry-run-first Airtable migration.
- `docs/supplier-order-settlement.md` — Airtable setup, migration, rollback, verification runbook.
- `src/lib/calc.test.ts`, `src/lib/airtable-mappers.test.ts` — unit checks using existing test harness if present; otherwise use Node built-in test runner only for pure helpers.

### Task 1: Confirm Airtable schema and access

**Files:**
- Create: `docs/supplier-order-settlement.md`
- Modify: Airtable base schema and Worker secret outside repository.

**Consumes:** Existing server-side `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` from `src/lib/airtable.ts`.

**Produces:** Read/write-capable `Supplier Orders` table accessible only through server routes.

- [ ] **Step 1: Create Airtable `Supplier Orders` fields**

Create fields exactly:

```text
Alibaba Order Number       single line text
Related Order              link to Orders
Related Customer           link to Customers
Supplier Name              single line text
Order Date                 date
Item Subtotal USD          currency USD
Shipping Fee USD           currency USD
Total USD                  currency USD
Booked Payment AUD         currency AUD
Booked Payment Date        date
Pending Balance USD        currency USD
Pending Balance Estimated AUD currency AUD
Payment Status             single select: Partially Paid, Paid
Items JSON                 long text
Notes                      long text
```

- [ ] **Step 2: Grant least-required Airtable token access**

Grant target-base access plus `data.records:read` and `data.records:write`. Store token as Worker secret, never `wrangler.jsonc` variable.

- [ ] **Step 3: Verify access without mutation**

Run server-side read using existing `listRecords("Supplier Orders", { maxRecords: 1 })`. Expected: HTTP200 or empty array, never `403`.

- [ ] **Step 4: Document schema and access preconditions**

Write exact fields, allowed statuses, server-only token requirement, and no-secret verification command in `docs/supplier-order-settlement.md`.

### Task 2: Define canonical supplier-order data and mapping

**Files:**
- Modify: `src/lib/types.ts:128-161`
- Modify: `src/lib/airtable-mappers.ts`
- Test: `src/lib/airtable-mappers.test.ts`

**Consumes:** Existing `AirtableRecord`, `num`, `str`, `link`, and JSON parsing helpers.

**Produces:** `recordToSupplierOrder(rec): SupplierOrder` and `supplierOrderToFields(order): Record<string, unknown>`.

- [ ] **Step 1: Write failing mapper tests**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { recordToSupplierOrder, supplierOrderToFields } from "./airtable-mappers";

test("preserves authoritative supplier header totals despite partial items", () => {
  const order = recordToSupplierOrder({
    id: "recSupplier",
    fields: {
      "Alibaba Order Number": "309939247501026460",
      "Related Order": ["recCooksHill"],
      "Item Subtotal USD": 1584.6,
      "Shipping Fee USD": 1000,
      "Total USD": 2584.6,
      "Booked Payment AUD": 1904.67,
      "Pending Balance USD": 1292.3,
      "Pending Balance Estimated AUD": 1849.51,
      "Items JSON": JSON.stringify([{ id: "only-six", qty: 57, totalUsd: 158.46 }]),
    },
  });
  assert.equal(order.totalUsd, 2584.6);
  assert.equal(order.bookedPaymentAud, 1904.67);
  assert.equal(order.pendingBalanceEstimatedAud, 1849.51);
});

test("writes linked Airtable IDs and preserves zero only when explicit", () => {
  const fields = supplierOrderToFields({ /* complete typed fixture */ });
  assert.deepEqual(fields["Related Order"], ["recCooksHill"]);
  assert.equal(fields["Booked Payment AUD"], 1904.67);
});
```

- [ ] **Step 2: Run mapper test and confirm failure**

Run Node test command chosen from package scripts or `node --experimental-strip-types --test src/lib/airtable-mappers.test.ts`. Expected: import/function failure before mapper exists.

- [ ] **Step 3: Extend type with canonical fields**

Add exact fields:

```ts
relatedOrderId?: ID;
relatedCustomerId?: ID;
bookedPaymentAud?: number;
bookedPaymentDate?: string;
pendingBalanceUsd?: number;
pendingBalanceEstimatedAud?: number;
paymentStatus?: "Partially Paid" | "Paid";
```

Keep existing descriptive items and USD header fields.

- [ ] **Step 4: Add mapper pair**

Map Airtable record ID to `id`; map all linked records as one-element arrays only when defined. Do not calculate totals from `items`. Parse money so explicit `0` stays `0`; absent values stay `undefined`.

- [ ] **Step 5: Run mapper test and lint**

Run targeted Node test plus `npm run lint`. Expected: pass.

- [ ] **Step 6: Commit mapper layer**

```bash
git add src/lib/types.ts src/lib/airtable-mappers.ts src/lib/airtable-mappers.test.ts
git commit -m "feat: map supplier orders from Airtable"
```

### Task 3: Add server-backed Supplier Orders and confirmed persistence

**Files:**
- Create: `src/app/api/supplier-orders/route.ts`
- Create: `src/app/api/supplier-orders/[id]/route.ts`
- Modify: `src/app/api/bootstrap/route.ts:16-42`
- Modify: `src/context/DataProvider.tsx:11-29,57-60,173-202,338-345`

**Consumes:** `createRecord`, `updateRecord`, `deleteRecord`, `listRecords`, supplier mapper pair.

**Produces:** Supplier Orders in bootstrap data plus `addSupplierOrder`, `updateSupplierOrder`, `deleteSupplierOrder` promises that resolve only after Airtable response.

- [ ] **Step 1: Add failing bootstrap/API test or fetch harness**

Mock `fetch` against `POST /api/supplier-orders` and require mapper output. Require rejected PATCH to leave original collection untouched and expose `Not saved to Airtable` error.

- [ ] **Step 2: Implement CRUD route pattern**

Mirror `api/orders` handlers:

```ts
const body: SupplierOrder = await req.json();
const record = await createRecord("Supplier Orders", supplierOrderToFields(body));
return NextResponse.json(recordToSupplierOrder(record));
```

PATCH uses `updateRecord`; DELETE uses `deleteRecord`; errors return generic server error without token/request headers.

- [ ] **Step 3: Add Supplier Orders to bootstrap**

Add source:

```ts
{ key: "supplierOrders", table: "Supplier Orders", mapper: recordToSupplierOrder }
```

Validate array in provider. Include supplier-order bootstrap issue in existing error surface.

- [ ] **Step 4: Replace local-only supplier lifecycle**

Remove seed merge and `novamerch-supplier-orders-v1` persistence. Remove stale storage key once after remote hydration. Supplier mutations must await API response, replace/create state from canonical returned record, preserve prior snapshot on failed update/delete, and surface shared save error.

- [ ] **Step 5: Fix all existing CRM update mutations**

For customers, quotes, orders, invoices, shipments: capture prior object; await PATCH; replace local object with returned Airtable record; on error restore prior object and return rejected promise. Do not swallow failures.

- [ ] **Step 6: Verify API and provider checks**

Run targeted fetch harness and `npm run lint`. Expected: successful mutation returns Airtable record; rejected update restores server-truth state.

- [ ] **Step 7: Commit server persistence**

```bash
git add src/app/api/supplier-orders src/app/api/bootstrap/route.ts src/context/DataProvider.tsx
git commit -m "feat: persist supplier orders in Airtable"
```

### Task 4: Make supplier and order admin views truthful

**Files:**
- Modify: `src/app/supplier-orders/page.tsx:63-469`
- Modify: `src/components/modals/OrderModal.tsx:61-70,77-79,195-229`
- Modify: `src/components/ui/LineItemsEditor.tsx:15-23,95-105`
- Modify: `src/app/orders/page.tsx:72-97`

**Consumes:** Provider supplier mutation promises; `orders` and `customers` lists; SupplierOrder linked IDs.

**Produces:** Supplier form uses real order/customer links, preserves input after failure, shows save state and actual costs; order editor clearly distinguishes linked supplier expected/paid costs from manual costs.

- [ ] **Step 1: Write UI behavior harness**

Verify failed supplier create/edit leaves form open, shows `Not saved to Airtable`, and does not add/rewrite table row. Verify success displays returned record values.

- [ ] **Step 2: Add linked selectors and payment fields**

Replace free-text `relatedCustomer` as canonical field with select values from `customers` and `orders`. Keep existing historical text only for display migration compatibility. Add booked AUD payment/date, pending USD/AUD balance, and status fields. Calculate no financial fields from partial items.

- [ ] **Step 3: Await saves in supplier form and OrderModal**

Use async submit handlers. Disable submit while pending. Call `onClose()` only after promise resolves. On rejection keep modal open and show `Not saved to Airtable` with safe error message.

- [ ] **Step 4: Preserve missing manual cost**

New order line should leave `costPerUnit` undefined, and blank Cost/Unit input should restore undefined. Cost display labels unset values `Not recorded`, not `0.00`.

- [ ] **Step 5: Run UI checks and lint**

Run UI test harness then `npm run lint`. Expected: failure remains visible; no modal closes on failed remote save.

- [ ] **Step 6: Commit admin save UX**

```bash
git add src/app/supplier-orders/page.tsx src/components/modals/OrderModal.tsx src/components/ui/LineItemsEditor.tsx src/app/orders/page.tsx
git commit -m "fix: keep admin edits until Airtable confirms"
```

### Task 5: Centralize projected and paid-cost calculations

**Files:**
- Modify: `src/lib/calc.ts:5-15,37-53,112-136`
- Modify: `src/app/dashboard/page.tsx:21-54,91-160`
- Modify: `src/app/financials/page.tsx:47-130,175-374`
- Modify: `src/app/customers/page.tsx:50-60`
- Modify: `src/components/modals/CustomerDetailModal.tsx:18-122`
- Modify: `src/lib/airtable-mappers.ts:133-152`
- Test: `src/lib/calc.test.ts`

**Consumes:** `Order`, `SupplierOrder`, `lineItemsTotal`, and linked supplier records.

**Produces:** `orderProjectedCost(order, supplierOrders): number | undefined`, `supplierCostsPaid(supplierOrders, fy): number`, and truthful labels.

- [ ] **Step 1: Write failing calculation tests**

```ts
test("uses linked authoritative supplier total rather than incomplete line items", () => {
  const projected = orderProjectedCost(order, [
    { relatedOrderId: order.id, bookedPaymentAud: 1904.67, pendingBalanceEstimatedAud: 1849.51, totalUsd: 2584.6 },
  ]);
  assert.equal(projected, 3754.18);
});

test("reports booked payment separately from projected cost", () => {
  assert.equal(supplierCostsPaid([supplier], "FY2026/27"), 1904.67);
});

test("returns undefined for costless order", () => {
  assert.equal(orderProjectedCost(orderWithoutCosts, []), undefined);
});
```

- [ ] **Step 2: Run failing test**

Run targeted Node test. Expected: missing resolver failure.

- [ ] **Step 3: Implement resolver without double counting**

For an order with one linked supplier order, expected cost is supplier booked payment plus pending AUD estimate when both exist. Do not add order manual cost or transport to linked supplier total. For no link, use manual line cost plus transport only when every line item has recorded cost; otherwise return `undefined`.

`Costs Paid` sums booked AUD payments by payment date FY. `Total Costs` and expected profit use projected total. Pending payment never counts as paid cash.

- [ ] **Step 4: Replace direct cost calculations in all financial consumers**

Pass `supplierOrders` to resolver. Dashboard labels cards exactly:

```text
Expected Costs
Costs Paid
Pending Supplier Balance
```

Use `Not recorded` for unknown projected costs. `Actual Profit Today` subtracts booked supplier payments only. Financials retains projected COGS/transport separate from booked cash row. Customer/order views use same resolver.

- [ ] **Step 5: Align Airtable Order total**

For manual-only orders write `Total Cost AUD` as manual line cost plus transport. For linked supplier order, write no duplicated `Total Cost AUD` from UI; show mapped linked supplier cost at read/render time. Never overwrite history during unrelated order edit.

- [ ] **Step 6: Run calculations, lint, build**

Run targeted tests, `npm run lint`, then `npm run build`. Expected: all pass.

- [ ] **Step 7: Commit financial semantics**

```bash
git add src/lib/calc.ts src/lib/calc.test.ts src/app/dashboard/page.tsx src/app/financials/page.tsx src/app/customers/page.tsx src/components/modals/CustomerDetailModal.tsx src/lib/airtable-mappers.ts
git commit -m "fix: separate projected and paid supplier costs"
```

### Task 6: Migrate Cooks Hill safely and document operations

**Files:**
- Create: `scripts/upsert-cooks-hill-alibaba-settlement.mjs`
- Modify: `docs/supplier-order-settlement.md`

**Consumes:** Airtable environment variables only in server/operator shell; canonical mapper field names.

**Produces:** Repeatable dry-run and upsert for Alibaba order `309939247501026460` linked to exact live Cooks Hill order.

- [ ] **Step 1: Write migration preflight assertions**

Script must:

```js
assertExactlyOne(await findCustomer("Cooks Hill"), "Cooks Hill customer");
assertExactlyOne(await findOrder("#O1002", customer.id), "Cooks Hill order");
```

Fail if zero/multiple result, supplier table unavailable, or order/customer link does not match.

- [ ] **Step 2: Define immutable migration payload**

```js
const target = {
  "Alibaba Order Number": "309939247501026460",
  "Related Order": [order.id],
  "Related Customer": [customer.id],
  "Supplier Name": "Jinan Runhang Textile Co., Ltd.",
  "Order Date": "2026-08-06",
  "Item Subtotal USD": 1584.6,
  "Shipping Fee USD": 1000,
  "Total USD": 2584.6,
  "Booked Payment AUD": 1904.67,
  "Booked Payment Date": "2026-08-12",
  "Pending Balance USD": 1292.3,
  "Pending Balance Estimated AUD": 1849.51,
  "Payment Status": "Partially Paid",
};
```

Include six known items in `Items JSON`, with notes stating four unavailable lines and that header total is authoritative.

- [ ] **Step 3: Make script dry-run default**

Print exact found record IDs, fields to create/change, and conflict fields. Do not mutate unless `--apply` is supplied. On existing record: accept equal values, set only missing values, fail on conflicting non-empty source, link, or monetary values.

- [ ] **Step 4: Add targeted test with mocked Airtable fetch**

Verify default run makes zero mutation requests; `--apply` creates once; second identical `--apply` makes zero writes; mismatch throws before write.

- [ ] **Step 5: Run migration dry-run then apply**

```bash
AIRTABLE_API_KEY=... AIRTABLE_BASE_ID=... node scripts/upsert-cooks-hill-alibaba-settlement.mjs
AIRTABLE_API_KEY=... AIRTABLE_BASE_ID=... node scripts/upsert-cooks-hill-alibaba-settlement.mjs --apply
```

Expected: one live Cooks Hill customer, one linked live order, one supplier record. Preserve run output in operator terminal, never commit secrets.

- [ ] **Step 6: Verify Airtable persisted values**

Reload record from Airtable. Confirm order link is exact record ID, booked payment `1904.67`, payment date `2026-08-12`, pending values `1292.30` USD / `1849.51` AUD, status `Partially Paid`.

- [ ] **Step 7: Document migration and rollback**

Document dry run, apply, conflict behavior, data source, rollback field values, and no deletion if later edit exists.

- [ ] **Step 8: Commit migration and runbook**

```bash
git add scripts/upsert-cooks-hill-alibaba-settlement.mjs docs/supplier-order-settlement.md
git commit -m "docs: add Cooks Hill supplier settlement runbook"
```

### Task 7: End-to-end verification and release

**Files:**
- Modify only if a failed check identifies root cause.

**Consumes:** Committed source, deployed worker configuration, migrated Airtable record.

**Produces:** Verified pushed and deployed release.

- [ ] **Step 1: Run full local checks**

```bash
npm run lint
npm run build
```

Expected: exit zero.

- [ ] **Step 2: Start admin and verify browser flows**

```bash
npm run dev
```

Verify after login and reload:

1. Supplier Orders shows Alibaba `309939247501026460`, linked live Cooks Hill order, booked `AUD1,904.67`, pending `USD1,292.30` / `AUD1,849.51`, `Partially Paid`.
2. Dashboard FY2026/27 shows `Costs Paid` increased by `AUD1,904.67`; expected costs include `AUD3,754.18`; pending supplier balance shows `AUD1,849.51`.
3. Financials uses same projected and paid numbers.
4. Order and customer detail show cost/profit from linked supplier order, without manual double count.
5. Simulate failed PATCH with a temporary denied request; edit stays open, user sees `Not saved to Airtable`, reload confirms remote truth.

- [ ] **Step 3: Review every changed line and test repository state**

```bash
git status --short
git diff HEAD~4..HEAD --check
git log --oneline -4
```

Expected: no whitespace errors; only intended files.

- [ ] **Step 4: Push committed branch**

```bash
git push origin main
```

- [ ] **Step 5: Deploy exact pushed commit**

```bash
npm run deploy
```

Record deployed revision from command output.

- [ ] **Step 6: Repeat production checks**

Log into production admin. Reload dashboard, Supplier Orders, Financials, order and customer view. Confirm values from Step2 and no Airtable connection issue. Check Worker logs for absence of supplier-order `403`/`500`.

- [ ] **Step 7: Report exact verification result**

Report commit SHA, push result, deploy revision, live Airtable record ID, exact dashboard values, tests/checks run, and any blocked external prerequisite.
