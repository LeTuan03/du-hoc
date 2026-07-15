import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Tư vấn Du học Mỹ, Canada, Úc, Anh, Hàn, Nhật | Tỷ lệ visa 95%`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "du học",
    "tư vấn du học",
    "du học Mỹ",
    "du học Canada",
    "du học Úc",
    "du học Anh",
    "du học Hàn Quốc",
    "du học Nhật Bản",
    "học bổng du học",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.fullName,
    description: siteConfig.description,
    images: [
      {
        url: `/images/logo.svg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  icons: {
    icon: "/images/logo.svg",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.fullName,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body style={{ fontFamily: "var(--font-be-vietnam), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
