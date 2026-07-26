import { NextRequest } from "next/server";
import { articleRepository } from "@/server/repositories/articleRepository";
import { articleSchema } from "@/server/validators/content.schema";
import {
  guard,
  invalid,
  notFound,
  ok,
  withErrorHandler,
} from "@/server/apiResponse";

type Params = { params: Promise<{ slug: string }> };

/** GET /api/v1/articles/:slug — public */
export const GET = withErrorHandler(async (_req: NextRequest, { params }: Params) => {
  const { slug } = await params;
  const article = await articleRepository.findBySlug(slug);
  return article ? ok(article) : notFound("Không tìm thấy bài viết");
});

/** PUT /api/v1/articles/:slug — admin */
export const PUT = withErrorHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await guard("content.manage");
  if ("response" in auth) return auth.response;

  const { slug } = await params;
  const existing = await articleRepository.findBySlug(slug);
  if (!existing) return notFound("Không tìm thấy bài viết");

  const parsed = articleSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);

  return ok(
    await articleRepository.update(existing.id, parsed.data),
    undefined,
    "Đã cập nhật",
  );
});

/** DELETE /api/v1/articles/:slug — admin */
export const DELETE = withErrorHandler(
  async (_req: NextRequest, { params }: Params) => {
    const auth = await guard("content.manage");
    if ("response" in auth) return auth.response;

    const { slug } = await params;
    const existing = await articleRepository.findBySlug(slug);
    if (!existing) return notFound("Không tìm thấy bài viết");

    await articleRepository.delete(existing.id);
    return ok({ id: existing.id }, undefined, "Đã xóa");
  },
);
