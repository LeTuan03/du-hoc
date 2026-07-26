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

  /** Học bổng của một trường — dùng ở trang chi tiết trường và API */
  findByUniversity: cache(async (universitySlug: string): Promise<Scholarship[]> => {
    return prisma.scholarship.findMany({
      where: { universitySlug, isActive: true },
      orderBy: { deadline: "asc" },
    });
  }),

  /**
   * Lọc phục vụ công cụ tra cứu học bổng của ứng viên và API public.
   * `countrySlug` khớp cả học bổng gắn trực tiếp với quốc gia lẫn học bổng
   * của các trường thuộc quốc gia đó.
   */
  async filter(filter: {
    country?: string;
    university?: string;
    activeOnly?: boolean;
    universitySlugsInCountry?: string[];
  }): Promise<Scholarship[]> {
    return prisma.scholarship.findMany({
      where: {
        ...(filter.activeOnly ? { isActive: true } : {}),
        ...(filter.university ? { universitySlug: filter.university } : {}),
        ...(filter.country
          ? {
              OR: [
                { countrySlug: filter.country },
                ...(filter.universitySlugsInCountry?.length
                  ? [{ universitySlug: { in: filter.universitySlugsInCountry } }]
                  : []),
              ],
            }
          : {}),
      },
      orderBy: { deadline: "asc" },
    });
  },

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
