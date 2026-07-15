import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase dùng service role key — chỉ import phía server (bypass RLS).
 * Trả về null khi env chưa cấu hình → route upload fallback về filesystem local.
 */

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

let client: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client =
    url && key
      ? createClient(url, key, { auth: { persistSession: false } })
      : null;
  return client;
}
