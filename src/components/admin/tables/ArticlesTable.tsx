"use client";

import Link from "next/link";
import { App, Button, Table, Tag, Tooltip } from "antd";
import { ExternalLink, Link2, Pencil } from "lucide-react";
import { ARTICLE_CATEGORY_LABELS, type Article } from "@/server/types";
import { deleteArticle } from "@/server/actions/articleActions";
import { DeleteButton } from "../DeleteButton";
import { formatDate } from "@/lib/format";

export function ArticlesTable({ articles }: { articles: Article[] }) {
  const { message } = App.useApp();

  async function copyLink(slug: string) {
    await navigator.clipboard.writeText(
      `${window.location.origin}/tin-tuc/${slug}`,
    );
    message.success("Đã sao chép liên kết bài viết");
  }

  return (
    <Table<Article>
      rowKey="id"
      dataSource={articles}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      scroll={{ x: 800 }}
      columns={[
        {
          title: "Tiêu đề",
          dataIndex: "title",
          render: (_, a) => (
            <>
              <Link
                href={`/admin/articles/${a.id}`}
                className="font-semibold text-slate-900 hover:text-[#1e4fa3]"
              >
                {a.title}
              </Link>
              <p className="text-xs text-slate-400">/tin-tuc/{a.slug}</p>
            </>
          ),
        },
        {
          title: "Danh mục",
          dataIndex: "category",
          width: 140,
          render: (category: Article["category"]) => (
            <Tag color="blue">{ARTICLE_CATEGORY_LABELS[category]}</Tag>
          ),
        },
        {
          title: "Ngày đăng",
          dataIndex: "publishedAt",
          width: 120,
          render: (d: string) => formatDate(d),
        },
        {
          title: "SEO",
          width: 110,
          render: (_, a) =>
            a.metaTitle && a.metaDescription ? (
              <Tag color="green">Đủ meta</Tag>
            ) : (
              <Tooltip title="Chưa điền meta title/description riêng — đang dùng tiêu đề & mô tả ngắn">
                <Tag color="orange">Mặc định</Tag>
              </Tooltip>
            ),
        },
        {
          title: "",
          width: 280,
          render: (_, a) => (
            <div className="flex items-center justify-end gap-2">
              <Tooltip title="Sao chép liên kết để gửi cho khách">
                <Button
                  size="small"
                  icon={<Link2 size={13} />}
                  onClick={() => copyLink(a.slug)}
                >
                  Copy link
                </Button>
              </Tooltip>
              <Link href={`/tin-tuc/${a.slug}`} target="_blank">
                <Button size="small" icon={<ExternalLink size={13} />}>
                  Xem
                </Button>
              </Link>
              <Link href={`/admin/articles/${a.id}`}>
                <Button size="small" type="primary" ghost icon={<Pencil size={13} />}>
                  Sửa
                </Button>
              </Link>
              <DeleteButton
                action={deleteArticle.bind(null, a.id)}
                confirmMessage={`Xóa bài viết "${a.title}"?`}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
