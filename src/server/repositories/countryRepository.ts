import { cache } from "react";
import { prisma } from "../db";
import type { Country } from "../types";

export type CountryInput = Omit<Country, "id">;

export const countryRepository = {
  /** cache() — dedupe query trong cùng một request render */
  findAll: cache(async (): Promise<Country[]> => {
    return prisma.country.findMany({ orderBy: { displayOrder: "asc" } });
  }),

  findBySlug: cache(async (slug: string): Promise<Country | null> => {
    return prisma.country.findUnique({ where: { slug } });
  }),

  findById(id: string): Promise<Country | null> {
    return prisma.country.findUnique({ where: { id } });
  },

  create(data: CountryInput): Promise<Country> {
    return prisma.country.create({ data });
  },

  /** Đổi slug sẽ cascade sang mọi bảng tham chiếu bằng slug (không có FK) */
  async update(id: string, data: CountryInput): Promise<Country> {
    const existing = await prisma.country.findUnique({ where: { id } });
    if (!existing || existing.slug === data.slug) {
      return prisma.country.update({ where: { id }, data });
    }
    const [updated] = await prisma.$transaction([
      prisma.country.update({ where: { id }, data }),
      prisma.university.updateMany({
        where: { countrySlug: existing.slug },
        data: { countrySlug: data.slug },
      }),
      prisma.scholarship.updateMany({
        where: { countrySlug: existing.slug },
        data: { countrySlug: data.slug },
      }),
      prisma.testimonial.updateMany({
        where: { countrySlug: existing.slug },
        data: { countrySlug: data.slug },
      }),
      prisma.lead.updateMany({
        where: { desiredCountry: existing.slug },
        data: { desiredCountry: data.slug },
      }),
    ]);
    return updated;
  },

  delete(id: string): Promise<Country> {
    return prisma.country.delete({ where: { id } });
  },
};
