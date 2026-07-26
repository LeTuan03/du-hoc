import { ROLE_PERMISSIONS, can, type Permission } from "@/server/types";
import { guard, ok, withErrorHandler } from "@/server/apiResponse";

/** GET /api/v1/auth/me — thông tin user hiện tại + danh sách quyền (SRS mục 7.2) */
export const GET = withErrorHandler(async () => {
  const auth = await guard();
  if ("response" in auth) return auth.response;

  const { session } = auth;
  const permissions = (Object.keys(ROLE_PERMISSIONS) as Permission[]).filter((p) =>
    can(session.role, p),
  );

  return ok({
    id: session.userId,
    fullName: session.fullName,
    email: session.email,
    role: session.role,
    permissions,
  });
});
