export type TableSchema = Record<string, string[]>;

export const REQUIRED_OPERATIONAL_TABLES: TableSchema = {
  Customers: ["Name", "Email"],
  Quotes: ["Customer"],
  Orders: ["Customer"],
  Invoices: ["Customer"],
  Shipments: ["Order"],
  "Supplier Orders": ["Related Order"],
};

export function validateTableSchema(schema: TableSchema, required = REQUIRED_OPERATIONAL_TABLES) {
  const errors: string[] = [];
  for (const [table, fields] of Object.entries(required)) {
    if (!schema[table]) {
      errors.push(`missing table: ${table}`);
      continue;
    }
    for (const field of fields) {
      if (!schema[table].includes(field)) errors.push(`missing field: ${table}.${field}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

export function buildSourceReference(sourceBaseId: string, sourceRecordId: string) {
  return `${sourceBaseId}:${sourceRecordId}`;
}
