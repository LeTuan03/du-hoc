import Link from "next/link";
import type { Article } from "@/server/types";
import { ARTICLE_CATEGORY_LABELS } from "@/server/types";
import { formatDate } from "@/lib/format";

const categoryColors: Record<string, string> = {
  "tuyen-sinh": "bg-blue-50 text-blue-700",
  "hoc-bong": "bg-amber-50 text-amber-700",
  visa: "bg-emerald-50 text-emerald-700",
  "kinh-nghiem": "bg-violet-50 text-violet-700",
  "cuoc-song-du-hoc": "bg-rose-50 text-rose-700",
};

const categoryGradients: Record<string, string> = {
  "tuyen-sinh": "from-blue-500 to-indigo-600",
  "hoc-bong": "from-amber-400 to-orange-500",
  visa: "from-emerald-500 to-teal-600",
  "kinh-nghiem": "from-violet-500 to-purple-600",
  "cuoc-song-du-hoc": "from-rose-400 to-pink-600",
};

const categoryIcons: Record<string, string> = {
  "tuyen-sinh": "📋",
  "hoc-bong": "🎓",
  visa: "🛂",
  "kinh-nghiem": "💡",
  "cuoc-song-du-hoc": "🌏",
};

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div
        className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${categoryGradients[article.category]}`}
      >
        <span className="text-5xl drop-shadow" aria-hidden>
          {categoryIcons[article.category]}
        </span>
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold ${categoryColors[article.category]}`}
        >
          {ARTICLE_CATEGORY_LABELS[article.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-bold leading-snug text-slate-900 group-hover:text-[#1e4fa3]">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-slate-400">
          <span>{formatDate(article.publishedAt)}</span>
          <span>⏱ {article.readMinutes} phút đọc</span>
        </div>
      </div>
    </Link>
  );
}
