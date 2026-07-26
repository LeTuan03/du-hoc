/**
 * Mã hồ sơ công khai dạng `DH-2026-0007`.
 * Ứng viên dùng mã này (kèm email/SĐT) để tra cứu tiến trình hồ sơ
 * ở trang /tra-cuu-ho-so mà không cần tạo tài khoản.
 */

const PREFIX = "DH";

export function formatLeadCode(year: number, sequence: number): string {
  return `${PREFIX}-${year}-${String(sequence).padStart(4, "0")}`;
}

/** Số thứ tự kế tiếp trong năm, dựa trên các mã đã cấp */
export function nextLeadCode(year: number, existingCodes: string[]): string {
  const prefix = `${PREFIX}-${year}-`;
  const max = existingCodes.reduce((acc, code) => {
    if (!code.startsWith(prefix)) return acc;
    const n = Number(code.slice(prefix.length));
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return formatLeadCode(year, max + 1);
}

/** Chuẩn hóa mã người dùng nhập (chấp nhận thiếu tiền tố, viết thường, thừa khoảng trắng) */
export function normalizeLeadCode(input: string): string {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, "");
  if (/^\d{4}-\d{1,}$/.test(cleaned)) return `${PREFIX}-${cleaned}`;
  return cleaned;
}
