// Stage 9: Google Workspace CLI (gws).
// Appends session metrics, rep counts, and error logs to Google Sheets.
// This shells out to the `gws` CLI (see scripts/log-session.sh) rather than
// calling the Sheets API directly, per the project's tooling choice.

import { spawn } from "node:child_process";
import type { SessionLog } from "@/types/session";

export async function logSessionToSheet(session: SessionLog): Promise<void> {
  const spreadsheetId = process.env.GWS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("GWS_SPREADSHEET_ID is not set");

  const row = [
    session.sessionId,
    session.athleteId,
    session.exercise,
    session.reps,
    new Date(session.startedAt).toISOString(),
  ];

  await new Promise<void>((resolve, reject) => {
    const child = spawn("gws", [
      "sheets",
      "append",
      "--spreadsheet",
      spreadsheetId,
      "--row",
      row.join(","),
    ]);
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`gws exited with code ${code}`))));
  });
}
