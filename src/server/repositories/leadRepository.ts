import type {
  Lead as LeadRow,
  LeadNote as LeadNoteRow,
  Prisma,
  User,
} from "@prisma/client";
import { prisma } from "../db";
import { nextLeadCode } from "../leadCode";
import type { Lead, LeadStatus } from "../types";

/** Repository lead trên Prisma/PostgreSQL (SRS mục 10.2) */

const include = {
  notes: {
    orderBy: { createdAt: "asc" as const },
    include: { user: { select: { fullName: true } } },
  },
  assignedTo: { select: { fullName: true } },
};

type Row = LeadRow & {
  notes: (LeadNoteRow & { user: Pick<User, "fullName"> | null })[];
  assignedTo: Pick<User, "fullName"> | null;
};

function toLead(row: Row): Lead {
  return {
    ...row,
    gender: row.gender as Lead["gender"],
    status: row.status as LeadStatus,
    assignedToName: row.assignedTo?.fullName ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    notes: row.notes.map((n) => ({
      id: n.id,
      note: n.note,
      statusChangeTo: n.statusChangeTo as LeadStatus | null,
      createdAt: n.createdAt.toISOString(),
      userId: n.userId,
      userName: n.user?.fullName ?? null,
    })),
  };
}

export interface LeadFilter {
  status?: string;
  country?: string;
  search?: string;
  assignedToId?: string;
  from?: Date;
  to?: Date;
}

function toWhere(filter: LeadFilter): Prisma.LeadWhereInput {
  return {
    ...(filter.status ? { status: filter.status } : {}),
    ...(filter.country ? { desiredCountry: filter.country } : {}),
    ...(filter.assignedToId
      ? filter.assignedToId === "unassigned"
        ? { assignedToId: null }
        : { assignedToId: filter.assignedToId }
      : {}),
    ...(filter.from || filter.to
      ? {
          createdAt: {
            ...(filter.from ? { gte: filter.from } : {}),
            ...(filter.to ? { lte: filter.to } : {}),
          },
        }
      : {}),
    ...(filter.search
      ? {
          OR: [
            { fullName: { contains: filter.search, mode: "insensitive" as const } },
            { email: { contains: filter.search, mode: "insensitive" as const } },
            { phone: { contains: filter.search } },
            { code: { contains: filter.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

export const leadRepository = {
  async findAll(): Promise<Lead[]> {
    const rows = await prisma.lead.findMany({
      include,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toLead);
  },

  /** Lọc ở tầng DB (SRS mục 12.3 — tránh load hết dữ liệu) */
  async filter(filter: LeadFilter): Promise<Lead[]> {
    const rows = await prisma.lead.findMany({
      where: toWhere(filter),
      include,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toLead);
  },

  async findById(id: string): Promise<Lead | undefined> {
    const row = await prisma.lead.findUnique({ where: { id }, include });
    return row ? toLead(row) : undefined;
  },

  /** Tra cứu công khai: mã hồ sơ + email hoặc SĐT khớp mới trả về */
  async findByCodeAndContact(
    code: string,
    contact: string,
  ): Promise<Lead | undefined> {
    const row = await prisma.lead.findUnique({ where: { code }, include });
    if (!row) return undefined;
    const value = contact.trim().toLowerCase();
    const matches =
      row.email.toLowerCase() === value ||
      row.phone.replace(/\s/g, "") === contact.replace(/\s/g, "");
    return matches ? toLead(row) : undefined;
  },

  /** Tìm lead trùng: cùng email trong 24h gần nhất (SRS mục 13, bước 3) */
  async findRecentDuplicate(email: string): Promise<Lead | undefined> {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const row = await prisma.lead.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        createdAt: { gt: cutoff },
      },
      include,
    });
    return row ? toLead(row) : undefined;
  },

  async create(
    data: Omit<
      Lead,
      | "id"
      | "code"
      | "status"
      | "notes"
      | "assignedToName"
      | "createdAt"
      | "updatedAt"
    >,
  ): Promise<Lead> {
    const year = new Date().getFullYear();

    // Mã hồ sơ phải duy nhất; hai lead gửi cùng lúc có thể sinh trùng số
    // thứ tự → thử lại khi vướng unique constraint (P2002).
    for (let attempt = 0; attempt < 5; attempt++) {
      const used = await prisma.lead.findMany({
        where: { code: { startsWith: `DH-${year}-` } },
        select: { code: true },
      });
      try {
        const row = await prisma.lead.create({
          data: {
            ...data,
            code: nextLeadCode(year, used.map((l) => l.code)),
            status: "new",
          },
          include,
        });
        return toLead(row);
      } catch (e) {
        if ((e as { code?: string }).code !== "P2002") throw e;
      }
    }
    throw new Error("Không cấp được mã hồ sơ, vui lòng thử lại");
  },

  async addNote(
    leadId: string,
    note: string,
    statusChangeTo: LeadStatus | null,
    userId: string | null = null,
  ): Promise<Lead | undefined> {
    try {
      const row = await prisma.lead.update({
        where: { id: leadId },
        data: {
          ...(statusChangeTo ? { status: statusChangeTo } : {}),
          notes: { create: { note, statusChangeTo, userId } },
        },
        include,
      });
      return toLead(row);
    } catch (e) {
      // P2025: lead đã bị xóa (kể cả giữa lúc admin khác đang thao tác)
      if ((e as { code?: string }).code === "P2025") return undefined;
      throw e;
    }
  },

  /** Giao lead cho tư vấn viên; `assignedToId = null` là bỏ giao */
  async assign(
    leadIds: string[],
    assignedToId: string | null,
  ): Promise<number> {
    const result = await prisma.lead.updateMany({
      where: { id: { in: leadIds } },
      data: { assignedToId },
    });
    return result.count;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.lead.delete({ where: { id } }); // cascade xóa notes/lịch hẹn/tài liệu
      return true;
    } catch {
      return false;
    }
  },

  async deleteMany(ids: string[]): Promise<number> {
    const result = await prisma.lead.deleteMany({ where: { id: { in: ids } } });
    return result.count;
  },
};
