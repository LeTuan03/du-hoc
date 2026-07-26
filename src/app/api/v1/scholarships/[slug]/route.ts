import { NextRequest } from "next/server";
import { scholarshipRepository } from "@/server/repositories/scholarshipRepository";
import { scholarshipSchema } from "@/server/validators/content.schema";
import {
  guard,
  invalid,
  notFound,
  ok,
  withErrorHandler,
} from "@/server/apiResponse";

type Params = { params: Promise<{ slug: string }> };

/** GET /api/v1/scholarships/:slug — public */
export const GET = withErrorHandler(async (_req: NextRequest, { params }: Params) => {
  const { slug } = await params;
  const scholarship = await scholarshipRepository.findBySlug(slug);
  return scholarship ? ok(scholarship) : notFound("Không tìm thấy học bổng");
});

/** PUT /api/v1/scholarships/:slug — admin */
export const PUT = withErrorHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await guard("content.manage");
  if ("response" in auth) return auth.response;

  const { slug } = await params;
  const existing = await scholarshipRepository.findBySlug(slug);
  if (!existing) return notFound("Không tìm thấy học bổng");

  const parsed = scholarshipSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);

  return ok(
    await scholarshipRepository.update(existing.id, parsed.data),
    undefined,
    "Đã cập nhật",
  );
});

/** DELETE /api/v1/scholarships/:slug — admin */
export const DELETE = withErrorHandler(
  async (_req: NextRequest, { params }: Params) => {
    const auth = await guard("content.manage");
    if ("response" in auth) return auth.response;

    const { slug } = await params;
    const existing = await scholarshipRepository.findBySlug(slug);
    if (!existing) return notFound("Không tìm thấy học bổng");

    await scholarshipRepository.delete(existing.id);
    return ok({ id: existing.id }, undefined, "Đã xóa");
  },
);
