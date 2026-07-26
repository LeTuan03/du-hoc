"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Alert,
  App,
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
} from "antd";
import dayjs from "dayjs";
import { CalendarPlus } from "lucide-react";
import {
  APPOINTMENT_MODE_LABELS,
  type Appointment,
  type AppointmentMode,
} from "@/server/types";
import {
  createAppointment,
  updateAppointment,
} from "@/server/actions/appointmentActions";
import { toFormData } from "./formKit";

/**
 * Đặt/sửa lịch hẹn tư vấn. Dùng chung cho trang /admin/appointments
 * (chọn hồ sơ trong danh sách) và trang chi tiết hồ sơ (khóa sẵn hồ sơ).
 */
export function AppointmentDrawer({
  leads,
  consultants,
  appointment,
  fixedLeadId,
  trigger,
}: {
  leads: { id: string; label: string }[];
  consultants: { id: string; fullName: string }[];
  appointment?: Appointment;
  /** Khóa hồ sơ khi mở từ trang chi tiết */
  fixedLeadId?: string;
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  async function onFinish(values: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    const fd = toFormData({
      ...values,
      leadId: fixedLeadId ?? values.leadId,
      // Server nhận chuỗi giờ địa phương "YYYY-MM-DDTHH:mm"
      scheduledAt: dayjs(values.scheduledAt as dayjs.Dayjs).format(
        "YYYY-MM-DDTHH:mm",
      ),
    });

    const result = appointment
      ? await updateAppointment(appointment.id, fd)
      : await createAppointment(fd);

    if (result.ok) {
      message.success(appointment ? "Đã cập nhật lịch hẹn" : "Đã đặt lịch hẹn");
      setOpen(false);
      form.resetFields();
      router.refresh();
    } else {
      setError(result.error);
    }
    setBusy(false);
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>
        {trigger ?? (
          <Button type="primary" icon={<CalendarPlus size={15} />}>
            Đặt lịch hẹn
          </Button>
        )}
      </span>

      <Drawer
        title={appointment ? "Sửa lịch hẹn" : "Đặt lịch hẹn tư vấn"}
        open={open}
        onClose={() => setOpen(false)}
        width={480}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            leadId: appointment?.leadId ?? fixedLeadId,
            consultantId: appointment?.consultantId ?? undefined,
            scheduledAt: appointment
              ? dayjs(appointment.scheduledAt)
              : dayjs().add(1, "day").hour(9).minute(0).second(0),
            durationMinutes: appointment?.durationMinutes ?? 30,
            mode: appointment?.mode ?? "online",
            location: appointment?.location ?? "",
            topic: appointment?.topic ?? "",
          }}
        >
          {error && (
            <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />
          )}

          {!fixedLeadId && (
            <Form.Item
              label="Hồ sơ ứng viên"
              name="leadId"
              rules={[{ required: true, message: "Chọn hồ sơ" }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="— Tìm theo tên, mã hồ sơ hoặc SĐT —"
                options={leads.map((l) => ({ value: l.id, label: l.label }))}
              />
            </Form.Item>
          )}

          <Form.Item label="Tư vấn viên phụ trách" name="consultantId">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="— Chưa phân công —"
              options={consultants.map((c) => ({
                value: c.id,
                label: c.fullName,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Thời gian"
            name="scheduledAt"
            rules={[{ required: true, message: "Chọn thời gian hẹn" }]}
          >
            <DatePicker
              showTime={{ format: "HH:mm", minuteStep: 15 }}
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Thời lượng" name="durationMinutes">
            <Select
              options={[15, 30, 45, 60, 90, 120].map((m) => ({
                value: m,
                label: `${m} phút`,
              }))}
            />
          </Form.Item>

          <Form.Item label="Hình thức" name="mode">
            <Select
              options={(
                Object.keys(APPOINTMENT_MODE_LABELS) as AppointmentMode[]
              ).map((m) => ({ value: m, label: APPOINTMENT_MODE_LABELS[m] }))}
            />
          </Form.Item>

          <Form.Item
            label="Địa điểm / link phòng họp"
            name="location"
            extra="VD: Google Meet link, hoặc địa chỉ văn phòng"
          >
            <Input placeholder="https://meet.google.com/..." />
          </Form.Item>

          <Form.Item label="Nội dung tư vấn" name="topic">
            <Input.TextArea
              rows={3}
              placeholder="VD: Tư vấn chọn ngành và học bổng tại Canada"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={busy} block>
            {appointment ? "Lưu thay đổi" : "Đặt lịch"}
          </Button>
        </Form>
      </Drawer>
    </>
  );
}
