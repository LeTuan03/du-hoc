/** Các kiểu dữ liệu domain — bám theo thiết kế DB mục 6 của SRS/SDD */

export interface Country {
  id: string;
  name: string;
  slug: string;
  description: string;
  highlights: string[];
  universityCount: number;
  avgTuition: string;
  workRights: string;
  visaRate: string;
  displayOrder: number;
}

export type ProgramLevel =
  | "dai-hoc"
  | "sau-dai-hoc"
  | "cao-dang"
  | "thac-si"
  | "tien-si"
  | "du-bi-dai-hoc"
  | "chuyen-tiep";

export const PROGRAM_LEVEL_LABELS: Record<ProgramLevel, string> = {
  "dai-hoc": "Đại học",
  "sau-dai-hoc": "Sau đại học",
  "cao-dang": "Cao đẳng",
  "thac-si": "Thạc sĩ",
  "tien-si": "Tiến sĩ",
  "du-bi-dai-hoc": "Dự bị đại học",
  "chuyen-tiep": "Chuyển tiếp",
};

/** Dữ liệu ngành học khi tạo/sửa (chưa có định danh) */
export interface ProgramInput {
  name: string;
  level: ProgramLevel;
  durationMonths: number;
  tuitionPerYear: number; // USD
  description?: string;
  /** Tháng nhập học trong năm, 1..12 */
  intakeMonths?: number[];
}

/** Bản ghi ngành học trong bảng `programs` */
export interface Program extends ProgramInput {
  id: string;
  universitySlug: string;
  slug: string;
  description: string;
  intakeMonths: number[];
  isActive: boolean;
}

export interface University {
  id: string;
  countrySlug: string;
  name: string;
  slug: string;
  city: string;
  ranking: number | null;
  rankingSource: string;
  tuitionMin: number; // USD/năm
  tuitionMax: number;
  description: string; // HTML
  admissionRequirements: string[];
  englishRequirements: string;
  livingCost: string;
  dormitoryInfo: string;
  isFeatured: boolean;
  majors: string[];
  programs: Program[];
  faqs: { question: string; answer: string }[];
}

export interface Scholarship {
  id: string;
  universitySlug: string | null;
  countrySlug: string | null;
  name: string;
  slug: string;
  value: string;
  conditions: string[];
  deadline: string; // ISO date
  description: string;
  isActive: boolean;
}

export type ArticleCategory =
  | "tuyen-sinh"
  | "hoc-bong"
  | "visa"
  | "kinh-nghiem"
  | "cuoc-song-du-hoc";

export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategory, string> = {
  "tuyen-sinh": "Tin tuyển sinh",
  "hoc-bong": "Học bổng",
  visa: "Visa",
  "kinh-nghiem": "Kinh nghiệm",
  "cuoc-song-du-hoc": "Cuộc sống du học",
};

export interface Article {
  id: string;
  category: ArticleCategory;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML
  author: string;
  publishedAt: string; // ISO date
  readMinutes: number;
  /** SEO — nếu trống, trang public fallback về title/excerpt */
  metaTitle?: string | null;
  metaDescription?: string | null;
  coverImage?: string | null;
  /** ISO datetime — dùng cho sitemap lastmod + JSON-LD dateModified */
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  universityName: string;
  countrySlug: string;
  program: string;
  content: string;
  scholarship?: string | null;
  year: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQ lưu trong DB (bảng faqs) — FaqItem + định danh cho admin CRUD */
export interface FaqRecord extends FaqItem {
  id: string;
  displayOrder: number;
}

/** Pipeline trạng thái lead — state machine mục 12.4 */
export type LeadStatus =
  | "new"
  | "contacted"
  | "consulting"
  | "preparing_documents"
  | "submitted"
  | "visa_approved"
  | "discontinued";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  consulting: "Đang tư vấn",
  preparing_documents: "Chuẩn bị hồ sơ",
  submitted: "Đã nộp hồ sơ",
  visa_approved: "Đậu Visa",
  discontinued: "Không tiếp tục",
};

/** Các bước chuyển trạng thái hợp lệ (không tính discontinued — cho phép từ mọi trạng thái trừ visa_approved) */
export const LEAD_STATUS_FLOW: Record<LeadStatus, LeadStatus[]> = {
  new: ["contacted"],
  contacted: ["consulting"],
  consulting: ["preparing_documents"],
  preparing_documents: ["submitted"],
  submitted: ["visa_approved"],
  visa_approved: [],
  discontinued: [],
};

export function getAllowedTransitions(current: LeadStatus): LeadStatus[] {
  const next = [...LEAD_STATUS_FLOW[current]];
  if (current !== "visa_approved" && current !== "discontinued") {
    next.push("discontinued");
  }
  return next;
}

export interface LeadNote {
  id: string;
  note: string;
  statusChangeTo: LeadStatus | null;
  createdAt: string;
  /** Người ghi chú — null nếu do hệ thống sinh */
  userId: string | null;
  userName: string | null;
}

export interface Lead {
  id: string;
  /** Mã hồ sơ công khai, VD "DH-2026-0007" */
  code: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  email: string;
  phone: string;
  city: string;
  currentSchool?: string | null;
  gpa?: number | null;
  languageLevel?: string | null;
  desiredCountry?: string | null; // country slug
  desiredUniversity?: string | null; // university slug
  major?: string | null;
  intakeTerm?: string | null;
  budget?: string | null;
  note?: string | null;
  status: LeadStatus;
  sourcePage?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  /** Tư vấn viên phụ trách */
  assignedToId?: string | null;
  assignedToName?: string | null;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

/* ─────────────── Người dùng nội bộ & phân quyền (SRS mục 12.1) ─────────────── */

export type UserRole = "super_admin" | "admin" | "consultant";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  consultant: "Tư vấn viên",
};

/**
 * Quyền theo vai trò. Kiểm tra ở cả server action/API lẫn UI (SRS mục 12.1:
 * "không bao giờ chỉ dựa vào ẩn UI").
 */
export const ROLE_PERMISSIONS = {
  /** Quản lý tài khoản & phân quyền */
  "users.manage": ["super_admin"],
  /** CRUD nội dung: trường, quốc gia, ngành, học bổng, bài viết, FAQ... */
  "content.manage": ["super_admin", "admin"],
  /** Cấu hình site */
  "settings.manage": ["super_admin", "admin"],
  /** Xem toàn bộ lead (tư vấn viên chỉ thấy lead được giao) */
  "leads.viewAll": ["super_admin", "admin"],
  /** Giao lead cho tư vấn viên */
  "leads.assign": ["super_admin", "admin"],
  /** Xóa lead */
  "leads.delete": ["super_admin", "admin"],
  /** Xuất báo cáo */
  "reports.view": ["super_admin", "admin"],
  /** Ép đổi trạng thái ngược pipeline (SRS mục 12.4) */
  "leads.overrideStatus": ["super_admin"],
} as const satisfies Record<string, readonly UserRole[]>;

export type Permission = keyof typeof ROLE_PERMISSIONS;

export function can(role: UserRole, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[permission] as readonly UserRole[]).includes(role);
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  status: "active" | "inactive";
  lastLoginAt?: string | null;
  createdAt: string;
}

/* ─────────────── Lịch hẹn tư vấn ─────────────── */

export type AppointmentMode = "online" | "office" | "phone";
export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export const APPOINTMENT_MODE_LABELS: Record<AppointmentMode, string> = {
  online: "Trực tuyến",
  office: "Tại văn phòng",
  phone: "Điện thoại",
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Đã đặt lịch",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
  no_show: "Khách không đến",
};

export interface Appointment {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  consultantId?: string | null;
  consultantName?: string | null;
  scheduledAt: string; // ISO datetime
  durationMinutes: number;
  mode: AppointmentMode;
  location?: string | null;
  topic: string;
  status: AppointmentStatus;
  outcome?: string | null;
  createdAt: string;
}

/* ─────────────── Tài liệu hồ sơ ─────────────── */

export type DocumentStatus = "pending" | "submitted" | "approved" | "rejected";

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  pending: "Chờ nộp",
  submitted: "Đã nộp",
  approved: "Đã duyệt",
  rejected: "Cần bổ sung",
};

/**
 * Bộ tài liệu chuẩn của hồ sơ du học. Dùng làm checklist mặc định khi lead
 * chuyển sang bước "Chuẩn bị hồ sơ" — theo thực tế hồ sơ nhập học + xin visa
 * du học của các thị trường chính (Úc, Canada, Anh, Mỹ, Hàn, Nhật, Đức).
 */
export const DOCUMENT_TYPES = [
  { code: "passport", name: "Hộ chiếu (còn hạn ≥ 6 tháng)", required: true },
  { code: "transcript", name: "Học bạ / Bảng điểm", required: true },
  { code: "diploma", name: "Bằng tốt nghiệp hoặc Giấy chứng nhận tốt nghiệp tạm thời", required: true },
  { code: "language_certificate", name: "Chứng chỉ ngoại ngữ (IELTS/TOEFL/TOPIK/JLPT...)", required: true },
  { code: "financial_proof", name: "Chứng minh tài chính (sổ tiết kiệm, xác nhận số dư)", required: true },
  { code: "income_proof", name: "Chứng minh thu nhập của người bảo trợ", required: true },
  { code: "personal_statement", name: "Bài luận cá nhân / Study plan", required: false },
  { code: "recommendation_letter", name: "Thư giới thiệu", required: false },
  { code: "cv", name: "CV / Sơ yếu lý lịch", required: false },
  { code: "birth_certificate", name: "Giấy khai sinh", required: false },
  { code: "health_check", name: "Giấy khám sức khỏe", required: false },
  { code: "photo", name: "Ảnh thẻ theo chuẩn visa", required: false },
  { code: "offer_letter", name: "Thư mời nhập học (Offer Letter)", required: false },
  { code: "visa_application", name: "Hồ sơ xin visa", required: false },
  { code: "other", name: "Tài liệu khác", required: false },
] as const;

export type DocumentTypeCode = (typeof DOCUMENT_TYPES)[number]["code"];

export function documentTypeName(code: string): string {
  return DOCUMENT_TYPES.find((d) => d.code === code)?.name ?? code;
}

export interface LeadDocument {
  id: string;
  leadId: string;
  type: string;
  name: string;
  fileUrl?: string | null;
  status: DocumentStatus;
  note?: string | null;
  reviewedByName?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
