import { NextRequest } from "next/server";
import { programRepository } from "@/server/repositories/programRepository";
import { standaloneProgramSchema } from "@/server/validators/content.schema";
import {
  guard,
  invalid,
  notFound,
  ok,
  withErrorHandler,
} from "@/server/apiResponse";

type Params = { params: Promise<{ id: string }> };

/** GET /api/v1/programs/:id — public */
export const GET = withErrorHandler(async (_req: NextRequest, { params }: Params) => {
  const { id } = await params;
  const program = await programRepository.findById(id);
  return program ? ok(program) : notFound("Không tìm thấy ngành học");
});

/** PUT /api/v1/programs/:id — admin */
export const PUT = withErrorHandler(async (req: NextRequest, { params }: Params) => {
  const auth = await guard("content.manage");
  if ("response" in auth) return auth.response;

  const { id } = await params;
  if (!(await programRepository.findById(id))) {
    return notFound("Không tìm thấy ngành học");
  }

  const parsed = standaloneProgramSchema.safeParse(
    await req.json().catch(() => null),
  );
  if (!parsed.success) return invalid(parsed.error);

  return ok(
    await programRepository.update(id, parsed.data.universitySlug, parsed.data),
    undefined,
    "Đã cập nhật",
  );
});

/** DELETE /api/v1/programs/:id — admin */
export const DELETE = withErrorHandler(
  async (_req: NextRequest, { params }: Params) => {
    const auth = await guard("content.manage");
    if ("response" in auth) return auth.response;

    const { id } = await params;
    if (!(await programRepository.findById(id))) {
      return notFound("Không tìm thấy ngành học");
    }

    await programRepository.delete(id);
    return ok({ id }, undefined, "Đã xóa");
  },
);
