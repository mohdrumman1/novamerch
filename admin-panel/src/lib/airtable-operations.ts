type AirtableRecord = { id: string; fields: Record<string, unknown> };

export async function listOperationsRecords(table: string, formula?: string): Promise<AirtableRecord[]> {
  const base = process.env.AIRTABLE_OPERATIONS_BASE_ID || process.env.AIRTABLE_BASE_ID;
  const key = process.env.AIRTABLE_API_KEY;
  if (!base || !key) throw new Error("Operations Airtable is not configured");
  const url = new URL(`https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}`);
  url.searchParams.set("pageSize", "100");
  if (formula) url.searchParams.set("filterByFormula", formula);
  const response = await fetch(url, { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" });
  if (!response.ok) throw new Error(`Operations Airtable error: ${response.status}`);
  return ((await response.json()) as { records: AirtableRecord[] }).records;
}

export function airtableFormula(value: string) {
  return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}
