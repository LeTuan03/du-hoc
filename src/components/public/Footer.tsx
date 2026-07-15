import Link from "next/link";
import { Clock, Mail, MapPin, Music2, Phone, Play } from "lucide-react";
import { siteConfig } from "@/lib/site";

const quickLinks = [
  { href: "/quoc-gia", label: "Các quốc gia du học" },
  { href: "/truong", label: "Danh sách trường" },
  { href: "/hoc-bong", label: "Học bổng mới nhất" },
  { href: "/tin-tuc", label: "Tin tức du học" },
  { href: "/faq", label: "Câu hỏi thường gặp" },
  { href: "/dang-ky-tu-van", label: "Đăng ký tư vấn" },
];

const policyLinks = [
  { href: "/gioi-thieu", label: "Về chúng tôi" },
  { href: "/cau-chuyen-hoc-vien", label: "Câu chuyện học viên" },
  { href: "/lien-he", label: "Liên hệ" },
  { href: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
  { href: "/dieu-khoan-su-dung", label: "Điều khoản sử dụng" },
];

export function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Về chúng tôi */}
          <div>
            <div className="flex items-center gap-2">
              <img src="/images/logo.svg" alt="Logo" className="grid h-10 w-10 place-items-center" />
              <span className="font-extrabold text-white text-lg">{siteConfig.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              12 năm kinh nghiệm tư vấn du học với hơn 5.000 học viên thành công
              tại 12 quốc gia. Đồng hành trọn vẹn từ định hướng, hồ sơ, học bổng
              đến visa và ổn định cuộc sống.
            </p>
            <div className="mt-4 flex gap-3">
              {[
                { href: siteConfig.facebook, label: "Facebook", icon: "f" },
                { href: siteConfig.youtube, label: "YouTube", icon: <Play size={15} /> },
                { href: siteConfig.tiktok, label: "TikTok", icon: <Music2 size={15} /> },
                { href: siteConfig.zalo, label: "Zalo", icon: "Z" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm font-bold text-white transition hover:bg-[#1e4fa3]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Khám phá
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-[#f5c451]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Công ty */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Công ty
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {policyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-[#f5c451]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Liên hệ
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0" aria-hidden />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex gap-2.5">
                <Phone size={15} className="mt-0.5 shrink-0" aria-hidden />
                <a href={siteConfig.hotlineHref} className="font-semibold text-[#f5c451]">
                  {siteConfig.hotline}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Mail size={15} className="mt-0.5 shrink-0" aria-hidden />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-[#f5c451]">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock size={15} className="mt-0.5 shrink-0" aria-hidden />
                <span>{siteConfig.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {siteConfig.fullName}. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  );
}
