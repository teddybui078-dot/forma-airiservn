// Sheets track endpoint: a finished session's summary metrics, logged to
// Google Sheets via gws.

import { NextRequest, NextResponse } from "next/server";
import { logSessionToSheet } from "@/lib/sheets/logSession";
import type { SessionLog } from "@/types/session";

export async function POST(req: NextRequest) {
  const session = (await req.json()) as SessionLog;
  await logSessionToSheet(session);
  return NextResponse.json({ ok: true });
}
