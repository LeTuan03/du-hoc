import { NextRequest } from "next/server";
import { countryRepository } from "@/server/repositories/countryRepository";
import { countrySchema } from "@/server/validators/content.schema";
import { created, guard, invalid, ok, withErrorHandler } from "@/server/apiResponse";

/** GET /api/v1/countries — public (SRS mục 7.3) */
export const GET = withErrorHandler(async () => {
  const countries = await countryRepository.findAll();
  return ok(countries, { total: countries.length });
});

/** POST /api/v1/countries — admin */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = await guard("content.manage");
  if ("response" in auth) return auth.response;

  const parsed = countrySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);

  return created(await countryRepository.create(parsed.data));
});
