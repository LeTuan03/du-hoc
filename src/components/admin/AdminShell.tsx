"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Layout, Menu } from "antd";
import {
  CircleHelp,
  ExternalLink,
  GraduationCap,
  Globe,
  Landmark,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Newspaper,
  Users,
} from "lucide-react";

const { Sider, Content } = Layout;

const menuItems = [
  { key: "/admin", icon: <LayoutDashboard size={16} />, label: <Link href="/admin">Dashboard</Link> },
  { key: "/admin/leads", icon: <Users size={16} />, label: <Link href="/admin/leads">Quản lý Leads</Link> },
  { key: "/admin/articles", icon: <Newspaper size={16} />, label: <Link href="/admin/articles">Bài viết</Link> },
  { key: "/admin/universities", icon: <Landmark size={16} />, label: <Link href="/admin/universities">Trường</Link> },
  { key: "/admin/scholarships", icon: <GraduationCap size={16} />, label: <Link href="/admin/scholarships">Học bổng</Link> },
  { key: "/admin/countries", icon: <Globe size={16} />, label: <Link href="/admin/countries">Quốc gia</Link> },
  { key: "/admin/testimonials", icon: <MessageSquareQuote size={16} />, label: <Link href="/admin/testimonials">Cảm nhận học viên</Link> },
  { key: "/admin/faqs", icon: <CircleHelp size={16} />, label: <Link href="/admin/faqs">FAQ</Link> },
  {
    key: "site",
    icon: <ExternalLink size={16} />,
    label: (
      <Link href="/" target="_blank">
        Xem website
      </Link>
    ),
  },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const selectedKey =
    menuItems
      .map((i) => i.key)
      .filter((k) =>
        k === "/admin" ? pathname === "/admin" : pathname.startsWith(k),
      )
      .sort((a, b) => b.length - a.length)[0] ?? "/admin";

  async function logout() {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Layout style={{ minHeight: "100vh" }} hasSider>
      <Sider
        breakpoint="md"
        collapsedWidth={0}
        width={240}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div className="flex items-center gap-2 px-5 py-5">
            <img src="/images/logo.svg" alt="Logo" className="grid h-10 w-10 place-items-center" />
            <div>
              <p className="text-sm font-extrabold text-white">GlobalEdu</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">
                Admin CMS
              </p>
            </div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ flex: 1, borderInlineEnd: 0, overflowY: "auto" }}
          />
          <div className="border-t border-white/10 p-3">
            <p className="truncate px-2 pb-2 text-xs text-slate-400">{email}</p>
            <Button
              type="text"
              icon={<LogOut size={14} />}
              onClick={logout}
              style={{ color: "rgba(255,255,255,0.75)", width: "100%" }}
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </Sider>
      <Layout>
        <Content style={{ padding: 24, minWidth: 0 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
