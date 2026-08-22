// Reference ghost data - a recorded "correct form" rep, stored as a static
// PoseFrame[] JSON asset (src/data/reference/) rather than a backend. No
// Storage/Firestore needed: the reference is just landmark coordinates, not
// images, and it ships with the app bundle.
//
// Shared, stable infrastructure - not owned by a single track. Both
// ghost-overlay (renders it) and motion-classifier (diffs against it)
// import from here; extend by adding a new JSON file, not by changing this
// function's signature.

import type { ReferenceGhost } from "@/types/session";
import squatReference from "@/data/reference/squat.json";

const REFERENCE_GHOSTS: Record<string, ReferenceGhost> = {
  squat: squatReference as ReferenceGhost,
};

export async function getReferenceGhost(exercise: string): Promise<ReferenceGhost | null> {
  return REFERENCE_GHOSTS[exercise] ?? null;
}
