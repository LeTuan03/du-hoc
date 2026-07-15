import type { Metadata } from "next";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { ConsultationForm } from "@/components/public/ConsultationForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ GlobalEdu — Hotline, địa chỉ văn phòng, email",
  description: `Liên hệ ${siteConfig.name}: hotline ${siteConfig.hotline}, email ${siteConfig.email}. Văn phòng tại ${siteConfig.address}.`,
  alternates: { canonical: "/lien-he" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb items={[{ label: "Liên hệ" }]} />

      <h1 className="mt-8 text-3xl font-extrabold text-slate-900 sm:text-4xl">
        Liên hệ với chúng tôi
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Đội ngũ tư vấn sẵn sàng hỗ trợ bạn qua hotline, email, mạng xã hội hoặc
        trực tiếp tại văn phòng.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          {[
            {
              icon: "📞",
              title: "Hotline",
              content: siteConfig.hotline,
              href: siteConfig.hotlineHref,
              note: siteConfig.workingHours,
            },
            {
              icon: "✉️",
              title: "Email",
              content: siteConfig.email,
              href: `mailto:${siteConfig.email}`,
              note: "Phản hồi trong 24 giờ làm việc",
            },
            {
              icon: "📍",
              title: "Văn phòng TP.HCM",
              content: siteConfig.address,
              note: "Đặt lịch trước để được phục vụ tốt nhất",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#e8f0fc] text-xl">
                {item.icon}
              </span>
              <div>
                <h2 className="font-bold text-slate-900">{item.title}</h2>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-0.5 block font-semibold text-[#1e4fa3] hover:underline"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="mt-0.5 font-semibold text-slate-700">
                    {item.content}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">{item.note}</p>
              </div>
            </div>
          ))}

          {/* Bản đồ placeholder */}
          <div className="grid h-64 place-items-center rounded-2xl bg-slate-100 text-slate-400">
            <div className="text-center">
              <p className="text-3xl" aria-hidden>
                🗺️
              </p>
              <p className="mt-2 text-sm font-medium">
                Bản đồ văn phòng (nhúng Google Maps khi có địa chỉ chính thức)
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card-hover)] ring-1 ring-slate-100 sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-900">
            Gửi yêu cầu tư vấn
          </h2>
          <div className="mt-5">
            <ConsultationForm compact />
          </div>
        </div>
      </div>
    </div>
  );
}
