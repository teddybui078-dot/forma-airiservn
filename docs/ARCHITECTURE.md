# Architecture

Forma's pipeline runs mostly client-side for low latency, with server-side API routes only where a secret key or persistence layer is required.

| # | Stage | Role | Code |
|---|---|---|---|
| 1 | Web Camera Feed | Streams live webcam frames at 60 FPS | `src/components/analysis/PoseOverlay.tsx` |
| 2 | MediaPipe Pose Landmarker | Detects 33 3D body joints locally via WASM | `src/lib/pose/landmarker.ts` |
| 3 | Three.js Overlay | Renders the translucent reference ghost, highlights bad joints in red | `src/lib/render/ghostScene.ts` |
| 4 | Joint Math & DTW Engine | Calculates joint angles, aligns rep timing against the ghost | `src/lib/motion/jointAngles.ts`, `src/lib/motion/dtw.ts`, `src/lib/motion/compareToGhost.ts` |
| 5 | Gemini Analysis Brain | Turns a classified fault into a biomechanical root cause | `src/lib/ai/analysisBrain.ts` (`analyzeForm`), `src/app/api/analyze/route.ts` |
| 6 | Gemini Voice Coach | Converts the root cause into a 5-word cue | `src/lib/ai/coach.ts` (`generateCoachingCue`), `src/app/api/coach/route.ts` |
| 7 | OpenAI TTS | Speaks the cue out loud | `src/lib/tts/openaiVoice.ts`, `src/app/api/speak/route.ts` |
| 8 | Google Workspace CLI (gws) | Appends session metrics to Google Sheets | `src/lib/sheets/logSession.ts` |

Stages 1-4 run entirely in the browser so pose tracking and ghost comparison stay real-time. Stages 5-8 are server-side API routes so the Gemini and OpenAI credentials never reach the client.

There's no backend/database in this project. The reference ghost is landmark data, not photos or video, so it ships as a static JSON asset (`src/data/reference/*.json`, read via `src/lib/reference/referenceGhost.ts`) instead of living in cloud storage. Sheets logging is the only persistence layer.

## Design system

The UI follows the "Ghost Coach" design system - Sand Dune and Hunter Green, Organic Minimalism, Plus Jakarta Sans. Tokens live in `tailwind.config.ts`, ported from [`../stitch_ghost_coach_form_analysis/DESIGN.md`](../stitch_ghost_coach_form_analysis/DESIGN.md). The initial `/analysis` screen (`src/app/(dashboard)/analysis/page.tsx`) is a direct port of the Stitch-generated mockup in that same folder.
