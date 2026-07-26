"use server";

import { revalidatePath } from "next/cache";
import { hashPassword } from "../auth";
import { userRepository } from "../repositories/userRepository";
import {
  userCreateSchema,
  userUpdateSchema,
} from "../validators/admissions.schema";
import {
  firstIssue,
  mutationError,
  requirePermission,
  str,
  type ActionResult,
} from "./util";

/** Quản lý tài khoản tư vấn viên/admin — chỉ Super Admin (SRS mục 12.1) */

function parseForm(fd: FormData) {
  return {
    fullName: str(fd, "fullName"),
    email: str(fd, "email"),
    phone: str(fd, "phone"),
    role: str(fd, "role"),
    status: str(fd, "status"),
    password: str(fd, "password"),
  };
}

function revalidateUsers() {
  revalidatePath("/admin/users");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/appointments");
}

export async function createUser(fd: FormData): Promise<ActionResult> {
  const guard = await requirePermission("users.manage");
  if (!guard.ok) return guard.result;

  const parsed = userCreateSchema.safeParse(parseForm(fd));
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  try {
    await userRepository.create({
      ...parsed.data,
      passwordHash: await hashPassword(parsed.data.password),
    });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      return { ok: false, error: "Email này đã được dùng cho tài khoản khác" };
    }
    return mutationError(e);
  }
  revalidateUsers();
  return { ok: true };
}

export async function updateUser(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const guard = await requirePermission("users.manage");
  if (!guard.ok) return guard.result;

  const parsed = userUpdateSchema.safeParse(parseForm(fd));
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  const target = await userRepository.findById(id);
  if (!target) return { ok: false, error: "Không tìm thấy tài khoản" };

  // Không để hệ thống mất Super Admin hoạt động cuối cùng
  const losesSuperAdmin =
    target.role === "super_admin" &&
    target.status === "active" &&
    (parsed.data.role !== "super_admin" || parsed.data.status !== "active");
  if (losesSuperAdmin && (await userRepository.countActiveSuperAdmins()) <= 1) {
    return {
      ok: false,
      error:
        "Đây là Super Admin đang hoạt động cuối cùng — hãy cấp quyền cho tài khoản khác trước khi đổi.",
    };
  }

  try {
    await userRepository.update(id, {
      ...parsed.data,
      passwordHash: parsed.data.password
        ? await hashPassword(parsed.data.password)
        : undefined,
    });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") {
      return { ok: false, error: "Email này đã được dùng cho tài khoản khác" };
    }
    return mutationError(e);
  }
  revalidateUsers();
  return { ok: true };
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const guard = await requirePermission("users.manage");
  if (!guard.ok) return guard.result;

  if (guard.session.userId === id) {
    return { ok: false, error: "Không thể xóa tài khoản bạn đang đăng nhập" };
  }

  const target = await userRepository.findById(id);
  if (!target) return { ok: false, error: "Không tìm thấy tài khoản" };

  if (
    target.role === "super_admin" &&
    (await userRepository.countActiveSuperAdmins()) <= 1
  ) {
    return { ok: false, error: "Không thể xóa Super Admin cuối cùng" };
  }

  const assigned = await userRepository.countAssignedLeads(id);
  if (assigned > 0) {
    return {
      ok: false,
      error: `Tài khoản đang phụ trách ${assigned} hồ sơ — hãy chuyển giao trước khi xóa (hoặc chuyển sang trạng thái "Ngưng hoạt động").`,
    };
  }

  try {
    await userRepository.delete(id);
  } catch (e) {
    return mutationError(e);
  }
  revalidateUsers();
  return { ok: true };
}
