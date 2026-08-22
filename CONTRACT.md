# Contract

This is the interface boundary between Forma's modules. If everyone builds against these shapes, features built in parallel merge into `main` without touching each other's files.

## Rule of thumb

- **Own your folder, don't reach into someone else's.** Each track owns a specific set of files (see the worktree table below) with one owner at a time. Import from another track only through the exported function signatures in the contract table - never reach into another track's internals.
- **Shared types are the contract.** `src/types/*.ts` is the one place two tracks are guaranteed to collide. Don't change a field on an existing type to fit your feature - add a new optional field instead, and flag breaking changes in your PR description so the other in-flight branch can rebase against it.
- **New pipeline stage = new file, not an edit to an existing one.** Adding stage-4b logic (e.g. a new classifier)? New file in `src/lib/motion/`, not a rewrite of `dtw.ts`.
- **UI components take data as props, never fetch it themselves.** `src/components/analysis/*` render `FormAnalysis` / `CoachingCue` objects passed in - they don't call Gemini or Firebase directly. This is what lets someone build the UI against `MOCK_ANALYSIS` in `analysis/page.tsx` while someone else builds the real pipeline behind it, in parallel, with zero merge conflicts.
- **Camera capture and ghost rendering are separate components on purpose.** `CameraFeed.tsx` (video + MediaPipe loop) and `GhostCanvas.tsx` (Three.js render) both mount inside `PoseOverlay.tsx`, but neither touches the other's file. `PoseOverlay.tsx` itself is the coaching-loop track's integration point - only that track edits it.

## Pipeline stage ownership

| Stage | Files | Exports (the contract) | Consumes | Produces |
|---|---|---|---|---|
| 1. Camera feed | `src/components/analysis/CameraFeed.tsx`, `src/lib/pose/landmarker.ts` | `<CameraFeed source onFrame />`, `createPoseLandmarker()` | `MediaStream` / uploaded file | `PoseFrame` (`src/types/pose.ts`) per frame, via `onFrame` |
| 2. Ghost overlay | `src/components/analysis/GhostCanvas.tsx`, `src/lib/render/ghostScene.ts` | `<GhostCanvas referenceFrame errorJoints />`, `createGhostScene()` | `PoseFrame` (reference) + error joint set | rendered canvas frame |
| 3. Joint math + classifier | `src/lib/motion/*.ts` | `computeJointAngles()`, `dtw()`, `computeAngleDeltas()`, `classifyForm()` | `PoseFrame` (user + reference) | `FormClassification` (`src/types/analysis.ts`) |
| 4. Analysis Brain | `src/lib/ai/analysisBrain.ts` + `POST /api/analyze` | `analyzeForm(classification)` | `FormClassification` | root cause `string` |
| 5. Voice Coach + integration loop | `src/lib/ai/coach.ts` + `POST /api/coach`, `src/components/analysis/PoseOverlay.tsx` | `generateCoachingCue(rootCause)` | root cause `string` | `CoachingCue` (`src/types/coaching.ts`) |
| 6. Fish Audio TTS | `src/lib/tts/fishAudio.ts` + `POST /api/speak` | `synthesizeSpeech(text)` | cue `string` | `ArrayBuffer` (mp3) |
| 7. Firebase + Sheets | `src/lib/firebase/*.ts`, `src/lib/sheets/logSession.ts` + `POST /api/session` | `getReferenceGhost()`, `adminDb`, `adminStorage`, `logSessionToSheet()` | `SessionLog` / `ReferenceGhost` (`src/types/session.ts`) | Firestore/Storage docs + a Sheets row via `gws` |

`src/lib/ai/geminiClient.ts` (the shared `callGemini()` fetch wrapper) is stable, shared infrastructure - built once, not owned by a track. Change its signature only with both AI-track owners' sign-off.

## The classifier (motion-classifier track)

`src/lib/motion/classifyForm.ts` takes a `JointFeatures` (the 8 features from `squat_features_augmented.csv` - see `README - training-data.md`) and returns a `FormClassification`: one of 6 `FaultLabel`s (`correct`, `shallow`, `forward_lean`, `knees_caving_in`, `heels_off_ground`, `asymmetric`) plus the joints to highlight red. It's currently a stub that always returns `correct` - fill in the trained decision boundaries without changing the function signature so nothing downstream (Analysis Brain, GhostCanvas) needs to change.

## API routes (client <-> server boundary)

All routes are in `src/app/api/*/route.ts`. Request/response bodies are the JSON-serialized shape of the types below - keep them in sync with `src/types/`, don't invent parallel shapes per route.

| Route | Method | Body in | Body out |
|---|---|---|---|
| `/api/analyze` | POST | `FormClassification` | `{ rootCause: string }` |
| `/api/coach` | POST | `{ rootCause: string }` | `CoachingCue` |
| `/api/speak` | POST | `{ text: string }` | `audio/mpeg` binary |
| `/api/session` | POST | `SessionLog` | `{ ok: true }` |

## Adding a new feature

1. Check the table above - if your feature lives inside one track's files, build it there and only import the existing exported functions from other tracks.
2. If your feature needs a new shared shape (e.g. a new field on `FormAnalysis`), add it as optional in `src/types/`, open a small PR for just that type change, and merge it first so parallel branches rebase cleanly.
3. Wire real logic behind the existing mock data in `analysis/page.tsx` (`MOCK_ANALYSIS`, `MOCK_CUE`) rather than restructuring the page - swap the mock for a real call once your stage is ready.
4. New UI card or panel? Add it as a new component in `src/components/analysis/` and slot it into the sidebar in `analysis/page.tsx` - don't restructure existing cards to make room.
