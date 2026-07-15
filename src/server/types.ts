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

export interface Program {
  name: string;
  level: ProgramLevel;
  durationMonths: number;
  tuitionPerYear: number; // USD
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
}

export interface Testimonial {
  id: string;
  studentName: string;
  universityName: string;
  countrySlug: string;
  program: string;
  content: string;
  scholarship?: string;
  year: number;
}

export interface FaqItem {
  question: string;
  answer: string;
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
}

export interface Lead {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  email: string;
  phone: string;
  city: string;
  currentSchool?: string;
  gpa?: number;
  languageLevel?: string;
  desiredCountry?: string; // country slug
  desiredUniversity?: string; // university slug
  major?: string;
  intakeTerm?: string;
  budget?: string;
  note?: string;
  status: LeadStatus;
  sourcePage?: string;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}
