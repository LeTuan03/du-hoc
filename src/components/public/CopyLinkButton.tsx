"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/** Sao chép liên kết bài viết để chia sẻ — người nhận mở link là đọc được */
export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Trình duyệt cũ không hỗ trợ clipboard API — bỏ qua
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 transition hover:border-[#1e4fa3] hover:text-[#1e4fa3]"
      aria-live="polite"
    >
      {copied ? (
        <>
          <Check size={13} className="text-emerald-600" />
          Đã sao chép!
        </>
      ) : (
        <>
          <Link2 size={13} />
          Sao chép liên kết
        </>
      )}
    </button>
  );
}
