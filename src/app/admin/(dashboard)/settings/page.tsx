import { notFound } from "next/navigation";
import { getSession } from "@/server/auth";
import { settingRepository } from "@/server/repositories/settingRepository";
import { can } from "@/server/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session || !can(session.role, "settings.manage")) notFound();

  const settings = await settingRepository.getAll();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Cấu hình site"
        description="Thông tin liên hệ và SEO mặc định hiển thị trên website công khai"
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
