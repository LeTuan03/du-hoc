import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AdminProviders } from "@/components/admin/AdminProviders";

/** Layout gốc cho toàn bộ /admin — inject style antd (SSR) + theme */
export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AntdRegistry>
      <AdminProviders>{children}</AdminProviders>
    </AntdRegistry>
  );
}
