"use server";

import { revalidatePath } from "next/cache";
import { leadRepository } from "../repositories/leadRepository";
import { AUTH_ERROR, requireAdmin, type ActionResult } from "./util";

export async function deleteLead(id: string): Promise<ActionResult> {
  if (!(await requireAdmin())) return AUTH_ERROR;
  const deleted = await leadRepository.delete(id);
  if (!deleted) {
    return { ok: false, error: "Không tìm thấy lead (có thể đã bị xóa)" };
  }
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}
