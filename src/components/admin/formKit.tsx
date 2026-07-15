"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Form, Space, type FormInstance } from "antd";
import dayjs from "dayjs";
import type { ActionResult } from "@/server/actions/util";

/**
 * Chuyển values của antd Form → FormData cho server actions hiện có:
 * boolean → "on"/"" (checkbox), Dayjs → yyyy-mm-dd, mảng/object → JSON.
 */
export function toFormData(values: Record<string, unknown>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) {
      fd.set(key, "");
    } else if (typeof value === "boolean") {
      fd.set(key, value ? "on" : "");
    } else if (dayjs.isDayjs(value)) {
      fd.set(key, value.format("YYYY-MM-DD"));
    } else if (Array.isArray(value) || typeof value === "object") {
      fd.set(key, JSON.stringify(value));
    } else {
      fd.set(key, String(value));
    }
  }
  return fd;
}

/**
 * Form wrapper antd: submit → server action → về trang danh sách.
 * Lỗi validate server/slug trùng hiển thị ở đầu form.
 */
export function AdminForm({
  action,
  backHref,
  form,
  initialValues,
  onValuesChange,
  children,
}: {
  action: (fd: FormData) => Promise<ActionResult>;
  backHref: string;
  form?: FormInstance;
  initialValues?: Record<string, unknown>;
  onValuesChange?: (changed: Record<string, unknown>) => void;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onFinish(values: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    let result: ActionResult;
    try {
      result = await action(toFormData(values));
    } catch {
      // Mất kết nối / server restart giữa chừng — không để nút Lưu kẹt spinner
      result = { ok: false, error: "Không thể kết nối máy chủ, vui lòng thử lại" };
    }
    if (result.ok) {
      router.push(backHref);
      router.refresh();
    } else {
      setError(result.error);
      setBusy(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      scrollToFirstError
    >
      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          style={{ marginBottom: 16 }}
        />
      )}
      {children}
      <Space style={{ marginTop: 8 }}>
        <Button type="primary" htmlType="submit" loading={busy}>
          Lưu
        </Button>
        <Button onClick={() => router.push(backHref)}>Hủy</Button>
      </Space>
    </Form>
  );
}
