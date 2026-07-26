"use server";

import { revalidatePath } from "next/cache";
import { appointmentRepository } from "../repositories/appointmentRepository";
import { leadRepository } from "../repositories/leadRepository";
import {
  appointmentSchema,
  appointmentStatusSchema,
} from "../validators/admissions.schema";
import { APPOINTMENT_MODE_LABELS } from "../types";
import { formatDateTime } from "@/lib/format";
import {
  firstIssue,
  mutationError,
  requirePermission,
  requireSession,
  str,
  type ActionResult,
} from "./util";

/** Lịch hẹn tư vấn — mọi vai trò đăng nhập đều đặt/cập nhật được lịch của mình */

function parseForm(fd: FormData) {
  return {
    leadId: str(fd, "leadId"),
    consultantId: str(fd, "consultantId"),
    scheduledAt: str(fd, "scheduledAt"),
    durationMinutes: str(fd, "durationMinutes"),
    mode: str(fd, "mode"),
    location: str(fd, "location"),
    topic: str(fd, "topic"),
  };
}

function revalidateAppointments(leadId?: string) {
  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
  if (leadId) revalidatePath(`/admin/leads/${leadId}`);
}

export async function createAppointment(fd: FormData): Promise<ActionResult> {
  // Tư vấn viên cũng cần đặt lịch cho khách của mình → chỉ yêu cầu đăng nhập
  const guard = await requireSession();
  if (!guard.ok) return guard.result;

  const parsed = appointmentSchema.safeParse(parseForm(fd));
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  const conflict = parsed.data.consultantId
    ? await appointmentRepository.findConflict(
        parsed.data.consultantId,
        parsed.data.scheduledAt,
        parsed.data.durationMinutes,
      )
    : null;
  if (conflict) {
    return {
      ok: false,
      error: `Tư vấn viên đã có lịch với ${conflict.leadName} lúc ${formatDateTime(conflict.scheduledAt)}`,
    };
  }

  try {
    const appointment = await appointmentRepository.create(parsed.data);
    // Ghi vào timeline chăm sóc để tư vấn viên thấy đủ ngữ cảnh ở 1 chỗ
    await leadRepository.addNote(
      parsed.data.leadId,
      `Đã đặt lịch hẹn ${APPOINTMENT_MODE_LABELS[parsed.data.mode].toLowerCase()} lúc ${formatDateTime(appointment.scheduledAt)}` +
        (parsed.data.topic ? ` — nội dung: ${parsed.data.topic}` : ""),
      null,
      null,
    );
  } catch (e) {
    return mutationError(e);
  }
  revalidateAppointments(parsed.data.leadId);
  return { ok: true };
}

export async function updateAppointment(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const guard = await requireSession();
  if (!guard.ok) return guard.result;

  const parsed = appointmentSchema.safeParse(parseForm(fd));
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  const conflict = parsed.data.consultantId
    ? await appointmentRepository.findConflict(
        parsed.data.consultantId,
        parsed.data.scheduledAt,
        parsed.data.durationMinutes,
        id,
      )
    : null;
  if (conflict) {
    return {
      ok: false,
      error: `Tư vấn viên đã có lịch với ${conflict.leadName} lúc ${formatDateTime(conflict.scheduledAt)}`,
    };
  }

  try {
    await appointmentRepository.update(id, parsed.data);
  } catch (e) {
    return mutationError(e);
  }
  revalidateAppointments(parsed.data.leadId);
  return { ok: true };
}

export async function changeAppointmentStatus(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const guard = await requireSession();
  if (!guard.ok) return guard.result;

  const parsed = appointmentStatusSchema.safeParse({
    status: str(fd, "status"),
    outcome: str(fd, "outcome"),
  });
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  const appointment = await appointmentRepository.findById(id);
  if (!appointment) return { ok: false, error: "Không tìm thấy lịch hẹn" };

  try {
    await appointmentRepository.changeStatus(
      id,
      parsed.data.status,
      parsed.data.outcome || null,
    );
    if (parsed.data.outcome) {
      await leadRepository.addNote(
        appointment.leadId,
        `Kết quả buổi tư vấn ${formatDateTime(appointment.scheduledAt)}: ${parsed.data.outcome}`,
        null,
        null,
      );
    }
  } catch (e) {
    return mutationError(e);
  }
  revalidateAppointments(appointment.leadId);
  return { ok: true };
}

export async function deleteAppointment(id: string): Promise<ActionResult> {
  const guard = await requirePermission("leads.assign");
  if (!guard.ok) return guard.result;

  const appointment = await appointmentRepository.findById(id);
  try {
    await appointmentRepository.delete(id);
  } catch (e) {
    return mutationError(e);
  }
  revalidateAppointments(appointment?.leadId);
  return { ok: true };
}
