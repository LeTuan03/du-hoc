"use client";

import dynamic from "next/dynamic";

/** CKEditor chỉ chạy client-side — tắt SSR */
const CKEditorInner = dynamic(() => import("./CKEditorInner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-80 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-400">
      Đang tải trình soạn thảo...
    </div>
  ),
});

/** Tương thích Form.Item của antd qua cặp value/onChange */
export function RichTextEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  return <CKEditorInner value={value ?? ""} onChange={onChange ?? (() => {})} />;
}
