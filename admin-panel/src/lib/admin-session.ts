const SESSION_COOKIE = "novamerch_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const encoder = new TextEncoder();

async function hmacSha256Hex(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function equalStrings(left: string, right: string) {
  if (left.length !== right.length) return false;

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

export function getAdminCookieName() {
  return SESSION_COOKIE;
}

export function getAdminSessionMaxAge() {
  return SESSION_MAX_AGE_SECONDS;
}

export async function createAdminSessionToken(username: string, secret: string) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomUUID();
  const payload = `${username}.${issuedAt}.${nonce}`;
  const signature = await hmacSha256Hex(secret, payload);
  return `${payload}.${signature}`;
}

export async function isValidAdminSession(
  token: string | undefined,
  username: string,
  secret: string,
) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [tokenUsername, issuedAtValue, nonce, signature] = parts;
  const issuedAt = Number(issuedAtValue);
  const now = Math.floor(Date.now() / 1000);

  if (tokenUsername !== username || !Number.isFinite(issuedAt) || !nonce) {
    return false;
  }

  if (issuedAt > now || now - issuedAt > SESSION_MAX_AGE_SECONDS) {
    return false;
  }

  const expected = await hmacSha256Hex(secret, `${tokenUsername}.${issuedAt}.${nonce}`);
  return equalStrings(signature, expected);
}
