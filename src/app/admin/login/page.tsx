"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Card, Form, Input } from "antd";
import { Lock, Mail } from "lucide-react";

interface LoginValues {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onFinish(values: LoginValues) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(json.message || "Đăng nhập thất bại");
        setLoading(false);
      }
    } catch {
      setError("Không thể kết nối máy chủ");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-[#1e4fa3] text-2xl font-extrabold text-white">
            G
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            GlobalEdu Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Đăng nhập để quản lý leads và nội dung
          </p>
        </div>

        <Card className="mt-8" styles={{ body: { padding: 24 } }}>
          <Form<LoginValues> layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không đúng định dạng" },
              ]}
            >
              <Input
                prefix={<Mail size={14} className="text-slate-400" />}
                placeholder="admin@duhoc.edu.vn"
                autoComplete="username"
              />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                prefix={<Lock size={14} className="text-slate-400" />}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Form.Item>

            {error && (
              <Form.Item>
                <Alert type="error" message={error} showIcon />
              </Form.Item>
            )}

            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>

            <p className="mt-4 text-center text-xs text-slate-400">
              Mặc định (dev): admin@duhoc.edu.vn / Admin@123456
            </p>
          </Form>
        </Card>
      </div>
    </div>
  );
}
