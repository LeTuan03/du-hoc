import { z } from "zod";
import {
  APPOINTMENT_MODE_LABELS,
  APPOINTMENT_STATUS_LABELS,
  DOCUMENT_STATUS_LABELS,
  USER_ROLE_LABELS,
  type AppointmentMode,
  type AppointmentStatus,
  type DocumentStatus,
  type UserRole,
} from "../types";
import { SETTING_DEFAULTS } from "../repositories/settingRepository";

/** Zod schemas cho các module nghiệp vụ tuyển sinh (tài khoản, lịch hẹn, tài liệu, cấu hình) */

const keysOf = <T extends string>(obj: Record<T, unknown>) =>
  Object.keys(obj) as [T, ...T[]];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

const phoneField = z
  .string()
  .trim()
  .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ (VD: 0912345678)");

/* ─────────────── Tài khoản nội bộ ─────────────── */

const passwordField = z
  .string()
  .min(8, "Mật khẩu tối thiểu 8 ký tự")
  .max(72, "Mật khẩu tối đa 72 ký tự") // giới hạn của bcrypt
  .regex(/[a-zA-Z]/, "Mật khẩu cần ít nhất 1 chữ cái")
  .regex(/[0-9]/, "Mật khẩu cần ít nhất 1 chữ số");

export const userCreateSchema = z.object({
  fullName: z.string().trim().min(2, "Nhập họ tên").max(255),
  email: z.string().trim().toLowerCase().email("Email không đúng định dạng").max(255),
  phone: z.union([phoneField, z.literal("")]).transform((v) => v || null),
  role: z.enum(keysOf<UserRole>(USER_ROLE_LABELS), {
    message: "Vai trò không hợp lệ",
  }),
  status: z.enum(["active", "inactive"]),
  password: passwordField,
});

/** Khi sửa: để trống mật khẩu = giữ nguyên mật khẩu cũ */
export const userUpdateSchema = userCreateSchema.extend({
  password: z.union([passwordField, z.literal("")]).optional(),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

/* ─────────────── Lịch hẹn tư vấn ─────────────── */

export const appointmentSchema = z.object({
  leadId: z.string().trim().min(1, "Vui lòng chọn hồ sơ ứng viên"),
  consultantId: z.string().trim().transform((v) => v || null),
  // datetime-local gửi lên dạng "2026-08-01T09:30" (giờ địa phương)
  scheduledAt: z
    .string()
    .trim()
    .min(1, "Vui lòng chọn thời gian hẹn")
    .refine((v) => !Number.isNaN(new Date(v).getTime()), "Thời gian không hợp lệ")
    .transform((v) => new Date(v)),
  durationMinutes: z.coerce
    .number({ message: "Thời lượng phải là số" })
    .int()
    .min(15, "Thời lượng tối thiểu 15 phút")
    .max(480, "Thời lượng tối đa 8 giờ"),
  mode: z.enum(keysOf<AppointmentMode>(APPOINTMENT_MODE_LABELS), {
    message: "Hình thức không hợp lệ",
  }),
  location: optionalText(500),
  topic: z.string().trim().max(255).default(""),
});

export const appointmentStatusSchema = z.object({
  status: z.enum(keysOf<AppointmentStatus>(APPOINTMENT_STATUS_LABELS), {
    message: "Trạng thái không hợp lệ",
  }),
  outcome: z.string().trim().max(2000).default(""),
});

export type AppointmentInputParsed = z.infer<typeof appointmentSchema>;

/* ─────────────── Tài liệu hồ sơ ─────────────── */

export const documentSchema = z.object({
  leadId: z.string().trim().min(1),
  type: z.string().trim().min(1, "Vui lòng chọn loại tài liệu").max(50),
  name: z.string().trim().min(2, "Nhập tên tài liệu").max(255),
  fileUrl: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => !v || /^https?:\/\//.test(v) || v.startsWith("/uploads/"),
      "File phải là URL http(s):// hoặc file đã upload (/uploads/...)",
    )
    .transform((v) => v || null),
  note: optionalText(1000),
});

export const documentReviewSchema = z.object({
  status: z.enum(keysOf<DocumentStatus>(DOCUMENT_STATUS_LABELS), {
    message: "Trạng thái không hợp lệ",
  }),
  note: optionalText(1000),
});

/* ─────────────── Cấu hình site ─────────────── */

const urlField = z
  .string()
  .trim()
  .max(500)
  .refine((v) => !v || /^https?:\/\//.test(v), "Đường dẫn phải bắt đầu bằng http(s)://");

export const settingsSchema = z.object({
  site_name: z.string().trim().min(1, "Nhập tên website").max(100),
  hotline: z.string().trim().min(1, "Nhập hotline").max(50),
  email: z.string().trim().email("Email không đúng định dạng").max(255),
  address: z.string().trim().min(1, "Nhập địa chỉ").max(500),
  working_hours: z.string().trim().max(255).default(""),
  facebook_url: urlField,
  youtube_url: urlField,
  zalo_url: urlField,
  tiktok_url: urlField,
  default_meta_title: z.string().trim().max(255).default(""),
  default_meta_description: z.string().trim().max(500).default(""),
  consultation_response_hours: z.coerce
    .number({ message: "Số giờ phản hồi phải là số" })
    .int()
    .min(1, "Tối thiểu 1 giờ")
    .max(168, "Tối đa 168 giờ (7 ngày)")
    .transform(String),
}) satisfies z.ZodType<Record<keyof typeof SETTING_DEFAULTS, string>, z.ZodTypeDef, unknown>;

/* ─────────────── Giao lead cho tư vấn viên ─────────────── */

export const assignLeadsSchema = z.object({
  leadIds: z.array(z.string().min(1)).min(1, "Chưa chọn hồ sơ nào"),
  assignedToId: z.string().trim().transform((v) => v || null),
});

/* ─────────────── Tra cứu hồ sơ công khai ─────────────── */

export const leadLookupSchema = z.object({
  code: z.string().trim().min(4, "Nhập mã hồ sơ").max(30),
  contact: z.string().trim().min(5, "Nhập email hoặc số điện thoại đã đăng ký").max(255),
});
