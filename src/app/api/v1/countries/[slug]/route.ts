import { NextRequest } from "next/server";
import { countryRepository } from "@/server/repositories/countryRepository";
import { universityRepository } from "@/server/repositories/universityRepository";
import { countrySchema } from "@/server/validators/content.schema";
import {
  fail,
  guard,
  invalid,
  notFound,
  ok,
  withErrorHandler,
} from "@/server/apiResponse";

type Params = { params: Promise<{ slug: string }> };

/** GET /api/v1/countries/:slug — chi tiết + trường liên quan (SRS mục 7.3) */
export const GET = withErrorHandler(async (_req: NextRequest, { params }: Params) => {
  const { slug } = await params;
  const country = await countryRepository.findBySlug(slug);
  if (!country) return notFound("Không tìm thấy quốc gia");

  const universities = await universityRepository.filter({ country: slug });
  return ok({ ...country, universities });
});

/** PUT /api/v1/countries/:slug — admin (định danh bằng id trong body hoặc slug) */
export const PUT = withErrorHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await guard("content.manage");
  if ("response" in auth) return auth.response;

  const { slug } = await params;
  const existing = await countryRepository.findBySlug(slug);
  if (!existing) return notFound("Không tìm thấy quốc gia");

  const parsed = countrySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);

  return ok(await countryRepository.update(existing.id, parsed.data), undefined, "Đã cập nhật");
});

/** DELETE /api/v1/countries/:slug — admin */
export const DELETE = withErrorHandler(
  async (_req: NextRequest, { params }: Params) => {
    const auth = await guard("content.manage");
    if ("response" in auth) return auth.response;

    const { slug } = await params;
    const existing = await countryRepository.findBySlug(slug);
    if (!existing) return notFound("Không tìm thấy quốc gia");

    // Còn trường tham chiếu → chặn xóa để không tạo dữ liệu mồ côi
    const universities = await universityRepository.filter({ country: slug });
    if (universities.length > 0) {
      return fail(
        `Quốc gia đang có ${universities.length} trường — hãy chuyển hoặc xóa các trường này trước.`,
        409,
      );
    }

    await countryRepository.delete(existing.id);
    return ok({ id: existing.id }, undefined, "Đã xóa");
  },
);
