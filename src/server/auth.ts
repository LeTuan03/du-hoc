import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Phiên admin dạng cookie ký HMAC — đơn giản, không cần DB.
 * Khi mở rộng đa người dùng + RBAC đầy đủ, thay bằng bảng users + JWT
 * theo thiết kế SRS mục 7.2 mà không đổi interface bên ngoài.
 */

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 giờ

function getSecret(): string {
  return process.env.AUTH_SECRET || "dev-secret-change-in-production";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function getAdminCredentials(): { email: string; password: string } {
  return {
    email: process.env.ADMIN_EMAIL || "admin@duhoc.edu.vn",
    password: process.env.ADMIN_PASSWORD || "Admin@123456",
  };
}

export function createSessionToken(email: string): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${email}|${expiresAt}`;
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): {
  valid: boolean;
  email?: string;
} {
  if (!token) return { valid: false };
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return { valid: false };

  let payload: string;
  try {
    payload = Buffer.from(encoded, "base64url").toString("utf-8");
  } catch {
    return { valid: false };
  }

  const expected = sign(payload);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false };
  }

  const [email, expiresAt] = payload.split("|");
  if (!expiresAt || Date.now() > Number(expiresAt)) return { valid: false };
  return { valid: true, email };
}

export async function getSession(): Promise<{ email: string } | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const result = verifySessionToken(token);
  return result.valid && result.email ? { email: result.email } : null;
}

export const sessionCookieOptions = {
  name: SESSION_COOKIE,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
};
