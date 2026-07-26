import { cache } from "react";
import type { University as UniversityRow } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { programRepository } from "./programRepository";
import type { Program, ProgramInput, University } from "../types";

/** Ngành học nằm ở bảng `programs`, ghép vào University khi đọc */
export type UniversityInput = Omit<University, "id" | "programs"> & {
  programs: ProgramInput[];
};

export interface UniversityFilter {
  country?: string;
  major?: string;
  tuitionMax?: number;
  search?: string;
  sort?: "featured" | "ranking" | "tuition-asc" | "tuition-desc";
}

function toUniversity(row: UniversityRow, programs: Program[]): University {
  return {
    ...row,
    programs,
    faqs: (row.faqs ?? []) as unknown as University["faqs"],
  };
}

function toRowData(data: Omit<UniversityInput, "programs">) {
  return {
    ...data,
    faqs: data.faqs as unknown as Prisma.InputJsonValue,
  };
}

/** Ghép ngành học cho nhiều trường bằng 1 truy vấn (tránh N+1) */
async function attachPrograms(rows: UniversityRow[]): Promise<University[]> {
  const byUniversity = await programRepository.groupByUniversity(
    rows.map((r) => r.slug),
  );
  return rows.map((row) => toUniversity(row, byUniversity.get(row.slug) ?? []));
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
    return attachPrograms(rows);
  }),

  findBySlug: cache(async (slug: string): Promise<University | null> => {
    const row = await prisma.university.findUnique({ where: { slug } });
    if (!row) return null;
    return toUniversity(row, await programRepository.findByUniversity(slug));
  }),

  async findById(id: string): Promise<University | null> {
    const row = await prisma.university.findUnique({ where: { id } });
    if (!row) return null;
    return toUniversity(
      row,
      await programRepository.findByUniversity(row.slug),
    );
  },

  /** Danh sách rút gọn cho dropdown (không cần kéo theo ngành học) */
  listOptions: cache(
    async (): Promise<{ name: string; slug: string; countrySlug: string }[]> => {
      return prisma.university.findMany({
        select: { name: true, slug: true, countrySlug: true },
        orderBy: { name: "asc" },
      });
    },
  ),

  /** Giữ nguyên ngữ nghĩa filterUniversities cũ — quy mô nhỏ, filter in-memory là đủ */
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
    const rows = await prisma.university.findMany({ select: { majors: true } });
    const set = new Set<string>();
    rows.forEach((u) => u.majors.forEach((m) => set.add(m)));
    return [...set].sort((a, b) => a.localeCompare(b, "vi"));
  },

  async create(data: UniversityInput): Promise<University> {
    const { programs, ...rest } = data;
    const row = await prisma.university.create({ data: toRowData(rest) });
    await programRepository.syncForUniversity(row.slug, programs);
    return toUniversity(
      row,
      await programRepository.findByUniversity(row.slug),
    );
  },

  /** Đổi slug sẽ cascade sang học bổng, ngành học và lead tham chiếu bằng slug */
  async update(id: string, data: UniversityInput): Promise<University> {
    const { programs, ...rest } = data;
    const existing = await prisma.university.findUnique({ where: { id } });

    let row: UniversityRow;
    if (!existing || existing.slug === rest.slug) {
      row = await prisma.university.update({
        where: { id },
        data: toRowData(rest),
      });
    } else {
      const [updated] = await prisma.$transaction([
        prisma.university.update({ where: { id }, data: toRowData(rest) }),
        prisma.scholarship.updateMany({
          where: { universitySlug: existing.slug },
          data: { universitySlug: rest.slug },
        }),
        prisma.lead.updateMany({
          where: { desiredUniversity: existing.slug },
          data: { desiredUniversity: rest.slug },
        }),
        prisma.program.updateMany({
          where: { universitySlug: existing.slug },
          data: { universitySlug: rest.slug },
        }),
      ]);
      row = updated;
    }

    await programRepository.syncForUniversity(row.slug, programs);
    return toUniversity(
      row,
      await programRepository.findByUniversity(row.slug),
    );
  },

  async delete(id: string): Promise<UniversityRow> {
    const row = await prisma.university.delete({ where: { id } });
    // Ngành học tham chiếu bằng slug nên không có FK cascade — dọn thủ công
    await prisma.program.deleteMany({ where: { universitySlug: row.slug } });
    return row;
  },
};
