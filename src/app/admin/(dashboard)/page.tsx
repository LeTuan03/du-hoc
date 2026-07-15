import Link from "next/link";
import { CalendarDays, Stamp, UserPlus, Users } from "lucide-react";
import { leadService } from "@/server/services/leadService";
import { countryRepository } from "@/server/repositories/countryRepository";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/server/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DonutChart, FunnelBars, LineChart } from "@/components/admin/Charts";
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
  const [leads, countries] = await Promise.all([
    leadService.list({}),
    countryRepository.findAll(),
  ]);
  const countryName = (slug: string) =>
    countries.find((c) => c.slug === slug)?.name;

  const today = new Date();
  const isSameDay = (iso: string) => {
    const d = new Date(iso);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };
  const isSameMonth = (iso: string) => {
    const d = new Date(iso);
    return (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const totalLeads = leads.length;
  const todayLeads = leads.filter((l) => isSameDay(l.createdAt)).length;
  const monthLeads = leads.filter((l) => isSameMonth(l.createdAt)).length;
  const submitted = leads.filter((l) =>
    ["submitted", "visa_approved"].includes(l.status),
  ).length;
  const visaApproved = leads.filter((l) => l.status === "visa_approved").length;
  const visaRate =
    submitted > 0 ? Math.round((visaApproved / submitted) * 100) : 0;

  // Lead theo ngày — 30 ngày gần nhất.
  // Key theo giờ ĐỊA PHƯƠNG (không dùng toISOString = UTC) để khớp với
  // cách tính "Hôm nay" ở stat card phía trên.
  const localKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const days: { key: string; label: string }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      key: localKey(d),
      label: `${d.getDate()}/${d.getMonth() + 1}`,
    });
  }
  const byDay = days.map(
    (day) =>
      leads.filter((l) => localKey(new Date(l.createdAt)) === day.key).length,
  );

  // Lead theo quốc gia
  const byCountry = new Map<string, number>();
  leads.forEach((l) => {
    const name = l.desiredCountry
      ? (countryName(l.desiredCountry) ?? l.desiredCountry)
      : "Chưa xác định";
    byCountry.set(name, (byCountry.get(name) ?? 0) + 1);
  });
  const countryData = [...byCountry.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  // Funnel theo trạng thái
  const funnelData = (Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map(
    (status) => ({
      label: LEAD_STATUS_LABELS[status],
      value: leads.filter((l) => l.status === status).length,
      color: funnelColors[status],
    }),
  );

  const recentLeads = leads.slice(0, 8);

  const statCards = [
    { label: "Tổng lead", value: totalLeads, icon: <Users size={18} />, tone: "text-[#1e4fa3]" },
    { label: "Hôm nay", value: todayLeads, icon: <UserPlus size={18} />, tone: "text-cyan-600" },
    { label: "Tháng này", value: monthLeads, icon: <CalendarDays size={18} />, tone: "text-violet-600" },
    { label: "Tỷ lệ đậu visa", value: `${visaRate}%`, icon: <Stamp size={18} />, tone: "text-emerald-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Tổng quan hoạt động thu thập và chăm sóc lead
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                {card.label}
              </p>
              <span aria-hidden className={card.tone}>
                {card.icon}
              </span>
            </div>
            <p className={`mt-2 text-3xl font-extrabold ${card.tone}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:col-span-3">
          <h2 className="font-bold text-slate-900">Lead theo ngày (30 ngày)</h2>
          <div className="mt-4">
            <LineChart points={byDay} labels={days.map((d) => d.label)} />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:col-span-2">
          <h2 className="font-bold text-slate-900">Lead theo quốc gia</h2>
          <div className="mt-4">
            <DonutChart data={countryData} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Funnel */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:col-span-2">
          <h2 className="font-bold text-slate-900">Pipeline trạng thái</h2>
          <div className="mt-4">
            <FunnelBars data={funnelData} />
          </div>
        </div>

        {/* Bảng lead mới nhất */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Lead mới nhất</h2>
            <Link
              href="/admin/leads"
              className="text-sm font-bold text-[#1e4fa3] hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                  <th className="pb-2 pr-3">Họ tên</th>
                  <th className="pb-2 pr-3">Quốc gia</th>
                  <th className="pb-2 pr-3">Trạng thái</th>
                  <th className="pb-2">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-50">
                    <td className="py-2.5 pr-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
                      >
                        {lead.fullName}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">
                      {lead.desiredCountry
                        ? (countryName(lead.desiredCountry) ?? "—")
                        : "—"}
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
        </div>
      </div>
    </div>
  );
}
