import { notFound } from "next/navigation";
import { getSession } from "@/server/auth";
import { userRepository } from "@/server/repositories/userRepository";
import { can } from "@/server/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/UserForm";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || !can(session.role, "users.manage")) notFound();

  const { id } = await params;
  const user = await userRepository.findById(id);
  if (!user) notFound();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={`Sửa tài khoản: ${user.fullName}`}
        description={
          user.lastLoginAt
            ? `Đăng nhập gần nhất: ${formatDateTime(user.lastLoginAt)}`
            : "Tài khoản chưa đăng nhập lần nào"
        }
      />
      <UserForm user={user} />
    </div>
  );
}
