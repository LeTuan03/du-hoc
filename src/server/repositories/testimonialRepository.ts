import { cache } from "react";
import { prisma } from "../db";
import type { Testimonial } from "../types";

export type TestimonialInput = Omit<Testimonial, "id">;

export const testimonialRepository = {
  findAll: cache(async (): Promise<Testimonial[]> => {
    // Seed dùng createMany → createdAt trùng nhau; thêm id làm tiebreaker
    // để thứ tự ổn định giữa các lần query
    return prisma.testimonial.findMany({
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });
  }),

  findById(id: string): Promise<Testimonial | null> {
    return prisma.testimonial.findUnique({ where: { id } });
  },

  create(data: TestimonialInput): Promise<Testimonial> {
    return prisma.testimonial.create({ data });
  },

  update(id: string, data: TestimonialInput): Promise<Testimonial> {
    return prisma.testimonial.update({ where: { id }, data });
  },

  delete(id: string): Promise<Testimonial> {
    return prisma.testimonial.delete({ where: { id } });
  },
};
