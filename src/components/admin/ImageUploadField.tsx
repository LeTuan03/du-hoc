"use client";

import { App, Button, Upload } from "antd";
import { ImagePlus, Trash2 } from "lucide-react";

/**
 * Upload ảnh lên /api/v1/uploads (Supabase Storage; dev chưa cấu hình
 * Supabase thì lưu public/uploads) — value là URL ảnh, tương thích Form.Item antd.
 */
export function ImageUploadField({
  value,
  onChange,
}: {
  value?: string | null;
  onChange?: (value: string) => void;
}) {
  const { message } = App.useApp();

  return (
    <div>
      {value && (
        <img
          src={value}
          alt="Ảnh đã chọn"
          className="mb-3 max-h-48 rounded-xl border border-slate-200 object-cover"
        />
      )}
      <div className="flex items-center gap-2">
        <Upload
          name="upload"
          action="/api/v1/uploads"
          accept="image/jpeg,image/png,image/webp,image/gif"
          showUploadList={false}
          maxCount={1}
          onChange={(info) => {
            if (info.file.status === "done") {
              const url = info.file.response?.url as string | undefined;
              if (url) {
                onChange?.(url);
                message.success("Đã tải ảnh lên");
              }
            } else if (info.file.status === "error") {
              message.error(
                info.file.response?.error?.message || "Tải ảnh thất bại",
              );
            }
          }}
        >
          <Button icon={<ImagePlus size={14} />}>
            {value ? "Đổi ảnh" : "Tải ảnh lên"}
          </Button>
        </Upload>
        {value && (
          <Button
            icon={<Trash2 size={14} />}
            onClick={() => onChange?.("")}
            danger
          >
            Bỏ ảnh
          </Button>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-400">
        JPG/PNG/WebP tối đa 5MB — khuyến nghị 1200×630 cho ảnh chia sẻ mạng
        xã hội.
      </p>
    </div>
  );
}
