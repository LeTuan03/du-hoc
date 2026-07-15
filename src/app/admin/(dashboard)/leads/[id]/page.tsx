import Link from "next/link";
import { notFound } from "next/navigation";
import { leadService } from "@/server/services/leadService";
import { getCountryBySlug } from "@/server/data/countries";
import { getUniversityBySlug } from "@/server/data/universities";
import { LEAD_STATUS_LABELS } from "@/server/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { LeadActions } from "@/components/admin/LeadActions";
import { formatDate, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const genderLabels = { male: "Nam", female: "Nữ", other: "Khác" };

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await leadService.getById(id);
  if (!lead) notFound();

  const country = lead.desiredCountry
    ? getCountryBySlug(lead.desiredCountry)
    : undefined;
  const university = lead.desiredUniversity
    ? getUniversityBySlug(lead.desiredUniversity)
    : undefined;

  const infoRows: { label: string; value: string | undefined }[] = [
    { label: "Ngày sinh", value: formatDate(lead.dateOfBirth) },
    { label: "Giới tính", value: genderLabels[lead.gender] },
    { label: "Email", value: lead.email },
    { label: "Số điện thoại", value: lead.phone },
    { label: "Tỉnh/Thành phố", value: lead.city },
    { label: "Trường đang học", value: lead.currentSchool },
    { label: "GPA", value: lead.gpa?.toString() },
    { label: "Ngoại ngữ", value: lead.languageLevel },
    { label: "Quốc gia mong muốn", value: country?.name },
    { label: "Trường quan tâm", value: university?.name },
    { label: "Ngành dự kiến", value: lead.major },
    { label: "Kỳ nhập học", value: lead.intakeTerm },
    { label: "Ngân sách", value: lead.budget },
    { label: "Trang nguồn", value: lead.sourcePage },
  ];

  // Timeline: ghi chú mới nhất trước
  const timeline = [...lead.notes].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div>
      <Link
        href="/admin/leads"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách leads
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {lead.fullName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Đăng ký lúc {formatDateTime(lead.createdAt)}
            {lead.sourcePage && <> · từ trang <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{lead.sourcePage}</code></>}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Thông tin học sinh */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="font-bold text-slate-900">Thông tin học sinh</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              {infoRows
                .filter((r) => r.value)
                .map((r) => (
                  <div key={r.label} className="flex justify-between gap-3">
                    <dt className="shrink-0 text-slate-500">{r.label}</dt>
                    <dd className="break-all text-right font-semibold text-slate-900">
                      {r.value}
                    </dd>
                  </div>
                ))}
            </dl>
            {lead.note && (
              <div className="mt-4 rounded-xl bg-amber-50 p-3.5 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Ghi chú của khách
                </p>
                <p className="mt-1 text-slate-700">{lead.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline chăm sóc */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="font-bold text-slate-900">
              Lịch sử chăm sóc ({timeline.length})
            </h2>
            {timeline.length === 0 ? (
              <p className="mt-3 text-sm text-slate-400">
                Chưa có ghi chú nào — hãy liên hệ khách và ghi lại kết quả.
              </p>
            ) : (
              <ol className="mt-4 space-y-0 border-l-2 border-[#e8f0fc] pl-5">
                {timeline.map((n) => (
                  <li key={n.id} className="relative pb-5">
                    <span className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full bg-[#1e4fa3] ring-4 ring-white" />
                    <p className="text-xs text-slate-400">
                      {formatDateTime(n.createdAt)}
                    </p>
                    {n.statusChangeTo && (
                      <p className="mt-1 text-xs font-bold text-violet-600">
                        → Chuyển sang: {LEAD_STATUS_LABELS[n.statusChangeTo]}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-slate-700">{n.note}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Hành động */}
        <div className="lg:col-span-1">
          <LeadActions leadId={lead.id} currentStatus={lead.status} />
        </div>
      </div>
    </div>
  );
}
