import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Lead, LeadNote, LeadStatus } from "../types";

/**
 * Repository lưu lead vào file JSON (data/leads.json).
 * Tách riêng layer này để về sau thay bằng Prisma/PostgreSQL
 * mà không đụng đến Service/Controller (SRS mục 10.2).
 */

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

// Serialize mọi thao tác ghi để tránh race condition giữa các request
let writeQueue: Promise<unknown> = Promise.resolve();

async function readAll(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return seedLeads();
  }
}

async function writeAll(leads: Lead[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = LEADS_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(leads, null, 2), "utf-8");
  await fs.rename(tmp, LEADS_FILE);
}

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task);
  writeQueue = run.catch(() => undefined);
  return run;
}

/** Vài lead mẫu để dashboard có dữ liệu demo ngay lần chạy đầu */
function seedLeads(): Lead[] {
  const daysAgo = (n: number, hour = 9) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(hour, 30, 0, 0);
    return d.toISOString();
  };
  const seed: Lead[] = [
    {
      id: randomUUID(),
      fullName: "Trần Thị Bích Ngọc",
      dateOfBirth: "2008-03-14",
      gender: "female",
      email: "bichngoc.tran@example.com",
      phone: "0912345678",
      city: "Đà Nẵng",
      currentSchool: "THPT Phan Châu Trinh",
      gpa: 8.5,
      languageLevel: "IELTS 6.0",
      desiredCountry: "canada",
      desiredUniversity: "university-of-toronto",
      major: "Khoa học Máy tính",
      intakeTerm: "Fall 2027",
      budget: "700 triệu - 1 tỷ/năm",
      note: "Muốn tư vấn thêm về học bổng",
      status: "consulting",
      sourcePage: "/truong/university-of-toronto",
      notes: [
        {
          id: randomUUID(),
          note: "Đã gọi điện lần 1, em quan tâm học bổng Pearson. Hẹn tư vấn chi tiết cùng phụ huynh.",
          statusChangeTo: "contacted",
          createdAt: daysAgo(4, 14),
        },
        {
          id: randomUUID(),
          note: "Tư vấn online cùng mẹ, gia đình đồng ý lộ trình. Gửi checklist hồ sơ qua email.",
          statusChangeTo: "consulting",
          createdAt: daysAgo(2, 10),
        },
      ],
      createdAt: daysAgo(5),
      updatedAt: daysAgo(2, 10),
    },
    {
      id: randomUUID(),
      fullName: "Lê Hoàng Nam",
      dateOfBirth: "2007-11-02",
      gender: "male",
      email: "hoangnam.le@example.com",
      phone: "0987654321",
      city: "Hà Nội",
      currentSchool: "THPT Chu Văn An",
      gpa: 9.1,
      languageLevel: "IELTS 7.0",
      desiredCountry: "singapore",
      desiredUniversity: "national-university-of-singapore",
      major: "Khoa học Máy tính",
      intakeTerm: "Fall 2027",
      budget: "Trên 1 tỷ/năm",
      status: "new",
      sourcePage: "/hoc-bong/hoc-bong-asean-undergraduate-nus",
      notes: [],
      createdAt: daysAgo(1, 16),
      updatedAt: daysAgo(1, 16),
    },
    {
      id: randomUUID(),
      fullName: "Phạm Thu Hà",
      dateOfBirth: "2008-07-25",
      gender: "female",
      email: "thuha.pham@example.com",
      phone: "0905112233",
      city: "TP. Hồ Chí Minh",
      currentSchool: "THPT Nguyễn Thị Minh Khai",
      gpa: 7.8,
      languageLevel: "Chưa có chứng chỉ",
      desiredCountry: "han-quoc",
      desiredUniversity: "yonsei-university",
      major: "Truyền thông",
      intakeTerm: "Spring 2027",
      budget: "300 - 500 triệu/năm",
      note: "Em muốn học tiếng Hàn trước rồi vào chính khóa",
      status: "preparing_documents",
      sourcePage: "/quoc-gia/han-quoc",
      notes: [
        {
          id: randomUUID(),
          note: "Gọi điện tư vấn lộ trình D-4 → D-2. Em và gia đình thống nhất đi kỳ tháng 3/2027.",
          statusChangeTo: "contacted",
          createdAt: daysAgo(12),
        },
        {
          id: randomUUID(),
          note: "Ký hợp đồng dịch vụ, bắt đầu chuẩn bị hồ sơ nhập học KLI.",
          statusChangeTo: "preparing_documents",
          createdAt: daysAgo(6, 15),
        },
      ],
      createdAt: daysAgo(14),
      updatedAt: daysAgo(6, 15),
    },
    {
      id: randomUUID(),
      fullName: "Ngô Minh Khang",
      dateOfBirth: "2006-01-18",
      gender: "male",
      email: "minhkhang.ngo@example.com",
      phone: "0938445566",
      city: "Cần Thơ",
      gpa: 8.2,
      languageLevel: "IELTS 6.5",
      desiredCountry: "uc",
      desiredUniversity: "university-of-melbourne",
      major: "Thương mại",
      intakeTerm: "February 2027",
      budget: "700 triệu - 1 tỷ/năm",
      status: "visa_approved",
      sourcePage: "/dang-ky-tu-van",
      notes: [
        {
          id: randomUUID(),
          note: "Hồ sơ đầy đủ, nộp visa subclass 500.",
          statusChangeTo: "submitted",
          createdAt: daysAgo(30),
        },
        {
          id: randomUUID(),
          note: "VISA ĐÃ ĐƯỢC DUYỆT sau 15 ngày! Thông báo gia đình, lên kế hoạch pre-departure.",
          statusChangeTo: "visa_approved",
          createdAt: daysAgo(15, 11),
        },
      ],
      createdAt: daysAgo(45),
      updatedAt: daysAgo(15, 11),
    },
    {
      id: randomUUID(),
      fullName: "Đặng Quỳnh Chi",
      dateOfBirth: "2008-09-09",
      gender: "female",
      email: "quynhchi.dang@example.com",
      phone: "0977889900",
      city: "Hải Phòng",
      gpa: 7.2,
      languageLevel: "Chưa có chứng chỉ",
      desiredCountry: "nhat-ban",
      major: "Du lịch & Khách sạn",
      intakeTerm: "Fall 2027",
      budget: "300 - 500 triệu/năm",
      status: "contacted",
      sourcePage: "/",
      notes: [
        {
          id: randomUUID(),
          note: "Đã liên hệ qua Zalo, em đang phân vân giữa Nhật và Hàn. Gửi tài liệu so sánh 2 nước.",
          statusChangeTo: "contacted",
          createdAt: daysAgo(3, 17),
        },
      ],
      createdAt: daysAgo(3, 9),
      updatedAt: daysAgo(3, 17),
    },
  ];
  return seed;
}

export const leadRepository = {
  async findAll(): Promise<Lead[]> {
    const leads = await readAll();
    // Đảm bảo file seed được ghi xuống ở lần đọc đầu tiên
    try {
      await fs.access(LEADS_FILE);
    } catch {
      await enqueue(() => writeAll(leads));
    }
    return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async findById(id: string): Promise<Lead | undefined> {
    const leads = await readAll();
    return leads.find((l) => l.id === id);
  },

  /** Tìm lead trùng: cùng email trong 24h gần nhất (SRS mục 13, bước 3) */
  async findRecentDuplicate(email: string): Promise<Lead | undefined> {
    const leads = await readAll();
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return leads.find(
      (l) =>
        l.email.toLowerCase() === email.toLowerCase() &&
        new Date(l.createdAt).getTime() > cutoff,
    );
  },

  async create(data: Omit<Lead, "id" | "status" | "notes" | "createdAt" | "updatedAt">): Promise<Lead> {
    return enqueue(async () => {
      const leads = await readAll();
      const now = new Date().toISOString();
      const lead: Lead = {
        ...data,
        id: randomUUID(),
        status: "new",
        notes: [],
        createdAt: now,
        updatedAt: now,
      };
      leads.push(lead);
      await writeAll(leads);
      return lead;
    });
  },

  async addNote(
    leadId: string,
    note: string,
    statusChangeTo: LeadStatus | null,
  ): Promise<Lead | undefined> {
    return enqueue(async () => {
      const leads = await readAll();
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return undefined;
      const newNote: LeadNote = {
        id: randomUUID(),
        note,
        statusChangeTo,
        createdAt: new Date().toISOString(),
      };
      lead.notes.push(newNote);
      if (statusChangeTo) lead.status = statusChangeTo;
      lead.updatedAt = newNote.createdAt;
      await writeAll(leads);
      return lead;
    });
  },
};
