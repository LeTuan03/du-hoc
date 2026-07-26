import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { getSession, type Session } from "./auth";
import { can, type Permission } from "./types";

/** Định dạng phản hồi API chuẩn theo SRS mục 7.1 */

export interface Meta {
  page?: number;
  limit?: number;
  total: number;
}

export function ok<T>(data: T, meta?: Meta, message = "Thành công") {
  return NextResponse.json({ success: true, data, message, ...(meta ? { meta } : {}) });
}

export function created<T>(data: T, message = "Tạo thành công") {
  return NextResponse.json({ success: true, data, message }, { status: 201 });
}

export function fail(message: string, status = 400, errors?: unknown) {
  return NextResponse.json(
    { success: false, message, ...(errors ? { errors } : {}) },
    { status },
  );
}

export function invalid(error: ZodError) {
  return fail(
    "Dữ liệu không hợp lệ",
    400,
    error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
  );
}

export const notFound = (what = "Không tìm thấy dữ liệu") => fail(what, 404);

/**
 * Guard cho Route Handler: trả về session hoặc response lỗi 401/403.
 * Dùng: `const auth = await guard("content.manage"); if ("response" in auth) return auth.response;`
 */
export async function guard(
  permission?: Permission,
): Promise<{ session: Session } | { response: NextResponse }> {
  const session = await getSession();
  if (!session) return { response: fail("Chưa đăng nhập", 401) };
  if (permission && !can(session.role, permission)) {
    return { response: fail("Bạn không có quyền thực hiện thao tác này", 403) };
  }
  return { session };
}

/** Phân trang từ query string, chặn limit quá lớn */
export function paginate(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

/** Bọc handler để lỗi ngoài dự kiến trả về 500 đúng format (SRS mục 10.4) */
export function withErrorHandler<Args extends unknown[]>(
  handler: (...args: Args) => Promise<NextResponse>,
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("[api]", error);
      return fail("Có lỗi xảy ra, vui lòng thử lại sau", 500);
    }
  };
}
