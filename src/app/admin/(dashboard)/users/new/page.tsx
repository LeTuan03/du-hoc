import { notFound } from "next/navigation";
import { getSession } from "@/server/auth";
import { can } from "@/server/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/UserForm";

export const dynamic = "force-dynamic";

export default async function NewUserPage() {
  const session = await getSession();
  if (!session || !can(session.role, "users.manage")) notFound();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Thêm tài khoản"
        description="Tài khoản dùng để đăng nhập Admin CMS và nhận hồ sơ phụ trách"
      />
      <UserForm />
    </div>
  );
}
