import type { Lead as LeadRow, LeadNote as LeadNoteRow } from "@prisma/client";
import { prisma } from "../db";
import type { Lead, LeadStatus } from "../types";

/** Repository lead trên Prisma/PostgreSQL (SRS mục 10.2) */

const withNotes = {
  notes: { orderBy: { createdAt: "asc" as const } },
};

function toLead(row: LeadRow & { notes: LeadNoteRow[] }): Lead {
  return {
    ...row,
    gender: row.gender as Lead["gender"],
    status: row.status as LeadStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    notes: row.notes.map((n) => ({
      id: n.id,
      note: n.note,
      statusChangeTo: n.statusChangeTo as LeadStatus | null,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}

export const leadRepository = {
  async findAll(): Promise<Lead[]> {
    const rows = await prisma.lead.findMany({
      include: withNotes,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toLead);
  },

  async findById(id: string): Promise<Lead | undefined> {
    const row = await prisma.lead.findUnique({
      where: { id },
      include: withNotes,
    });
    return row ? toLead(row) : undefined;
  },

  /** Tìm lead trùng: cùng email trong 24h gần nhất (SRS mục 13, bước 3) */
  async findRecentDuplicate(email: string): Promise<Lead | undefined> {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const row = await prisma.lead.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        createdAt: { gt: cutoff },
      },
      include: withNotes,
    });
    return row ? toLead(row) : undefined;
  },

  async create(
    data: Omit<Lead, "id" | "status" | "notes" | "createdAt" | "updatedAt">,
  ): Promise<Lead> {
    const row = await prisma.lead.create({
      data: { ...data, status: "new" },
      include: withNotes,
    });
    return toLead(row);
  },

  async addNote(
    leadId: string,
    note: string,
    statusChangeTo: LeadStatus | null,
  ): Promise<Lead | undefined> {
    try {
      const row = await prisma.lead.update({
        where: { id: leadId },
        data: {
          ...(statusChangeTo ? { status: statusChangeTo } : {}),
          notes: { create: { note, statusChangeTo } },
        },
        include: withNotes,
      });
      return toLead(row);
    } catch (e) {
      // P2025: lead đã bị xóa (kể cả giữa lúc admin khác đang thao tác)
      if ((e as { code?: string }).code === "P2025") return undefined;
      throw e;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.lead.delete({ where: { id } }); // cascade xóa notes
      return true;
    } catch {
      return false;
    }
  },
};
