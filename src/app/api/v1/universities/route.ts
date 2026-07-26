import { NextRequest } from "next/server";
import { universityRepository } from "@/server/repositories/universityRepository";
import { universitySchema } from "@/server/validators/content.schema";
import {
  created,
  guard,
  invalid,
  ok,
  paginate,
  withErrorHandler,
} from "@/server/apiResponse";

/**
 * GET /api/v1/universities?country=&major=&tuition_max=&search=&sort=&page=&limit=
 * Public, có phân trang (SRS mục 7.4)
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const sp = req.nextUrl.searchParams;
  const { page, limit, skip } = paginate(sp);

  const tuitionMax = Number(sp.get("tuition_max"));
  const all = await universityRepository.filter({
    country: sp.get("country") || undefined,
    major: sp.get("major") || undefined,
    tuitionMax: Number.isFinite(tuitionMax) && tuitionMax > 0 ? tuitionMax : undefined,
    search: sp.get("search") || undefined,
    sort: (sp.get("sort") as "ranking" | "tuition-asc" | "tuition-desc") || undefined,
  });

  return ok(all.slice(skip, skip + limit), { page, limit, total: all.length });
});

/** POST /api/v1/universities — admin */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = await guard("content.manage");
  if ("response" in auth) return auth.response;

  const parsed = universitySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);

  return created(await universityRepository.create(parsed.data));
});
