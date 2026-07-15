"use client";

import { useId, useState } from "react";

export interface TabItem {
  label: string;
  content: React.ReactNode;
}

export function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();

  return (
    <div>
      <div
        role="tablist"
        aria-label="Nội dung chi tiết"
        className="flex gap-1 overflow-x-auto border-b border-slate-200 scrollbar-hide"
      >
        {items.map((item, i) => (
          <button
            key={i}
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${baseId}-panel-${i}`}
            onClick={() => setActive(i)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              active === i
                ? "border-[#1e4fa3] text-[#1e4fa3]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={active !== i}
          className="pt-6"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
