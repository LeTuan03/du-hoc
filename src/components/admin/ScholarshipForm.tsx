"use client";

import { Card, Checkbox, Col, DatePicker, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import type { Scholarship } from "@/server/types";
import {
  createScholarship,
  updateScholarship,
} from "@/server/actions/scholarshipActions";
import { slugify } from "@/lib/slugify";
import { AdminForm } from "./formKit";

export function ScholarshipForm({
  scholarship,
  countries,
  universities,
}: {
  scholarship?: Scholarship;
  countries: { name: string; slug: string }[];
  universities: { name: string; slug: string }[];
}) {
  const [form] = Form.useForm();
  const isEdit = Boolean(scholarship);
  const slug = Form.useWatch("slug", form) ?? "";

  const action = scholarship
    ? updateScholarship.bind(null, scholarship.id)
    : createScholarship;

  return (
    <AdminForm
      action={action}
      backHref="/admin/scholarships"
      form={form}
      initialValues={{
        name: scholarship?.name ?? "",
        slug: scholarship?.slug ?? "",
        // undefined (không phải "") để antd Select hiển thị placeholder
        countrySlug: scholarship?.countrySlug ?? undefined,
        universitySlug: scholarship?.universitySlug ?? undefined,
        value: scholarship?.value ?? "",
        deadline: scholarship ? dayjs(scholarship.deadline) : undefined,
        conditions: scholarship?.conditions.join("\n") ?? "",
        description: scholarship?.description ?? "",
        isActive: scholarship?.isActive ?? true,
      }}
      onValuesChange={(changed) => {
        if ("name" in changed && !isEdit && !form.isFieldTouched("slug")) {
          form.setFieldValue("slug", slugify(String(changed.name ?? "")));
        }
      }}
    >
      <Card style={{ marginBottom: 16 }}>
        <Form.Item
          label="Tên học bổng"
          name="name"
          rules={[{ required: true, message: "Nhập tên học bổng" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          extra={`URL: /hoc-bong/${slug || "..."}`}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Quốc gia (tùy chọn)" name="countrySlug">
              <Select
                allowClear
                placeholder="— Không gắn quốc gia —"
                options={countries.map((c) => ({
                  value: c.slug,
                  label: c.name,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Trường (tùy chọn)" name="universitySlug">
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="— Không gắn trường —"
                options={universities.map((u) => ({
                  value: u.slug,
                  label: u.name,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Giá trị học bổng"
              name="value"
              extra='VD: "100% học phí + sinh hoạt phí"'
              rules={[{ required: true, message: "Nhập giá trị học bổng" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Hạn nộp"
              name="deadline"
              rules={[{ required: true, message: "Chọn hạn nộp" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Điều kiện (mỗi dòng một điều kiện)"
          name="conditions"
          rules={[{ required: true, message: "Nhập điều kiện" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Nhập mô tả" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Đang mở đơn (hiển thị trên website)</Checkbox>
        </Form.Item>
      </Card>
    </AdminForm>
  );
}
