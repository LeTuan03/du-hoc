import { z } from "zod";
import {
  ARTICLE_CATEGORY_LABELS,
  PROGRAM_LEVEL_LABELS,
  type ArticleCategory,
  type ProgramLevel,
} from "../types";

/** Zod schemas cho admin CRUD nội dung — validate server-side trong server actions */

const slugField = z
  .string()
  .trim()
  .min(1, "Slug không được để trống")
  .max(255)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang",
  );

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày không hợp lệ (yyyy-mm-dd)");

/** Chuỗi tùy chọn: "" → null */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

const categoryValues = Object.keys(ARTICLE_CATEGORY_LABELS) as [
  ArticleCategory,
  ...ArticleCategory[],
];

export const articleSchema = z.object({
  category: z.enum(categoryValues, { message: "Danh mục không hợp lệ" }),
  title: z.string().trim().min(5, "Tiêu đề tối thiểu 5 ký tự").max(255),
  slug: slugField,
  excerpt: z.string().trim().min(10, "Mô tả ngắn tối thiểu 10 ký tự").max(500),
  content: z.string().trim().min(20, "Nội dung tối thiểu 20 ký tự"),
  author: z.string().trim().min(2, "Nhập tên tác giả").max(100),
  publishedAt: isoDate,
  readMinutes: z.coerce
    .number({ message: "Thời gian đọc phải là số" })
    .int()
    .min(1, "Thời gian đọc tối thiểu 1 phút")
    .max(120),
  metaTitle: optionalText(255),
  metaDescription: optionalText(500),
  coverImage: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => !v || /^https?:\/\//.test(v) || v.startsWith("/uploads/"),
      "Ảnh phải là URL http(s):// hoặc ảnh đã upload (/uploads/...)",
    )
    .transform((v) => v || null),
});

const levelValues = Object.keys(PROGRAM_LEVEL_LABELS) as [
  ProgramLevel,
  ...ProgramLevel[],
];

export const programSchema = z.object({
  name: z.string().trim().min(1, "Tên chương trình không được trống"),
  level: z.enum(levelValues, { message: "Bậc học không hợp lệ" }),
  durationMonths: z.coerce
    .number({ message: "Thời lượng (tháng) phải là số" })
    .int()
    .min(1, "Thời lượng chương trình tối thiểu 1 tháng")
    .max(120, "Thời lượng chương trình tối đa 120 tháng"),
  tuitionPerYear: z.coerce
    .number({ message: "Học phí/năm phải là số" })
    .min(0, "Học phí/năm không được âm"),
  description: z.string().trim().max(2000).default(""),
  intakeMonths: z
    .array(z.coerce.number().int().min(1).max(12))
    .max(12)
    .default([]),
});

/** Ngành học đứng riêng ở /admin/programs — cần chỉ rõ thuộc trường nào */
export const standaloneProgramSchema = programSchema.extend({
  universitySlug: z.string().trim().min(1, "Vui lòng chọn trường"),
  isActive: z.boolean().default(true),
});

const qaSchema = z.object({
  question: z.string().trim().min(1, "Câu hỏi không được trống"),
  answer: z.string().trim().min(1, "Câu trả lời không được trống"),
});

export const universitySchema = z.object({
  name: z.string().trim().min(2, "Tên trường tối thiểu 2 ký tự").max(255),
  slug: slugField,
  countrySlug: z.string().trim().min(1, "Vui lòng chọn quốc gia"),
  city: z.string().trim().min(1, "Nhập thành phố").max(255),
  ranking: z
    .union([z.coerce.number().int().min(1).max(10000), z.literal("")])
    .transform((v) => (v === "" ? null : v)),
  rankingSource: z.string().trim().max(100).default(""),
  tuitionMin: z.coerce.number({ message: "Học phí min phải là số" }).min(0),
  tuitionMax: z.coerce.number({ message: "Học phí max phải là số" }).min(0),
  description: z.string().trim().min(10, "Giới thiệu tối thiểu 10 ký tự"),
  admissionRequirements: z.array(z.string().trim().min(1)),
  englishRequirements: z.string().trim().min(1, "Nhập yêu cầu tiếng Anh").max(500),
  livingCost: z.string().trim().min(1, "Nhập chi phí sinh hoạt").max(255),
  dormitoryInfo: z.string().trim().max(1000).default(""),
  isFeatured: z.boolean(),
  majors: z.array(z.string().trim().min(1)),
  programs: z.array(programSchema),
  faqs: z.array(qaSchema),
});

export const scholarshipSchema = z.object({
  name: z.string().trim().min(5, "Tên học bổng tối thiểu 5 ký tự").max(255),
  slug: slugField,
  universitySlug: optionalText(255),
  countrySlug: optionalText(100),
  value: z.string().trim().min(1, "Nhập giá trị học bổng").max(255),
  conditions: z
    .array(z.string().trim().min(1))
    .min(1, "Cần ít nhất 1 điều kiện"),
  deadline: isoDate,
  description: z.string().trim().min(10, "Mô tả tối thiểu 10 ký tự"),
  isActive: z.boolean(),
});

export const countrySchema = z.object({
  name: z.string().trim().min(1, "Nhập tên quốc gia").max(100),
  slug: slugField,
  description: z.string().trim().min(10, "Mô tả tối thiểu 10 ký tự"),
  highlights: z
    .array(z.string().trim().min(1))
    .min(1, "Cần ít nhất 1 điểm nổi bật"),
  universityCount: z.coerce
    .number({ message: "Số trường phải là số" })
    .int()
    .min(0),
  avgTuition: z.string().trim().min(1, "Nhập học phí trung bình").max(100),
  workRights: z.string().trim().min(1, "Nhập quyền làm thêm").max(255),
  visaRate: z.string().trim().min(1, "Nhập tỷ lệ visa").max(20),
  displayOrder: z.coerce
    .number({ message: "Thứ tự phải là số" })
    .int()
    .min(0),
});

export const testimonialSchema = z.object({
  studentName: z.string().trim().min(2, "Nhập tên học viên").max(100),
  universityName: z.string().trim().min(2, "Nhập tên trường").max(255),
  countrySlug: z.string().trim().min(1, "Vui lòng chọn quốc gia"),
  program: z.string().trim().min(2, "Nhập chương trình học").max(255),
  content: z.string().trim().min(10, "Nội dung tối thiểu 10 ký tự"),
  scholarship: optionalText(255),
  year: z.coerce
    .number({ message: "Năm phải là số" })
    .int()
    .min(2000)
    .max(2100),
});

export const faqSchema = z.object({
  question: z.string().trim().min(5, "Câu hỏi tối thiểu 5 ký tự").max(500),
  answer: z.string().trim().min(5, "Câu trả lời tối thiểu 5 ký tự"),
  displayOrder: z.coerce
    .number({ message: "Thứ tự phải là số" })
    .int()
    .min(0),
});
