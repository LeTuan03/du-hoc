import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-[#1e4fa3] focus:shadow-lg"
      >
        Bỏ qua điều hướng
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />

      {/* Nút liên hệ nổi trên mobile */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 lg:hidden">
        <a
          href={siteConfig.hotlineHref}
          aria-label="Gọi hotline"
          className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-xl text-white shadow-lg"
        >
          📞
        </a>
        <Link
          href="/dang-ky-tu-van"
          aria-label="Đăng ký tư vấn"
          className="grid h-12 w-12 place-items-center rounded-full bg-[#f5c451] text-xl shadow-lg"
        >
          ✏️
        </Link>
      </div>
    </>
  );
}
