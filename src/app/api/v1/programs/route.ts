import { NextRequest } from "next/server";
import { programRepository } from "@/server/repositories/programRepository";
import { universityRepository } from "@/server/repositories/universityRepository";
import { standaloneProgramSchema } from "@/server/validators/content.schema";
import {
  created,
  guard,
  invalid,
  ok,
  paginate,
  withErrorHandler,
} from "@/server/apiResponse";

/**
 * GET /api/v1/programs?level=&university=&country=&tuition_max=&duration_max=&search=
 * Public — nguồn dữ liệu cho công cụ tra cứu ngành học (SRS mục 7.5)
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const sp = req.nextUrl.searchParams;
  const { page, limit, skip } = paginate(sp);
  const country = sp.get("country");

  // Ngành tham chiếu trường qua slug → lọc theo quốc gia cần danh sách slug trường
  const universitySlugs = country
    ? (await universityRepository.listOptions())
        .filter((u) => u.countrySlug === country)
        .map((u) => u.slug)
    : undefined;

  const tuitionMax = Number(sp.get("tuition_max"));
  const durationMax = Number(sp.get("duration_max"));

  const all = await programRepository.filter(
    {
      university: sp.get("university") || undefined,
      level: sp.get("level") || undefined,
      search: sp.get("search") || undefined,
      tuitionMax:
        Number.isFinite(tuitionMax) && tuitionMax > 0 ? tuitionMax : undefined,
      durationMaxMonths:
        Number.isFinite(durationMax) && durationMax > 0 ? durationMax : undefined,
      activeOnly: sp.get("active") !== "false",
    },
    universitySlugs,
  );

  return ok(all.slice(skip, skip + limit), { page, limit, total: all.length });
});

/** POST /api/v1/programs — admin */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = await guard("content.manage");
  if ("response" in auth) return auth.response;

  const parsed = standaloneProgramSchema.safeParse(
    await req.json().catch(() => null),
  );
  if (!parsed.success) return invalid(parsed.error);

  return created(
    await programRepository.create(parsed.data.universitySlug, parsed.data),
  );
});
