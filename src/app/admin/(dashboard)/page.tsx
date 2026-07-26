import Link from "next/link";
import {
  CalendarClock,
  CalendarDays,
  FileWarning,
  Stamp,
  UserPlus,
  Users,
} from "lucide-react";
import { getSession } from "@/server/auth";
import { leadService } from "@/server/services/leadService";
import { reportService } from "@/server/services/reportService";
import { appointmentRepository } from "@/server/repositories/appointmentRepository";
import { can, LEAD_STATUS_LABELS, type LeadStatus } from "@/server/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DonutChart, FunnelBars, LineChart } from "@/components/admin/Charts";
import { EmptyState, Panel, StatCard } from "@/components/admin/PageHeader";
import { formatDateTime } from "@/lib/format";

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

export default async function AdminDashboardPage() {
  const session = await getSession();
  const isConsultant = Boolean(session && !can(session.role, "leads.viewAll"));

  const [summary, byDay, byCountry, conversion, recentLeads, upcoming] =
    await Promise.all([
      reportService.summary(),
      reportService.leadsByDay(30),
      reportService.byCountry(),
      reportService.conversion(),
      leadService.list({}, session),
      appointmentRepository.filter({
        status: "scheduled",
        from: new Date(),
        consultantId: isConsultant ? session!.userId : undefined,
      }),
    ]);

  const funnelData = conversion.funnel.map((f) => ({
    label: f.label,
    value: f.count,
    color: funnelColors[f.status],
  }));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Tổng quan pipeline tuyển sinh
        {session && ` — xin chào ${session.fullName}`}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Tổng hồ sơ" value={summary.total} icon={<Users size={18} />} />
        <StatCard
          label="Hôm nay"
          value={summary.today}
          icon={<UserPlus size={18} />}
          tone="text-cyan-600"
        />
        <StatCard
          label="Tháng này"
          value={summary.month}
          icon={<CalendarDays size={18} />}
          tone="text-violet-600"
        />
        <StatCard
          label="Tỷ lệ đậu visa"
          value={`${summary.visaRate}%`}
          icon={<Stamp size={18} />}
          tone="text-emerald-600"
        />
        <StatCard
          label="Lịch hẹn sắp tới"
          value={summary.upcomingAppointments}
          icon={<CalendarClock size={18} />}
          tone="text-blue-600"
        />
        <StatCard
          label="Tài liệu chờ xử lý"
          value={summary.pendingDocuments}
          icon={<FileWarning size={18} />}
          tone="text-amber-600"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Panel title="Hồ sơ theo ngày (30 ngày)" className="lg:col-span-3">
          <LineChart
            points={byDay.map((d) => d.count)}
            labels={byDay.map((d) => d.label)}
          />
        </Panel>
        <Panel title="Hồ sơ theo quốc gia" className="lg:col-span-2">
          {byCountry.length === 0 ? (
            <EmptyState message="Chưa có dữ liệu" />
          ) : (
            <DonutChart
              data={byCountry.map((c) => ({ label: c.label, value: c.count }))}
            />
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Panel title="Pipeline trạng thái" className="lg:col-span-2">
          <FunnelBars data={funnelData} />
        </Panel>

        <Panel
          title="Lịch hẹn sắp tới"
          className="lg:col-span-3"
          extra={
            <Link
              href="/admin/appointments"
              className="text-sm font-bold text-[#1e4fa3] hover:underline"
            >
              Xem tất cả →
            </Link>
          }
        >
          {upcoming.length === 0 ? (
            <EmptyState
              message="Không có lịch hẹn nào sắp tới"
              hint="Đặt lịch từ trang chi tiết hồ sơ để chốt bước tư vấn tiếp theo."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcoming.slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/leads/${a.leadId}`}
                      className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
                    >
                      {a.leadName}
                    </Link>
                    <p className="truncate text-xs text-slate-400">
                      {a.topic || "Chưa ghi nội dung"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-slate-500">
                    {formatDateTime(a.scheduledAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel
        title={isConsultant ? "Hồ sơ được giao cho bạn" : "Hồ sơ mới nhất"}
        className="mt-6"
        extra={
          <Link
            href="/admin/leads"
            className="text-sm font-bold text-[#1e4fa3] hover:underline"
          >
            Xem tất cả →
          </Link>
        }
      >
        {recentLeads.length === 0 ? (
          <EmptyState message="Chưa có hồ sơ nào" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                  <th className="pb-2 pr-3">Ứng viên</th>
                  <th className="pb-2 pr-3">Quốc gia</th>
                  <th className="pb-2 pr-3">Phụ trách</th>
                  <th className="pb-2 pr-3">Trạng thái</th>
                  <th className="pb-2">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.slice(0, 8).map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-50">
                    <td className="py-2.5 pr-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
                      >
                        {lead.fullName}
                      </Link>
                      <p className="text-xs text-slate-400">{lead.code}</p>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">
                      {byCountry.find((c) => c.slug === lead.desiredCountry)
                        ?.label ?? "—"}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">
                      {lead.assignedToName ?? (
                        <span className="text-amber-600">Chưa giao</span>
                      )}
                    </td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="py-2.5 text-xs text-slate-400">
                      {formatDateTime(lead.createdAt)}
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
