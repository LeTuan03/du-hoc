"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";
import type { Testimonial } from "@/server/types";
import { Flag } from "./Flag";

export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => setIndex((next + items.length) % items.length),
    [items.length],
  );

  // Auto-play, dừng khi hover
  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  const start = useCallback(() => {
    stop();
    timer.current = setInterval(() => go(indexRef.current + 1), 6000);
  }, [go]);

  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    start();
    return stop;
  }, [start]);

  const t = items[index];

  return (
    <div
      className="relative"
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      <div className="mx-auto rounded-3xl bg-white p-8 shadow-[var(--shadow-card)] sm:p-10">
        <svg width="40" height="32" viewBox="0 0 40 32" className="text-[#e8f0fc]" fill="currentColor" aria-hidden>
          <path d="M0 32V20.8C0 9.6 6.4 2.4 17.6 0l2.4 4.8C13.6 7.2 10.4 11.2 10 16h8v16H0zm22 0V20.8C22 9.6 28.4 2.4 39.6 0L42 4.8C35.6 7.2 32.4 11.2 32 16h8v16H22z" transform="scale(0.95)" />
        </svg>
        <blockquote key={t.id} className="animate-fade-in">
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            “{t.content}”
          </p>
          <footer className="mt-6 flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#1e4fa3] text-lg font-bold text-white">
              {t.studentName.split(" ").pop()?.[0]}
            </span>
            <div>
              <div className="font-bold text-slate-900">{t.studentName}</div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Flag country={t.countrySlug} className="h-3.5 w-5 rounded-[2px]" />
                {t.program} — {t.universityName} ({t.year})
              </div>
              {t.scholarship && (
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  <Trophy size={11} aria-hidden />
                  {t.scholarship}
                </div>
              )}
            </div>
          </footer>
        </blockquote>
      </div>

      {/* Điều hướng */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Câu chuyện trước"
          className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#1e4fa3] hover:text-[#1e4fa3]"
        >
          ←
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Chọn câu chuyện">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Câu chuyện ${i + 1}`}
              aria-selected={i === index}
              role="tab"
              onClick={() => go(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-7 bg-[#1e4fa3]" : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Câu chuyện tiếp theo"
          className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#1e4fa3] hover:text-[#1e4fa3]"
        >
          →
        </button>
      </div>
    </div>
  );
}
