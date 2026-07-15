import Link from "next/link";
import { articleRepository } from "@/server/repositories/articleRepository";
import { ArticlesTable } from "@/components/admin/tables/ArticlesTable";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await articleRepository.findAll();

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Quản lý Bài viết
          </h1>
          <p className="mt-1 text-sm text-slate-500">{articles.length} bài viết</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-[#1e4fa3] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#123a7a]"
        >
          + Viết bài mới
        </Link>
      </div>
      <ArticlesTable articles={articles} />
    </div>
  );
}
