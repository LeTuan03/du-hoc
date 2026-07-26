"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock, GraduationCap, MapPin, SearchX, Wallet } from "lucide-react";
import {
  PROGRAM_LEVEL_LABELS,
  type Program,
  type ProgramLevel,
} from "@/server/types";
import { formatUSD } from "@/lib/format";

interface UniversityRef {
  slug: string;
  name: string;
  city: string;
  countrySlug: string;
  ranking: number | null;
}

/**
 * Công cụ tra cứu ngành học: lọc tức thì phía client trên toàn bộ ngành đã
 * publish. Bộ dữ liệu ở quy mô vài trăm bản ghi nên lọc client cho phản hồi
 * tức thì, không tốn round-trip mỗi lần kéo thanh học phí.
 */
export function ProgramFinder({
  programs,
  universities,
  countries,
}: {
  programs: Program[];
  universities: UniversityRef[];
  countries: { slug: string; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [budget, setBudget] = useState(0); // 0 = không giới hạn
  const [visible, setVisible] = useState(12);

  const uniBySlug = useMemo(
    () => new Map(universities.map((u) => [u.slug, u])),
    [universities],
  );

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    return programs.filter((p) => {
      const uni = uniBySlug.get(p.universitySlug);
      if (country && uni?.countrySlug !== country) return false;
      if (level && p.level !== level) return false;
      if (budget > 0 && p.tuitionPerYear > budget) return false;
      if (q) {
        const haystack = `${p.name} ${uni?.name ?? ""} ${uni?.city ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [programs, uniBySlug, search, country, level, budget]);

  const selectCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-[#1e4fa3] focus:ring-2 focus:ring-[#1e4fa3]/20 focus:outline-none";

  const budgetSteps = [0, 15000, 25000, 35000, 50000, 80000];

  function reset() {
    setSearch("");
    setCountry("");
    setLevel("");
    setBudget(0);
    setVisible(12);
  }

  return (
    <div>
      {/* Bộ lọc */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label htmlFor="pf-search" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Tìm ngành hoặc trường
            </label>
            <input
              id="pf-search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisible(12);
              }}
              placeholder="VD: Khoa học máy tính, Toronto..."
              className={selectCls}
            />
          </div>

          <div>
            <label htmlFor="pf-country" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Quốc gia
            </label>
            <select
              id="pf-country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setVisible(12);
              }}
              className={selectCls}
            >
              <option value="">Tất cả quốc gia</option>
              {countries.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pf-level" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Bậc học
            </label>
            <select
              id="pf-level"
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setVisible(12);
              }}
              className={selectCls}
            >
              <option value="">Tất cả bậc học</option>
              {(Object.keys(PROGRAM_LEVEL_LABELS) as ProgramLevel[]).map((l) => (
                <option key={l} value={l}>
                  {PROGRAM_LEVEL_LABELS[l]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Học phí tối đa mỗi năm
          </p>
          <div className="flex flex-wrap gap-2">
            {budgetSteps.map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => {
                  setBudget(step);
                  setVisible(12);
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  budget === step
                    ? "bg-[#1e4fa3] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {step === 0 ? "Không giới hạn" : `≤ ${formatUSD(step)}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kết quả */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-600">
          Tìm thấy{" "}
          <strong className="text-slate-900">{results.length}</strong> ngành học
          phù hợp
        </p>
        {(search || country || level || budget > 0) && (
          <button
            type="button"
            onClick={reset}
            className="text-sm font-semibold text-[#1e4fa3] hover:underline"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 py-14 text-center">
          <SearchX size={32} className="mx-auto text-slate-300" aria-hidden />
          <p className="mt-3 font-semibold text-slate-600">
            Không có ngành nào khớp bộ lọc
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Thử nới ngân sách hoặc bỏ bớt điều kiện — hoặc để tư vấn viên gợi ý
            giúp bạn.
          </p>
          <Link
            href="/dang-ky-tu-van"
            className="mt-5 inline-block rounded-lg bg-[#1e4fa3] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#123a7a]"
          >
            Nhờ tư vấn viên gợi ý
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.slice(0, visible).map((p) => {
              const uni = uniBySlug.get(p.universitySlug);
              return (
                <li
                  key={p.id}
                  className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md hover:ring-[#1e4fa3]/30"
                >
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#e8f0fc] px-2.5 py-1 text-xs font-bold text-[#1e4fa3]">
                    <GraduationCap size={12} aria-hidden />
                    {PROGRAM_LEVEL_LABELS[p.level]}
                  </span>

                  <h3 className="mt-3 font-bold leading-snug text-slate-900">
                    {p.name}
                  </h3>

                  {uni && (
                    <Link
                      href={`/truong/${uni.slug}`}
                      className="mt-1 text-sm font-semibold text-[#1e4fa3] hover:underline"
                    >
                      {uni.name}
                    </Link>
                  )}

                  <dl className="mt-3 space-y-1.5 text-sm text-slate-600">
                    {uni && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" aria-hidden />
                        <dd>{uni.city}</dd>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Wallet size={14} className="text-slate-400" aria-hidden />
                      <dd>
                        <strong className="text-slate-900">
                          {formatUSD(p.tuitionPerYear)}
                        </strong>
                        /năm
                      </dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" aria-hidden />
                      <dd>{p.durationMonths} tháng</dd>
                    </div>
                  </dl>

                  {p.intakeMonths.length > 0 && (
                    <p className="mt-2 text-xs text-slate-500">
                      Kỳ nhập học:{" "}
                      {p.intakeMonths.map((m) => `Tháng ${m}`).join(", ")}
                    </p>
                  )}

                  <Link
                    href={`/dang-ky-tu-van?nganh=${encodeURIComponent(p.name)}${uni ? `&truong=${uni.slug}` : ""}`}
                    className="mt-4 rounded-lg bg-[#1e4fa3] px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#123a7a]"
                  >
                    Tư vấn ngành này
                  </Link>
                </li>
              );
            })}
          </ul>

          {visible < results.length && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 12)}
                className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#1e4fa3] hover:text-[#1e4fa3]"
              >
                Xem thêm {Math.min(12, results.length - visible)} ngành
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
