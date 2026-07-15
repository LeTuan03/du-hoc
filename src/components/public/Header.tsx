"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/quoc-gia", label: "Quốc gia" },
  { href: "/truong", label: "Trường" },
  { href: "/hoc-bong", label: "Học bổng" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/cau-chuyen-hoc-vien", label: "Câu chuyện học viên" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đóng menu mobile khi chuyển trang
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-md" : "border-b border-slate-100"
      }`}
    >
      {/* Top bar */}
      <div className="hidden md:block bg-[#123a7a] text-white text-xs">
        <div className="mx-auto max-w-7xl px-4 py-1.5 flex justify-between items-center">
          <p>🎓 Tư vấn du học miễn phí — Đồng hành từ hồ sơ đến visa</p>
          <a href={siteConfig.hotlineHref} className="font-semibold hover:text-[#f5c451]">
            Hotline: {siteConfig.hotline}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Về trang chủ">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1e4fa3] text-white font-extrabold text-lg">
              G
            </span>
            <span className="leading-tight">
              <span className="block font-extrabold text-[#1e4fa3] text-lg">
                {siteConfig.name}
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-500">
                Du học quốc tế
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Điều hướng chính">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-[#e8f0fc] text-[#1e4fa3]"
                    : "text-slate-700 hover:bg-slate-50 hover:text-[#1e4fa3]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/dang-ky-tu-van"
              className="hidden sm:inline-flex items-center rounded-lg bg-[#f5c451] px-4 py-2.5 text-sm font-bold text-[#123a7a] shadow-sm transition hover:bg-[#d9a92e] hover:shadow"
            >
              Đăng ký tư vấn
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
              className="lg:hidden grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="lg:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2 shadow-lg animate-fade-in"
          aria-label="Menu di động"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive(item.href)
                  ? "bg-[#e8f0fc] text-[#1e4fa3]"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/dang-ky-tu-van"
            className="mt-3 block rounded-lg bg-[#f5c451] px-4 py-3 text-center text-sm font-bold text-[#123a7a]"
          >
            Đăng ký tư vấn miễn phí
          </Link>
        </nav>
      )}
    </header>
  );
}
