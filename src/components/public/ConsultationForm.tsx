"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { leadSchema, type LeadInput } from "@/server/validators/lead.schema";

interface SelectOptions {
  countries: { name: string; slug: string }[];
  universities: { name: string; slug: string; countrySlug: string }[];
}

const intakeTerms = [
  "Spring 2027",
  "Fall 2027",
  "Spring 2028",
  "Fall 2028",
  "Chưa xác định",
];

const budgetRanges = [
  "Dưới 300 triệu/năm",
  "300 - 500 triệu/năm",
  "500 - 700 triệu/năm",
  "700 triệu - 1 tỷ/năm",
  "Trên 1 tỷ/năm",
];

interface Props {
  /** Prefill quốc gia/trường khi nhúng ở trang chi tiết (SRS 5.3) */
  prefillCountry?: string;
  prefillUniversity?: string;
  compact?: boolean;
}

export function ConsultationForm({
  prefillCountry,
  prefillUniversity,
  compact = false,
}: Props) {
  const pathname = usePathname();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    message: string;
    code?: string;
  } | null>(null);
  const [options, setOptions] = useState<SelectOptions>({
    countries: [],
    universities: [],
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/options")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json.success) return;
        setOptions(json.data);
        // Option đến sau khi select đã mount (uncontrolled) — áp lại giá trị
        // prefill để DOM hiển thị đúng lựa chọn thay vì "Chưa xác định"
        if (prefillCountry) setValue("desiredCountry", prefillCountry);
        if (prefillUniversity) setValue("desiredUniversity", prefillUniversity);
      })
      .catch(() => {
        // Select vẫn dùng được với lựa chọn "Chưa xác định"
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      desiredCountry: prefillCountry ?? "",
      desiredUniversity: prefillUniversity ?? "",
      gender: undefined,
    },
  });

  const selectedCountry = watch("desiredCountry");
  const universityOptions = options.universities.filter(
    (u) => !selectedCountry || u.countrySlug === selectedCountry,
  );

  async function onSubmit(data: LeadInput) {
    setSubmitting(true);
    setResult(null);
    try {
      // UTM đọc từ URL hiện tại — đo hiệu quả kênh marketing (SRS mục 13)
      const params = new URLSearchParams(window.location.search);
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sourcePage: pathname,
          utmSource: params.get("utm_source") ?? "",
          utmMedium: params.get("utm_medium") ?? "",
          utmCampaign: params.get("utm_campaign") ?? "",
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setResult({ ok: true, message: json.message, code: json.data?.code });
        reset();
      } else {
        setResult({
          ok: false,
          message: json.message || "Có lỗi xảy ra, vui lòng thử lại",
        });
      }
    } catch {
      setResult({
        ok: false,
        message: "Không thể kết nối máy chủ, vui lòng thử lại sau",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = (hasError: boolean) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-[#1e4fa3] focus:ring-2 focus:ring-[#1e4fa3]/20 focus:outline-none ${
      hasError ? "border-red-400" : "border-slate-300"
    }`;

  const labelCls = "mb-1.5 block text-sm font-semibold text-slate-700";

  const Err = ({ name }: { name: keyof LeadInput }) =>
    errors[name] ? (
      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
        {errors[name]?.message as string}
      </p>
    ) : null;

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center animate-fade-in">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-white">
          <Check size={32} aria-hidden />
        </div>
        <h3 className="mt-4 text-xl font-bold text-emerald-800">
          Đăng ký thành công!
        </h3>
        <p className="mt-2 text-sm text-emerald-700">{result.message}</p>

        {result.code && (
          <div className="mt-5 rounded-xl border border-emerald-300 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Mã hồ sơ của bạn
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-wider text-slate-900">
              {result.code}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Lưu lại mã này để theo dõi tiến trình hồ sơ bất cứ lúc nào tại
              trang{" "}
              <a
                href="/tra-cuu-ho-so"
                className="font-semibold text-[#1e4fa3] underline"
              >
                Tra cứu hồ sơ
              </a>
              .
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-6 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Gửi đăng ký khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Honeypot — ẩn với người dùng thật */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input
          id="cf-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label htmlFor="cf-fullName" className={labelCls}>
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-fullName"
            placeholder="Nguyễn Văn A"
            aria-describedby={errors.fullName ? "cf-fullName-err" : undefined}
            className={inputCls(!!errors.fullName)}
            {...register("fullName")}
          />
          <Err name="fullName" />
        </div>

        <div>
          <label htmlFor="cf-phone" className={labelCls}>
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-phone"
            type="tel"
            placeholder="0912 345 678"
            className={inputCls(!!errors.phone)}
            {...register("phone")}
          />
          <Err name="phone" />
        </div>

        <div>
          <label htmlFor="cf-email" className={labelCls}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            placeholder="email@example.com"
            className={inputCls(!!errors.email)}
            {...register("email")}
          />
          <Err name="email" />
        </div>

        <div>
          <label htmlFor="cf-dob" className={labelCls}>
            Ngày sinh <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-dob"
            type="date"
            className={inputCls(!!errors.dateOfBirth)}
            {...register("dateOfBirth")}
          />
          <Err name="dateOfBirth" />
        </div>

        <div>
          <label htmlFor="cf-gender" className={labelCls}>
            Giới tính <span className="text-red-500">*</span>
          </label>
          <select
            id="cf-gender"
            className={inputCls(!!errors.gender)}
            defaultValue=""
            {...register("gender")}
          >
            <option value="" disabled>
              — Chọn —
            </option>
            <option value="female">Nữ</option>
            <option value="male">Nam</option>
            <option value="other">Khác</option>
          </select>
          <Err name="gender" />
        </div>

        <div>
          <label htmlFor="cf-city" className={labelCls}>
            Tỉnh/Thành phố <span className="text-red-500">*</span>
          </label>
          <input
            id="cf-city"
            placeholder="TP. Hồ Chí Minh"
            className={inputCls(!!errors.city)}
            {...register("city")}
          />
          <Err name="city" />
        </div>

        <div>
          <label htmlFor="cf-school" className={labelCls}>
            Trường đang học
          </label>
          <input
            id="cf-school"
            placeholder="THPT..."
            className={inputCls(false)}
            {...register("currentSchool")}
          />
        </div>

        <div>
          <label htmlFor="cf-gpa" className={labelCls}>
            GPA (thang 10)
          </label>
          <input
            id="cf-gpa"
            type="number"
            step="0.1"
            min="0"
            max="10"
            placeholder="8.5"
            className={inputCls(!!errors.gpa)}
            {...register("gpa")}
          />
          <Err name="gpa" />
        </div>

        <div>
          <label htmlFor="cf-lang" className={labelCls}>
            Trình độ ngoại ngữ
          </label>
          <input
            id="cf-lang"
            placeholder="IELTS 6.0 / TOPIK 3 / Chưa có"
            className={inputCls(false)}
            {...register("languageLevel")}
          />
        </div>

        <div>
          <label htmlFor="cf-country" className={labelCls}>
            Quốc gia mong muốn
          </label>
          <select
            id="cf-country"
            className={inputCls(false)}
            {...register("desiredCountry")}
          >
            <option value="">— Chưa xác định —</option>
            {options.countries.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cf-university" className={labelCls}>
            Trường quan tâm
          </label>
          <select
            id="cf-university"
            className={inputCls(false)}
            {...register("desiredUniversity")}
          >
            <option value="">— Chưa xác định —</option>
            {universityOptions.map((u) => (
              <option key={u.slug} value={u.slug}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cf-major" className={labelCls}>
            Ngành học dự kiến
          </label>
          <input
            id="cf-major"
            placeholder="Khoa học máy tính..."
            className={inputCls(false)}
            {...register("major")}
          />
        </div>

        <div>
          <label htmlFor="cf-intake" className={labelCls}>
            Kỳ nhập học
          </label>
          <select
            id="cf-intake"
            className={inputCls(false)}
            {...register("intakeTerm")}
          >
            <option value="">— Chọn kỳ —</option>
            {intakeTerms.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cf-budget" className={labelCls}>
            Ngân sách dự kiến
          </label>
          <select
            id="cf-budget"
            className={inputCls(false)}
            {...register("budget")}
          >
            <option value="">— Chọn mức —</option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cf-note" className={labelCls}>
          Ghi chú / câu hỏi cho tư vấn viên
        </label>
        <textarea
          id="cf-note"
          rows={3}
          placeholder="VD: Em muốn tìm học bổng ngành CNTT tại Canada..."
          className={inputCls(!!errors.note)}
          {...register("note")}
        />
        <Err name="note" />
      </div>

      {result && !result.ok && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {result.message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[#1e4fa3] px-6 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-[#123a7a] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Đang gửi..." : "Đăng ký tư vấn miễn phí"}
      </button>

      <p className="text-center text-xs text-slate-400">
        Thông tin của bạn được bảo mật theo{" "}
        <a href="/chinh-sach-bao-mat" className="underline hover:text-[#1e4fa3]">
          chính sách bảo mật
        </a>
        . Chúng tôi sẽ liên hệ trong 24h làm việc.
      </p>
    </form>
  );
}
