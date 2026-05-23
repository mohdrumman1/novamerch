type AirtableRecord = { id: string; fields: Record<string, unknown> };

const BASE = () => `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`;
const AUTH = () => ({ Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`, "Content-Type": "application/json" });

export async function listRecords(table: string): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const url = new URL(`${BASE()}/${encodeURIComponent(table)}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const res = await fetch(url.toString(), { headers: AUTH(), cache: "no-store" });
    if (!res.ok) throw new Error(`Airtable listRecords error: ${await res.text()}`);
    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);
  return records;
}

export async function createRecord(table: string, fields: Record<string, unknown>): Promise<AirtableRecord> {
  const res = await fetch(`${BASE()}/${encodeURIComponent(table)}`, {
    method: "POST",
    headers: AUTH(),
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Airtable createRecord error: ${await res.text()}`);
  return res.json();
}

export async function updateRecord(table: string, id: string, fields: Record<string, unknown>): Promise<AirtableRecord> {
  const res = await fetch(`${BASE()}/${encodeURIComponent(table)}/${id}`, {
    method: "PATCH",
    headers: AUTH(),
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Airtable updateRecord error: ${await res.text()}`);
  return res.json();
}

export async function deleteRecord(table: string, id: string): Promise<void> {
  const res = await fetch(`${BASE()}/${encodeURIComponent(table)}/${id}`, {
    method: "DELETE",
    headers: AUTH(),
  });
  if (!res.ok) throw new Error(`Airtable deleteRecord error: ${await res.text()}`);
}
