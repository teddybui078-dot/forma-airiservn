# Forma

Forma is an AI ghost coach that corrects your exercise form in real time. It tracks your body locally in the browser, overlays a translucent "ghost" of correct form on top of your live video, and speaks a short correction the moment your form breaks down.

Built for Lotushacks x Google Vietnam Community.

## How it works

1. **Web Camera Feed** streams live webcam frames to the browser at 60 FPS.
2. **MediaPipe Pose Landmarker** detects 33 3D body joints locally via WASM.
3. **Three.js Overlay** renders a translucent reference "ghost" and turns bad joints red on the live video.
4. **Joint Math & DTW Engine** calculates joint angles and compares timing against the expert ghost using Dynamic Time Warping.
5. **Gemini Analysis Brain** turns joint angle deltas into a biomechanical root cause.
6. **Gemini Voice Coach** converts the root cause into a 5-word coaching cue.
7. **Fish Audio TTS** speaks the cue out loud to the athlete.
8. **Firebase Storage/Firestore** stores raw session vectors and expert reference ghost clips.
9. **Google Workspace CLI (gws)** appends session metrics and error logs to Google Sheets.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full pipeline breakdown and [`stitch_ghost_coach_form_analysis/DESIGN.md`](stitch_ghost_coach_form_analysis/DESIGN.md) for the design system.

## Tech stack

| Layer | Technology |
|---|---|
| Computer vision | MediaPipe Pose Landmarker (WASM) |
| 3D rendering | Three.js |
| Math engine | TypeScript + custom DTW |
| Biomechanical analysis | Gemini 2.5 Flash API |
| Voice synthesis | Fish Audio API |
| Frontend | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS + Lucide icons |
| Storage | Firebase Cloud Storage / Firestore |
| Logging | Google Workspace CLI (gws) |
| Hosting | Firebase Hosting |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/            Next.js App Router pages + API routes
  components/     UI components (layout, analysis screen, design-system primitives)
  lib/
    pose/         MediaPipe Pose Landmarker wrapper
    render/       Three.js ghost overlay scene
    motion/       Joint angle math + DTW alignment engine
    ai/           Gemini client (analysis + voice coach)
    tts/          Fish Audio client
    firebase/     Firebase client + admin SDK init
    sheets/       gws session logging
  types/          Shared TypeScript types
```
