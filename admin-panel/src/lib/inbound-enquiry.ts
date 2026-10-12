export interface InboundEnquiryInput {
  name: string;
  email: string;
  phone: string;
  company?: string;
  selections: unknown;
  attribution?: unknown;
  idempotencyKey: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInboundEnquiry(input: Partial<InboundEnquiryInput>) {
  const errors: string[] = [];
  if (!input.name?.trim()) errors.push("name_required");
  if (!input.email || !EMAIL.test(input.email.trim())) errors.push("email_invalid");
  if (!input.phone?.trim()) errors.push("phone_required");
  if (!input.idempotencyKey?.trim()) errors.push("idempotency_key_required");
  if (!input.selections || (Array.isArray(input.selections) && input.selections.length === 0)) errors.push("selections_required");
  return { valid: errors.length === 0, errors };
}
