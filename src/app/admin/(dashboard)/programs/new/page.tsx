import { universityRepository } from "@/server/repositories/universityRepository";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProgramForm } from "@/components/admin/ProgramForm";

export const dynamic = "force-dynamic";

export default async function NewProgramPage({
  searchParams,
}: {
  searchParams: Promise<{ truong?: string }>;
}) {
  const [{ truong }, universities] = await Promise.all([
    searchParams,
    universityRepository.listOptions(),
  ]);

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Thêm ngành học"
        description="Ngành học hiển thị ở trang chi tiết trường và công cụ tra cứu ngành của ứng viên"
      />
      <ProgramForm universities={universities} defaultUniversity={truong} />
    </div>
  );
}
