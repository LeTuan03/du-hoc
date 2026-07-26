"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { App, Button, Input, Modal, Progress, Select, Tag, Tooltip } from "antd";
import {
  CheckCircle2,
  FileText,
  ListChecks,
  Paperclip,
  Plus,
  RotateCcw,
  XCircle,
} from "lucide-react";
import {
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_TYPES,
  type DocumentStatus,
  type LeadDocument,
} from "@/server/types";
import {
  createDocument,
  deleteDocument,
  generateChecklist,
  reviewDocument,
} from "@/server/actions/documentActions";
import { DeleteButton } from "./DeleteButton";
import { FileUploadField } from "./FileUploadField";
import { formatDateTime } from "@/lib/format";

const statusColors: Record<DocumentStatus, string> = {
  pending: "default",
  submitted: "blue",
  approved: "green",
  rejected: "red",
};

/** Duyệt / yêu cầu bổ sung một tài liệu */
function ReviewButtons({
  doc,
  leadId,
}: {
  doc: LeadDocument;
  leadId: string;
}) {
  const router = useRouter();
  const { message } = App.useApp();
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState(doc.note ?? "");
  const [busy, setBusy] = useState(false);

  async function submit(status: DocumentStatus, reason?: string) {
    setBusy(true);
    const fd = new FormData();
    fd.set("status", status);
    fd.set("note", reason ?? "");
    const result = await reviewDocument(doc.id, leadId, fd);
    if (result.ok) {
      message.success("Đã cập nhật tài liệu");
      setRejecting(false);
      router.refresh();
    } else {
      message.error(result.error);
    }
    setBusy(false);
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {doc.status !== "approved" && (
          <Tooltip title="Tài liệu hợp lệ, đạt yêu cầu">
            <Button
              size="small"
              type="primary"
              ghost
              icon={<CheckCircle2 size={13} />}
              loading={busy}
              onClick={() => submit("approved")}
            >
              Duyệt
            </Button>
          </Tooltip>
        )}
        {doc.status !== "rejected" && (
          <Button
            size="small"
            danger
            icon={<XCircle size={13} />}
            onClick={() => setRejecting(true)}
          >
            Cần bổ sung
          </Button>
        )}
        {doc.status !== "pending" && (
          <Tooltip title="Đưa về trạng thái chờ nộp">
            <Button
              size="small"
              icon={<RotateCcw size={13} />}
              loading={busy}
              onClick={() => submit("pending")}
            />
          </Tooltip>
        )}
        <DeleteButton
          action={deleteDocument.bind(null, doc.id, leadId)}
          confirmMessage={`Xóa tài liệu "${doc.name}" khỏi checklist?`}
        />
      </div>

      <Modal
        title={`Yêu cầu bổ sung: ${doc.name}`}
        open={rejecting}
        onCancel={() => setRejecting(false)}
        onOk={() => submit("rejected", note)}
        okText="Gửi yêu cầu"
        cancelText="Hủy"
        okButtonProps={{ danger: true, disabled: !note.trim() }}
        confirmLoading={busy}
      >
        <Input.TextArea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="VD: Bản scan bị mờ trang 2, cần scan lại rõ nét và có dấu đỏ của trường."
        />
        <p className="mt-2 text-xs text-slate-400">
          Ghi rõ để ứng viên biết cần làm gì — nội dung này hiển thị ở trang tra
          cứu hồ sơ của ứng viên.
        </p>
      </Modal>
    </>
  );
}

/** Thêm tài liệu vào checklist */
function AddDocument({ leadId }: { leadId: string }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>("other");
  const [name, setName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    const fd = new FormData();
    fd.set("leadId", leadId);
    fd.set("type", type);
    fd.set("name", name);
    fd.set("fileUrl", fileUrl);
    const result = await createDocument(fd);
    if (result.ok) {
      message.success("Đã thêm tài liệu");
      setOpen(false);
      setName("");
      setFileUrl("");
      router.refresh();
    } else {
      message.error(result.error);
    }
    setBusy(false);
  }

  return (
    <>
      <Button size="small" icon={<Plus size={13} />} onClick={() => setOpen(true)}>
        Thêm tài liệu
      </Button>
      <Modal
        title="Thêm tài liệu vào hồ sơ"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={busy}
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Loại tài liệu
            </label>
            <Select
              value={type}
              onChange={setType}
              style={{ width: "100%" }}
              options={DOCUMENT_TYPES.map((d) => ({
                value: d.code,
                label: d.required ? `${d.name} (bắt buộc)` : d.name,
              }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Tên hiển thị
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Để trống sẽ dùng tên chuẩn của loại tài liệu"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              File đính kèm
            </label>
            <FileUploadField
              value={fileUrl}
              onChange={setFileUrl}
              accept="application/pdf,image/jpeg,image/png,image/webp"
              preview={false}
              label="file"
              hint="PDF hoặc ảnh scan, tối đa 5MB"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

/** Sinh checklist tài liệu bắt buộc */
function GenerateChecklist({ leadId }: { leadId: string }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const result = await generateChecklist(leadId);
    if (result.ok) {
      message.success("Đã tạo checklist tài liệu bắt buộc");
      router.refresh();
    } else {
      message.info(result.error);
    }
    setBusy(false);
  }

  return (
    <Button
      size="small"
      type="primary"
      ghost
      icon={<ListChecks size={13} />}
      loading={busy}
      onClick={run}
    >
      Tạo checklist chuẩn
    </Button>
  );
}

export function DocumentChecklist({
  leadId,
  documents,
}: {
  leadId: string;
  documents: LeadDocument[];
}) {
  const approved = documents.filter((d) => d.status === "approved").length;
  const percent =
    documents.length > 0 ? Math.round((approved / documents.length) * 100) : 0;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold text-slate-900">
          Tài liệu hồ sơ ({approved}/{documents.length})
        </h2>
        <div className="flex items-center gap-2">
          <GenerateChecklist leadId={leadId} />
          <AddDocument leadId={leadId} />
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 py-8 text-center">
          <p className="text-sm font-semibold text-slate-500">
            Chưa có tài liệu nào
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Bấm &ldquo;Tạo checklist chuẩn&rdquo; để sinh sẵn các giấy tờ bắt buộc
            của hồ sơ du học.
          </p>
        </div>
      ) : (
        <>
          <Progress
            percent={percent}
            strokeColor="#16a34a"
            style={{ marginTop: 12 }}
          />
          <ul className="mt-3 divide-y divide-slate-100">
            {documents.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-start gap-3 py-3">
                <span className="mt-0.5 text-slate-400">
                  <FileText size={16} aria-hidden />
                </span>
                <div className="min-w-[200px] flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {doc.name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Tag color={statusColors[doc.status]}>
                      {DOCUMENT_STATUS_LABELS[doc.status]}
                    </Tag>
                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e4fa3] hover:underline"
                      >
                        <Paperclip size={12} aria-hidden />
                        Xem file
                      </a>
                    )}
                    {doc.reviewedByName && doc.reviewedAt && (
                      <span className="text-xs text-slate-400">
                        {doc.reviewedByName} · {formatDateTime(doc.reviewedAt)}
                      </span>
                    )}
                  </div>
                  {doc.note && (
                    <p className="mt-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                      {doc.note}
                    </p>
                  )}
                </div>
                <ReviewButtons doc={doc} leadId={leadId} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
