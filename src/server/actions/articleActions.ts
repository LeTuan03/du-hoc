"use server";

import { articleRepository } from "../repositories/articleRepository";
import { articleSchema } from "../validators/content.schema";
import { slugify } from "@/lib/slugify";
import { runDelete, runMutation, str, type ActionResult } from "./util";

function parseForm(fd: FormData) {
  const title = str(fd, "title");
  return {
    category: str(fd, "category"),
    title,
    slug: str(fd, "slug").trim() || slugify(title),
    excerpt: str(fd, "excerpt"),
    content: str(fd, "content"),
    author: str(fd, "author"),
    publishedAt: str(fd, "publishedAt"),
    readMinutes: str(fd, "readMinutes"),
    metaTitle: str(fd, "metaTitle"),
    metaDescription: str(fd, "metaDescription"),
    coverImage: str(fd, "coverImage"),
  };
}

export async function createArticle(fd: FormData): Promise<ActionResult> {
  return runMutation(articleSchema, parseForm(fd), (data) =>
    articleRepository.create(data),
  );
}

export async function updateArticle(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  return runMutation(articleSchema, parseForm(fd), (data) =>
    articleRepository.update(id, data),
  );
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  return runDelete(() => articleRepository.delete(id));
}
