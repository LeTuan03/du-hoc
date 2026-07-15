"use client";

import "@ant-design/v5-patch-for-react-19";
import { App, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: "#1e4fa3",
          borderRadius: 8,
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
