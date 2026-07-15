"use client";

import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import { Plus, Trash2 } from "lucide-react";
import {
  PROGRAM_LEVEL_LABELS,
  type University,
} from "@/server/types";
import {
  createUniversity,
  updateUniversity,
} from "@/server/actions/universityActions";
import { slugify } from "@/lib/slugify";
import { AdminForm } from "./formKit";

const levelOptions = Object.entries(PROGRAM_LEVEL_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export function UniversityForm({
  university,
  countries,
}: {
  university?: University;
  countries: { name: string; slug: string }[];
}) {
  const [form] = Form.useForm();
  const isEdit = Boolean(university);
  const slug = Form.useWatch("slug", form) ?? "";

  const action = university
    ? updateUniversity.bind(null, university.id)
    : createUniversity;

  return (
    <AdminForm
      action={action}
      backHref="/admin/universities"
      form={form}
      initialValues={{
        name: university?.name ?? "",
        slug: university?.slug ?? "",
        countrySlug: university?.countrySlug,
        city: university?.city ?? "",
        ranking: university?.ranking ?? undefined,
        rankingSource: university?.rankingSource ?? "QS World 2026",
        tuitionMin: university?.tuitionMin ?? 0,
        tuitionMax: university?.tuitionMax ?? 0,
        description: university?.description ?? "",
        isFeatured: university?.isFeatured ?? false,
        admissionRequirements:
          university?.admissionRequirements.join("\n") ?? "",
        englishRequirements: university?.englishRequirements ?? "",
        livingCost: university?.livingCost ?? "",
        dormitoryInfo: university?.dormitoryInfo ?? "",
        majors: university?.majors.join("\n") ?? "",
        programs: university?.programs ?? [],
        faqs: university?.faqs ?? [],
      }}
      onValuesChange={(changed) => {
        if ("name" in changed && !isEdit && !form.isFieldTouched("slug")) {
          form.setFieldValue("slug", slugify(String(changed.name ?? "")));
        }
      }}
    >
      <Card title="Thông tin chung" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tên trường"
              name="name"
              rules={[{ required: true, message: "Nhập tên trường" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Slug"
              name="slug"
              extra={`URL: /truong/${slug || "..."}`}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12}>
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: "Nhập thành phố" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Xếp hạng (để trống nếu không có)"
              name="ranking"
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Nguồn xếp hạng" name="rankingSource">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Học phí tối thiểu (USD/năm)"
              name="tuitionMin"
              rules={[{ required: true, message: "Nhập học phí tối thiểu" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Học phí tối đa (USD/năm)"
              name="tuitionMax"
              rules={[{ required: true, message: "Nhập học phí tối đa" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Giới thiệu (HTML)"
          name="description"
          rules={[{ required: true, message: "Nhập giới thiệu" }]}
        >
          <Input.TextArea rows={6} className="font-mono text-xs" />
        </Form.Item>

        <Form.Item name="isFeatured" valuePropName="checked">
          <Checkbox>Trường nổi bật (hiển thị trang chủ)</Checkbox>
        </Form.Item>
      </Card>

      <Card title="Tuyển sinh & sinh hoạt" style={{ marginBottom: 16 }}>
        <Form.Item
          label="Điều kiện tuyển sinh (mỗi dòng một mục)"
          name="admissionRequirements"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Yêu cầu tiếng Anh"
          name="englishRequirements"
          rules={[{ required: true, message: "Nhập yêu cầu tiếng Anh" }]}
        >
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Chi phí sinh hoạt"
              name="livingCost"
              rules={[{ required: true, message: "Nhập chi phí sinh hoạt" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Thông tin ký túc xá" name="dormitoryInfo">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Chuyên ngành (mỗi dòng một ngành)" name="majors">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Card>

      <Card title="Chương trình đào tạo" style={{ marginBottom: 16 }}>
        <Form.List name="programs">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Row gutter={8} key={key} align="middle">
                  <Col flex="auto">
                    <Form.Item
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Nhập tên chương trình" }]}
                    >
                      <Input placeholder="Tên chương trình" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item name={[name, "level"]} initialValue="dai-hoc">
                      <Select options={levelOptions} style={{ width: 140 }} />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name={[name, "durationMonths"]}
                      initialValue={48}
                      rules={[{ required: true, message: "Nhập số tháng" }]}
                    >
                      <InputNumber
                        min={1}
                        max={120}
                        style={{ width: 90 }}
                        placeholder="Tháng"
                        title="Thời lượng (tháng)"
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      name={[name, "tuitionPerYear"]}
                      initialValue={0}
                      rules={[{ required: true, message: "Nhập học phí" }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: 120 }}
                        placeholder="USD/năm"
                        title="Học phí/năm (USD)"
                      />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item>
                      <Button
                        danger
                        icon={<Trash2 size={13} />}
                        onClick={() => remove(name)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ))}
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="dashed"
                  block
                  icon={<Plus size={14} />}
                  onClick={() => add()}
                >
                  Thêm chương trình
                </Button>
                <span className="text-xs text-slate-400">
                  Cột: tên · bậc học · thời lượng (tháng) · học phí/năm (USD)
                </span>
              </Space>
            </>
          )}
        </Form.List>
      </Card>

      <Card
        title="FAQ của trường"
        style={{ marginBottom: 16 }}
        extra={
          <span className="text-xs text-slate-400">
            Hiển thị ở trang chi tiết trường
          </span>
        }
      >
        <Form.List name="faqs">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div
                  key={key}
                  className="mb-3 rounded-xl border border-slate-200 p-3"
                >
                  <Row gutter={8}>
                    <Col flex="auto">
                      <Form.Item
                        name={[name, "question"]}
                        rules={[{ required: true, message: "Nhập câu hỏi" }]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="Câu hỏi" />
                      </Form.Item>
                      <Form.Item
                        name={[name, "answer"]}
                        rules={[{ required: true, message: "Nhập câu trả lời" }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input.TextArea rows={2} placeholder="Câu trả lời" />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Button
                        danger
                        icon={<Trash2 size={13} />}
                        onClick={() => remove(name)}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
              <Button
                type="dashed"
                block
                icon={<Plus size={14} />}
                onClick={() => add()}
              >
                Thêm câu hỏi
              </Button>
            </>
          )}
        </Form.List>
      </Card>
    </AdminForm>
  );
}
