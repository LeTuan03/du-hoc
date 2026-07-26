"use client";

import { Card, Form, Input, Radio, Select } from "antd";
import { USER_ROLE_LABELS, type User, type UserRole } from "@/server/types";
import { createUser, updateUser } from "@/server/actions/userActions";
import { AdminForm } from "./formKit";

const roleHints: Record<UserRole, string> = {
  super_admin: "Toàn quyền, bao gồm quản lý tài khoản và ép đổi trạng thái hồ sơ",
  admin: "Quản lý nội dung, xem toàn bộ hồ sơ, giao việc và xuất báo cáo",
  consultant: "Chỉ xem và chăm sóc hồ sơ được giao cho mình",
};

export function UserForm({ user }: { user?: User }) {
  const action = user ? updateUser.bind(null, user.id) : createUser;

  return (
    <AdminForm
      action={action}
      backHref="/admin/users"
      initialValues={{
        fullName: user?.fullName ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        role: user?.role ?? "consultant",
        status: user?.status ?? "active",
        password: "",
      }}
    >
      <Card style={{ marginBottom: 16 }}>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Nhập họ tên" }]}
        >
          <Input placeholder="Nguyễn Thị Tư Vấn" />
        </Form.Item>

        <Form.Item
          label="Email đăng nhập"
          name="email"
          rules={[
            { required: true, message: "Nhập email" },
            { type: "email", message: "Email không đúng định dạng" },
          ]}
        >
          <Input placeholder="tuvan@globaledu.edu.vn" />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone">
          <Input placeholder="0912345678" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          extra={
            user
              ? "Để trống nếu không muốn đổi mật khẩu hiện tại"
              : "Tối thiểu 8 ký tự, gồm cả chữ và số"
          }
          rules={
            user
              ? []
              : [{ required: true, message: "Nhập mật khẩu cho tài khoản mới" }]
          }
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Card>

      <Card title="Vai trò & trạng thái" style={{ marginBottom: 16 }}>
        <Form.Item label="Vai trò" name="role">
          <Select
            options={(Object.keys(USER_ROLE_LABELS) as UserRole[]).map((r) => ({
              value: r,
              label: USER_ROLE_LABELS[r],
            }))}
          />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prev, next) => prev.role !== next.role}>
          {({ getFieldValue }) => (
            <p className="mb-5 -mt-3 text-xs text-slate-500">
              {roleHints[(getFieldValue("role") ?? "consultant") as UserRole]}
            </p>
          )}
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Radio.Group
            options={[
              { value: "active", label: "Đang hoạt động" },
              { value: "inactive", label: "Ngưng hoạt động" },
            ]}
            optionType="button"
          />
        </Form.Item>
      </Card>
    </AdminForm>
  );
}
