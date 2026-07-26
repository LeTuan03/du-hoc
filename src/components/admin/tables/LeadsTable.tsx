"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { App, Button, Popconfirm, Table, Tag } from "antd";
import { Eye, Trash2 } from "lucide-react";
import { LEAD_STATUS_LABELS, type Lead } from "@/server/types";
import { deleteLeads } from "@/server/actions/leadActions";
import { StatusBadge } from "../StatusBadge";
import { AssignConsultant } from "../AssignConsultant";
import { formatDateTime } from "@/lib/format";

/**
 * Bảng hồ sơ ứng viên. Bộ lọc nằm ở FilterBar (query string) nên bảng này
 * chỉ lo hiển thị + thao tác hàng loạt.
 */
export function LeadsTable({
  leads,
  countries,
  consultants,
  canAssign,
  canDelete,
}: {
  leads: Lead[];
  countries: { name: string; slug: string }[];
  consultants: { id: string; fullName: string }[];
  canAssign: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const { message } = App.useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const countryName = (slug: string | null | undefined) =>
    slug ? (countries.find((c) => c.slug === slug)?.name ?? "—") : "—";

  async function bulkDelete() {
    setBusy(true);
    const result = await deleteLeads(selected);
    if (result.ok) {
      message.success(`Đã xóa ${selected.length} hồ sơ`);
      setSelected([]);
      router.refresh();
    } else {
      message.error(result.error);
    }
    setBusy(false);
  }

  return (
    <>
      {selected.length > 0 && (canAssign || canDelete) && (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl bg-[#e8f0fc] px-4 py-3">
          <span className="text-sm font-bold text-[#1e4fa3]">
            Đã chọn {selected.length} hồ sơ
          </span>
          {canAssign && (
            <AssignConsultant
              leadIds={selected}
              consultants={consultants}
              size="small"
              onDone={() => setSelected([])}
            />
          )}
          {canDelete && (
            <Popconfirm
              title={`Xóa ${selected.length} hồ sơ cùng toàn bộ lịch sử chăm sóc?`}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={bulkDelete}
            >
              <Button danger size="small" icon={<Trash2 size={13} />} loading={busy}>
                Xóa đã chọn
              </Button>
            </Popconfirm>
          )}
          <Button type="text" size="small" onClick={() => setSelected([])}>
            Bỏ chọn
          </Button>
        </div>
      )}

      <Table<Lead>
        rowKey="id"
        dataSource={leads}
        pagination={{ pageSize: 15, showSizeChanger: false, hideOnSinglePage: true }}
        scroll={{ x: 1100 }}
        rowSelection={
          canAssign || canDelete
            ? {
                selectedRowKeys: selected,
                onChange: (keys) => setSelected(keys as string[]),
              }
            : undefined
        }
        columns={[
          {
            title: "Ứng viên",
            render: (_, lead) => (
              <>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
                >
                  {lead.fullName}
                </Link>
                <p className="text-xs text-slate-400">
                  <code className="rounded bg-slate-100 px-1">{lead.code}</code>
                  {" · "}
                  {lead.city}
                </p>
              </>
            ),
          },
          {
            title: "Liên hệ",
            width: 190,
            render: (_, lead) => (
              <>
                <p>{lead.phone}</p>
                <p className="text-xs text-slate-400">{lead.email}</p>
              </>
            ),
          },
          {
            title: "Nguyện vọng",
            width: 160,
            render: (_, lead) => (
              <>
                <p className="text-sm">{countryName(lead.desiredCountry)}</p>
                {lead.major && (
                  <p className="max-w-[150px] truncate text-xs text-slate-400">
                    {lead.major}
                  </p>
                )}
              </>
            ),
          },
          {
            title: "Phụ trách",
            width: 210,
            render: (_, lead) =>
              canAssign ? (
                <AssignConsultant
                  leadIds={[lead.id]}
                  currentId={lead.assignedToId}
                  consultants={consultants}
                  size="small"
                />
              ) : (
                (lead.assignedToName ?? (
                  <span className="text-slate-400">Chưa giao</span>
                ))
              ),
          },
          {
            title: "Trạng thái",
            width: 145,
            render: (_, lead) => <StatusBadge status={lead.status} />,
            filters: Object.entries(LEAD_STATUS_LABELS).map(([value, text]) => ({
              value,
              text,
            })),
            onFilter: (value, lead) => lead.status === value,
          },
          {
            title: "Nguồn",
            width: 120,
            render: (_, lead) =>
              lead.utmSource ? (
                <Tag color="purple">{lead.utmSource}</Tag>
              ) : (
                <span className="text-xs text-slate-400">Trực tiếp</span>
              ),
          },
          {
            title: "Ngày đăng ký",
            dataIndex: "createdAt",
            width: 150,
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            render: (d: string) => (
              <span className="text-xs text-slate-500">{formatDateTime(d)}</span>
            ),
          },
          {
            title: "",
            width: 90,
            fixed: "right",
            render: (_, lead) => (
              <Link href={`/admin/leads/${lead.id}`}>
                <Button size="small" type="primary" ghost icon={<Eye size={13} />}>
                  Xem
                </Button>
              </Link>
            ),
          },
        ]}
      />
    </>
  );
}
