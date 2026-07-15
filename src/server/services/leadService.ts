import { leadRepository } from "../repositories/leadRepository";
import type { LeadInput } from "../validators/lead.schema";
import type { Lead, LeadStatus } from "../types";
import { getAllowedTransitions } from "../types";

/**
 * Business logic thuần túy — không phụ thuộc HTTP (SRS mục 10.2).
 * Email service (Resend) sẽ được gắn vào đây ở giai đoạn tích hợp;
 * hiện tại log ra console để không chặn luồng tạo lead.
 */
export const leadService = {
  async create(
    input: LeadInput,
  ): Promise<{ lead: Lead; isDuplicate: boolean }> {
    // Chống trùng lặp: cùng email trong 24h → thêm note vào lead cũ
    const existing = await leadRepository.findRecentDuplicate(input.email);
    if (existing) {
      const updated = await leadRepository.addNote(
        existing.id,
        `Khách đăng ký lại từ trang ${input.sourcePage || "không rõ"}.` +
          (input.note ? ` Ghi chú mới: ${input.note}` : ""),
        null,
      );
      return { lead: updated ?? existing, isDuplicate: true };
    }

    const lead = await leadRepository.create({
      fullName: input.fullName,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender,
      email: input.email,
      phone: input.phone,
      city: input.city,
      currentSchool: input.currentSchool || undefined,
      gpa: input.gpa,
      languageLevel: input.languageLevel || undefined,
      desiredCountry: input.desiredCountry || undefined,
      desiredUniversity: input.desiredUniversity || undefined,
      major: input.major || undefined,
      intakeTerm: input.intakeTerm || undefined,
      budget: input.budget || undefined,
      note: input.note || undefined,
      sourcePage: input.sourcePage,
    });

    // Gửi email bất đồng bộ, không chặn response (SRS mục 13 bước 4).
    // Khi tích hợp Resend: thay 2 console.log bằng EmailService tương ứng.
    void Promise.allSettled([
      Promise.resolve().then(() =>
        console.log(`[email] Gửi xác nhận tới ${lead.email}`),
      ),
      Promise.resolve().then(() =>
        console.log(`[email] Thông báo admin: lead mới ${lead.fullName}`),
      ),
    ]);

    return { lead, isDuplicate: false };
  },

  async list(filter: {
    status?: string;
    country?: string;
    search?: string;
  }): Promise<Lead[]> {
    let leads = await leadRepository.findAll();
    if (filter.status) {
      leads = leads.filter((l) => l.status === filter.status);
    }
    if (filter.country) {
      leads = leads.filter((l) => l.desiredCountry === filter.country);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      leads = leads.filter(
        (l) =>
          l.fullName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q),
      );
    }
    return leads;
  },

  async getById(id: string): Promise<Lead | undefined> {
    return leadRepository.findById(id);
  },

  /** Đổi trạng thái theo state machine (SRS mục 12.4) */
  async changeStatus(
    id: string,
    newStatus: LeadStatus,
    note: string,
  ): Promise<{ ok: true; lead: Lead } | { ok: false; error: string }> {
    const lead = await leadRepository.findById(id);
    if (!lead) return { ok: false, error: "Không tìm thấy lead" };

    const allowed = getAllowedTransitions(lead.status);
    if (!allowed.includes(newStatus)) {
      return {
        ok: false,
        error: `Không thể chuyển từ trạng thái hiện tại sang trạng thái này. Các bước hợp lệ: ${allowed.join(", ") || "không có"}`,
      };
    }

    const updated = await leadRepository.addNote(
      id,
      note || `Chuyển trạng thái sang ${newStatus}`,
      newStatus,
    );
    return { ok: true, lead: updated! };
  },

  async addNote(id: string, note: string): Promise<Lead | undefined> {
    return leadRepository.addNote(id, note, null);
  },
};
