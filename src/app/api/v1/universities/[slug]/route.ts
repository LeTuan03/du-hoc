import { NextRequest } from "next/server";
import { universityRepository } from "@/server/repositories/universityRepository";
import { scholarshipRepository } from "@/server/repositories/scholarshipRepository";
import { universitySchema } from "@/server/validators/content.schema";
import {
  guard,
  invalid,
  notFound,
  ok,
  withErrorHandler,
} from "@/server/apiResponse";

type Params = { params: Promise<{ slug: string }> };

/** GET /api/v1/universities/:slug — chi tiết trường + ngành + học bổng (SRS mục 7.4) */
export const GET = withErrorHandler(async (_req: NextRequest, { params }: Params) => {
  const { slug } = await params;
  const university = await universityRepository.findBySlug(slug);
  if (!university) return notFound("Không tìm thấy trường");

  const scholarships = await scholarshipRepository.findByUniversity(slug);
  return ok({ ...university, scholarships });
});

/** PUT /api/v1/universities/:slug — admin */
export const PUT = withErrorHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await guard("content.manage");
  if ("response" in auth) return auth.response;

  const { slug } = await params;
  const existing = await universityRepository.findBySlug(slug);
  if (!existing) return notFound("Không tìm thấy trường");

  const parsed = universitySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);

  return ok(
    await universityRepository.update(existing.id, parsed.data),
    undefined,
    "Đã cập nhật",
  );
});

/** DELETE /api/v1/universities/:slug — admin */
export const DELETE = withErrorHandler(
  async (_req: NextRequest, { params }: Params) => {
    const auth = await guard("content.manage");
    if ("response" in auth) return auth.response;

    const { slug } = await params;
    const existing = await universityRepository.findBySlug(slug);
    if (!existing) return notFound("Không tìm thấy trường");

    await universityRepository.delete(existing.id);
    return ok({ id: existing.id }, undefined, "Đã xóa");
  },
);
