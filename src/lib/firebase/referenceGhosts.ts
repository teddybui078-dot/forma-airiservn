// Firebase track: stores and serves the reference "ghost" images/clips
// (expert reference movements) used by the ghost-overlay and
// motion-classifier tracks. Sheets logging is a separate track/concern -
// see src/lib/sheets/.

import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "./client";
import type { ReferenceGhost } from "@/types/session";

const REFERENCE_GHOSTS_COLLECTION = "referenceGhosts";

export async function getReferenceGhost(exercise: string): Promise<ReferenceGhost | null> {
  const snapshot = await getDoc(doc(collection(db, REFERENCE_GHOSTS_COLLECTION), exercise));
  return snapshot.exists() ? (snapshot.data() as ReferenceGhost) : null;
}
