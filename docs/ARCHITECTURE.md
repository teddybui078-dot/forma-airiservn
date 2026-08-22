# Architecture

Forma's pipeline runs mostly client-side for low latency, with server-side API routes only where a secret key or persistence layer is required.

| # | Stage | Role | Code |
|---|---|---|---|
| 1 | Web Camera Feed | Streams live webcam frames at 60 FPS | `src/components/analysis/PoseOverlay.tsx` |
| 2 | MediaPipe Pose Landmarker | Detects 33 3D body joints locally via WASM | `src/lib/pose/landmarker.ts` |
| 3 | Three.js Overlay | Renders the translucent reference ghost, highlights bad joints in red | `src/lib/render/ghostScene.ts` |
| 4 | Joint Math & DTW Engine | Calculates joint angles, aligns rep timing against the ghost | `src/lib/motion/jointAngles.ts`, `src/lib/motion/dtw.ts`, `src/lib/motion/compareToGhost.ts` |
| 5 | Gemini Analysis Brain | Turns joint angle deltas into a biomechanical root cause | `src/lib/ai/gemini.ts` (`analyzeForm`), `src/app/api/analyze/route.ts` |
| 6 | Gemini Voice Coach | Converts the root cause into a 5-word cue | `src/lib/ai/gemini.ts` (`generateCoachingCue`), `src/app/api/coach/route.ts` |
| 7 | Fish Audio TTS | Speaks the cue out loud | `src/lib/tts/fishAudio.ts`, `src/app/api/speak/route.ts` |
| 8 | Firebase Storage / Firestore | Stores reference ghost clips and raw session vectors | `src/lib/firebase/*`, `src/app/api/session/route.ts` |
| 9 | Google Workspace CLI (gws) | Appends session metrics to Google Sheets | `src/lib/sheets/logSession.ts` |

Stages 1-4 run entirely in the browser so pose tracking and ghost comparison stay real-time. Stages 5-9 are server-side API routes so the Gemini, Fish Audio, and Firebase Admin credentials never reach the client.

## Design system

The UI follows the "Ghost Coach" design system - Sand Dune and Hunter Green, Organic Minimalism, Plus Jakarta Sans. Tokens live in `tailwind.config.ts`, ported from [`../stitch_ghost_coach_form_analysis/DESIGN.md`](../stitch_ghost_coach_form_analysis/DESIGN.md). The initial `/analysis` screen (`src/app/(dashboard)/analysis/page.tsx`) is a direct port of the Stitch-generated mockup in that same folder.
