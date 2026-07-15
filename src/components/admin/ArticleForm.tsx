"use client";

import { Card, Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd";
import dayjs from "dayjs";
import { ARTICLE_CATEGORY_LABELS, type Article } from "@/server/types";
import { createArticle, updateArticle } from "@/server/actions/articleActions";
import { slugify } from "@/lib/slugify";
import { AdminForm } from "./formKit";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUploadField } from "./ImageUploadField";

/** Form tạo/sửa bài viết — CKEditor + upload ảnh bìa + nhóm trường SEO */
export function ArticleForm({ article }: { article?: Article }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(article);

  const action = article
    ? updateArticle.bind(null, article.id)
    : createArticle;

  const metaTitle = Form.useWatch("metaTitle", form) ?? "";
  const metaDescription = Form.useWatch("metaDescription", form) ?? "";
  const slug = Form.useWatch("slug", form) ?? "";

  const counter = (len: number, max: number) => (
    <span className={len > max ? "text-red-600" : "text-slate-400"}>
      {len}/{max} ký tự
    </span>
  );

  return (
    <AdminForm
      action={action}
      backHref="/admin/articles"
      form={form}
      initialValues={{
        title: article?.title ?? "",
        slug: article?.slug ?? "",
        category: article?.category ?? "tuyen-sinh",
        publishedAt: article ? dayjs(article.publishedAt) : dayjs(),
        readMinutes: article?.readMinutes ?? 5,
        author: article?.author ?? "",
        excerpt: article?.excerpt ?? "",
        content: article?.content ?? "",
        metaTitle: article?.metaTitle ?? "",
        metaDescription: article?.metaDescription ?? "",
        coverImage: article?.coverImage ?? "",
      }}
      onValuesChange={(changed) => {
        // Auto-sinh slug từ tiêu đề khi tạo mới và slug chưa bị sửa tay
        if ("title" in changed && !isEdit && !form.isFieldTouched("slug")) {
          form.setFieldValue("slug", slugify(String(changed.title ?? "")));
        }
      }}
    >
      <Card title="Nội dung bài viết" style={{ marginBottom: 16 }}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Slug (đường dẫn)"
          name="slug"
          extra={`URL: /tin-tuc/${slug || "..."}`}
        >
          <Input placeholder="tu-dong-tao-tu-tieu-de" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item label="Danh mục" name="category">
              <Select
                options={Object.entries(ARTICLE_CATEGORY_LABELS).map(
                  ([value, label]) => ({ value, label }),
                )}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Ngày đăng"
              name="publishedAt"
              rules={[{ required: true, message: "Chọn ngày đăng" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label="Thời gian đọc (phút)" name="readMinutes">
              <InputNumber min={1} max={120} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Tác giả"
          name="author"
          rules={[{ required: true, message: "Nhập tên tác giả" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả ngắn (excerpt)"
          name="excerpt"
          extra="Hiển thị ở card bài viết và đầu trang chi tiết"
          rules={[{ required: true, message: "Nhập mô tả ngắn" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Nhập nội dung bài viết" }]}
        >
          <RichTextEditor />
        </Form.Item>
      </Card>

      <Card
        title="SEO"
        style={{ marginBottom: 16 }}
        extra={
          <span className="text-xs text-slate-400">
            Bỏ trống sẽ dùng tiêu đề/mô tả ngắn
          </span>
        }
      >
        <Form.Item
          label="Meta title"
          name="metaTitle"
          extra={counter(metaTitle.length, 60)}
        >
          <Input placeholder="Tiêu đề hiển thị trên Google (≤ 60 ký tự)" />
        </Form.Item>

        <Form.Item
          label="Meta description"
          name="metaDescription"
          extra={counter(metaDescription.length, 160)}
        >
          <Input.TextArea
            rows={2}
            placeholder="Mô tả hiển thị dưới tiêu đề trên Google (≤ 160 ký tự)"
          />
        </Form.Item>

        <Form.Item label="Ảnh bìa / OG image" name="coverImage">
          <ImageUploadField />
        </Form.Item>
      </Card>
    </AdminForm>
  );
}
