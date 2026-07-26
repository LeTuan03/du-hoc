"use client";

import Link from "next/link";
import { Button, Table, Tag } from "antd";
import { Pencil } from "lucide-react";
import { USER_ROLE_LABELS, type User } from "@/server/types";
import { deleteUser } from "@/server/actions/userActions";
import { DeleteButton } from "../DeleteButton";
import { formatDateTime } from "@/lib/format";

const roleColors: Record<User["role"], string> = {
  super_admin: "gold",
  admin: "geekblue",
  consultant: "cyan",
};

export function UsersTable({
  users,
  currentUserId,
  assignedCounts,
}: {
  users: User[];
  currentUserId: string;
  /** Số hồ sơ mỗi tài khoản đang phụ trách */
  assignedCounts: Record<string, number>;
}) {
  return (
    <Table<User>
      rowKey="id"
      dataSource={users}
      pagination={{ pageSize: 15, hideOnSinglePage: true }}
      scroll={{ x: 860 }}
      columns={[
        {
          title: "Tài khoản",
          render: (_, u) => (
            <>
              <Link
                href={`/admin/users/${u.id}`}
                className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
              >
                {u.fullName}
              </Link>
              {u.id === currentUserId && (
                <Tag color="blue" style={{ marginInlineStart: 8 }}>
                  Bạn
                </Tag>
              )}
              <p className="text-xs text-slate-400">{u.email}</p>
            </>
          ),
        },
        {
          title: "Vai trò",
          width: 140,
          render: (_, u) => <Tag color={roleColors[u.role]}>{USER_ROLE_LABELS[u.role]}</Tag>,
        },
        {
          title: "Điện thoại",
          width: 130,
          render: (_, u) => u.phone || "—",
        },
        {
          title: "Hồ sơ phụ trách",
          width: 140,
          align: "center",
          render: (_, u) => assignedCounts[u.id] ?? 0,
        },
        {
          title: "Trạng thái",
          width: 130,
          render: (_, u) =>
            u.status === "active" ? (
              <Tag color="green">Đang hoạt động</Tag>
            ) : (
              <Tag>Ngưng hoạt động</Tag>
            ),
        },
        {
          title: "Đăng nhập gần nhất",
          width: 160,
          render: (_, u) => (
            <span className="text-xs text-slate-500">
              {u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "Chưa đăng nhập"}
            </span>
          ),
        },
        {
          title: "",
          width: 150,
          render: (_, u) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/admin/users/${u.id}`}>
                <Button size="small" type="primary" ghost icon={<Pencil size={13} />}>
                  Sửa
                </Button>
              </Link>
              {u.id !== currentUserId && (
                <DeleteButton
                  action={deleteUser.bind(null, u.id)}
                  confirmMessage={`Xóa tài khoản "${u.fullName}"?`}
                />
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
