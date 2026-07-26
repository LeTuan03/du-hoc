import { NextRequest } from "next/server";
import { articleRepository } from "@/server/repositories/articleRepository";
import { articleSchema } from "@/server/validators/content.schema";
import {
  created,
  guard,
  invalid,
  ok,
  paginate,
  withErrorHandler,
} from "@/server/apiResponse";

/** GET /api/v1/articles?category=&page=&limit= — public (SRS mục 7.7) */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const sp = req.nextUrl.searchParams;
  const { page, limit, skip } = paginate(sp);

  const all = await articleRepository.findAll(sp.get("category") || undefined);
  // Danh sách không cần body HTML — bỏ ra cho payload nhẹ
  const list = all
    .slice(skip, skip + limit)
    .map(({ content: _content, ...rest }) => rest);

  return ok(list, { page, limit, total: all.length });
});

/** POST /api/v1/articles — admin */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const auth = await guard("content.manage");
  if ("response" in auth) return auth.response;

  const parsed = articleSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return invalid(parsed.error);

  return created(await articleRepository.create(parsed.data));
});
