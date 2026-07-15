import { cache } from "react";
import { prisma } from "../db";
import type { Scholarship } from "../types";

export type ScholarshipInput = Omit<Scholarship, "id">;

export const scholarshipRepository = {
  findAll: cache(async (): Promise<Scholarship[]> => {
    return prisma.scholarship.findMany({ orderBy: { deadline: "asc" } });
  }),

  findActive: cache(async (): Promise<Scholarship[]> => {
    return prisma.scholarship.findMany({
      where: { isActive: true },
      orderBy: { deadline: "asc" },
    });
  }),

  findBySlug: cache(async (slug: string): Promise<Scholarship | null> => {
    return prisma.scholarship.findUnique({ where: { slug } });
  }),

  findById(id: string): Promise<Scholarship | null> {
    return prisma.scholarship.findUnique({ where: { id } });
  },

  create(data: ScholarshipInput): Promise<Scholarship> {
    return prisma.scholarship.create({ data });
  },

  update(id: string, data: ScholarshipInput): Promise<Scholarship> {
    return prisma.scholarship.update({ where: { id }, data });
  },

  delete(id: string): Promise<Scholarship> {
    return prisma.scholarship.delete({ where: { id } });
  },
};
