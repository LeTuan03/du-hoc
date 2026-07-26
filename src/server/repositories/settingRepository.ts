import { cache } from "react";
import { prisma } from "../db";

/**
 * Cấu hình site dạng key-value (SRS mục 6.2 `settings`).
 * Khóa nào chưa có trong DB thì dùng giá trị mặc định bên dưới, nên trang
 * public luôn render được kể cả khi admin chưa cấu hình gì.
 */

export const SETTING_DEFAULTS = {
  site_name: "GlobalEdu",
  hotline: "1900 6789",
  email: "tuvan@globaledu.edu.vn",
  address: "Tầng 8, Tòa nhà Sunrise, 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
  working_hours: "Thứ 2 - Thứ 7: 8h00 - 17h30",
  facebook_url: "",
  youtube_url: "",
  zalo_url: "",
  tiktok_url: "",
  default_meta_title: "Tư vấn du học uy tín — GlobalEdu",
  default_meta_description:
    "Tư vấn du học miễn phí: chọn trường, săn học bổng, chuẩn bị hồ sơ và visa. Đồng hành cùng bạn từ lúc tìm hiểu đến khi nhập học.",
  consultation_response_hours: "24",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;

export type SiteSettings = Record<SettingKey, string>;

export const settingRepository = {
  getAll: cache(async (): Promise<SiteSettings> => {
    const rows = await prisma.setting.findMany().catch(() => []);
    const stored = new Map(rows.map((r) => [r.key, r.value]));
    const result = { ...SETTING_DEFAULTS } as SiteSettings;
    for (const key of Object.keys(SETTING_DEFAULTS) as SettingKey[]) {
      const value = stored.get(key);
      if (value !== undefined && value !== "") result[key] = value;
    }
    return result;
  }),

  /** Ghi đè các khóa được gửi lên; khóa lạ bị bỏ qua để tránh rác dữ liệu */
  async setMany(values: Partial<Record<SettingKey, string>>): Promise<void> {
    const entries = Object.entries(values).filter(([key]) =>
      Object.prototype.hasOwnProperty.call(SETTING_DEFAULTS, key),
    ) as [SettingKey, string][];

    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        }),
      ),
    );
  },
};
