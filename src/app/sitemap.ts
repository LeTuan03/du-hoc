import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { countries } from "@/server/data/countries";
import { universities } from "@/server/data/universities";
import { scholarships } from "@/server/data/scholarships";
import { articles } from "@/server/data/articles";
import { PROGRAM_LEVEL_LABELS } from "@/server/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ([
    { url: `${base}/`, priority: 1, changeFrequency: "daily" },
    { url: `${base}/quoc-gia`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/truong`, priority: 0.9, changeFrequency: "daily" },
    { url: `${base}/hoc-bong`, priority: 0.9, changeFrequency: "daily" },
    { url: `${base}/tin-tuc`, priority: 0.8, changeFrequency: "daily" },
    { url: `${base}/chuong-trinh-hoc`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${base}/cau-chuyen-hoc-vien`, priority: 0.6, changeFrequency: "weekly" },
    { url: `${base}/gioi-thieu`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${base}/lien-he`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${base}/dang-ky-tu-van`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/faq`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${base}/chinh-sach-bao-mat`, priority: 0.2, changeFrequency: "yearly" },
    { url: `${base}/dieu-khoan-su-dung`, priority: 0.2, changeFrequency: "yearly" },
  ] as const).map((r) => ({ ...r, lastModified: now }));

  const countryRoutes: MetadataRoute.Sitemap = countries.map((c) => ({
    url: `${base}/quoc-gia/${c.slug}`,
    lastModified: now,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const universityRoutes: MetadataRoute.Sitemap = universities.map((u) => ({
    url: `${base}/truong/${u.slug}`,
    lastModified: now,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  const scholarshipRoutes: MetadataRoute.Sitemap = scholarships
    .filter((s) => s.isActive)
    .map((s) => ({
      url: `${base}/hoc-bong/${s.slug}`,
      lastModified: now,
      priority: 0.7,
      changeFrequency: "weekly",
    }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/tin-tuc/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    priority: 0.6,
    changeFrequency: "monthly",
  }));

  const programRoutes: MetadataRoute.Sitemap = Object.keys(
    PROGRAM_LEVEL_LABELS,
  ).map((level) => ({
    url: `${base}/chuong-trinh-hoc/${level}`,
    lastModified: now,
    priority: 0.6,
    changeFrequency: "weekly",
  }));

  return [
    ...staticRoutes,
    ...countryRoutes,
    ...universityRoutes,
    ...scholarshipRoutes,
    ...articleRoutes,
    ...programRoutes,
  ];
}
