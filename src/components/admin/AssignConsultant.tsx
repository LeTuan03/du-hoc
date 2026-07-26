"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { App, Select } from "antd";
import { assignLeads } from "@/server/actions/leadActions";

/** Giao hồ sơ cho tư vấn viên — dùng ở trang chi tiết và bulk action */
export function AssignConsultant({
  leadIds,
  currentId,
  consultants,
  size = "middle",
  onDone,
}: {
  leadIds: string[];
  currentId?: string | null;
  consultants: { id: string; fullName: string }[];
  size?: "small" | "middle";
  onDone?: () => void;
}) {
  const router = useRouter();
  const { message } = App.useApp();
  const [busy, setBusy] = useState(false);

  async function handleChange(value: string | undefined) {
    setBusy(true);
    const result = await assignLeads(leadIds, value ?? "");
    if (result.ok) {
      message.success(
        value
          ? `Đã giao ${leadIds.length} hồ sơ`
          : `Đã bỏ giao ${leadIds.length} hồ sơ`,
      );
      onDone?.();
      router.refresh();
    } else {
      message.error(result.error);
    }
    setBusy(false);
  }

  return (
    <Select
      allowClear
      showSearch
      optionFilterProp="label"
      size={size}
      loading={busy}
      disabled={busy || leadIds.length === 0}
      value={currentId ?? undefined}
      onChange={handleChange}
      placeholder="— Chưa giao —"
      style={{ minWidth: 190 }}
      options={consultants.map((c) => ({ value: c.id, label: c.fullName }))}
    />
  );
}
