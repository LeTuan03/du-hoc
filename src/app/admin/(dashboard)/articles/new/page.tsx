import Link from "next/link";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export default function NewArticlePage() {
  return (
    <div className="mx-auto">
      <Link
        href="/admin/articles"
        className="text-sm font-semibold text-[#1e4fa3] hover:underline"
      >
        ← Danh sách bài viết
      </Link>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Viết bài mới
      </h1>
      <div className="mt-6">
        <ArticleForm />
      </div>
    </div>
  );
}
