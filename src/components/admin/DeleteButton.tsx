"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { App, Button, Popconfirm } from "antd";
import { Trash2 } from "lucide-react";
import type { ActionResult } from "@/server/actions/util";

/** Nút xóa dùng chung: Popconfirm → server action → refresh (hoặc chuyển trang) */
export function DeleteButton({
  action,
  confirmMessage,
  redirectTo,
  label = "Xóa",
}: {
  action: () => Promise<ActionResult>;
  confirmMessage: string;
  /** Nếu có: chuyển tới trang này sau khi xóa (dùng ở trang chi tiết) */
  redirectTo?: string;
  label?: string;
}) {
  const router = useRouter();
  const { message } = App.useApp();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    setBusy(true);
    const result = await action();
    if (result.ok) {
      message.success("Đã xóa");
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } else {
      message.error(result.error);
      setBusy(false);
    }
  }

  return (
    <Popconfirm
      title={confirmMessage}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
      onConfirm={handleDelete}
    >
      <Button danger size="small" icon={<Trash2 size={13} />} loading={busy}>
        {label}
      </Button>
    </Popconfirm>
  );
}
