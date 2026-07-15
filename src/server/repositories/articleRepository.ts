import { cache } from "react";
import type { Article as ArticleRow } from "@prisma/client";
import { prisma } from "../db";
import type { Article, ArticleCategory } from "../types";

export type ArticleInput = Omit<Article, "id" | "updatedAt">;

function toArticle(row: ArticleRow): Article {
  return {
    ...row,
    category: row.category as ArticleCategory,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const articleRepository = {
  /** Sắp theo ngày đăng mới nhất, lọc theo danh mục nếu có */
  findAll: cache(async (category?: string): Promise<Article[]> => {
    const rows = await prisma.article.findMany({
      where: category ? { category } : undefined,
      orderBy: { publishedAt: "desc" },
    });
    return rows.map(toArticle);
  }),

  findBySlug: cache(async (slug: string): Promise<Article | null> => {
    const row = await prisma.article.findUnique({ where: { slug } });
    return row ? toArticle(row) : null;
  }),

  async findById(id: string): Promise<Article | null> {
    const row = await prisma.article.findUnique({ where: { id } });
    return row ? toArticle(row) : null;
  },

  async create(data: ArticleInput): Promise<Article> {
    return toArticle(await prisma.article.create({ data }));
  },

  async update(id: string, data: ArticleInput): Promise<Article> {
    return toArticle(await prisma.article.update({ where: { id }, data }));
  },

  delete(id: string): Promise<ArticleRow> {
    return prisma.article.delete({ where: { id } });
  },
};
