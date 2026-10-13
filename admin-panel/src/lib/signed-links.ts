const encoder = new TextEncoder();

async function sign(secret: string, value: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Buffer.from(digest).toString("base64url");
}

export type CustomerLinkKind = "approval" | "tracking" | "feedback";

export async function createOrderLinkToken(kind: CustomerLinkKind, orderId: string, secret: string, ttlSeconds = 60 * 60 * 24 * 30) {
  const payload = `${kind}.${orderId}.${Math.floor(Date.now() / 1000) + ttlSeconds}.${crypto.randomUUID()}`;
  return `${payload}.${await sign(secret, payload)}`;
}

export async function verifyOrderLinkToken(token: string, expectedKind: CustomerLinkKind, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 5 || parts[0] !== expectedKind) return null;
  const [kind, orderId, expiryValue, nonce, signature] = parts;
  const expiry = Number(expiryValue);
  if (!orderId || !nonce || !Number.isFinite(expiry) || expiry < Math.floor(Date.now() / 1000)) return null;
  const expected = await sign(secret, `${kind}.${orderId}.${expiryValue}.${nonce}`);
  if (expected.length !== signature.length) return null;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return mismatch === 0 ? { kind, orderId, expiresAt: expiry } : null;
}
