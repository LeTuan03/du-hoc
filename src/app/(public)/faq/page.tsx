import type { Metadata } from "next";
import { faqRepository } from "@/server/repositories/faqRepository";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { SectionHeading } from "@/components/public/SectionHeading";
import { FaqAccordion } from "@/components/public/FaqAccordion";
import { JsonLd } from "@/components/public/JsonLd";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp về du học — Chi phí, visa, học bổng, làm thêm",
  description:
    "Giải đáp các thắc mắc phổ biến nhất: du học cần bao nhiêu tiền, GPA thấp có đi được không, chứng minh tài chính thế nào, làm thêm ra sao.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const globalFaqs = await faqRepository.findAll();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: globalFaqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumb items={[{ label: "Câu hỏi thường gặp" }]} />
        <div className="mt-8">
          <SectionHeading
            align="left"
            eyebrow="Hỗ trợ"
            title="Câu hỏi thường gặp"
            description="Tổng hợp giải đáp từ đội ngũ tư vấn cho những thắc mắc phổ biến nhất của học sinh và phụ huynh."
          />
        </div>
        <div className="mt-10">
          <FaqAccordion items={globalFaqs} />
        </div>

        <div className="mt-12 rounded-2xl bg-[#e8f0fc] p-6 text-center">
          <h2 className="font-bold text-slate-900">
            Chưa tìm thấy câu trả lời?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Đặt câu hỏi trực tiếp cho tư vấn viên — hoàn toàn miễn phí.
          </p>
          <Link
            href="/dang-ky-tu-van"
            className="mt-4 inline-block rounded-lg bg-[#1e4fa3] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#123a7a]"
          >
            Đặt câu hỏi ngay
          </Link>
        </div>
      </div>
    </>
  );
}
