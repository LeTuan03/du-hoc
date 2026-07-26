import { CalendarClock, CalendarX2, CircleCheck } from "lucide-react";
import { getSession } from "@/server/auth";
import { appointmentRepository } from "@/server/repositories/appointmentRepository";
import { userRepository } from "@/server/repositories/userRepository";
import { leadService } from "@/server/services/leadService";
import {
  APPOINTMENT_STATUS_LABELS,
  can,
  type AppointmentStatus,
} from "@/server/types";
import { PageHeader, StatCard } from "@/components/admin/PageHeader";
import { FilterBar } from "@/components/admin/FilterBar";
import { AppointmentDrawer } from "@/components/admin/AppointmentDrawer";
import { AppointmentsTable } from "@/components/admin/tables/AppointmentsTable";

export const dynamic = "force-dynamic";

interface SearchParams {
  trang_thai?: string;
  tu_van_vien?: string;
  ngay_tu?: string;
  ngay_den?: string;
}

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const session = await getSession();

  // Tư vấn viên mặc định chỉ thấy lịch của chính mình
  const scopedConsultant =
    session && !can(session.role, "leads.viewAll")
      ? session.userId
      : sp.tu_van_vien || undefined;

  const [appointments, consultants, leads] = await Promise.all([
    appointmentRepository.filter({
      status: (sp.trang_thai as AppointmentStatus) || undefined,
      consultantId: scopedConsultant,
      from: sp.ngay_tu ? new Date(`${sp.ngay_tu}T00:00:00`) : undefined,
      to: sp.ngay_den ? new Date(`${sp.ngay_den}T23:59:59`) : undefined,
    }),
    userRepository.findActiveConsultants(),
    leadService.list({}, session),
  ]);

  const now = Date.now();
  const upcoming = appointments.filter(
    (a) => a.status === "scheduled" && new Date(a.scheduledAt).getTime() >= now,
  ).length;
  const overdue = appointments.filter(
    (a) => a.status === "scheduled" && new Date(a.scheduledAt).getTime() < now,
  ).length;
  const completed = appointments.filter((a) => a.status === "completed").length;

  const leadOptions = leads.map((l) => ({
    id: l.id,
    label: `${l.fullName} — ${l.code} — ${l.phone}`,
  }));
  const consultantOptions = consultants.map((c) => ({
    id: c.id,
    fullName: c.fullName,
  }));

  return (
    <div>
      <PageHeader
        title="Lịch hẹn tư vấn"
        description={`${appointments.length} lịch hẹn trong bộ lọc hiện tại`}
        actions={
          <AppointmentDrawer
            leads={leadOptions}
            consultants={consultantOptions}
          />
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Sắp diễn ra"
          value={upcoming}
          icon={<CalendarClock size={18} />}
        />
        <StatCard
          label="Quá hạn chưa cập nhật"
          value={overdue}
          icon={<CalendarX2 size={18} />}
          tone="text-amber-600"
          hint={overdue > 0 ? "Cần ghi kết quả để pipeline không bị nghẽn" : undefined}
        />
        <StatCard
          label="Đã hoàn thành"
          value={completed}
          icon={<CircleCheck size={18} />}
          tone="text-emerald-600"
        />
      </div>

      <FilterBar
        basePath="/admin/appointments"
        fields={[
          {
            name: "trang_thai",
            type: "select",
            placeholder: "Trạng thái",
            options: (
              Object.keys(APPOINTMENT_STATUS_LABELS) as AppointmentStatus[]
            ).map((s) => ({ value: s, label: APPOINTMENT_STATUS_LABELS[s] })),
          },
          ...(session && can(session.role, "leads.viewAll")
            ? [
                {
                  name: "tu_van_vien",
                  type: "select" as const,
                  placeholder: "Tư vấn viên",
                  width: 200,
                  options: consultants.map((c) => ({
                    value: c.id,
                    label: c.fullName,
                  })),
                },
              ]
            : []),
          { name: "ngay", type: "dateRange", placeholder: "Khoảng ngày" },
        ]}
      />

      <AppointmentsTable
        appointments={appointments}
        leads={leadOptions}
        consultants={consultantOptions}
      />
    </div>
  );
}
