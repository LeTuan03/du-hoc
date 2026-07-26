import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { Button } from "antd";
import { getSession } from "@/server/auth";
import { leadService } from "@/server/services/leadService";
import { countryRepository } from "@/server/repositories/countryRepository";
import { universityRepository } from "@/server/repositories/universityRepository";
import { documentRepository } from "@/server/repositories/documentRepository";
import { appointmentRepository } from "@/server/repositories/appointmentRepository";
import { userRepository } from "@/server/repositories/userRepository";
import {
  APPOINTMENT_MODE_LABELS,
  APPOINTMENT_STATUS_LABELS,
  can,
  LEAD_STATUS_LABELS,
} from "@/server/types";
import { deleteLead } from "@/server/actions/leadActions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { LeadActions } from "@/components/admin/LeadActions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AssignConsultant } from "@/components/admin/AssignConsultant";
import { DocumentChecklist } from "@/components/admin/DocumentChecklist";
import { AppointmentDrawer } from "@/components/admin/AppointmentDrawer";
import { Panel } from "@/components/admin/PageHeader";
import { formatDate, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const genderLabels = { male: "Nam", female: "Nữ", other: "Khác" };

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const lead = await leadService.getById(id, session);
  // Tư vấn viên mở hồ sơ không được giao → 404 thay vì lộ dữ liệu
  if (!lead) notFound();

  const [country, university, documents, appointments, consultants] =
    await Promise.all([
      lead.desiredCountry
        ? countryRepository.findBySlug(lead.desiredCountry)
        : undefined,
      lead.desiredUniversity
        ? universityRepository.findBySlug(lead.desiredUniversity)
        : undefined,
      documentRepository.findByLead(lead.id),
      appointmentRepository.findByLead(lead.id),
      userRepository.findActiveConsultants(),
    ]);

  const canAssign = Boolean(session && can(session.role, "leads.assign"));
  const canDelete = Boolean(session && can(session.role, "leads.delete"));

  const infoRows: { label: string; value: string | null | undefined }[] = [
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
  ];

  const trackingRows = [
    { label: "Trang nguồn", value: lead.sourcePage },
    { label: "utm_source", value: lead.utmSource },
    { label: "utm_medium", value: lead.utmMedium },
    { label: "utm_campaign", value: lead.utmCampaign },
  ].filter((r) => r.value);

  // Timeline: ghi chú mới nhất trước
  const timeline = [...lead.notes].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  const leadOption = [
    { id: lead.id, label: `${lead.fullName} — ${lead.code}` },
  ];
  const consultantOptions = consultants.map((c) => ({
    id: c.id,
    fullName: c.fullName,
  }));

  return (
    <div>
      <Link
        href="/admin/leads"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách hồ sơ
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {lead.fullName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Mã hồ sơ{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-700">
              {lead.code}
            </code>{" "}
            · Đăng ký lúc {formatDateTime(lead.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={lead.status} />
          {canDelete && (
            <DeleteButton
              action={deleteLead.bind(null, lead.id)}
              confirmMessage={`Xóa hồ sơ "${lead.fullName}" cùng toàn bộ lịch sử chăm sóc, lịch hẹn và tài liệu? Hành động này không thể hoàn tác.`}
              redirectTo="/admin/leads"
              label="Xóa hồ sơ"
            />
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Cột trái: thông tin + phụ trách */}
        <div className="space-y-6 lg:col-span-1">
          <Panel title="Thông tin học sinh">
            <dl className="space-y-2.5 text-sm">
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
          </Panel>

          <Panel title="Tư vấn viên phụ trách">
            {canAssign ? (
              <AssignConsultant
                leadIds={[lead.id]}
                currentId={lead.assignedToId}
                consultants={consultantOptions}
              />
            ) : (
              <p className="text-sm font-semibold text-slate-900">
                {lead.assignedToName ?? "Chưa được giao"}
              </p>
            )}
          </Panel>

          {trackingRows.length > 0 && (
            <Panel title="Nguồn & tracking">
              <dl className="space-y-2 text-sm">
                {trackingRows.map((r) => (
                  <div key={r.label} className="flex justify-between gap-3">
                    <dt className="shrink-0 text-slate-500">{r.label}</dt>
                    <dd className="break-all text-right font-medium text-slate-700">
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
          )}
        </div>

        {/* Cột giữa: tài liệu + lịch hẹn + timeline */}
        <div className="space-y-6 lg:col-span-1">
          <DocumentChecklist leadId={lead.id} documents={documents} />

          <Panel
            title={`Lịch hẹn tư vấn (${appointments.length})`}
            extra={
              <AppointmentDrawer
                leads={leadOption}
                consultants={consultantOptions}
                fixedLeadId={lead.id}
                trigger={
                  <Button size="small" icon={<CalendarPlus size={13} />}>
                    Đặt lịch
                  </Button>
                }
              />
            }
          >
            {appointments.length === 0 ? (
              <p className="text-sm text-slate-400">
                Chưa có lịch hẹn nào — đặt lịch để chốt bước tư vấn tiếp theo.
              </p>
            ) : (
              <ul className="space-y-3">
                {appointments.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl bg-slate-50 px-3.5 py-3 text-sm"
                  >
                    <p className="font-semibold text-slate-900">
                      {formatDateTime(a.scheduledAt)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {APPOINTMENT_MODE_LABELS[a.mode]} ·{" "}
                      {APPOINTMENT_STATUS_LABELS[a.status]}
                      {a.consultantName && ` · ${a.consultantName}`}
                    </p>
                    {a.topic && (
                      <p className="mt-1 text-slate-600">{a.topic}</p>
                    )}
                    {a.outcome && (
                      <p className="mt-1 text-xs text-emerald-700">
                        Kết quả: {a.outcome}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title={`Lịch sử chăm sóc (${timeline.length})`}>
            {timeline.length === 0 ? (
              <p className="text-sm text-slate-400">
                Chưa có ghi chú nào — hãy liên hệ khách và ghi lại kết quả.
              </p>
            ) : (
              <ol className="space-y-0 border-l-2 border-[#e8f0fc] pl-5">
                {timeline.map((n) => (
                  <li key={n.id} className="relative pb-5">
                    <span className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full bg-[#1e4fa3] ring-4 ring-white" />
                    <p className="text-xs text-slate-400">
                      {formatDateTime(n.createdAt)}
                      {n.userName && ` · ${n.userName}`}
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
          </Panel>
        </div>

        {/* Cột phải: hành động */}
        <div className="lg:col-span-1">
          <LeadActions
            leadId={lead.id}
            currentStatus={lead.status}
            canOverride={Boolean(
              session && can(session.role, "leads.overrideStatus"),
            )}
          />
        </div>
      </div>
    </div>
  );
}
