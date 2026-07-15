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

const categoryImages: Record<string, string> = {
  "tuyen-sinh": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
  "hoc-bong": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop",
  visa: "https://images.unsplash.com/photo-1544016713-622823e17a78?q=80&w=600&auto=format&fit=crop",
  "kinh-nghiem": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
  "cuoc-song-du-hoc": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop",
};

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/tin-tuc/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={categoryImages[article.category] || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop"}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
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
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-slate-400 border-t border-slate-50 mt-4">
          <span>{formatDate(article.publishedAt)}</span>
          <span>⏱ {article.readMinutes} phút đọc</span>
        </div>
      </div>
    </Link>
  );
}
