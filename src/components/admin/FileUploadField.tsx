"use client";

import { App, Button, Upload } from "antd";
import { FileUp, ImagePlus, Paperclip, Trash2 } from "lucide-react";

/**
 * Upload file lên /api/v1/uploads (Supabase Storage; dev chưa cấu hình
 * Supabase thì lưu public/uploads) — value là URL file, tương thích Form.Item antd.
 * Dùng chung cho ảnh nội dung (có preview) và tài liệu hồ sơ (PDF/ảnh scan).
 */
export function FileUploadField({
  value,
  onChange,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  preview = true,
  hint = "JPG/PNG/WebP tối đa 5MB — khuyến nghị 1200×630 cho ảnh chia sẻ mạng xã hội.",
  label = "ảnh",
}: {
  value?: string | null;
  onChange?: (value: string) => void;
  accept?: string;
  /** Hiện ảnh xem trước; tài liệu PDF thì tắt và chỉ hiện link */
  preview?: boolean;
  hint?: string;
  /** Danh từ dùng trong nhãn nút: "ảnh" | "file" */
  label?: string;
}) {
  const { message } = App.useApp();
  const isImage = value ? /\.(jpe?g|png|webp|gif)$/i.test(value) : false;

  return (
    <div>
      {value && preview && isImage && (
        <img
          src={value}
          alt="Ảnh đã chọn"
          className="mb-3 max-h-48 rounded-xl border border-slate-200 object-cover"
        />
      )}
      {value && !(preview && isImage) && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1e4fa3] hover:underline"
        >
          <Paperclip size={14} aria-hidden />
          Xem file đã tải lên
        </a>
      )}

      <div className="flex items-center gap-2">
        <Upload
          name="upload"
          action="/api/v1/uploads"
          accept={accept}
          showUploadList={false}
          maxCount={1}
          onChange={(info) => {
            if (info.file.status === "done") {
              const url = info.file.response?.url as string | undefined;
              if (url) {
                onChange?.(url);
                message.success(`Đã tải ${label} lên`);
              }
            } else if (info.file.status === "error") {
              message.error(
                info.file.response?.error?.message || `Tải ${label} thất bại`,
              );
            }
          }}
        >
          <Button icon={preview ? <ImagePlus size={14} /> : <FileUp size={14} />}>
            {value ? `Đổi ${label}` : `Tải ${label} lên`}
          </Button>
        </Upload>
        {value && (
          <Button icon={<Trash2 size={14} />} onClick={() => onChange?.("")} danger>
            Bỏ {label}
          </Button>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  );
}
