export async function sendBrevoTransactional(input: { to: string; name?: string; subject: string; htmlContent: string; templateId?: number }) {
  if (process.env.BREVO_ENABLED !== "true") return { sent: false, disabled: true as const };
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is not configured");
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST", headers: { "api-key": apiKey, "content-type": "application/json" },
    body: JSON.stringify({ sender: { email: process.env.BREVO_SENDER_EMAIL || "quotes@novamerchau.com", name: "NovaMerch" }, to: [{ email: input.to, name: input.name }], subject: input.subject, htmlContent: input.htmlContent, ...(input.templateId ? { templateId: input.templateId } : {}) }),
  });
  if (!response.ok) throw new Error(`Brevo send failed: ${response.status}`);
  return { sent: true as const, messageId: response.headers.get("x-message-id") || (await response.json().catch(() => ({}))).messageId || null };
}
