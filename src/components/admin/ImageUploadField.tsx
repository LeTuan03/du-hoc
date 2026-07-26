"use client";

import { FileUploadField } from "./FileUploadField";

/** Biến thể ảnh của FileUploadField — giữ tên cũ cho các form nội dung đang dùng */
export function ImageUploadField(props: {
  value?: string | null;
  onChange?: (value: string) => void;
}) {
  return <FileUploadField {...props} />;
}
