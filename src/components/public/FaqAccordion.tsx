"use client";

import { useState } from "react";
import type { FaqItem } from "@/server/types";

export function FaqAccordion({
  items,
  initialVisible,
}: {
  items: FaqItem[];
  /** Số câu hiển thị ban đầu; còn lại sau nút "Xem thêm" */
  initialVisible?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [expanded, setExpanded] = useState(false);

  const visibleItems =
    initialVisible && !expanded ? items.slice(0, initialVisible) : items;

  return (
    <div>
      <div className="space-y-3">
        {visibleItems.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold text-slate-900">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e8f0fc] text-[#1e4fa3] transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {initialVisible && items.length > initialVisible && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-lg border-2 border-[#1e4fa3] px-6 py-2.5 text-sm font-semibold text-[#1e4fa3] transition hover:bg-[#e8f0fc]"
          >
            {expanded ? "Thu gọn" : `Xem thêm ${items.length - initialVisible} câu hỏi`}
          </button>
        </div>
      )}
    </div>
  );
}
