// Stage 8: read/write expert reference movement vectors ("ghost" arrays)
// used by src/lib/render/ghostScene.ts and src/lib/motion/compareToGhost.ts.

import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "./client";
import type { ReferenceGhost } from "@/types/session";

const REFERENCE_GHOSTS_COLLECTION = "referenceGhosts";

export async function getReferenceGhost(exercise: string): Promise<ReferenceGhost | null> {
  const snapshot = await getDoc(doc(collection(db, REFERENCE_GHOSTS_COLLECTION), exercise));
  return snapshot.exists() ? (snapshot.data() as ReferenceGhost) : null;
}
