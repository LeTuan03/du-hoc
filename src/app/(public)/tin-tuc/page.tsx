import type { Metadata } from "next";
import Link from "next/link";
import { articleRepository } from "@/server/repositories/articleRepository";
import { ARTICLE_CATEGORY_LABELS } from "@/server/types";
import { ArticleCard } from "@/components/public/ArticleCard";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { SectionHeading } from "@/components/public/SectionHeading";

export const metadata: Metadata = {
  title: "Tin tức & cẩm nang du học — Tuyển sinh, học bổng, visa, kinh nghiệm",
  description:
    "Cập nhật tin tuyển sinh, học bổng mới, chính sách visa và kinh nghiệm thực tế từ du học sinh tại Mỹ, Canada, Úc, Anh, Hàn, Nhật.",
  alternates: { canonical: "/tin-tuc" },
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ danh_muc?: string }>;
}) {
  const { danh_muc } = await searchParams;
  const articles = await articleRepository.findAll(danh_muc);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb items={[{ label: "Tin tức" }]} />
      <div className="mt-8">
        <SectionHeading
          align="left"
          eyebrow="Tin tức & cẩm nang"
          title="Kiến thức du học cập nhật"
          description="Từ lịch tuyển sinh, deadline học bổng đến kinh nghiệm sống — viết bởi đội ngũ tư vấn và cựu du học sinh."
        />
      </div>

      {/* Danh mục */}
      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Danh mục bài viết">
        <Link
          href="/tin-tuc"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            !danh_muc
              ? "bg-[#1e4fa3] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tất cả
        </Link>
        {Object.entries(ARTICLE_CATEGORY_LABELS).map(([slug, label]) => (
          <Link
            key={slug}
            href={`/tin-tuc?danh_muc=${slug}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              danh_muc === slug
                ? "bg-[#1e4fa3] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {articles.length === 0 ? (
        <p className="mt-12 text-center text-slate-500">
          Chưa có bài viết trong danh mục này.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
