import { notFound } from "next/navigation";
import { FileDown, Percent, Stamp, Users } from "lucide-react";
import { getSession } from "@/server/auth";
import { reportService } from "@/server/services/reportService";
import { can, type LeadStatus } from "@/server/types";
import { PageHeader, Panel, StatCard, EmptyState } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { DonutChart, FunnelBars, LineChart } from "@/components/admin/Charts";

export const dynamic = "force-dynamic";

const funnelColors: Record<LeadStatus, string> = {
  new: "#3b82f6",
  contacted: "#06b6d4",
  consulting: "#7c3aed",
  preparing_documents: "#f59e0b",
  submitted: "#ea580c",
  visa_approved: "#16a34a",
  discontinued: "#94a3b8",
};

interface SearchParams {
  ky_tu?: string;
  ky_den?: string;
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getSession();
  if (!session || !can(session.role, "reports.view")) notFound();

  const sp = await searchParams;
  const range = {
    from: sp.ky_tu ? new Date(`${sp.ky_tu}T00:00:00`) : undefined,
    to: sp.ky_den ? new Date(`${sp.ky_den}T23:59:59`) : undefined,
  };

  const [conversion, byConsultant, bySource, byCountry, byDay] =
    await Promise.all([
      reportService.conversion(range),
      reportService.byConsultant(range),
      reportService.bySource(range),
      reportService.byCountry(range),
      reportService.leadsByDay(30),
    ]);

  const exportQuery = new URLSearchParams();
  if (sp.ky_tu) exportQuery.set("from", sp.ky_tu);
  if (sp.ky_den) exportQuery.set("to", sp.ky_den);

  return (
    <div>
      <PageHeader
        title="Báo cáo chuyển đổi"
        description={
          range.from || range.to
            ? "Số liệu trong khoảng thời gian đã chọn"
            : "Số liệu toàn bộ thời gian"
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
        basePath="/admin/reports"
        fields={[{ name: "ky", type: "dateRange", placeholder: "Kỳ báo cáo" }]}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Tổng hồ sơ"
          value={conversion.total}
          icon={<Users size={18} />}
        />
        <StatCard
          label="Đã nộp hồ sơ"
          value={conversion.submitted}
          icon={<Percent size={18} />}
          tone="text-orange-600"
          hint={`${conversion.applicationRate}% trên tổng hồ sơ`}
        />
        <StatCard
          label="Đậu visa"
          value={conversion.visaApproved}
          icon={<Stamp size={18} />}
          tone="text-emerald-600"
        />
        <StatCard
          label="Tỷ lệ đậu visa"
          value={`${conversion.visaRate}%`}
          icon={<Percent size={18} />}
          tone="text-emerald-600"
          hint="Đậu visa / đã nộp hồ sơ"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Panel title="Phễu chuyển đổi" className="lg:col-span-2">
          <FunnelBars
            data={conversion.funnel.map((f) => ({
              label: `${f.label} (${f.shareOfTotal}%)`,
              value: f.count,
              color: funnelColors[f.status],
            }))}
          />
        </Panel>

        <Panel title="Hồ sơ theo ngày (30 ngày)" className="lg:col-span-3">
          <LineChart
            points={byDay.map((d) => d.count)}
            labels={byDay.map((d) => d.label)}
          />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Panel title="Hiệu quả tư vấn viên" className="lg:col-span-3">
          {byConsultant.length === 0 ? (
            <EmptyState message="Chưa có hồ sơ nào trong kỳ này" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                    <th className="pb-2 pr-3">Tư vấn viên</th>
                    <th className="pb-2 pr-3 text-right">Hồ sơ</th>
                    <th className="pb-2 pr-3 text-right">Đã nộp</th>
                    <th className="pb-2 pr-3 text-right">Đậu visa</th>
                    <th className="pb-2 text-right">Tỷ lệ nộp</th>
                  </tr>
                </thead>
                <tbody>
                  {byConsultant.map((row) => (
                    <tr key={row.id} className="border-b border-slate-50">
                      <td className="py-2.5 pr-3 font-semibold text-slate-900">
                        {row.name}
                      </td>
                      <td className="py-2.5 pr-3 text-right">{row.total}</td>
                      <td className="py-2.5 pr-3 text-right">{row.submitted}</td>
                      <td className="py-2.5 pr-3 text-right font-semibold text-emerald-600">
                        {row.visaApproved}
                      </td>
                      <td className="py-2.5 text-right text-slate-600">
                        {row.applicationRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Quốc gia mong muốn" className="lg:col-span-2">
          {byCountry.length === 0 ? (
            <EmptyState message="Chưa có dữ liệu" />
          ) : (
            <DonutChart
              data={byCountry.map((c) => ({ label: c.label, value: c.count }))}
            />
          )}
        </Panel>
      </div>

      <Panel title="Hiệu quả kênh marketing (UTM)" className="mt-6">
        {bySource.length === 0 ? (
          <EmptyState
            message="Chưa có dữ liệu kênh"
            hint="Gắn utm_source vào link quảng cáo để đo hiệu quả từng kênh"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                  <th className="pb-2 pr-3">Nguồn</th>
                  <th className="pb-2 pr-3 text-right">Hồ sơ</th>
                  <th className="pb-2 pr-3 text-right">Đậu visa</th>
                  <th className="pb-2 text-right">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody>
                {bySource.map((row) => (
                  <tr key={row.source} className="border-b border-slate-50">
                    <td className="py-2.5 pr-3 font-semibold text-slate-900">
                      {row.source}
                    </td>
                    <td className="py-2.5 pr-3 text-right">{row.total}</td>
                    <td className="py-2.5 pr-3 text-right">{row.visaApproved}</td>
                    <td className="py-2.5 text-right text-slate-600">
                      {row.visaRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
