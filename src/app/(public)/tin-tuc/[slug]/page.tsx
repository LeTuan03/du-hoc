import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleRepository } from "@/server/repositories/articleRepository";
import { ARTICLE_CATEGORY_LABELS } from "@/server/types";
import { Breadcrumb } from "@/components/public/Breadcrumb";
import { ArticleCard } from "@/components/public/ArticleCard";
import { ConsultationForm } from "@/components/public/ConsultationForm";
import { CopyLinkButton } from "@/components/public/CopyLinkButton";
import { JsonLd } from "@/components/public/JsonLd";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export async function generateStaticParams() {
  const articles = await articleRepository.findAll();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await articleRepository.findBySlug(slug);
  if (!article) return {};
  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/tin-tuc/${article.slug}` },
    openGraph: {
      type: "article",
      url: `/tin-tuc/${article.slug}`,
      title,
      description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      section: ARTICLE_CATEGORY_LABELS[article.category],
      ...(article.coverImage ? { images: [article.coverImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(article.coverImage ? { images: [article.coverImage] } : {}),
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await articleRepository.findBySlug(slug);
  if (!article) notFound();

  const related = (await articleRepository.findAll(article.category))
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  // JSON-LD yêu cầu URL tuyệt đối (metadataBase chỉ áp dụng cho metadata)
  const base = siteConfig.url.replace(/\/$/, "");
  const articleUrl = `${base}/tin-tuc/${article.slug}`;
  let absoluteImage: string | undefined;
  if (article.coverImage) {
    absoluteImage = article.coverImage.startsWith("http")
      ? article.coverImage
      : `${base}${article.coverImage}`;
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
          headline: article.title,
          description: article.metaDescription || article.excerpt,
          inLanguage: "vi-VN",
          datePublished: article.publishedAt,
          ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
          ...(absoluteImage ? { image: [absoluteImage] } : {}),
          author: { "@type": "Organization", name: article.author, url: base },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: base,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: base },
            {
              "@type": "ListItem",
              position: 2,
              name: "Tin tức",
              item: `${base}/tin-tuc`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: ARTICLE_CATEGORY_LABELS[article.category],
              item: `${base}/tin-tuc?danh_muc=${article.category}`,
            },
            { "@type": "ListItem", position: 4, name: article.title },
          ],
        }}
      />

      <article className="mx-auto px-4 py-10">
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
            <span className="ml-auto">
              <CopyLinkButton />
            </span>
          </div>
        </header>

        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="mt-8 w-full rounded-2xl object-cover"
          />
        )}

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
