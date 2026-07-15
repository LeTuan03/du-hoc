import type { Metadata } from "next";
import Link from "next/link";
import { universityRepository } from "@/server/repositories/universityRepository";
import { countryRepository } from "@/server/repositories/countryRepository";
import { UniversityCard } from "@/components/public/UniversityCard";
import { Breadcrumb } from "@/components/public/Breadcrumb";

export const metadata: Metadata = {
  title: "Danh sách trường đại học quốc tế — Lọc theo quốc gia, ngành, học phí",
  description:
    "Khám phá 500+ trường đại học đối tác tại Mỹ, Canada, Úc, Anh, Hàn, Nhật, Singapore, New Zealand. Lọc theo quốc gia, chuyên ngành, học phí và xếp hạng.",
  alternates: { canonical: "/truong" },
};

const tuitionOptions = [
  { value: "10000", label: "Dưới $10.000/năm" },
  { value: "25000", label: "Dưới $25.000/năm" },
  { value: "40000", label: "Dưới $40.000/năm" },
  { value: "60000", label: "Dưới $60.000/năm" },
];

const sortOptions = [
  { value: "featured", label: "Nổi bật" },
  { value: "ranking", label: "Xếp hạng cao" },
  { value: "tuition-asc", label: "Học phí thấp → cao" },
  { value: "tuition-desc", label: "Học phí cao → thấp" },
];

interface SearchParams {
  quoc_gia?: string;
  nganh?: string;
  hoc_phi?: string;
  sap_xep?: string;
  tu_khoa?: string;
}

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  // Number("abc") = NaN → mọi so sánh false → 0 kết quả; bỏ qua filter không hợp lệ
  const tuitionMax = Number(sp.hoc_phi);
  const [results, majors, countries] = await Promise.all([
    universityRepository.filter({
      country: sp.quoc_gia || undefined,
      major: sp.nganh || undefined,
      tuitionMax: Number.isFinite(tuitionMax) && tuitionMax > 0 ? tuitionMax : undefined,
      search: sp.tu_khoa || undefined,
      sort: (sp.sap_xep as "featured" | "ranking" | "tuition-asc" | "tuition-desc") || "featured",
    }),
    universityRepository.getAllMajors(),
    countryRepository.findAll(),
  ]);
  const hasFilter = !!(sp.quoc_gia || sp.nganh || sp.hoc_phi || sp.tu_khoa);

  const selectCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#1e4fa3] focus:outline-none focus:ring-2 focus:ring-[#1e4fa3]/20";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumb items={[{ label: "Trường" }]} />
      <h1 className="mt-6 text-3xl font-extrabold text-slate-900">
        Danh sách trường đại học
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Lọc theo quốc gia, chuyên ngành và học phí để tìm ngôi trường phù hợp
        nhất với hồ sơ của bạn.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        {/* Sidebar filter — form GET để giữ URL chia sẻ được (SEO) */}
        <aside className="lg:col-span-1">
          <form
            method="GET"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24"
          >
            <h2 className="font-bold text-slate-900">Bộ lọc</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="f-keyword" className="mb-1.5 block text-sm font-semibold text-slate-600">
                  Từ khóa
                </label>
                <input
                  id="f-keyword"
                  name="tu_khoa"
                  defaultValue={sp.tu_khoa || ""}
                  placeholder="Tên trường, thành phố..."
                  className={selectCls}
                />
              </div>

              <div>
                <label htmlFor="f-country" className="mb-1.5 block text-sm font-semibold text-slate-600">
                  Quốc gia
                </label>
                <select id="f-country" name="quoc_gia" defaultValue={sp.quoc_gia || ""} className={selectCls}>
                  <option value="">Tất cả quốc gia</option>
                  {countries.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="f-major" className="mb-1.5 block text-sm font-semibold text-slate-600">
                  Chuyên ngành
                </label>
                <select id="f-major" name="nganh" defaultValue={sp.nganh || ""} className={selectCls}>
                  <option value="">Tất cả ngành</option>
                  {majors.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="f-tuition" className="mb-1.5 block text-sm font-semibold text-slate-600">
                  Học phí
                </label>
                <select id="f-tuition" name="hoc_phi" defaultValue={sp.hoc_phi || ""} className={selectCls}>
                  <option value="">Mọi mức học phí</option>
                  {tuitionOptions.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="f-sort" className="mb-1.5 block text-sm font-semibold text-slate-600">
                  Sắp xếp
                </label>
                <select id="f-sort" name="sap_xep" defaultValue={sp.sap_xep || "featured"} className={selectCls}>
                  {sortOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#1e4fa3] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#123a7a]"
              >
                Áp dụng bộ lọc
              </button>
              {hasFilter && (
                <Link
                  href="/truong"
                  className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Xóa bộ lọc
                </Link>
              )}
            </div>
          </form>
        </aside>

        {/* Kết quả */}
        <div className="lg:col-span-3">
          <p className="text-sm text-slate-500">
            Tìm thấy <strong className="text-slate-900">{results.length}</strong>{" "}
            trường
            {sp.quoc_gia &&
              ` tại ${countries.find((c) => c.slug === sp.quoc_gia)?.name ?? ""}`}
          </p>

          {results.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-4xl" aria-hidden>
                🔍
              </p>
              <h2 className="mt-3 font-bold text-slate-900">
                Không tìm thấy trường phù hợp
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Thử nới lỏng bộ lọc, hoặc để lại thông tin — tư vấn viên sẽ tìm
                giúp bạn trường phù hợp trong hệ thống 500+ đối tác.
              </p>
              <Link
                href="/dang-ky-tu-van"
                className="mt-5 inline-block rounded-lg bg-[#1e4fa3] px-5 py-2.5 text-sm font-bold text-white"
              >
                Nhờ tư vấn viên tìm trường
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((u) => (
                <UniversityCard key={u.slug} university={u} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
