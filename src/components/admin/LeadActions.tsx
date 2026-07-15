"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, App, Button, Card, Input, Select } from "antd";
import { ArrowRightCircle, StickyNote } from "lucide-react";
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
  const { message } = App.useApp();
  const allowed = getAllowedTransitions(currentStatus);

  const [newStatus, setNewStatus] = useState<LeadStatus | undefined>();
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
      message.success("Đã cập nhật");
      router.refresh();
      return true;
    } catch {
      setError("Không thể kết nối máy chủ");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus() {
    if (!newStatus) return;
    const ok = await patch({
      action: "change_status",
      status: newStatus,
      note: statusNote,
    });
    if (ok) {
      setNewStatus(undefined);
      setStatusNote("");
    }
  }

  async function addNote() {
    if (!note.trim()) return;
    const ok = await patch({ action: "add_note", note });
    if (ok) setNote("");
  }

  return (
    <div className="space-y-5">
      <Card title="Chuyển trạng thái">
        {allowed.length === 0 ? (
          <p className="text-sm text-slate-500">
            Lead đã ở trạng thái cuối ({LEAD_STATUS_LABELS[currentStatus]}) —
            không thể chuyển tiếp.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <Select
              placeholder="— Chọn trạng thái mới (theo pipeline) —"
              value={newStatus}
              onChange={(v) => setNewStatus(v)}
              options={allowed.map((s) => ({
                value: s,
                label: LEAD_STATUS_LABELS[s],
              }))}
              style={{ width: "100%" }}
            />
            <Input.TextArea
              rows={2}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Ghi chú kèm theo (tùy chọn). VD: Khách đồng ý lộ trình, hẹn ký hợp đồng thứ 6..."
            />
            <Button
              type="primary"
              block
              icon={<ArrowRightCircle size={14} />}
              disabled={!newStatus}
              loading={busy}
              onClick={changeStatus}
            >
              Cập nhật trạng thái
            </Button>
          </div>
        )}
      </Card>

      <Card title="Thêm ghi chú chăm sóc">
        <div className="flex flex-col gap-3">
          <Input.TextArea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VD: Đã gọi điện, khách bận, hẹn gọi lại 15h..."
            aria-label="Nội dung ghi chú"
          />
          <Button
            block
            icon={<StickyNote size={14} />}
            disabled={!note.trim()}
            loading={busy}
            onClick={addNote}
          >
            Lưu ghi chú
          </Button>
        </div>
      </Card>

      {error && <Alert type="error" showIcon message={error} />}
    </div>
  );
}
