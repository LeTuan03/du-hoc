"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";
import { RotateCcw } from "lucide-react";

/**
 * Thanh lọc dùng chung, đẩy trạng thái lên query string để URL chia sẻ được
 * và server component tự đọc bộ lọc (không cần state client).
 */

export interface FilterField {
  /** Tên tham số trên query string */
  name: string;
  type: "search" | "select" | "dateRange";
  placeholder: string;
  options?: { value: string; label: string }[];
  width?: number;
}

export function FilterBar({
  basePath,
  fields,
}: {
  basePath: string;
  fields: FilterField[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = useCallback(
    (patch: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      const query = params.toString();
      router.push(query ? `${basePath}?${query}` : basePath);
    },
    [basePath, router, searchParams],
  );

  const hasFilter = fields.some((f) =>
    f.type === "dateRange"
      ? searchParams.get(`${f.name}_tu`) || searchParams.get(`${f.name}_den`)
      : searchParams.get(f.name),
  );

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      {fields.map((field) => {
        if (field.type === "search") {
          return (
            <Input.Search
              key={field.name}
              allowClear
              placeholder={field.placeholder}
              defaultValue={searchParams.get(field.name) ?? ""}
              onSearch={(v) => update({ [field.name]: v || undefined })}
              style={{ maxWidth: field.width ?? 260 }}
            />
          );
        }

        if (field.type === "dateRange") {
          const from = searchParams.get(`${field.name}_tu`);
          const to = searchParams.get(`${field.name}_den`);
          return (
            <DatePicker.RangePicker
              key={field.name}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              value={from && to ? [dayjs(from), dayjs(to)] : null}
              onChange={(range) =>
                update({
                  [`${field.name}_tu`]: range?.[0]?.format("YYYY-MM-DD"),
                  [`${field.name}_den`]: range?.[1]?.format("YYYY-MM-DD"),
                })
              }
            />
          );
        }

        return (
          <Select
            key={field.name}
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder={field.placeholder}
            value={searchParams.get(field.name) || undefined}
            onChange={(v) => update({ [field.name]: v })}
            options={field.options ?? []}
            style={{ minWidth: field.width ?? 170 }}
          />
        );
      })}

      {hasFilter && (
        <Button
          type="text"
          icon={<RotateCcw size={14} />}
          onClick={() => router.push(basePath)}
        >
          Xóa lọc
        </Button>
      )}
    </div>
  );
}
