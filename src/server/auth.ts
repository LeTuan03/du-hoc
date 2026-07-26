import { createHmac, timingSafeEqual } from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { can, type Permission, type User, type UserRole } from "./types";

/**
 * Phiên admin: cookie ký HMAC chứa userId, tài khoản lưu ở bảng `users`
 * (SRS mục 6.2 + 12.1). Vai trò và trạng thái được đọc lại từ DB mỗi request
 * nên vô hiệu hóa tài khoản có hiệu lực ngay, không cần chờ token hết hạn.
 */

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 giờ

function getSecret(): string {
  return process.env.AUTH_SECRET || "dev-secret-change-in-production";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(userId: string): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${userId}|${expiresAt}`;
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): {
  valid: boolean;
  userId?: string;
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

  const [userId, expiresAt] = payload.split("|");
  if (!expiresAt || Date.now() > Number(expiresAt)) return { valid: false };
  return { valid: true, userId };
}

export interface Session {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
}

/** cache(): nhiều lời gọi trong cùng một request chỉ truy vấn DB một lần */
export const getSession = cache(async (): Promise<Session | null> => {
  const store = await cookies();
  const { valid, userId } = verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!valid || !userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, fullName: true, role: true, status: true },
  });
  if (!user || user.status !== "active") return null;

  return {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role as UserRole,
  };
});

/** Session có quyền `permission` hay không — dùng ở server action, API và RSC */
export async function sessionCan(permission: Permission): Promise<boolean> {
  const session = await getSession();
  return session ? can(session.role, permission) : false;
}

/** Xác thực email + mật khẩu; trả về user nếu hợp lệ */
export async function verifyCredentials(
  email: string,
  password: string,
): Promise<User | null> {
  const row = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  // So sánh hash kể cả khi không tìm thấy user để thời gian phản hồi đồng đều,
  // tránh lộ email nào đã tồn tại qua timing.
  const hash = row?.passwordHash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidina";
  const ok = await bcrypt.compare(password, hash);
  if (!row || !ok || row.status !== "active") return null;

  await prisma.user.update({
    where: { id: row.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    avatarUrl: row.avatarUrl,
    role: row.role as UserRole,
    status: row.status as User["status"],
    lastLoginAt: row.lastLoginAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export const sessionCookieOptions = {
  name: SESSION_COOKIE,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
};
