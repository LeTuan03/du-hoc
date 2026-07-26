"use client";

import { useState } from "react";
import {
  CalendarClock,
  Check,
  CircleAlert,
  FileCheck2,
  FileClock,
  FileX2,
  Search,
  UserRound,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/format";

/** Kết quả tra cứu — khớp với payload của POST /api/v1/leads/lookup */
interface LookupResult {
  code: string;
  fullName: string;
  status: string;
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  consultantName: string | null;
  major: string | null;
  intakeTerm: string | null;
  pipeline: { status: string; label: string; done: boolean; current: boolean }[];
  documents: {
    name: string;
    status: string;
    statusLabel: string;
    note: string | null;
    updatedAt: string;
  }[];
  appointments: {
    scheduledAt: string;
    mode: string;
    topic: string;
    consultantName: string | null;
    location: string | null;
  }[];
}

const docIcons: Record<string, React.ReactNode> = {
  approved: <FileCheck2 size={16} className="text-emerald-600" />,
  submitted: <FileClock size={16} className="text-blue-600" />,
  rejected: <FileX2 size={16} className="text-red-600" />,
  pending: <FileClock size={16} className="text-slate-400" />,
};

export function LeadTracker() {
  const [code, setCode] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/v1/leads/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, contact }),
      });
      const json = await res.json();
      if (res.ok && json.success) setResult(json.data);
      else setError(json.message || "Không tra cứu được, vui lòng thử lại");
    } catch {
      setError("Không thể kết nối máy chủ, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-[#1e4fa3] focus:ring-2 focus:ring-[#1e4fa3]/20 focus:outline-none";

  const approvedDocs =
    result?.documents.filter((d) => d.status === "approved").length ?? 0;

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lt-code" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Mã hồ sơ <span className="text-red-500">*</span>
            </label>
            <input
              id="lt-code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="DH-2026-0007"
              className={`${inputCls} font-semibold uppercase tracking-wider`}
            />
          </div>
          <div>
            <label htmlFor="lt-contact" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email hoặc số điện thoại đã đăng ký <span className="text-red-500">*</span>
            </label>
            <input
              id="lt-contact"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="email@example.com hoặc 0912345678"
              className={inputCls}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1e4fa3] px-6 py-3 text-base font-bold text-white shadow-md transition hover:bg-[#123a7a] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Search size={17} aria-hidden />
          {loading ? "Đang tra cứu..." : "Tra cứu hồ sơ"}
        </button>

        {error && (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            <CircleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />
            {error}
          </p>
        )}
      </form>

      {result && (
        <div className="mt-6 space-y-6 animate-fade-in">
          {/* Tổng quan */}
          <section className="rounded-2xl bg-gradient-to-br from-[#1e4fa3] to-[#123a7a] p-6 text-white shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">
              Hồ sơ {result.code}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold">{result.fullName}</h2>
            <p className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
              {result.statusLabel}
            </p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <p className="text-white/60">Ngày đăng ký</p>
                <p className="font-semibold">{formatDate(result.createdAt)}</p>
              </div>
              <div>
                <p className="text-white/60">Cập nhật gần nhất</p>
                <p className="font-semibold">{formatDate(result.updatedAt)}</p>
              </div>
              <div>
                <p className="text-white/60">Tư vấn viên</p>
                <p className="font-semibold">
                  {result.consultantName ?? "Đang phân công"}
                </p>
              </div>
            </div>
          </section>

          {/* Tiến trình pipeline */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h3 className="font-bold text-slate-900">Tiến trình hồ sơ</h3>
            <ol className="mt-5 space-y-0">
              {result.pipeline.map((step, i) => (
                <li key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < result.pipeline.length - 1 && (
                    <span
                      aria-hidden
                      className={`absolute left-[15px] top-8 h-full w-0.5 ${
                        step.done ? "bg-emerald-400" : "bg-slate-200"
                      }`}
                    />
                  )}
                  <span
                    className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-white ${
                      step.current
                        ? "bg-[#1e4fa3] text-white"
                        : step.done
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {step.done && !step.current ? (
                      <Check size={16} aria-hidden />
                    ) : (
                      <span className="text-xs font-bold">{i + 1}</span>
                    )}
                  </span>
                  <div className="pt-1">
                    <p
                      className={`font-semibold ${
                        step.current
                          ? "text-[#1e4fa3]"
                          : step.done
                            ? "text-slate-900"
                            : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.current && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        Bước hiện tại của hồ sơ
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Tài liệu */}
          {result.documents.length > 0 && (
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h3 className="font-bold text-slate-900">
                Tài liệu hồ sơ ({approvedDocs}/{result.documents.length} đã duyệt)
              </h3>
              <ul className="mt-4 divide-y divide-slate-100">
                {result.documents.map((doc) => (
                  <li key={doc.name} className="flex items-start gap-3 py-3">
                    <span className="mt-0.5">{docIcons[doc.status]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {doc.name}
                      </p>
                      <p className="text-xs text-slate-500">{doc.statusLabel}</p>
                      {doc.note && (
                        <p className="mt-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                          Cần bổ sung: {doc.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Lịch hẹn sắp tới */}
          {result.appointments.length > 0 && (
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <h3 className="font-bold text-slate-900">Lịch hẹn tư vấn sắp tới</h3>
              <ul className="mt-4 space-y-3">
                {result.appointments.map((a, i) => (
                  <li key={i} className="rounded-xl bg-[#e8f0fc] px-4 py-3">
                    <p className="flex items-center gap-2 font-bold text-[#1e4fa3]">
                      <CalendarClock size={16} aria-hidden />
                      {formatDateTime(a.scheduledAt)}
                    </p>
                    {a.topic && (
                      <p className="mt-1 text-sm text-slate-700">{a.topic}</p>
                    )}
                    {a.consultantName && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <UserRound size={13} aria-hidden />
                        {a.consultantName}
                      </p>
                    )}
                    {a.location && (
                      <p className="mt-1 break-all text-xs text-slate-500">
                        {a.location}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
