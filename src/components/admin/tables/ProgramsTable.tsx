"use client";

import Link from "next/link";
import { Button, Table, Tag } from "antd";
import { Pencil } from "lucide-react";
import { PROGRAM_LEVEL_LABELS, type Program } from "@/server/types";
import { deleteProgram } from "@/server/actions/programActions";
import { DeleteButton } from "../DeleteButton";
import { formatUSD } from "@/lib/format";

export function ProgramsTable({
  programs,
  universityNames,
}: {
  programs: Program[];
  universityNames: Record<string, string>;
}) {
  return (
    <Table<Program>
      rowKey="id"
      dataSource={programs}
      pagination={{ pageSize: 20, showSizeChanger: false, hideOnSinglePage: true }}
      scroll={{ x: 900 }}
      columns={[
        {
          title: "Ngành học",
          render: (_, p) => (
            <>
              <Link
                href={`/admin/programs/${p.id}`}
                className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
              >
                {p.name}
              </Link>
              <p className="text-xs text-slate-400">
                {universityNames[p.universitySlug] ?? p.universitySlug}
              </p>
            </>
          ),
        },
        {
          title: "Bậc học",
          width: 140,
          render: (_, p) => <Tag>{PROGRAM_LEVEL_LABELS[p.level]}</Tag>,
        },
        {
          title: "Thời lượng",
          width: 110,
          render: (_, p) => `${p.durationMonths} tháng`,
        },
        {
          title: "Học phí/năm",
          width: 130,
          render: (_, p) => formatUSD(p.tuitionPerYear),
        },
        {
          title: "Kỳ nhập học",
          width: 150,
          render: (_, p) =>
            p.intakeMonths.length > 0
              ? p.intakeMonths.map((m) => `T${m}`).join(", ")
              : "—",
        },
        {
          title: "Trạng thái",
          width: 120,
          render: (_, p) =>
            p.isActive ? <Tag color="green">Đang tuyển</Tag> : <Tag>Tạm ngưng</Tag>,
        },
        {
          title: "",
          width: 150,
          render: (_, p) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/admin/programs/${p.id}`}>
                <Button size="small" type="primary" ghost icon={<Pencil size={13} />}>
                  Sửa
                </Button>
              </Link>
              <DeleteButton
                action={deleteProgram.bind(null, p.id)}
                confirmMessage={`Xóa ngành "${p.name}"?`}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
