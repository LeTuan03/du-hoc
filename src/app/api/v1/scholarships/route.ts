import { NextRequest } from "next/server";
import { scholarshipRepository } from "@/server/repositories/scholarshipRepository";
import { universityRepository } from "@/server/repositories/universityRepository";
import { scholarshipSchema } from "@/server/validators/content.schema";
import {
  created,
  guard,
  invalid,
  ok,
  paginate,
  withErrorHandler,
} from "@/server/apiResponse";

/** GET /api/v1/scholarships?country=&university=&active=true (SRS mục 7.6) */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const sp = req.nextUrl.searchParams;
  const { page, limit, skip } = paginate(sp);
  const country = sp.get("country");

  const universitySlugsInCountry = country
    ? (await universityRepository.listOptions())
        .filter((u) => u.countrySlug === country)
        .map((u) => u.slug)
    : undefined;

  const all = await scholarshipRepository.filter({
    country: country || undefined,
    university: sp.get("university") || undefined,
    activeOnly: sp.get("active") !== "false",
    universitySlugsInCountry,
  });

  return ok(all.slice(skip, skip + limit), { page, limit, total: all.length });
});

/** POST /api/v1/scholarships — admin */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = await guard("content.manage");
  if ("response" in auth) return auth.response;

  const parsed = scholarshipSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);

  return created(await scholarshipRepository.create(parsed.data));
});
