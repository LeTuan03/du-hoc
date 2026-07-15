"use client";

import { Card, Col, Form, Input, InputNumber, Row } from "antd";
import type { Country } from "@/server/types";
import { createCountry, updateCountry } from "@/server/actions/countryActions";
import { slugify } from "@/lib/slugify";
import { AdminForm } from "./formKit";

export function CountryForm({ country }: { country?: Country }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(country);
  const slug = Form.useWatch("slug", form) ?? "";

  const action = country
    ? updateCountry.bind(null, country.id)
    : createCountry;

  return (
    <AdminForm
      action={action}
      backHref="/admin/countries"
      form={form}
      initialValues={{
        name: country?.name ?? "",
        slug: country?.slug ?? "",
        description: country?.description ?? "",
        highlights: country?.highlights.join("\n") ?? "",
        universityCount: country?.universityCount ?? 0,
        avgTuition: country?.avgTuition ?? "",
        workRights: country?.workRights ?? "",
        visaRate: country?.visaRate ?? "",
        displayOrder: country?.displayOrder ?? 0,
      }}
      onValuesChange={(changed) => {
        if ("name" in changed && !isEdit && !form.isFieldTouched("slug")) {
          form.setFieldValue("slug", slugify(String(changed.name ?? "")));
        }
      }}
    >
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tên quốc gia"
              name="name"
              rules={[{ required: true, message: "Nhập tên quốc gia" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Slug"
              name="slug"
              extra={`URL: /quoc-gia/${slug || "..."}`}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Nhập mô tả" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Điểm nổi bật (mỗi dòng một mục)"
          name="highlights"
          rules={[{ required: true, message: "Nhập điểm nổi bật" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Số trường đối tác" name="universityCount">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Học phí trung bình"
              name="avgTuition"
              rules={[{ required: true, message: "Nhập học phí trung bình" }]}
            >
              <Input placeholder="VD: 25.000 - 60.000 USD/năm" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Quyền làm thêm"
              name="workRights"
              rules={[{ required: true, message: "Nhập quyền làm thêm" }]}
            >
              <Input placeholder="VD: 20h/tuần trong kỳ học" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Tỷ lệ đậu visa"
              name="visaRate"
              rules={[{ required: true, message: "Nhập tỷ lệ visa" }]}
            >
              <Input placeholder="VD: 95%" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Thứ tự hiển thị" name="displayOrder">
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </AdminForm>
  );
}
