import { revalidatePath } from "next/cache";
import type { ZodError, ZodType, ZodTypeDef } from "zod";
import { getSession, type Session } from "../auth";
import { can, type Permission } from "../types";

/** Kết quả trả về của mọi server action admin */
export type ActionResult = { ok: true } | { ok: false; error: string };

export async function requireAdmin(): Promise<boolean> {
  return Boolean(await getSession());
}

export const AUTH_ERROR: ActionResult = {
  ok: false,
  error: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
};

export const FORBIDDEN_ERROR: ActionResult = {
  ok: false,
  error: "Bạn không có quyền thực hiện thao tác này",
};

export type Guard =
  | { ok: true; session: Session }
  | { ok: false; result: ActionResult };

/** Chỉ cần đăng nhập hợp lệ — dùng cho thao tác mọi vai trò đều được làm */
export async function requireSession(): Promise<Guard> {
  const session = await getSession();
  if (!session) return { ok: false, result: AUTH_ERROR };
  return { ok: true, session };
}

/**
 * Guard chung cho server action: trả về session nếu đủ quyền, ngược lại trả
 * về ActionResult lỗi để action `return` thẳng ra (SRS mục 12.1 — chặn ở
 * server, không chỉ ẩn UI).
 */
export async function requirePermission(permission: Permission): Promise<Guard> {
  const guard = await requireSession();
  if (!guard.ok) return guard;
  if (!can(guard.session.role, permission)) {
    return { ok: false, result: FORBIDDEN_ERROR };
  }
  return guard;
}

/**
 * Nội dung public được cache theo trang (SSG/ISR) — revalidate toàn site
 * sau mỗi mutation để mọi trang liên quan đều được làm mới. Site nhỏ nên
 * cách này đơn giản và luôn đúng. sitemap.xml và /api/v1/options là route
 * handler tĩnh, KHÔNG nằm trong layout "/" nên phải revalidate riêng.
 */
export function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/api/v1/options");
}

/**
 * Pipeline chung cho create/update: auth → phân quyền → zod validate →
 * thao tác DB → revalidate. Dùng bởi mọi server action nội dung để tránh
 * 18 bản copy. Mặc định yêu cầu quyền quản lý nội dung.
 */
export async function runMutation<T>(
  // Input ≠ Output vì schema có coerce/transform — nới Input thành unknown
  schema: ZodType<T, ZodTypeDef, unknown>,
  input: unknown,
  op: (data: T, session: Session) => Promise<unknown>,
  permission: Permission = "content.manage",
): Promise<ActionResult> {
  const guard = await requirePermission(permission);
  if (!guard.ok) return guard.result;
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
  try {
    await op(parsed.data, guard.session);
  } catch (e) {
    return mutationError(e);
  }
  revalidateSite();
  return { ok: true };
}

/** Pipeline chung cho delete: auth → phân quyền → thao tác DB → revalidate */
export async function runDelete(
  op: (session: Session) => Promise<unknown>,
  permission: Permission = "content.manage",
): Promise<ActionResult> {
  const guard = await requirePermission(permission);
  if (!guard.ok) return guard.result;
  try {
    await op(guard.session);
  } catch (e) {
    return mutationError(e);
  }
  revalidateSite();
  return { ok: true };
}

/** Textarea "mỗi dòng một mục" → string[] */
export function splitLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Hidden input chứa JSON (programs, faqs) → mảng thô cho zod validate tiếp */
export function parseJsonArray(value: FormDataEntryValue | null): unknown[] {
  try {
    const parsed = JSON.parse(String(value ?? "[]"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function str(fd: FormData, name: string): string {
  return String(fd.get(name) ?? "");
}

export function firstIssue(error: ZodError): string {
  const issue = error.issues[0];
  return issue ? issue.message : "Dữ liệu không hợp lệ";
}

/** Diễn giải lỗi Prisma phổ biến thành thông báo tiếng Việt */
export function mutationError(e: unknown): ActionResult {
  const code =
    e && typeof e === "object" && "code" in e
      ? (e as { code?: string }).code
      : undefined;
  if (code === "P2002") {
    return { ok: false, error: "Slug đã tồn tại, vui lòng dùng slug khác" };
  }
  if (code === "P2025") {
    return { ok: false, error: "Không tìm thấy bản ghi (có thể đã bị xóa)" };
  }
  console.error("[admin action]", e);
  return { ok: false, error: "Có lỗi xảy ra, vui lòng thử lại" };
}
