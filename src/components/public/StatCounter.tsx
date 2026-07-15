"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Số liệu thống kê với hiệu ứng đếm tăng dần khi vào viewport (SRS 8.2).
 * SSR render sẵn giá trị cuối để không mất nội dung khi JS chưa chạy.
 */
export function StatCounter({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Tách phần số và hậu tố (vd: "5.000+" → 5000 và "+")
    const numeric = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
    if (Number.isNaN(numeric)) return;
    const suffix = /[+%]$/.test(value) ? value.slice(-1) : "";
    const useDots = value.includes(".");

    const format = (n: number) =>
      (useDots ? n.toLocaleString("de-DE") : String(n)) + suffix;

    const animate = () => {
      if (started.current) return;
      started.current = true;
      const duration = 1600;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(format(Math.round(numeric * eased)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    // Đã trong viewport → animate ngay; chưa → chờ cuộn tới
    if (el.getBoundingClientRect().top < window.innerHeight) {
      animate();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-extrabold text-[#1e4fa3] sm:text-4xl">
        {display}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-600">{label}</div>
    </div>
  );
}
