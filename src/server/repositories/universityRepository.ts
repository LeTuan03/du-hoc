import { cache } from "react";
import type { Prisma, University as UniversityRow } from "@prisma/client";
import { prisma } from "../db";
import type { Program, University } from "../types";

export type UniversityInput = Omit<University, "id">;

export interface UniversityFilter {
  country?: string;
  major?: string;
  tuitionMax?: number;
  search?: string;
  sort?: "featured" | "ranking" | "tuition-asc" | "tuition-desc";
}

/** Map Json columns (programs, faqs) về đúng shape của domain type */
function toUniversity(row: UniversityRow): University {
  return {
    ...row,
    programs: (row.programs ?? []) as unknown as Program[],
    faqs: (row.faqs ?? []) as unknown as University["faqs"],
  };
}

function toRowData(data: UniversityInput) {
  return {
    ...data,
    programs: data.programs as unknown as Prisma.InputJsonValue,
    faqs: data.faqs as unknown as Prisma.InputJsonValue,
  };
}

export const universityRepository = {
  findAll: cache(async (): Promise<University[]> => {
    const rows = await prisma.university.findMany({
      // name làm tiebreaker để thứ tự ổn định khi trùng ranking/null
      orderBy: [
        { isFeatured: "desc" },
        { ranking: { sort: "asc", nulls: "last" } },
        { name: "asc" },
      ],
    });
    return rows.map(toUniversity);
  }),

  findBySlug: cache(async (slug: string): Promise<University | null> => {
    const row = await prisma.university.findUnique({ where: { slug } });
    return row ? toUniversity(row) : null;
  }),

  async findById(id: string): Promise<University | null> {
    const row = await prisma.university.findUnique({ where: { id } });
    return row ? toUniversity(row) : null;
  },

  /** Giữ nguyên ngữ nghĩa filterUniversities cũ — 16 bản ghi, filter in-memory là đủ */
  async filter(filter: UniversityFilter): Promise<University[]> {
    let result = await this.findAll();

    if (filter.country) {
      result = result.filter((u) => u.countrySlug === filter.country);
    }
    if (filter.major) {
      const q = filter.major.toLowerCase();
      result = result.filter((u) =>
        u.majors.some((m) => m.toLowerCase().includes(q)),
      );
    }
    if (filter.tuitionMax !== undefined) {
      result = result.filter((u) => u.tuitionMin <= filter.tuitionMax!);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q),
      );
    }

    result = [...result];
    switch (filter.sort) {
      case "ranking":
        result.sort((a, b) => (a.ranking ?? 9999) - (b.ranking ?? 9999));
        break;
      case "tuition-asc":
        result.sort((a, b) => a.tuitionMin - b.tuitionMin);
        break;
      case "tuition-desc":
        result.sort((a, b) => b.tuitionMin - a.tuitionMin);
        break;
      default:
        result.sort(
          (a, b) =>
            Number(b.isFeatured) - Number(a.isFeatured) ||
            (a.ranking ?? 9999) - (b.ranking ?? 9999),
        );
    }
    return result;
  },

  /** Danh sách chuyên ngành duy nhất cho filter trang /truong */
  async getAllMajors(): Promise<string[]> {
    const all = await this.findAll();
    const set = new Set<string>();
    all.forEach((u) => u.majors.forEach((m) => set.add(m)));
    return [...set].sort((a, b) => a.localeCompare(b, "vi"));
  },

  async create(data: UniversityInput): Promise<University> {
    return toUniversity(await prisma.university.create({ data: toRowData(data) }));
  },

  /** Đổi slug sẽ cascade sang học bổng và lead tham chiếu bằng slug */
  async update(id: string, data: UniversityInput): Promise<University> {
    const existing = await prisma.university.findUnique({ where: { id } });
    if (!existing || existing.slug === data.slug) {
      return toUniversity(
        await prisma.university.update({ where: { id }, data: toRowData(data) }),
      );
    }
    const [updated] = await prisma.$transaction([
      prisma.university.update({ where: { id }, data: toRowData(data) }),
      prisma.scholarship.updateMany({
        where: { universitySlug: existing.slug },
        data: { universitySlug: data.slug },
      }),
      prisma.lead.updateMany({
        where: { desiredUniversity: existing.slug },
        data: { desiredUniversity: data.slug },
      }),
    ]);
    return toUniversity(updated);
  },

  delete(id: string): Promise<UniversityRow> {
    return prisma.university.delete({ where: { id } });
  },
};
