"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Layout, Menu, Tag } from "antd";
import {
  BookOpen,
  CalendarCheck,
  ChartNoAxesCombined,
  CircleHelp,
  ExternalLink,
  GraduationCap,
  Globe,
  Landmark,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Newspaper,
  Settings,
  UserCog,
  Users,
} from "lucide-react";
import { can, USER_ROLE_LABELS, type Permission, type UserRole } from "@/server/types";

const { Sider, Content } = Layout;

/** Mục menu; `permission` để trống nghĩa là mọi vai trò đều thấy */
interface NavItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  permission?: Permission;
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Tuyển sinh",
    items: [
      { key: "/admin", icon: <LayoutDashboard size={16} />, label: "Dashboard" },
      { key: "/admin/leads", icon: <Users size={16} />, label: "Hồ sơ ứng viên" },
      { key: "/admin/appointments", icon: <CalendarCheck size={16} />, label: "Lịch hẹn tư vấn" },
      {
        key: "/admin/reports",
        icon: <ChartNoAxesCombined size={16} />,
        label: "Báo cáo chuyển đổi",
        permission: "reports.view",
      },
    ],
  },
  {
    title: "Nội dung tuyển sinh",
    items: [
      { key: "/admin/universities", icon: <Landmark size={16} />, label: "Trường đối tác", permission: "content.manage" },
      { key: "/admin/programs", icon: <BookOpen size={16} />, label: "Ngành học", permission: "content.manage" },
      { key: "/admin/scholarships", icon: <GraduationCap size={16} />, label: "Học bổng", permission: "content.manage" },
      { key: "/admin/countries", icon: <Globe size={16} />, label: "Quốc gia", permission: "content.manage" },
      { key: "/admin/articles", icon: <Newspaper size={16} />, label: "Bài viết", permission: "content.manage" },
      { key: "/admin/testimonials", icon: <MessageSquareQuote size={16} />, label: "Câu chuyện học viên", permission: "content.manage" },
      { key: "/admin/faqs", icon: <CircleHelp size={16} />, label: "FAQ", permission: "content.manage" },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { key: "/admin/users", icon: <UserCog size={16} />, label: "Tư vấn viên", permission: "users.manage" },
      { key: "/admin/settings", icon: <Settings size={16} />, label: "Cấu hình site", permission: "settings.manage" },
    ],
  },
];

export function AdminShell({
  fullName,
  email,
  role,
  children,
}: {
  fullName: string;
  email: string;
  role: UserRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((i) => !i.permission || can(role, i.permission)),
    }))
    .filter((group) => group.items.length > 0);

  const allKeys = visibleGroups.flatMap((g) => g.items.map((i) => i.key));
  const selectedKey =
    allKeys
      .filter((k) => (k === "/admin" ? pathname === "/admin" : pathname.startsWith(k)))
      .sort((a, b) => b.length - a.length)[0] ?? "/admin";

  const menuItems = [
    ...visibleGroups.map((group) => ({
      key: group.title,
      label: group.title,
      type: "group" as const,
      children: group.items.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: <Link href={item.key}>{item.label}</Link>,
      })),
    })),
    { key: "divider", type: "divider" as const },
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
        width={252}
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
            <p className="truncate px-2 text-sm font-semibold text-white">
              {fullName}
            </p>
            <p className="truncate px-2 pb-2 text-xs text-slate-400">{email}</p>
            <div className="px-2 pb-2">
              <Tag color={role === "consultant" ? "blue" : "gold"} style={{ marginInlineEnd: 0 }}>
                {USER_ROLE_LABELS[role]}
              </Tag>
            </div>
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
