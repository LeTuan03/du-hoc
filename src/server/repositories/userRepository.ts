import { cache } from "react";
import type { User as UserRow } from "@prisma/client";
import { prisma } from "../db";
import type { User, UserRole } from "../types";

/** Repository tài khoản nội bộ (SRS mục 6.2 `users`) */

export interface UserInput {
  fullName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: "active" | "inactive";
  /** Bỏ trống khi sửa = giữ nguyên mật khẩu cũ */
  passwordHash?: string;
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    avatarUrl: row.avatarUrl,
    role: row.role as UserRole,
    status: row.status as User["status"],
    lastLoginAt: row.lastLoginAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export const userRepository = {
  findAll: cache(async (): Promise<User[]> => {
    const rows = await prisma.user.findMany({
      orderBy: [{ status: "asc" }, { fullName: "asc" }],
    });
    return rows.map(toUser);
  }),

  /** Tư vấn viên đang hoạt động — dùng cho dropdown giao lead/đặt lịch hẹn */
  findActiveConsultants: cache(async (): Promise<User[]> => {
    const rows = await prisma.user.findMany({
      where: { status: "active" },
      orderBy: { fullName: "asc" },
    });
    return rows.map(toUser);
  }),

  async findById(id: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? toUser(row) : null;
  },

  async create(data: UserInput & { passwordHash: string }): Promise<User> {
    const row = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone || null,
        role: data.role,
        status: data.status,
        passwordHash: data.passwordHash,
      },
    });
    return toUser(row);
  },

  async update(id: string, data: UserInput): Promise<User> {
    const row = await prisma.user.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone || null,
        role: data.role,
        status: data.status,
        ...(data.passwordHash ? { passwordHash: data.passwordHash } : {}),
      },
    });
    return toUser(row);
  },

  /** Số lead đang phụ trách — chặn xóa tài khoản còn việc dở */
  async countAssignedLeads(id: string): Promise<number> {
    return prisma.lead.count({ where: { assignedToId: id } });
  },

  delete(id: string): Promise<UserRow> {
    return prisma.user.delete({ where: { id } });
  },

  /** Số tài khoản Super Admin đang hoạt động — chặn tự khóa mất quyền cuối cùng */
  async countActiveSuperAdmins(): Promise<number> {
    return prisma.user.count({
      where: { role: "super_admin", status: "active" },
    });
  },
};
