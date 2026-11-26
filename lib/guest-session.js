import { createHmac, timingSafeEqual } from "node:crypto";

export const GUEST_COOKIE = "jarvis_guest";
export const GUEST_SESSION_SECONDS = 60 * 60 * 24 * 30;

function sessionSecret() {
  return process.env.NEXTAUTH_SECRET || "";
}

export function createGuestToken() {
  const secret = sessionSecret();
  if (!secret) throw new Error("NEXTAUTH_SECRET is not configured");
  const expires = Math.floor(Date.now() / 1000) + GUEST_SESSION_SECONDS;
  const signature = createHmac("sha256", secret).update("jarvis-guest:" + expires).digest("base64url");
  return expires + "." + signature;
}

export function verifyGuestToken(token) {
  if (!token || typeof token !== "string") return false;
  const [expiresText, signature, extra] = token.split(".");
  if (extra !== undefined || !/^\d+$/.test(expiresText || "")) return false;
  const expires = Number(expiresText);
  if (!Number.isSafeInteger(expires) || expires <= Math.floor(Date.now() / 1000)) return false;
  const secret = sessionSecret();
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update("jarvis-guest:" + expiresText).digest("base64url");
  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export function matchesGuestPassword(input) {
  const expected = process.env.GUEST_ACCESS_PASSWORD || "";
  if (!expected || typeof input !== "string") return false;
  const providedBytes = Buffer.from(input);
  const expectedBytes = Buffer.from(expected);
  return providedBytes.length === expectedBytes.length && timingSafeEqual(providedBytes, expectedBytes);
}
