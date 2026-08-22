// Stage 8-9 endpoint: persists a finished session to Firestore and appends
// its summary metrics to Google Sheets via gws.

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { logSessionToSheet } from "@/lib/sheets/logSession";
import type { SessionLog } from "@/types/session";

export async function POST(req: NextRequest) {
  const session = (await req.json()) as SessionLog;

  await adminDb.collection("sessions").doc(session.sessionId).set(session);
  await logSessionToSheet(session);

  return NextResponse.json({ ok: true });
}
