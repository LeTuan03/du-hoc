import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

const menu = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/leads", label: "Quản lý Leads", icon: "👥" },
];

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col bg-[#0f172a] text-slate-300 md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1e4fa3] font-extrabold text-white">
            G
          </span>
          <div>
            <p className="text-sm font-extrabold text-white">GlobalEdu</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">
              Admin CMS
            </p>
          </div>
        </div>
        <nav className="mt-2 flex-1 space-y-1 px-3" aria-label="Menu quản trị">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-white/10 hover:text-white"
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-white/10 hover:text-white"
          >
            <span aria-hidden>🌐</span>
            Xem website
          </Link>
        </nav>
        <div className="border-t border-white/10 p-3">
          <p className="truncate px-3 pb-2 text-xs text-slate-400">
            {session.email}
          </p>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between bg-[#0f172a] px-4 py-3 text-white md:hidden">
          <span className="font-extrabold">GlobalEdu Admin</span>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/leads">Leads</Link>
          </nav>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
