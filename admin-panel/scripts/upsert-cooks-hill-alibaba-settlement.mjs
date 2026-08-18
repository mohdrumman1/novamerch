#!/usr/bin/env node

const RELATED_ORDER_ID = "receLbd69zNxYT6fD";
const RELATED_CUSTOMER_ID = "recHSQqCG3Juq03ya";
const ALIBABA_ORDER_NUMBER = "309939247501026460";
const TABLE = "Supplier Orders";

const SETTLEMENT_FIELDS = {
  "Alibaba Order Number": ALIBABA_ORDER_NUMBER,
  "Related Order": [RELATED_ORDER_ID],
  "Related Customer": [RELATED_CUSTOMER_ID],
  "Supplier Name": "Jinan Runhang Textile Co., Ltd.",
  "Order Date": "2026-08-06",
  "Item Subtotal USD": 1584.6,
  "Shipping Fee USD": 1000,
  "Total USD": 2584.6,
  "Projected Cost AUD": 3754.18,
  "Booked Payment AUD": 1904.67,
  "Booked Payment Date": "2026-08-12",
  "Pending Balance USD": 1292.3,
  "Pending Balance Estimated AUD": 1849.51,
  "Payment Status": "Partially Paid",
};

function baseUrl() {
  return `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };
}

function linkedIds(value) {
  return Array.isArray(value) ? value : [];
}

function fieldsEqual(existing, next) {
  return Object.keys(next).every((key) =>
    JSON.stringify(existing[key] ?? null) === JSON.stringify(next[key] ?? null)
  );
}

async function airtableJson(url, label, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${label} failed (${res.status}).`);
  return res.json();
}

async function getRecord(table, id) {
  return airtableJson(
    `${baseUrl()}/${encodeURIComponent(table)}/${id}`,
    `Read ${table} ${id}`,
    { headers: authHeaders() },
  );
}

async function listAllRecords(table) {
  const records = [];
  let offset;
  do {
    const url = new URL(`${baseUrl()}/${encodeURIComponent(table)}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const data = await airtableJson(url, `List ${table}`, { headers: authHeaders() });
    records.push(...data.records);
    offset = data.offset;
  } while (offset);
  return records;
}

function assertSupplierRecordCompatible(record) {
  const fields = record.fields;
  const orderNumber = fields["Alibaba Order Number"];
  const relatedOrders = linkedIds(fields["Related Order"]);
  const relatedCustomers = linkedIds(fields["Related Customer"]);

  if (orderNumber && orderNumber !== ALIBABA_ORDER_NUMBER) {
    throw new Error(`Conflict: Supplier Orders ${record.id} has Alibaba order ${orderNumber}.`);
  }
  if (relatedOrders.length && !relatedOrders.includes(RELATED_ORDER_ID)) {
    throw new Error(`Conflict: Supplier Orders ${record.id} links another Order.`);
  }
  if (relatedCustomers.length && !relatedCustomers.includes(RELATED_CUSTOMER_ID)) {
    throw new Error(`Conflict: Supplier Orders ${record.id} links another Customer.`);
  }
}

async function main() {
  const apply = process.argv.includes("--apply");

  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    throw new Error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in environment.");
  }

  console.log(`Mode: ${apply ? "APPLY (will write)" : "DRY RUN (no writes)"}`);
  const [order, customer, supplierOrders] = await Promise.all([
    getRecord("Orders", RELATED_ORDER_ID),
    getRecord("Customers", RELATED_CUSTOMER_ID),
    listAllRecords(TABLE),
  ]);
  void customer;

  if (!linkedIds(order.fields.Customer).includes(RELATED_CUSTOMER_ID)) {
    throw new Error(`Conflict: Orders ${RELATED_ORDER_ID} does not link Customers ${RELATED_CUSTOMER_ID}.`);
  }

  const candidates = supplierOrders.filter((record) =>
    linkedIds(record.fields["Related Order"]).includes(RELATED_ORDER_ID) ||
    record.fields["Alibaba Order Number"] === ALIBABA_ORDER_NUMBER
  );

  if (candidates.length > 1) {
    throw new Error(
      `Conflict: found ${candidates.length} Supplier Orders candidates: ${candidates.map((record) => record.id).join(", ")}.`,
    );
  }

  const existing = candidates[0];
  if (existing) assertSupplierRecordCompatible(existing);

  if (!existing) {
    console.log("No matching Supplier Orders record. Will create settlement fields.");
    console.log(JSON.stringify(SETTLEMENT_FIELDS, null, 2));
    if (!apply) return;
    const created = await airtableJson(
      `${baseUrl()}/${encodeURIComponent(TABLE)}`,
      `Create ${TABLE}`,
      { method: "POST", headers: authHeaders(), body: JSON.stringify({ fields: SETTLEMENT_FIELDS }) },
    );
    console.log(`Created Supplier Orders record ${created.id}.`);
    return;
  }

  if (fieldsEqual(existing.fields, SETTLEMENT_FIELDS)) {
    console.log(`Supplier Orders ${existing.id} already matches managed settlement fields.`);
    return;
  }

  console.log(`Supplier Orders ${existing.id} needs settlement field update.`);
  console.log(JSON.stringify(SETTLEMENT_FIELDS, null, 2));
  if (!apply) return;
  await airtableJson(
    `${baseUrl()}/${encodeURIComponent(TABLE)}/${existing.id}`,
    `Update ${TABLE} ${existing.id}`,
    { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ fields: SETTLEMENT_FIELDS }) },
  );
  console.log(`Updated Supplier Orders record ${existing.id}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Settlement migration failed.");
  process.exitCode = 1;
});
