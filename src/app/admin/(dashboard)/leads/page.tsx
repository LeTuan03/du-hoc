import Link from "next/link";
import { leadService } from "@/server/services/leadService";
import { countries, getCountryBySlug } from "@/server/data/countries";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/server/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/format";

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
  const leads = await leadService.list({
    status: sp.trang_thai || undefined,
    country: sp.quoc_gia || undefined,
    search: sp.tim || undefined,
  });

  const inputCls =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#1e4fa3] focus:outline-none focus:ring-2 focus:ring-[#1e4fa3]/20";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Quản lý Leads
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {leads.length} lead{sp.trang_thai || sp.quoc_gia || sp.tim ? " (đã lọc)" : ""}
          </p>
        </div>
      </div>

      {/* Bộ lọc */}
      <form
        method="GET"
        className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
      >
        <div className="min-w-[200px] flex-1">
          <label htmlFor="l-search" className="mb-1 block text-xs font-bold text-slate-500">
            Tìm kiếm
          </label>
          <input
            id="l-search"
            name="tim"
            defaultValue={sp.tim || ""}
            placeholder="Tên, email, SĐT..."
            className={`${inputCls} w-full`}
          />
        </div>
        <div>
          <label htmlFor="l-status" className="mb-1 block text-xs font-bold text-slate-500">
            Trạng thái
          </label>
          <select id="l-status" name="trang_thai" defaultValue={sp.trang_thai || ""} className={inputCls}>
            <option value="">Tất cả</option>
            {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="l-country" className="mb-1 block text-xs font-bold text-slate-500">
            Quốc gia
          </label>
          <select id="l-country" name="quoc_gia" defaultValue={sp.quoc_gia || ""} className={inputCls}>
            <option value="">Tất cả</option>
            {countries.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-[#1e4fa3] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#123a7a]"
        >
          Lọc
        </button>
        <Link
          href="/admin/leads"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Xóa lọc
        </Link>
      </form>

      {/* Bảng */}
      <div className="mt-5 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Họ tên</th>
              <th className="px-4 py-3">Liên hệ</th>
              <th className="px-4 py-3">Quốc gia</th>
              <th className="px-4 py-3">Trường quan tâm</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày đăng ký</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  Không có lead nào khớp bộ lọc
                </td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
                  >
                    {lead.fullName}
                  </Link>
                  <p className="text-xs text-slate-400">{lead.city}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <p>{lead.phone}</p>
                  <p className="text-xs text-slate-400">{lead.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {lead.desiredCountry
                    ? (getCountryBySlug(lead.desiredCountry)?.name ?? "—")
                    : "—"}
                </td>
                <td className="max-w-[180px] truncate px-4 py-3 text-slate-600">
                  {lead.desiredUniversity
                    ? lead.desiredUniversity
                        .split("-")
                        .map((w) => w[0]?.toUpperCase() + w.slice(1))
                        .join(" ")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {formatDateTime(lead.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="rounded-lg bg-[#e8f0fc] px-3 py-1.5 text-xs font-bold text-[#1e4fa3] hover:bg-[#d5e5fa]"
                  >
                    Xem
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
