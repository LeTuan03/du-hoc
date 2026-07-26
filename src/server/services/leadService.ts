import type { Session } from "../auth";
import { leadRepository, type LeadFilter } from "../repositories/leadRepository";
import { documentRepository } from "../repositories/documentRepository";
import type { LeadInput } from "../validators/lead.schema";
import type { Lead, LeadStatus } from "../types";
import { can, getAllowedTransitions, LEAD_STATUS_LABELS } from "../types";

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
      utmSource: input.utmSource || undefined,
      utmMedium: input.utmMedium || undefined,
      utmCampaign: input.utmCampaign || undefined,
    });

    // Gửi email bất đồng bộ, không chặn response (SRS mục 13 bước 4).
    // Khi tích hợp Resend: thay 2 console.log bằng EmailService tương ứng.
    void Promise.allSettled([
      Promise.resolve().then(() =>
        console.log(`[email] Gửi xác nhận tới ${lead.email} — mã hồ sơ ${lead.code}`),
      ),
      Promise.resolve().then(() =>
        console.log(`[email] Thông báo admin: lead mới ${lead.fullName}`),
      ),
    ]);

    return { lead, isDuplicate: false };
  },

  /**
   * Danh sách lead theo bộ lọc. Tư vấn viên chỉ thấy hồ sơ được giao cho
   * mình (SRS mục 12.1) — ràng buộc áp ở server, không phụ thuộc UI.
   */
  async list(filter: LeadFilter, session?: Session | null): Promise<Lead[]> {
    const scoped: LeadFilter =
      session && !can(session.role, "leads.viewAll")
        ? { ...filter, assignedToId: session.userId }
        : filter;
    return leadRepository.filter(scoped);
  },

  async getById(id: string, session?: Session | null): Promise<Lead | undefined> {
    const lead = await leadRepository.findById(id);
    if (!lead) return undefined;
    if (
      session &&
      !can(session.role, "leads.viewAll") &&
      lead.assignedToId !== session.userId
    ) {
      return undefined;
    }
    return lead;
  },

  /** Tra cứu công khai theo mã hồ sơ + email/SĐT */
  async lookup(code: string, contact: string): Promise<Lead | undefined> {
    return leadRepository.findByCodeAndContact(code, contact);
  },

  /**
   * Đổi trạng thái theo state machine (SRS mục 12.4).
   * Super Admin được phép ép chuyển ngược pipeline, ghi rõ lý do vào timeline.
   */
  async changeStatus(
    id: string,
    newStatus: LeadStatus,
    note: string,
    session?: Session | null,
  ): Promise<{ ok: true; lead: Lead } | { ok: false; error: string }> {
    const lead = await this.getById(id, session);
    if (!lead) return { ok: false, error: "Không tìm thấy lead" };

    const allowed = getAllowedTransitions(lead.status);
    const isOverride = !allowed.includes(newStatus);
    if (isOverride) {
      const canOverride = session && can(session.role, "leads.overrideStatus");
      if (!canOverride) {
        const labels = allowed.map((s) => LEAD_STATUS_LABELS[s]).join(", ");
        return {
          ok: false,
          error: `Không thể chuyển từ "${LEAD_STATUS_LABELS[lead.status]}" sang "${LEAD_STATUS_LABELS[newStatus]}". Bước hợp lệ tiếp theo: ${labels || "không có"}`,
        };
      }
      if (!note.trim()) {
        return {
          ok: false,
          error: "Chuyển trạng thái ngoài pipeline cần ghi rõ lý do",
        };
      }
    }

    const prefix = isOverride ? "[Ép đổi trạng thái] " : "";
    const updated = await leadRepository.addNote(
      id,
      prefix + (note || `Chuyển trạng thái sang ${LEAD_STATUS_LABELS[newStatus]}`),
      newStatus,
      session?.userId ?? null,
    );
    if (!updated) return { ok: false, error: "Không tìm thấy lead" };

    // Sang bước chuẩn bị hồ sơ → dựng sẵn checklist tài liệu bắt buộc
    if (newStatus === "preparing_documents") {
      await documentRepository.ensureRequiredChecklist(id);
    }
    return { ok: true, lead: updated };
  },

  async addNote(
    id: string,
    note: string,
    session?: Session | null,
  ): Promise<Lead | undefined> {
    // Kiểm tra phạm vi truy cập trước khi ghi
    if (!(await this.getById(id, session))) return undefined;
    return leadRepository.addNote(id, note, null, session?.userId ?? null);
  },
};
