import { cache } from "react";
import type { Program as ProgramRow } from "@prisma/client";
import { prisma } from "../db";
import { slugify } from "@/lib/slugify";
import type { Program, ProgramInput, ProgramLevel } from "../types";

/** Repository ngành học — SRS mục 7.5 (`GET /programs?level=&university=`) */

export interface ProgramFilter {
  university?: string;
  level?: ProgramLevel | string;
  country?: string;
  search?: string;
  tuitionMax?: number;
  durationMaxMonths?: number;
  activeOnly?: boolean;
}

function toProgram(row: ProgramRow): Program {
  return {
    ...row,
    level: row.level as ProgramLevel,
  };
}

/**
 * Slug duy nhất trong phạm vi một trường. Trùng tên → thêm hậu tố -2, -3...
 * `excludeId` để khi sửa không tự đụng chính bản ghi đang sửa.
 */
async function uniqueSlug(
  universitySlug: string,
  name: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(name) || "nganh-hoc";
  const taken = await prisma.program.findMany({
    where: {
      universitySlug,
      slug: { startsWith: base },
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { slug: true },
  });
  const set = new Set(taken.map((t) => t.slug));
  if (!set.has(base)) return base;
  for (let i = 2; ; i++) {
    const candidate = `${base}-${i}`;
    if (!set.has(candidate)) return candidate;
  }
}

export const programRepository = {
  findAll: cache(async (): Promise<Program[]> => {
    const rows = await prisma.program.findMany({
      orderBy: [{ universitySlug: "asc" }, { name: "asc" }],
    });
    return rows.map(toProgram);
  }),

  findByUniversity: cache(async (universitySlug: string): Promise<Program[]> => {
    const rows = await prisma.program.findMany({
      where: { universitySlug },
      orderBy: [{ level: "asc" }, { name: "asc" }],
    });
    return rows.map(toProgram);
  }),

  /** Gom ngành học theo trường — tránh N+1 khi render danh sách trường */
  async groupByUniversity(
    universitySlugs?: string[],
  ): Promise<Map<string, Program[]>> {
    const rows = await prisma.program.findMany({
      where: universitySlugs ? { universitySlug: { in: universitySlugs } } : undefined,
      orderBy: [{ level: "asc" }, { name: "asc" }],
    });
    const map = new Map<string, Program[]>();
    for (const row of rows) {
      const list = map.get(row.universitySlug) ?? [];
      list.push(toProgram(row));
      map.set(row.universitySlug, list);
    }
    return map;
  },

  async findById(id: string): Promise<Program | null> {
    const row = await prisma.program.findUnique({ where: { id } });
    return row ? toProgram(row) : null;
  },

  /**
   * Lọc phục vụ cả admin lẫn công cụ tra cứu ngành học của ứng viên.
   * `country` cần join sang universities nên truyền vào danh sách slug trường.
   */
  async filter(
    filter: ProgramFilter,
    universitySlugsInCountry?: string[],
  ): Promise<Program[]> {
    const rows = await prisma.program.findMany({
      where: {
        ...(filter.activeOnly ? { isActive: true } : {}),
        ...(filter.university ? { universitySlug: filter.university } : {}),
        ...(filter.level ? { level: filter.level } : {}),
        ...(universitySlugsInCountry
          ? { universitySlug: { in: universitySlugsInCountry } }
          : {}),
        ...(filter.search
          ? { name: { contains: filter.search, mode: "insensitive" as const } }
          : {}),
        ...(filter.tuitionMax !== undefined
          ? { tuitionPerYear: { lte: filter.tuitionMax } }
          : {}),
        ...(filter.durationMaxMonths !== undefined
          ? { durationMonths: { lte: filter.durationMaxMonths } }
          : {}),
      },
      orderBy: [{ tuitionPerYear: "asc" }, { name: "asc" }],
    });
    return rows.map(toProgram);
  },

  async create(universitySlug: string, data: ProgramInput): Promise<Program> {
    const row = await prisma.program.create({
      data: {
        universitySlug,
        slug: await uniqueSlug(universitySlug, data.name),
        name: data.name,
        level: data.level,
        durationMonths: data.durationMonths,
        tuitionPerYear: data.tuitionPerYear,
        description: data.description ?? "",
        intakeMonths: data.intakeMonths ?? [],
      },
    });
    return toProgram(row);
  },

  async update(
    id: string,
    universitySlug: string,
    data: ProgramInput & { isActive?: boolean },
  ): Promise<Program> {
    const existing = await prisma.program.findUnique({ where: { id } });
    // Đổi tên hoặc đổi trường → cấp lại slug cho khỏi đụng bản ghi khác
    const slug =
      existing && existing.name === data.name && existing.universitySlug === universitySlug
        ? existing.slug
        : await uniqueSlug(universitySlug, data.name, id);

    const row = await prisma.program.update({
      where: { id },
      data: {
        universitySlug,
        slug,
        name: data.name,
        level: data.level,
        durationMonths: data.durationMonths,
        tuitionPerYear: data.tuitionPerYear,
        description: data.description ?? "",
        intakeMonths: data.intakeMonths ?? [],
        ...(data.isActive === undefined ? {} : { isActive: data.isActive }),
      },
    });
    return toProgram(row);
  },

  delete(id: string): Promise<ProgramRow> {
    return prisma.program.delete({ where: { id } });
  },

  /**
   * Đồng bộ toàn bộ ngành học của một trường theo danh sách nhập từ form
   * UniversityForm: upsert theo slug và xóa ngành không còn trong danh sách.
   * Upsert (thay vì xóa hết rồi tạo lại) giữ nguyên id để không mất tham chiếu.
   */
  async syncForUniversity(
    universitySlug: string,
    programs: ProgramInput[],
  ): Promise<void> {
    const existing = await prisma.program.findMany({
      where: { universitySlug },
      select: { id: true, slug: true, name: true },
    });
    const bySlug = new Map(existing.map((p) => [p.slug, p]));
    const keptIds = new Set<string>();

    for (const input of programs) {
      const base = slugify(input.name) || "nganh-hoc";
      // Khớp theo slug gốc; nếu đã dùng cho ngành khác thì tạo bản ghi mới
      const match = bySlug.get(base);
      if (match && match.name === input.name) {
        keptIds.add(match.id);
        await prisma.program.update({
          where: { id: match.id },
          data: {
            level: input.level,
            durationMonths: input.durationMonths,
            tuitionPerYear: input.tuitionPerYear,
            description: input.description ?? "",
            intakeMonths: input.intakeMonths ?? [],
          },
        });
      } else {
        const created = await this.create(universitySlug, input);
        keptIds.add(created.id);
      }
    }

    const toDelete = existing.filter((p) => !keptIds.has(p.id)).map((p) => p.id);
    if (toDelete.length > 0) {
      await prisma.program.deleteMany({ where: { id: { in: toDelete } } });
    }
  },

  /** Đổi slug trường → kéo theo ngành học của trường đó */
  async reassignUniversitySlug(from: string, to: string): Promise<void> {
    await prisma.program.updateMany({
      where: { universitySlug: from },
      data: { universitySlug: to },
    });
  },
};
