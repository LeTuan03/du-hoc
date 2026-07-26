"use client";

import { Card, Checkbox, Form, Input, InputNumber, Select } from "antd";
import {
  PROGRAM_LEVEL_LABELS,
  type Program,
  type ProgramLevel,
} from "@/server/types";
import { createProgram, updateProgram } from "@/server/actions/programActions";
import { AdminForm } from "./formKit";

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Tháng ${i + 1}`,
}));

export function ProgramForm({
  program,
  universities,
  defaultUniversity,
}: {
  program?: Program;
  universities: { name: string; slug: string }[];
  defaultUniversity?: string;
}) {
  const action = program ? updateProgram.bind(null, program.id) : createProgram;

  return (
    <AdminForm
      action={action}
      backHref="/admin/programs"
      initialValues={{
        universitySlug: program?.universitySlug ?? defaultUniversity ?? undefined,
        name: program?.name ?? "",
        level: program?.level ?? "dai-hoc",
        durationMonths: program?.durationMonths ?? 48,
        tuitionPerYear: program?.tuitionPerYear ?? 0,
        description: program?.description ?? "",
        intakeMonths: program?.intakeMonths ?? [],
        isActive: program?.isActive ?? true,
      }}
    >
      <Card style={{ marginBottom: 16 }}>
        <Form.Item
          label="Trường"
          name="universitySlug"
          rules={[{ required: true, message: "Chọn trường" }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            placeholder="— Chọn trường —"
            options={universities.map((u) => ({ value: u.slug, label: u.name }))}
          />
        </Form.Item>

        <Form.Item
          label="Tên ngành / chương trình"
          name="name"
          rules={[{ required: true, message: "Nhập tên ngành học" }]}
        >
          <Input placeholder="Cử nhân Khoa học Máy tính" />
        </Form.Item>

        <Form.Item label="Bậc học" name="level">
          <Select
            options={(Object.keys(PROGRAM_LEVEL_LABELS) as ProgramLevel[]).map(
              (l) => ({ value: l, label: PROGRAM_LEVEL_LABELS[l] }),
            )}
          />
        </Form.Item>

        <Form.Item
          label="Thời lượng (tháng)"
          name="durationMonths"
          rules={[{ required: true, message: "Nhập thời lượng" }]}
        >
          <InputNumber min={1} max={120} style={{ width: 160 }} />
        </Form.Item>

        <Form.Item
          label="Học phí mỗi năm (USD)"
          name="tuitionPerYear"
          rules={[{ required: true, message: "Nhập học phí" }]}
        >
          <InputNumber<number>
            min={0}
            step={1000}
            style={{ width: 200 }}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => Number((v ?? "").replace(/,/g, ""))}
          />
        </Form.Item>
      </Card>

      <Card title="Chi tiết hiển thị cho ứng viên" style={{ marginBottom: 16 }}>
        <Form.Item
          label="Kỳ nhập học"
          name="intakeMonths"
          extra="Chọn các tháng trường nhận nhập học — hiển thị ở công cụ tra cứu ngành"
        >
          <Checkbox.Group options={MONTHS} />
        </Form.Item>

        <Form.Item label="Mô tả ngành" name="description">
          <Input.TextArea
            rows={4}
            placeholder="Điểm mạnh của ngành, cơ hội việc làm, yêu cầu đầu vào riêng..."
          />
        </Form.Item>

        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Đang tuyển sinh (hiển thị trên website)</Checkbox>
        </Form.Item>
      </Card>
    </AdminForm>
  );
}
