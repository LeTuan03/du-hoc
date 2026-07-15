"use client";

import Link from "next/link";
import { Button, Table } from "antd";
import { Pencil } from "lucide-react";
import type { FaqRecord } from "@/server/types";
import { deleteFaq } from "@/server/actions/faqActions";
import { DeleteButton } from "../DeleteButton";

export function FaqsTable({ faqs }: { faqs: FaqRecord[] }) {
  return (
    <Table<FaqRecord>
      rowKey="id"
      dataSource={faqs}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      scroll={{ x: 640 }}
      columns={[
        {
          title: "Câu hỏi",
          dataIndex: "question",
          render: (_, f) => (
            <>
              <Link
                href={`/admin/faqs/${f.id}`}
                className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
              >
                {f.question}
              </Link>
              <p className="max-w-[480px] truncate text-xs text-slate-400">
                {f.answer}
              </p>
            </>
          ),
        },
        { title: "Thứ tự", dataIndex: "displayOrder", width: 90 },
        {
          title: "",
          width: 150,
          render: (_, f) => (
            <div className="flex items-center justify-end gap-2">
              <Link href={`/admin/faqs/${f.id}`}>
                <Button size="small" type="primary" ghost icon={<Pencil size={13} />}>
                  Sửa
                </Button>
              </Link>
              <DeleteButton
                action={deleteFaq.bind(null, f.id)}
                confirmMessage="Xóa câu hỏi này?"
              />
            </div>
          ),
        },
      ]}
    />
  );
}
