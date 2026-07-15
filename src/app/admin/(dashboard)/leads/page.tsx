import { leadService } from "@/server/services/leadService";
import { countryRepository } from "@/server/repositories/countryRepository";
import { LeadsTable } from "@/components/admin/tables/LeadsTable";

export const dynamic = "force-dynamic";

interface SearchParams {
  trang_thai?: string;
  quoc_gia?: string;
  tim?: string;
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const [leads, countries] = await Promise.all([
    leadService.list({
      status: sp.trang_thai || undefined,
      country: sp.quoc_gia || undefined,
      search: sp.tim || undefined,
    }),
    countryRepository.findAll(),
  ]);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Quản lý Leads
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {leads.length} lead{sp.trang_thai || sp.quoc_gia || sp.tim ? " (đã lọc)" : ""}
        </p>
      </div>
      <LeadsTable
        leads={leads}
        countries={countries.map((c) => ({ name: c.name, slug: c.slug }))}
      />
    </div>
  );
}
