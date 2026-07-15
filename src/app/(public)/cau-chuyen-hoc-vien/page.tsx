import type { Metadata } from "next";
import Link from "next/link";
import { testimonials } from "@/server/data/testimonials";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { SectionHeading } from "@/components/public/SectionHeading";
import { Flag } from "@/components/public/Flag";

export const metadata: Metadata = {
  title: "Câu chuyện học viên — Hành trình du học thành công",
  description:
    "Những câu chuyện thật từ học viên GlobalEdu: đậu học bổng Toronto, Yonsei, Melbourne, NUS... và hành trình chinh phục visa của họ.",
  alternates: { canonical: "/cau-chuyen-hoc-vien" },
};

export default function TestimonialsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb items={[{ label: "Câu chuyện học viên" }]} />
      <div className="mt-8">
        <SectionHeading
          align="left"
          eyebrow="Câu chuyện thành công"
          title="Học viên GlobalEdu trên khắp thế giới"
          description="5.000+ học viên đã bắt đầu hành trình của mình cùng chúng tôi — đây là một vài câu chuyện trong số đó."
        />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="flex flex-col rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-slate-100"
          >
            <blockquote className="flex-1 text-sm leading-relaxed text-slate-700">
              “{t.content}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1e4fa3] font-bold text-white">
                {t.studentName.split(" ").pop()?.[0]}
              </span>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {t.studentName}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Flag country={t.countrySlug} className="h-3 w-[18px] rounded-[2px]" />
                  {t.universityName} · {t.year}
                </div>
                {t.scholarship && (
                  <div className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    🏆 {t.scholarship}
                  </div>
                )}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-14 rounded-3xl bg-[#123a7a] p-8 text-center text-white sm:p-12">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Câu chuyện tiếp theo là của bạn?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-blue-100">
          Đăng ký tư vấn miễn phí — chúng tôi sẽ giúp bạn viết nên hành trình du
          học của riêng mình.
        </p>
        <Link
          href="/dang-ky-tu-van"
          className="mt-6 inline-block rounded-xl bg-[#f5c451] px-8 py-3.5 font-bold text-[#123a7a] shadow-lg transition hover:bg-[#ffd97a]"
        >
          Bắt đầu ngay
        </Link>
      </div>
    </div>
  );
}
