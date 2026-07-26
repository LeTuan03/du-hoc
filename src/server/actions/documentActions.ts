"use server";

import { revalidatePath } from "next/cache";
import { documentRepository } from "../repositories/documentRepository";
import {
  documentReviewSchema,
  documentSchema,
} from "../validators/admissions.schema";
import { documentTypeName } from "../types";
import {
  firstIssue,
  mutationError,
  requireSession,
  str,
  type ActionResult,
} from "./util";

/** Checklist tài liệu hồ sơ — tư vấn viên phụ trách cũng thao tác được */

export async function createDocument(fd: FormData): Promise<ActionResult> {
  const guard = await requireSession();
  if (!guard.ok) return guard.result;

  const type = str(fd, "type");
  const parsed = documentSchema.safeParse({
    leadId: str(fd, "leadId"),
    type,
    // Bỏ trống tên → lấy tên chuẩn của loại tài liệu
    name: str(fd, "name").trim() || documentTypeName(type),
    fileUrl: str(fd, "fileUrl"),
    note: str(fd, "note"),
  });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  try {
    await documentRepository.create(parsed.data);
  } catch (e) {
    return mutationError(e);
  }
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
  return { ok: true };
}

export async function updateDocument(
  id: string,
  leadId: string,
  fd: FormData,
): Promise<ActionResult> {
  const guard = await requireSession();
  if (!guard.ok) return guard.result;

  const parsed = documentSchema.safeParse({
    leadId,
    type: str(fd, "type"),
    name: str(fd, "name"),
    fileUrl: str(fd, "fileUrl"),
    note: str(fd, "note"),
  });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  try {
    await documentRepository.update(id, parsed.data);
  } catch (e) {
    return mutationError(e);
  }
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

/** Duyệt / yêu cầu bổ sung tài liệu */
export async function reviewDocument(
  id: string,
  leadId: string,
  fd: FormData,
): Promise<ActionResult> {
  const guard = await requireSession();
  if (!guard.ok) return guard.result;

  const parsed = documentReviewSchema.safeParse({
    status: str(fd, "status"),
    note: str(fd, "note"),
  });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  if (parsed.data.status === "rejected" && !parsed.data.note) {
    return {
      ok: false,
      error: "Vui lòng ghi rõ cần bổ sung gì để ứng viên biết cách xử lý",
    };
  }

  try {
    await documentRepository.review(
      id,
      parsed.data.status,
      guard.session.userId,
      parsed.data.note,
    );
  } catch (e) {
    return mutationError(e);
  }
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

export async function deleteDocument(
  id: string,
  leadId: string,
): Promise<ActionResult> {
  const guard = await requireSession();
  if (!guard.ok) return guard.result;

  try {
    await documentRepository.delete(id);
  } catch (e) {
    return mutationError(e);
  }
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

/** Sinh checklist tài liệu bắt buộc cho hồ sơ (SRS: bước "Chuẩn bị hồ sơ") */
export async function generateChecklist(leadId: string): Promise<ActionResult> {
  const guard = await requireSession();
  if (!guard.ok) return guard.result;

  try {
    const created = await documentRepository.ensureRequiredChecklist(leadId);
    if (created === 0) {
      return {
        ok: false,
        error: "Hồ sơ đã có đủ các tài liệu bắt buộc trong checklist",
      };
    }
  } catch (e) {
    return mutationError(e);
  }
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}
