"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { App, Button, Input, Modal, Table, Tag } from "antd";
import { CheckCircle2 } from "lucide-react";
import {
  APPOINTMENT_MODE_LABELS,
  APPOINTMENT_STATUS_LABELS,
  type Appointment,
  type AppointmentStatus,
} from "@/server/types";
import {
  changeAppointmentStatus,
  deleteAppointment,
} from "@/server/actions/appointmentActions";
import { DeleteButton } from "../DeleteButton";
import { AppointmentDrawer } from "../AppointmentDrawer";
import { formatDateTime } from "@/lib/format";

const statusColors: Record<AppointmentStatus, string> = {
  scheduled: "blue",
  completed: "green",
  cancelled: "default",
  no_show: "red",
};

/** Đánh dấu kết quả buổi tư vấn — ghi luôn vào timeline chăm sóc của hồ sơ */
function CloseAppointment({ appointment }: { appointment: Appointment }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<AppointmentStatus>("completed");
  const [outcome, setOutcome] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const fd = new FormData();
    fd.set("status", status);
    fd.set("outcome", outcome);
    const result = await changeAppointmentStatus(appointment.id, fd);
    if (result.ok) {
      message.success("Đã cập nhật lịch hẹn");
      setOpen(false);
      setOutcome("");
      router.refresh();
    } else {
      message.error(result.error);
    }
    setBusy(false);
  }

  return (
    <>
      <Button
        size="small"
        type="primary"
        ghost
        icon={<CheckCircle2 size={13} />}
        onClick={() => setOpen(true)}
      >
        Kết quả
      </Button>
      <Modal
        title={`Kết quả buổi hẹn với ${appointment.leadName}`}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={busy}
      >
        <div className="flex flex-wrap gap-2 py-2">
          {(
            ["completed", "no_show", "cancelled"] as AppointmentStatus[]
          ).map((s) => (
            <Button
              key={s}
              type={status === s ? "primary" : "default"}
              onClick={() => setStatus(s)}
            >
              {APPOINTMENT_STATUS_LABELS[s]}
            </Button>
          ))}
        </div>
        <Input.TextArea
          rows={4}
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          placeholder="Tóm tắt nội dung đã tư vấn, bước tiếp theo đã thống nhất với khách..."
        />
        <p className="mt-2 text-xs text-slate-400">
          Nội dung này được ghi vào lịch sử chăm sóc của hồ sơ.
        </p>
      </Modal>
    </>
  );
}

export function AppointmentsTable({
  appointments,
  leads,
  consultants,
}: {
  appointments: Appointment[];
  leads: { id: string; label: string }[];
  consultants: { id: string; fullName: string }[];
}) {
  const now = Date.now();

  return (
    <Table<Appointment>
      rowKey="id"
      dataSource={appointments}
      pagination={{ pageSize: 15, hideOnSinglePage: true }}
      scroll={{ x: 980 }}
      columns={[
        {
          title: "Thời gian",
          width: 165,
          render: (_, a) => {
            const overdue =
              a.status === "scheduled" && new Date(a.scheduledAt).getTime() < now;
            return (
              <>
                <p className="font-semibold text-slate-900">
                  {formatDateTime(a.scheduledAt)}
                </p>
                <p className="text-xs text-slate-400">{a.durationMinutes} phút</p>
                {overdue && (
                  <Tag color="orange" style={{ marginTop: 4 }}>
                    Quá hạn chưa cập nhật
                  </Tag>
                )}
              </>
            );
          },
        },
        {
          title: "Ứng viên",
          render: (_, a) => (
            <>
              <Link
                href={`/admin/leads/${a.leadId}`}
                className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
              >
                {a.leadName}
              </Link>
              <p className="text-xs text-slate-400">{a.leadPhone}</p>
            </>
          ),
        },
        {
          title: "Tư vấn viên",
          width: 150,
          render: (_, a) => a.consultantName ?? <span className="text-slate-400">Chưa phân công</span>,
        },
        {
          title: "Hình thức",
          width: 130,
          render: (_, a) => (
            <>
              <Tag>{APPOINTMENT_MODE_LABELS[a.mode]}</Tag>
              {a.location && (
                <p className="mt-1 max-w-[160px] truncate text-xs text-slate-400">
                  {a.location}
                </p>
              )}
            </>
          ),
        },
        {
          title: "Nội dung",
          render: (_, a) => (
            <p className="max-w-[220px] truncate text-sm text-slate-600">
              {a.topic || "—"}
            </p>
          ),
        },
        {
          title: "Trạng thái",
          width: 130,
          render: (_, a) => (
            <>
              <Tag color={statusColors[a.status]}>
                {APPOINTMENT_STATUS_LABELS[a.status]}
              </Tag>
              {a.outcome && (
                <p className="mt-1 max-w-[160px] truncate text-xs text-slate-400">
                  {a.outcome}
                </p>
              )}
            </>
          ),
        },
        {
          title: "",
          width: 210,
          render: (_, a) => (
            <div className="flex items-center justify-end gap-2">
              {a.status === "scheduled" && <CloseAppointment appointment={a} />}
              <AppointmentDrawer
                leads={leads}
                consultants={consultants}
                appointment={a}
                trigger={
                  <Button size="small" ghost type="primary">
                    Sửa
                  </Button>
                }
              />
              <DeleteButton
                action={deleteAppointment.bind(null, a.id)}
                confirmMessage={`Xóa lịch hẹn với ${a.leadName}?`}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
