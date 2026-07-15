"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Bọc nội dung để fade-up khi cuộn vào viewport.
 * An toàn: nội dung luôn hiển thị mặc định (SSR/no-JS); chỉ ẩn tạm để
 * animate khi phần tử thực sự nằm DƯỚI viewport lúc mount.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // null = chưa xác định (SSR: hiển thị bình thường, không animate)
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Đã trong viewport lúc mount → hiển thị ngay, không animate
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      setVisible(true);
      return;
    }

    // Nằm dưới viewport → ẩn và chờ cuộn tới
    setVisible(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden = visible === false;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(24px)" : "translateY(0)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
