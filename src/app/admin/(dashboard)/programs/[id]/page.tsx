import { notFound } from "next/navigation";
import { programRepository } from "@/server/repositories/programRepository";
import { universityRepository } from "@/server/repositories/universityRepository";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProgramForm } from "@/components/admin/ProgramForm";

export const dynamic = "force-dynamic";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [program, universities] = await Promise.all([
    programRepository.findById(id),
    universityRepository.listOptions(),
  ]);
  if (!program) notFound();

  return (
    <div className="max-w-2xl">
      <PageHeader title={`Sửa ngành: ${program.name}`} />
      <ProgramForm program={program} universities={universities} />
    </div>
  );
}
