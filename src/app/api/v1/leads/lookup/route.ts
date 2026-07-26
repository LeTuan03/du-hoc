import { NextRequest } from "next/server";
import { leadService } from "@/server/services/leadService";
import { documentRepository } from "@/server/repositories/documentRepository";
import { appointmentRepository } from "@/server/repositories/appointmentRepository";
import { normalizeLeadCode } from "@/server/leadCode";
import { leadLookupSchema } from "@/server/validators/admissions.schema";
import { checkRateLimit, getClientIp } from "@/server/middlewares/rateLimit";
import {
  DOCUMENT_STATUS_LABELS,
  LEAD_STATUS_LABELS,
  type LeadStatus,
} from "@/server/types";
import { fail, invalid, ok, withErrorHandler } from "@/server/apiResponse";

/**
 * POST /api/v1/leads/lookup — tra cứu tiến trình hồ sơ công khai.
 * Yêu cầu mã hồ sơ + email/SĐT đã đăng ký nên không thể dò mã hàng loạt;
 * kèm rate limit theo IP. Chỉ trả về dữ liệu ứng viên được phép thấy —
 * không lộ ghi chú nội bộ của tư vấn viên.
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const rate = checkRateLimit(`lookup:${getClientIp(req)}`);
  if (!rate.allowed) {
    return fail(
      `Bạn thử quá nhiều lần, vui lòng đợi ${rate.retryAfterSeconds} giây`,
      429,
    );
  }

  const parsed = leadLookupSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);

  const lead = await leadService.lookup(
    normalizeLeadCode(parsed.data.code),
    parsed.data.contact,
  );
  if (!lead) {
    // Thông báo chung cho cả "sai mã" lẫn "sai liên hệ" để không dò được mã hợp lệ
    return fail(
      "Không tìm thấy hồ sơ khớp với mã và thông tin liên hệ đã nhập",
      404,
    );
  }

  const [documents, appointments] = await Promise.all([
    documentRepository.findByLead(lead.id),
    appointmentRepository.findByLead(lead.id),
  ]);

  const statuses = Object.keys(LEAD_STATUS_LABELS) as LeadStatus[];
  const pipeline = statuses
    .filter((s) => s !== "discontinued")
    .map((status) => ({
      status,
      label: LEAD_STATUS_LABELS[status],
      done:
        statuses.indexOf(status) <= statuses.indexOf(lead.status) &&
        lead.status !== "discontinued",
      current: status === lead.status,
    }));

  return ok({
    code: lead.code,
    fullName: lead.fullName,
    status: lead.status,
    statusLabel: LEAD_STATUS_LABELS[lead.status],
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
    consultantName: lead.assignedToName,
    desiredCountry: lead.desiredCountry,
    desiredUniversity: lead.desiredUniversity,
    major: lead.major,
    intakeTerm: lead.intakeTerm,
    pipeline,
    documents: documents.map((d) => ({
      name: d.name,
      status: d.status,
      statusLabel: DOCUMENT_STATUS_LABELS[d.status],
      // `note` là hướng dẫn bổ sung dành cho ứng viên, không phải ghi chú nội bộ
      note: d.status === "rejected" ? d.note : null,
      updatedAt: d.updatedAt,
    })),
    appointments: appointments
      .filter((a) => a.status === "scheduled")
      .map((a) => ({
        scheduledAt: a.scheduledAt,
        mode: a.mode,
        topic: a.topic,
        consultantName: a.consultantName,
        location: a.location,
      })),
  });
});
