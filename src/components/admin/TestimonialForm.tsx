"use client";

import { Card, Col, Form, Input, InputNumber, Row, Select } from "antd";
import type { Testimonial } from "@/server/types";
import {
  createTestimonial,
  updateTestimonial,
} from "@/server/actions/testimonialActions";
import { AdminForm } from "./formKit";

export function TestimonialForm({
  testimonial,
  countries,
}: {
  testimonial?: Testimonial;
  countries: { name: string; slug: string }[];
}) {
  const action = testimonial
    ? updateTestimonial.bind(null, testimonial.id)
    : createTestimonial;

  return (
    <AdminForm
      action={action}
      backHref="/admin/testimonials"
      initialValues={{
        studentName: testimonial?.studentName ?? "",
        universityName: testimonial?.universityName ?? "",
        countrySlug: testimonial?.countrySlug,
        program: testimonial?.program ?? "",
        content: testimonial?.content ?? "",
        scholarship: testimonial?.scholarship ?? "",
        year: testimonial?.year ?? new Date().getFullYear(),
      }}
    >
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tên học viên"
              name="studentName"
              rules={[{ required: true, message: "Nhập tên học viên" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Trường theo học"
              name="universityName"
              rules={[{ required: true, message: "Nhập tên trường" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Quốc gia"
              name="countrySlug"
              rules={[{ required: true, message: "Chọn quốc gia" }]}
            >
              <Select
                placeholder="— Chọn quốc gia —"
                options={countries.map((c) => ({
                  value: c.slug,
                  label: c.name,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Chương trình học"
              name="program"
              rules={[{ required: true, message: "Nhập chương trình học" }]}
            >
              <Input placeholder="VD: Cử nhân Khoa học Máy tính" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Năm" name="year">
              <InputNumber min={2000} max={2100} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Nội dung chia sẻ"
          name="content"
          rules={[{ required: true, message: "Nhập nội dung chia sẻ" }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>

        <Form.Item label="Học bổng đạt được (tùy chọn)" name="scholarship">
          <Input placeholder="VD: Học bổng 50% học phí" />
        </Form.Item>
      </Card>
    </AdminForm>
  );
}
