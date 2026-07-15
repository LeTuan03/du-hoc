"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LEAD_STATUS_LABELS,
  getAllowedTransitions,
  type LeadStatus,
} from "@/server/types";

/** Đổi trạng thái theo state machine + thêm ghi chú chăm sóc */
export function LeadActions({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: LeadStatus;
}) {
  const router = useRouter();
  const allowed = getAllowedTransitions(currentStatus);

  const [newStatus, setNewStatus] = useState<LeadStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function patch(body: object) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Có lỗi xảy ra");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Không thể kết nối máy chủ");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!newStatus) return;
    const ok = await patch({
      action: "change_status",
      status: newStatus,
      note: statusNote,
    });
    if (ok) {
      setNewStatus("");
      setStatusNote("");
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    const ok = await patch({ action: "add_note", note });
    if (ok) setNote("");
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#1e4fa3] focus:outline-none focus:ring-2 focus:ring-[#1e4fa3]/20";

  return (
    <div className="space-y-5">
      {/* Đổi trạng thái */}
      <form
        onSubmit={changeStatus}
        className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
      >
        <h2 className="font-bold text-slate-900">Chuyển trạng thái</h2>
        {allowed.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            Lead đã ở trạng thái cuối ({LEAD_STATUS_LABELS[currentStatus]}) —
            không thể chuyển tiếp.
          </p>
        ) : (
          <>
            <label htmlFor="la-status" className="mt-3 block text-xs font-bold text-slate-500">
              Trạng thái mới (theo đúng pipeline)
            </label>
            <select
              id="la-status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
              className={`${inputCls} mt-1`}
              required
            >
              <option value="" disabled>
                — Chọn trạng thái —
              </option>
              {allowed.map((s) => (
                <option key={s} value={s}>
                  {LEAD_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <label htmlFor="la-status-note" className="mt-3 block text-xs font-bold text-slate-500">
              Ghi chú kèm theo (tùy chọn)
            </label>
            <textarea
              id="la-status-note"
              rows={2}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="VD: Khách đồng ý lộ trình, hẹn ký hợp đồng thứ 6..."
              className={`${inputCls} mt-1`}
            />
            <button
              type="submit"
              disabled={busy || !newStatus}
              className="mt-3 w-full rounded-lg bg-[#1e4fa3] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#123a7a] disabled:opacity-50"
            >
              {busy ? "Đang lưu..." : "Cập nhật trạng thái"}
            </button>
          </>
        )}
      </form>

      {/* Thêm ghi chú */}
      <form
        onSubmit={addNote}
        className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
      >
        <h2 className="font-bold text-slate-900">Thêm ghi chú chăm sóc</h2>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="VD: Đã gọi điện, khách bận, hẹn gọi lại 15h..."
          className={`${inputCls} mt-3`}
          aria-label="Nội dung ghi chú"
        />
        <button
          type="submit"
          disabled={busy || !note.trim()}
          className="mt-3 w-full rounded-lg border-2 border-[#1e4fa3] px-4 py-2 text-sm font-bold text-[#1e4fa3] transition hover:bg-[#e8f0fc] disabled:opacity-50"
        >
          Lưu ghi chú
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
