import { NextResponse } from "next/server";
import { sessionCookieOptions } from "@/server/auth";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set({ ...sessionCookieOptions, value: "", maxAge: 0 });
  return res;
}
