import type { Appointment as AppointmentRow, Lead, User } from "@prisma/client";
import { prisma } from "../db";
import type {
  Appointment,
  AppointmentMode,
  AppointmentStatus,
} from "../types";

/** Repository lịch hẹn tư vấn */

export interface AppointmentInput {
  leadId: string;
  consultantId?: string | null;
  scheduledAt: Date;
  durationMinutes: number;
  mode: AppointmentMode;
  location?: string | null;
  topic: string;
}

export interface AppointmentFilter {
  status?: AppointmentStatus;
  consultantId?: string;
  leadId?: string;
  from?: Date;
  to?: Date;
}

type Row = AppointmentRow & {
  lead: Pick<Lead, "fullName" | "phone">;
  consultant: Pick<User, "fullName"> | null;
};

const include = {
  lead: { select: { fullName: true, phone: true } },
  consultant: { select: { fullName: true } },
};

function toAppointment(row: Row): Appointment {
  return {
    id: row.id,
    leadId: row.leadId,
    leadName: row.lead.fullName,
    leadPhone: row.lead.phone,
    consultantId: row.consultantId,
    consultantName: row.consultant?.fullName ?? null,
    scheduledAt: row.scheduledAt.toISOString(),
    durationMinutes: row.durationMinutes,
    mode: row.mode as AppointmentMode,
    location: row.location,
    topic: row.topic,
    status: row.status as AppointmentStatus,
    outcome: row.outcome,
    createdAt: row.createdAt.toISOString(),
  };
}

export const appointmentRepository = {
  async filter(filter: AppointmentFilter): Promise<Appointment[]> {
    const rows = await prisma.appointment.findMany({
      where: {
        ...(filter.status ? { status: filter.status } : {}),
        ...(filter.consultantId ? { consultantId: filter.consultantId } : {}),
        ...(filter.leadId ? { leadId: filter.leadId } : {}),
        ...(filter.from || filter.to
          ? {
              scheduledAt: {
                ...(filter.from ? { gte: filter.from } : {}),
                ...(filter.to ? { lte: filter.to } : {}),
              },
            }
          : {}),
      },
      include,
      orderBy: { scheduledAt: "asc" },
    });
    return rows.map(toAppointment);
  },

  async findByLead(leadId: string): Promise<Appointment[]> {
    const rows = await prisma.appointment.findMany({
      where: { leadId },
      include,
      orderBy: { scheduledAt: "desc" },
    });
    return rows.map(toAppointment);
  },

  async findById(id: string): Promise<Appointment | null> {
    const row = await prisma.appointment.findUnique({ where: { id }, include });
    return row ? toAppointment(row) : null;
  },

  async create(data: AppointmentInput): Promise<Appointment> {
    const row = await prisma.appointment.create({
      data: {
        leadId: data.leadId,
        consultantId: data.consultantId || null,
        scheduledAt: data.scheduledAt,
        durationMinutes: data.durationMinutes,
        mode: data.mode,
        location: data.location || null,
        topic: data.topic,
      },
      include,
    });
    return toAppointment(row);
  },

  async update(id: string, data: AppointmentInput): Promise<Appointment> {
    const row = await prisma.appointment.update({
      where: { id },
      data: {
        consultantId: data.consultantId || null,
        scheduledAt: data.scheduledAt,
        durationMinutes: data.durationMinutes,
        mode: data.mode,
        location: data.location || null,
        topic: data.topic,
      },
      include,
    });
    return toAppointment(row);
  },

  async changeStatus(
    id: string,
    status: AppointmentStatus,
    outcome: string | null,
  ): Promise<Appointment> {
    const row = await prisma.appointment.update({
      where: { id },
      data: { status, ...(outcome === null ? {} : { outcome }) },
      include,
    });
    return toAppointment(row);
  },

  delete(id: string): Promise<AppointmentRow> {
    return prisma.appointment.delete({ where: { id } });
  },

  /**
   * Lịch hẹn của tư vấn viên bị chồng khung giờ. Hai buổi chồng nhau khi
   * start < otherEnd và otherStart < end. Chỉ xét lịch chưa hủy.
   */
  async findConflict(
    consultantId: string,
    start: Date,
    durationMinutes: number,
    excludeId?: string,
  ): Promise<Appointment | null> {
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    const candidates = await prisma.appointment.findMany({
      where: {
        consultantId,
        status: { in: ["scheduled", "completed"] },
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
        // Giới hạn cửa sổ quét: buổi hẹn dài nhất giả định 8 tiếng
        scheduledAt: {
          gte: new Date(start.getTime() - 8 * 60 * 60_000),
          lte: end,
        },
      },
      include,
    });

    const conflict = candidates.find((row) => {
      const otherEnd = new Date(
        row.scheduledAt.getTime() + row.durationMinutes * 60_000,
      );
      return start < otherEnd && row.scheduledAt < end;
    });
    return conflict ? toAppointment(conflict) : null;
  },
};
