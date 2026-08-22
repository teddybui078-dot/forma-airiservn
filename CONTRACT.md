# Contract

This is the interface boundary between Forma's modules. If everyone builds against these shapes, features built in parallel merge into `main` without touching each other's files.

## Rule of thumb

- **Own your folder, don't reach into someone else's.** Each pipeline stage lives in one `src/lib/<stage>/` folder (see table below) with one owner at a time. Import from another stage only through the exported function signatures below - never reach into another stage's internals.
- **Shared types are the contract.** `src/types/*.ts` is the one place two features are guaranteed to collide. Don't change a field on an existing type to fit your feature - add a new optional field instead, and flag breaking changes in your PR description so the other in-flight branch can rebase against it.
- **New pipeline stage = new folder + new file, not an edit to an existing one.** Adding stage-4b logic (e.g. a new alignment algorithm)? New file in `src/lib/motion/`, not a rewrite of `dtw.ts`.
- **UI components take data as props, never fetch it themselves.** `src/components/analysis/*` render `FormAnalysis` / `CoachingCue` objects passed in - they don't call Gemini or Firebase directly. This is what lets someone build the UI against `MOCK_ANALYSIS` in `analysis/page.tsx` while someone else builds the real pipeline behind it, in parallel, with zero merge conflicts.

## Pipeline stage ownership

| Stage | Folder | Exports (the contract) | Consumes | Produces |
|---|---|---|---|---|
| 1. Camera feed | `src/components/analysis/PoseOverlay.tsx` | `<PoseOverlay source />` | `MediaStream` / uploaded file | `HTMLVideoElement` frames |
| 2. Pose tracking | `src/lib/pose/landmarker.ts` | `createPoseLandmarker()`, `PoseLandmarkerHandle.detectForVideo()` | video frame + timestamp | `PoseFrame` (`src/types/pose.ts`) |
| 3. Ghost overlay | `src/lib/render/ghostScene.ts` | `createGhostScene()`, `GhostScene.update()` | `PoseFrame` (reference) + error joint set | rendered canvas frame |
| 4. Joint math + DTW | `src/lib/motion/*.ts` | `computeJointAngles()`, `dtw()`, `computeAngleDeltas()`, `jointsOutOfAlignment()` | `PoseFrame` (user + reference) | `JointAngleDelta[]` (`src/types/analysis.ts`) |
| 5. Analysis Brain | `src/lib/ai/gemini.ts` + `POST /api/analyze` | `analyzeForm(deltas)` | `JointAngleDelta[]` | root cause `string` |
| 6. Voice Coach | `src/lib/ai/gemini.ts` + `POST /api/coach` | `generateCoachingCue(rootCause)` | root cause `string` | `CoachingCue` (`src/types/coaching.ts`) |
| 7. Fish Audio TTS | `src/lib/tts/fishAudio.ts` + `POST /api/speak` | `synthesizeSpeech(text)` | cue `string` | `ArrayBuffer` (mp3) |
| 8. Firebase storage | `src/lib/firebase/*.ts` + `POST /api/session` | `getReferenceGhost()`, `adminDb`, `adminStorage` | `SessionLog` / `ReferenceGhost` (`src/types/session.ts`) | Firestore/Storage documents |
| 9. Sheets logging | `src/lib/sheets/logSession.ts` | `logSessionToSheet(session)` | `SessionLog` | row appended via `gws` |

## API routes (client <-> server boundary)

All routes are in `src/app/api/*/route.ts`. Request/response bodies are the JSON-serialized shape of the types below - keep them in sync with `src/types/`, don't invent parallel shapes per route.

| Route | Method | Body in | Body out |
|---|---|---|---|
| `/api/analyze` | POST | `{ deltas: JointAngleDelta[] }` | `{ rootCause: string }` |
| `/api/coach` | POST | `{ rootCause: string }` | `CoachingCue` |
| `/api/speak` | POST | `{ text: string }` | `audio/mpeg` binary |
| `/api/session` | POST | `SessionLog` | `{ ok: true }` |

## Adding a new feature

1. Check the table above - if your feature lives inside one stage's folder, build it there and only import the existing exported functions from other stages.
2. If your feature needs a new shared shape (e.g. a new field on `FormAnalysis`), add it as optional in `src/types/`, open a small PR for just that type change, and merge it first so parallel branches rebase cleanly.
3. Wire real logic behind the existing mock data in `analysis/page.tsx` (`MOCK_ANALYSIS`, `MOCK_CUE`) rather than restructuring the page - swap the mock for a real call once your stage is ready.
4. New UI card or panel? Add it as a new component in `src/components/analysis/` and slot it into the sidebar in `analysis/page.tsx` - don't restructure existing cards to make room.
