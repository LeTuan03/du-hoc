import type { Metadata } from "next";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { ConsultationForm } from "@/components/public/ConsultationForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Đăng ký tư vấn du học miễn phí",
  description:
    "Điền form đăng ký để nhận tư vấn lộ trình du học cá nhân hóa miễn phí từ chuyên gia GlobalEdu — phản hồi trong 24 giờ làm việc.",
  alternates: { canonical: "/dang-ky-tu-van" },
};

const steps = [
  {
    title: "Điền form đăng ký",
    desc: "Cung cấp thông tin cơ bản về học lực và nguyện vọng — chỉ mất 2 phút.",
  },
  {
    title: "Chuyên gia liên hệ trong 24h",
    desc: "Tư vấn viên phụ trách đúng quốc gia bạn quan tâm sẽ gọi điện/Zalo.",
  },
  {
    title: "Nhận lộ trình cá nhân hóa",
    desc: "Danh sách trường, học bổng phù hợp và dự toán chi phí chi tiết.",
  },
  {
    title: "Đồng hành đến khi bay",
    desc: "Hồ sơ, luyện phỏng vấn, visa, chỗ ở — hỗ trợ trọn gói từng bước.",
  },
];

export default function ConsultationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb items={[{ label: "Đăng ký tư vấn" }]} />

      <div className="mt-8 grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="text-sm font-bold uppercase tracking-widest text-[#1e4fa3]">
            Tư vấn miễn phí
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Bắt đầu hành trình du học của bạn
          </h1>
          <p className="mt-3 leading-relaxed text-slate-600">
            Hơn 5.000 học viên đã bắt đầu từ chính form này. Điền thông tin và
            để chuyên gia đồng hành cùng bạn.
          </p>

          <ol className="mt-8 space-y-5">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1e4fa3] text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">{step.title}</h2>
                  <p className="mt-0.5 text-sm text-slate-600">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-2xl bg-[#e8f0fc] p-5">
            <p className="text-sm font-semibold text-slate-700">
              Cần tư vấn ngay? Gọi hotline
            </p>
            <a
              href={siteConfig.hotlineHref}
              className="text-2xl font-extrabold text-[#1e4fa3]"
            >
              {siteConfig.hotline}
            </a>
            <p className="mt-1 text-xs text-slate-500">{siteConfig.workingHours}</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card-hover)] ring-1 ring-slate-100 sm:p-8">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
