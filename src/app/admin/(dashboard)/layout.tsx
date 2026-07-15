import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
