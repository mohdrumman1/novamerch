export type AirtableOwnership = "leads" | "operations";

/** Configuration is explicit so a migration cannot silently repoint the admin panel. */
export function getRuntimeConfig(env: Record<string, string | undefined> = process.env) {
  const leadsBaseId = env.AIRTABLE_LEADS_BASE_ID ?? env.AIRTABLE_BASE_ID ?? "";
  const operationsBaseId = env.AIRTABLE_OPERATIONS_BASE_ID ?? "";
  return {
    leadsBaseId,
    operationsBaseId,
    inboundQuoteMode: env.INBOUND_QUOTE_MODE === "operations" ? "operations" as const : "legacy" as const,
    automationEnabled: env.AUTOMATION_ENABLED === "true",
    brevoEnabled: env.BREVO_ENABLED === "true",
  };
}

export function assertConfiguredBaseId(baseId: string, ownership: AirtableOwnership) {
  if (!/^app[a-zA-Z0-9]+$/.test(baseId)) {
    throw new Error(`Missing or invalid Airtable ${ownership} base ID`);
  }
  return baseId;
}
