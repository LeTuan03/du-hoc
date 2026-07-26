import { programRepository } from "@/server/repositories/programRepository";
import { universityRepository } from "@/server/repositories/universityRepository";
import { PROGRAM_LEVEL_LABELS, type ProgramLevel } from "@/server/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { ProgramsTable } from "@/components/admin/tables/ProgramsTable";

export const dynamic = "force-dynamic";

interface SearchParams {
  truong?: string;
  bac_hoc?: string;
  tim?: string;
}

export default async function AdminProgramsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const universities = await universityRepository.listOptions();

  const programs = await programRepository.filter({
    university: sp.truong || undefined,
    level: sp.bac_hoc || undefined,
    search: sp.tim || undefined,
  });

  const universityNames = Object.fromEntries(
    universities.map((u) => [u.slug, u.name]),
  );
  const filtered = Boolean(sp.truong || sp.bac_hoc || sp.tim);

  return (
    <div>
      <PageHeader
        title="Ngành học"
        description={`${programs.length} ngành${filtered ? " (đã lọc)" : ""} của ${universities.length} trường đối tác`}
        createHref="/admin/programs/new"
        createLabel="Thêm ngành học"
      />

      <FilterBar
        basePath="/admin/programs"
        fields={[
          { name: "tim", type: "search", placeholder: "Tên ngành..." },
          {
            name: "truong",
            type: "select",
            placeholder: "Trường",
            width: 240,
            options: universities.map((u) => ({ value: u.slug, label: u.name })),
          },
          {
            name: "bac_hoc",
            type: "select",
            placeholder: "Bậc học",
            options: (Object.keys(PROGRAM_LEVEL_LABELS) as ProgramLevel[]).map(
              (l) => ({ value: l, label: PROGRAM_LEVEL_LABELS[l] }),
            ),
          },
        ]}
      />

      <ProgramsTable programs={programs} universityNames={universityNames} />
    </div>
  );
}
