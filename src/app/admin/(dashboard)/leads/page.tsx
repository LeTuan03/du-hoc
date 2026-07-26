import { FileDown } from "lucide-react";
import { getSession } from "@/server/auth";
import { leadService } from "@/server/services/leadService";
import { countryRepository } from "@/server/repositories/countryRepository";
import { userRepository } from "@/server/repositories/userRepository";
import { can, LEAD_STATUS_LABELS } from "@/server/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { LeadsTable } from "@/components/admin/tables/LeadsTable";

export const dynamic = "force-dynamic";

interface SearchParams {
  trang_thai?: string;
  quoc_gia?: string;
  tim?: string;
  phu_trach?: string;
  ngay_tu?: string;
  ngay_den?: string;
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const session = await getSession();

  const [leads, countries, consultants] = await Promise.all([
    leadService.list(
      {
        status: sp.trang_thai || undefined,
        country: sp.quoc_gia || undefined,
        search: sp.tim || undefined,
        assignedToId: sp.phu_trach || undefined,
        from: sp.ngay_tu ? new Date(`${sp.ngay_tu}T00:00:00`) : undefined,
        to: sp.ngay_den ? new Date(`${sp.ngay_den}T23:59:59`) : undefined,
      },
      session,
    ),
    countryRepository.findAll(),
    userRepository.findActiveConsultants(),
  ]);

  const canAssign = Boolean(session && can(session.role, "leads.assign"));
  const canDelete = Boolean(session && can(session.role, "leads.delete"));
  const canViewAll = Boolean(session && can(session.role, "leads.viewAll"));
  const filtered = Object.values(sp).some(Boolean);

  const exportQuery = new URLSearchParams();
  if (sp.trang_thai) exportQuery.set("status", sp.trang_thai);
  if (sp.quoc_gia) exportQuery.set("country", sp.quoc_gia);
  if (sp.tim) exportQuery.set("search", sp.tim);
  if (sp.ngay_tu) exportQuery.set("from", sp.ngay_tu);
  if (sp.ngay_den) exportQuery.set("to", sp.ngay_den);

  return (
    <div>
      <PageHeader
        title="Hồ sơ ứng viên"
        description={
          canViewAll
            ? `${leads.length} hồ sơ${filtered ? " (đã lọc)" : ""}`
            : `${leads.length} hồ sơ được giao cho bạn`
        }
        actions={
          <a
            href={`/api/v1/leads/export?${exportQuery.toString()}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-[#1e4fa3] hover:text-[#1e4fa3]"
          >
            <FileDown size={15} aria-hidden />
            Xuất CSV
          </a>
        }
      />

      <FilterBar
        basePath="/admin/leads"
        fields={[
          {
            name: "tim",
            type: "search",
            placeholder: "Tên, mã hồ sơ, email, SĐT...",
          },
          {
            name: "trang_thai",
            type: "select",
            placeholder: "Trạng thái",
            options: Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
          },
          {
            name: "quoc_gia",
            type: "select",
            placeholder: "Quốc gia",
            options: countries.map((c) => ({ value: c.slug, label: c.name })),
          },
          ...(canViewAll
            ? [
                {
                  name: "phu_trach",
                  type: "select" as const,
                  placeholder: "Phụ trách",
                  width: 190,
                  options: [
                    { value: "unassigned", label: "Chưa giao" },
                    ...consultants.map((c) => ({
                      value: c.id,
                      label: c.fullName,
                    })),
                  ],
                },
              ]
            : []),
          { name: "ngay", type: "dateRange", placeholder: "Ngày đăng ký" },
        ]}
      />

      <LeadsTable
        leads={leads}
        countries={countries.map((c) => ({ name: c.name, slug: c.slug }))}
        consultants={consultants.map((c) => ({
          id: c.id,
          fullName: c.fullName,
        }))}
        canAssign={canAssign}
        canDelete={canDelete}
      />
    </div>
  );
}
