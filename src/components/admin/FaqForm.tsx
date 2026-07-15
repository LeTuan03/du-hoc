"use client";

import { Card, Form, Input, InputNumber } from "antd";
import type { FaqRecord } from "@/server/types";
import { createFaq, updateFaq } from "@/server/actions/faqActions";
import { AdminForm } from "./formKit";

export function FaqForm({ faq }: { faq?: FaqRecord }) {
  const action = faq ? updateFaq.bind(null, faq.id) : createFaq;

  return (
    <AdminForm
      action={action}
      backHref="/admin/faqs"
      initialValues={{
        question: faq?.question ?? "",
        answer: faq?.answer ?? "",
        displayOrder: faq?.displayOrder ?? 0,
      }}
    >
      <Card style={{ marginBottom: 16 }}>
        <Form.Item
          label="Câu hỏi"
          name="question"
          rules={[{ required: true, message: "Nhập câu hỏi" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Câu trả lời"
          name="answer"
          rules={[{ required: true, message: "Nhập câu trả lời" }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>

        <Form.Item
          label="Thứ tự hiển thị"
          name="displayOrder"
          extra="Số nhỏ hiển thị trước"
        >
          <InputNumber min={0} />
        </Form.Item>
      </Card>
    </AdminForm>
  );
}
