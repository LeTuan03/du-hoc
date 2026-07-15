import type { Metadata } from "next";
import { countries } from "@/server/data/countries";
import { CountryCard } from "@/components/public/CountryCard";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { SectionHeading } from "@/components/public/SectionHeading";

export const metadata: Metadata = {
  title: "Các quốc gia du học — So sánh chi phí, visa, chính sách định cư",
  description:
    "Khám phá 8 điểm đến du học hàng đầu: Mỹ, Canada, Úc, Anh, Hàn Quốc, Nhật Bản, Singapore, New Zealand. So sánh học phí, chính sách làm thêm và tỷ lệ visa.",
  alternates: { canonical: "/quoc-gia" },
};

export default function CountriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb items={[{ label: "Quốc gia" }]} />
      <div className="mt-8">
        <SectionHeading
          align="left"
          eyebrow="Điểm đến du học"
          title="Chọn quốc gia phù hợp với bạn"
          description="Mỗi quốc gia có thế mạnh riêng về chi phí, chất lượng giáo dục, chính sách làm thêm và cơ hội định cư. Nhấn vào từng quốc gia để xem phân tích chi tiết."
        />
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {countries.map((c) => (
          <CountryCard key={c.slug} country={c} />
        ))}
      </div>
    </div>
  );
}
