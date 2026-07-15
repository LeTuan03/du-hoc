import { NextResponse } from "next/server";

/** Health-check endpoint cho giám sát uptime (SRS mục 16.4) */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
