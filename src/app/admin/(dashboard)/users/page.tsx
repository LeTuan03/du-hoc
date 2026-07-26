import { notFound } from "next/navigation";
import { getSession } from "@/server/auth";
import { prisma } from "@/server/db";
import { userRepository } from "@/server/repositories/userRepository";
import { can } from "@/server/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { UsersTable } from "@/components/admin/tables/UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getSession();
  // Chặn ở server: ẩn menu là chưa đủ (SRS mục 12.1)
  if (!session || !can(session.role, "users.manage")) notFound();

  const [users, grouped] = await Promise.all([
    userRepository.findAll(),
    prisma.lead.groupBy({
      by: ["assignedToId"],
      where: { assignedToId: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const assignedCounts = Object.fromEntries(
    grouped.map((g) => [g.assignedToId!, g._count._all]),
  );

  const active = users.filter((u) => u.status === "active").length;

  return (
    <div>
      <PageHeader
        title="Tư vấn viên & phân quyền"
        description={`${users.length} tài khoản · ${active} đang hoạt động`}
        createHref="/admin/users/new"
        createLabel="Thêm tài khoản"
      />
      <UsersTable
        users={users}
        currentUserId={session.userId}
        assignedCounts={assignedCounts}
      />
    </div>
  );
}
