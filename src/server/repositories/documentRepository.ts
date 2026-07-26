import type { LeadDocument as DocumentRow, User } from "@prisma/client";
import { prisma } from "../db";
import { DOCUMENT_TYPES, type DocumentStatus, type LeadDocument } from "../types";

/** Repository checklist tài liệu hồ sơ của ứng viên */

type Row = DocumentRow & { reviewedBy: Pick<User, "fullName"> | null };

const include = { reviewedBy: { select: { fullName: true } } };

function toDocument(row: Row): LeadDocument {
  return {
    id: row.id,
    leadId: row.leadId,
    type: row.type,
    name: row.name,
    fileUrl: row.fileUrl,
    status: row.status as DocumentStatus,
    note: row.note,
    reviewedByName: row.reviewedBy?.fullName ?? null,
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const documentRepository = {
  async findByLead(leadId: string): Promise<LeadDocument[]> {
    const rows = await prisma.leadDocument.findMany({
      where: { leadId },
      include,
      orderBy: { createdAt: "asc" },
    });
    return rows.map(toDocument);
  },

  async create(data: {
    leadId: string;
    type: string;
    name: string;
    fileUrl?: string | null;
    note?: string | null;
  }): Promise<LeadDocument> {
    const row = await prisma.leadDocument.create({
      data: {
        leadId: data.leadId,
        type: data.type,
        name: data.name,
        fileUrl: data.fileUrl || null,
        note: data.note || null,
        status: data.fileUrl ? "submitted" : "pending",
      },
      include,
    });
    return toDocument(row);
  },

  async update(
    id: string,
    data: { name: string; fileUrl?: string | null; note?: string | null },
  ): Promise<LeadDocument> {
    const row = await prisma.leadDocument.update({
      where: { id },
      data: {
        name: data.name,
        fileUrl: data.fileUrl || null,
        note: data.note || null,
      },
      include,
    });
    return toDocument(row);
  },

  /** Duyệt/từ chối tài liệu — ghi lại người duyệt và thời điểm */
  async review(
    id: string,
    status: DocumentStatus,
    reviewerId: string,
    note: string | null,
  ): Promise<LeadDocument> {
    const row = await prisma.leadDocument.update({
      where: { id },
      data: {
        status,
        note,
        reviewedById: status === "pending" ? null : reviewerId,
        reviewedAt: status === "pending" ? null : new Date(),
      },
      include,
    });
    return toDocument(row);
  },

  delete(id: string): Promise<DocumentRow> {
    return prisma.leadDocument.delete({ where: { id } });
  },

  /**
   * Tạo checklist tài liệu bắt buộc cho lead nếu chưa có. Gọi khi lead
   * chuyển sang bước "Chuẩn bị hồ sơ" để tư vấn viên không phải nhập tay.
   */
  async ensureRequiredChecklist(leadId: string): Promise<number> {
    const existing = await prisma.leadDocument.findMany({
      where: { leadId },
      select: { type: true },
    });
    const have = new Set(existing.map((d) => d.type));
    const missing = DOCUMENT_TYPES.filter((d) => d.required && !have.has(d.code));
    if (missing.length === 0) return 0;

    await prisma.leadDocument.createMany({
      data: missing.map((d) => ({
        leadId,
        type: d.code,
        name: d.name,
        status: "pending",
      })),
    });
    return missing.length;
  },

  /** Thống kê tiến độ hồ sơ — dùng cho badge ở danh sách lead và trang tra cứu */
  async progressByLead(
    leadIds: string[],
  ): Promise<Map<string, { total: number; approved: number }>> {
    const rows = await prisma.leadDocument.groupBy({
      by: ["leadId", "status"],
      where: { leadId: { in: leadIds } },
      _count: { _all: true },
    });
    const map = new Map<string, { total: number; approved: number }>();
    for (const row of rows) {
      const entry = map.get(row.leadId) ?? { total: 0, approved: 0 };
      entry.total += row._count._all;
      if (row.status === "approved") entry.approved += row._count._all;
      map.set(row.leadId, entry);
    }
    return map;
  },
};
