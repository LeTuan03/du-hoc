import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug, getArticles } from "@/server/data/articles";
import { ARTICLE_CATEGORY_LABELS } from "@/server/types";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { ArticleCard } from "@/components/public/ArticleCard";
import { ConsultationForm } from "@/components/public/ConsultationForm";
import { JsonLd } from "@/components/public/JsonLd";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/tin-tuc/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getArticles(article.category)
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          author: { "@type": "Organization", name: article.author },
          publisher: { "@type": "Organization", name: siteConfig.name },
        }}
      />

      <article className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumb
          items={[
            { label: "Tin tức", href: "/tin-tuc" },
            {
              label: ARTICLE_CATEGORY_LABELS[article.category],
              href: `/tin-tuc?danh_muc=${article.category}`,
            },
            { label: article.title },
          ]}
        />

        <header className="mt-8">
          <Link
            href={`/tin-tuc?danh_muc=${article.category}`}
            className="rounded-full bg-[#e8f0fc] px-3 py-1 text-xs font-bold text-[#1e4fa3]"
          >
            {ARTICLE_CATEGORY_LABELS[article.category]}
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {article.excerpt}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-100 pb-6 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{article.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            <span aria-hidden>·</span>
            <span>⏱ {article.readMinutes} phút đọc</span>
          </div>
        </header>

        <div
          className="prose-content mt-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* CTA cuối bài */}
        <div className="mt-12 rounded-3xl bg-[#123a7a] p-6 text-white sm:p-8">
          <h2 className="text-xl font-extrabold">
            Cần tư vấn lộ trình cá nhân hóa?
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            Để lại thông tin — chuyên gia sẽ phân tích hồ sơ và tư vấn miễn phí
            trong 24h.
          </p>
          <div className="mt-6 rounded-2xl bg-white p-5 sm:p-6">
            <ConsultationForm compact />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-slate-50 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Bài viết cùng chủ đề
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
