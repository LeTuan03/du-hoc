"use client";

import { Card, Form, Input, InputNumber } from "antd";
import type { SiteSettings } from "@/server/repositories/settingRepository";
import { updateSettings } from "@/server/actions/settingActions";
import { AdminForm } from "./formKit";

/** Cấu hình hiển thị ở header/footer/trang liên hệ của website public */
export function SettingsForm({ settings }: { settings: SiteSettings }) {
  return (
    <AdminForm
      action={updateSettings}
      backHref="/admin"
      initialValues={{
        ...settings,
        consultation_response_hours: Number(settings.consultation_response_hours),
      }}
    >
      <Card title="Thông tin liên hệ" style={{ marginBottom: 16 }}>
        <Form.Item
          label="Tên website"
          name="site_name"
          rules={[{ required: true, message: "Nhập tên website" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Hotline"
          name="hotline"
          rules={[{ required: true, message: "Nhập hotline" }]}
        >
          <Input placeholder="1900 6789" />
        </Form.Item>

        <Form.Item
          label="Email tư vấn"
          name="email"
          rules={[
            { required: true, message: "Nhập email" },
            { type: "email", message: "Email không đúng định dạng" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ văn phòng"
          name="address"
          rules={[{ required: true, message: "Nhập địa chỉ" }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Giờ làm việc" name="working_hours">
          <Input placeholder="Thứ 2 - Thứ 7: 8h00 - 17h30" />
        </Form.Item>

        <Form.Item
          label="Cam kết phản hồi trong (giờ)"
          name="consultation_response_hours"
          extra="Hiển thị trong thông điệp sau khi ứng viên gửi form đăng ký"
        >
          <InputNumber min={1} max={168} style={{ width: 140 }} />
        </Form.Item>
      </Card>

      <Card title="Mạng xã hội" style={{ marginBottom: 16 }}>
        <Form.Item label="Facebook" name="facebook_url">
          <Input placeholder="https://facebook.com/..." />
        </Form.Item>
        <Form.Item label="YouTube" name="youtube_url">
          <Input placeholder="https://youtube.com/..." />
        </Form.Item>
        <Form.Item label="Zalo" name="zalo_url">
          <Input placeholder="https://zalo.me/..." />
        </Form.Item>
        <Form.Item label="TikTok" name="tiktok_url">
          <Input placeholder="https://tiktok.com/@..." />
        </Form.Item>
      </Card>

      <Card title="SEO mặc định" style={{ marginBottom: 16 }}>
        <Form.Item
          label="Meta title mặc định"
          name="default_meta_title"
          extra="Dùng cho các trang chưa có meta title riêng"
        >
          <Input showCount maxLength={255} />
        </Form.Item>
        <Form.Item
          label="Meta description mặc định"
          name="default_meta_description"
        >
          <Input.TextArea rows={3} showCount maxLength={500} />
        </Form.Item>
      </Card>
    </AdminForm>
  );
}
