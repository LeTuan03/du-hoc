"use server";

import { revalidatePath } from "next/cache";
import { leadRepository } from "../repositories/leadRepository";
import { userRepository } from "../repositories/userRepository";
import { assignLeadsSchema } from "../validators/admissions.schema";
import {
  firstIssue,
  mutationError,
  requirePermission,
  type ActionResult,
} from "./util";

function revalidateLead(id?: string) {
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  if (id) revalidatePath(`/admin/leads/${id}`);
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const guard = await requirePermission("leads.delete");
  if (!guard.ok) return guard.result;

  const deleted = await leadRepository.delete(id);
  if (!deleted) {
    return { ok: false, error: "Không tìm thấy lead (có thể đã bị xóa)" };
  }
  revalidateLead();
  return { ok: true };
}

export async function deleteLeads(ids: string[]): Promise<ActionResult> {
  const guard = await requirePermission("leads.delete");
  if (!guard.ok) return guard.result;
  if (ids.length === 0) return { ok: false, error: "Chưa chọn hồ sơ nào" };

  try {
    await leadRepository.deleteMany(ids);
  } catch (e) {
    return mutationError(e);
  }
  revalidateLead();
  return { ok: true };
}

/** Giao hồ sơ cho tư vấn viên (một hoặc nhiều) */
export async function assignLeads(
  leadIds: string[],
  assignedToId: string,
): Promise<ActionResult> {
  const guard = await requirePermission("leads.assign");
  if (!guard.ok) return guard.result;

  const parsed = assignLeadsSchema.safeParse({ leadIds, assignedToId });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  const consultant = parsed.data.assignedToId
    ? await userRepository.findById(parsed.data.assignedToId)
    : null;
  if (parsed.data.assignedToId && !consultant) {
    return { ok: false, error: "Không tìm thấy tư vấn viên" };
  }
  if (consultant && consultant.status !== "active") {
    return {
      ok: false,
      error: `${consultant.fullName} đang ở trạng thái ngưng hoạt động`,
    };
  }

  try {
    await leadRepository.assign(parsed.data.leadIds, parsed.data.assignedToId);
    // Ghi timeline để lịch sử bàn giao minh bạch
    const message = consultant
      ? `Giao hồ sơ cho tư vấn viên ${consultant.fullName} (bởi ${guard.session.fullName})`
      : `Bỏ giao phụ trách (bởi ${guard.session.fullName})`;
    for (const id of parsed.data.leadIds) {
      await leadRepository.addNote(id, message, null, guard.session.userId);
    }
  } catch (e) {
    return mutationError(e);
  }
  revalidateLead(parsed.data.leadIds.length === 1 ? parsed.data.leadIds[0] : undefined);
  return { ok: true };
}

