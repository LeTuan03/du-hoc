import { z } from "zod";

/** Zod schema dùng chung client + server (SRS mục 11.4) */
export const leadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Họ tên tối thiểu 2 ký tự")
    .max(255, "Họ tên quá dài"),
  dateOfBirth: z
    .string()
    .min(1, "Vui lòng chọn ngày sinh")
    .refine((v) => {
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return false;
      const year = d.getFullYear();
      return year >= 1950 && year <= new Date().getFullYear();
    }, "Ngày sinh không hợp lệ"),
  gender: z.enum(["male", "female", "other"], {
    message: "Vui lòng chọn giới tính",
  }),
  email: z.string().trim().email("Email không đúng định dạng").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ (VD: 0912345678)"),
  city: z.string().trim().min(1, "Vui lòng nhập tỉnh/thành phố").max(100),
  currentSchool: z.string().trim().max(255).optional().or(z.literal("")),
  gpa: z
    .union([
      z
        .coerce
        .number()
        .min(0, "GPA từ 0 đến 10")
        .max(10, "GPA từ 0 đến 10"),
      z.literal(""),
    ])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  languageLevel: z.string().trim().max(100).optional().or(z.literal("")),
  desiredCountry: z.string().trim().max(100).optional().or(z.literal("")),
  desiredUniversity: z.string().trim().max(255).optional().or(z.literal("")),
  major: z.string().trim().max(255).optional().or(z.literal("")),
  intakeTerm: z.string().trim().max(50).optional().or(z.literal("")),
  budget: z.string().trim().max(100).optional().or(z.literal("")),
  note: z.string().trim().max(1000, "Ghi chú tối đa 1000 ký tự").optional().or(z.literal("")),
  // Honeypot chống bot — người dùng thật không bao giờ điền field này
  website: z.string().max(0, "Yêu cầu không hợp lệ").optional().or(z.literal("")),
  sourcePage: z.string().max(500).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
