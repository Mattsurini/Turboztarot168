import { cookies } from "next/headers";
import crypto from "node:crypto";

/**
 * Admin auth, self-hosted: sha256 password hash in env + HMAC-signed HttpOnly
 * cookie. No Supabase. Set ADMIN_PASSWORD_HASH (hex of your password) and
 * ADMIN_COOKIE_SECRET (any long random string).
 */

const COOKIE = "tz_admin";
const MAX_AGE = 7 * 24 * 3600; // 7 days

/** Read ADMIN_COOKIE_SECRET at call time; fail closed unless >= 32 chars. */
function currentSecret(): string {
  const s = process.env.ADMIN_COOKIE_SECRET || "";
  return s.length >= 32 ? s : "";
}

function hmac(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

/** Server-only: is there a valid admin session? Mirrors the old getAdminUser(). */
export async function getAdminUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  const secret = currentSecret();
  if (!secret) return null;
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(hmac(payload, secret));
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  let exp = 0;
  try {
    exp = Number(JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).exp);
  } catch {
    return null;
  }
  if (!exp || exp < Date.now()) return null;
  return { id: "admin" };
}

/** Sign a session cookie for a freshly logged-in admin. */
export async function createAdminSession() {
  const secret = currentSecret();
  if (!secret) throw new Error("ระบบแอดมินยังไม่ได้ตั้งค่า");
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 })
  ).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${hmac(payload, secret)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroyAdminSession() {
  (await cookies()).set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

/** Constant-time check of a submitted password against ADMIN_PASSWORD_HASH. */
export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD_HASH || "";
  if (!expected || !password) return false;
  const actual = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
