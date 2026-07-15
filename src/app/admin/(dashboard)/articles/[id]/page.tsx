import Link from "next/link";
import { notFound } from "next/navigation";
import { articleRepository } from "@/server/repositories/articleRepository";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await articleRepository.findById(id);
  if (!article) notFound();

  return (
    <div className="mx-auto">
      <Link
        href="/admin/articles"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách bài viết
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Sửa bài viết
      </h1>
      <div className="mt-6">
        <ArticleForm article={article} />
      </div>
    </div>
  );
}
