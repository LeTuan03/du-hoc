"use server";

import {
  SETTING_DEFAULTS,
  settingRepository,
  type SettingKey,
} from "../repositories/settingRepository";
import { settingsSchema } from "../validators/admissions.schema";
import { runMutation, str, type ActionResult } from "./util";

/** Cấu hình site — hiển thị ở header/footer/trang liên hệ của website public */

export async function updateSettings(fd: FormData): Promise<ActionResult> {
  const input = Object.fromEntries(
    (Object.keys(SETTING_DEFAULTS) as SettingKey[]).map((key) => [
      key,
      str(fd, key),
    ]),
  );

  return runMutation(
    settingsSchema,
    input,
    (data) => settingRepository.setMany(data),
    "settings.manage",
  );
}
