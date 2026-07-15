import { cache } from "react";
import { prisma } from "../db";
import type { FaqRecord } from "../types";

export type FaqInput = Omit<FaqRecord, "id">;

export const faqRepository = {
  findAll: cache(async (): Promise<FaqRecord[]> => {
    return prisma.faq.findMany({ orderBy: { displayOrder: "asc" } });
  }),

  findById(id: string): Promise<FaqRecord | null> {
    return prisma.faq.findUnique({ where: { id } });
  },

  create(data: FaqInput): Promise<FaqRecord> {
    return prisma.faq.create({ data });
  },

  update(id: string, data: FaqInput): Promise<FaqRecord> {
    return prisma.faq.update({ where: { id }, data });
  },

  delete(id: string): Promise<FaqRecord> {
    return prisma.faq.delete({ where: { id } });
  },
};
