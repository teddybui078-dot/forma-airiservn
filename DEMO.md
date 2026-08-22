# Demo

What the Forma demo shows, end to end, in front of judges.

## The golden path (~90 seconds)

1. **Open `/analysis`.** Sidebar, form score card, and joint status list are visible immediately - the app looks finished before anything moves.
2. **Start Live Camera** on a squat setup (barbell or bodyweight, side-on to the camera so knee valgus is visible).
3. **Perform one clean rep.** Skeleton overlay tracks in real time (stage 1-2). Form score sits high, joint rows stay neutral/green.
4. **Perform one rep with an induced fault** (deliberately let the left knee cave inward). Within a rep:
   - The Left Knee row flips to red ("Valgus") with its bar filling.
   - The ghost overlay highlights the offending joint in red (stage 3).
   - Form score visibly drops with a trend-down indicator.
   - The AI Insight card populates with the Gemini root-cause explanation (stage 5).
   - The bottom coaching bar shows the 5-word cue (stage 6) and speaks it out loud via OpenAI (stage 7) within ~1-2 seconds of the rep finishing.
5. **Point at the Sheet Sync badge** and flip to the Google Sheet already open in another tab - the row for that rep is there (stage 8-9).
6. **Close on the fix**: perform the rep again correcting the cue ("push knee out"), show the score recovering and the row turning green again.

That's the whole story: *the app watches you, tells you what's wrong, says it out loud, and remembers it* - in one unbroken loop, no slides needed.

## What's in scope

- One exercise: **squat**, one fault type: **knee valgus** (the fault the reference ghost and Gemini prompts are tuned for).
- Live camera only, 16:9 layout.
- The full 9-stage loop firing on-screen and audibly, back to back, with no manual steps between stages.
- A pre-recorded fallback clip (see below) as backup, not as the primary path.
- The Google Sheet tab, pre-opened and pre-scrolled to the right range, ready to flip to.

## What's explicitly out of scope

- **Other exercises** (deadlift, bench, etc.) - Insights/History/Performance nav items exist but stay empty; don't demo them.
- **Upload flow** - the toggle exists in the UI for completeness, but the demo only uses Live Camera. Don't switch to it live.
- **9:16 mobile layout** - toggle exists, not part of the walkthrough.
- **Accounts/auth, multi-user, team invite** - sidebar items are present but are not part of the story.
- **Historical trend charts, drill library ("View Drill" button)** - visible as UI, not wired to real data; don't click through expecting content.
- **Error recovery narration** - if MediaPipe mistracks or Gemini/OpenAI latency spikes, don't debug live; cut to the fallback clip instead of explaining the stack trace.

## Fallback plan

Keep a **pre-recorded screen capture** of one full successful golden-path run (steps 2-6 above) queued and ready to play if the venue wifi kills the Gemini/OpenAI calls or the webcam misbehaves. Practice the live version enough that the fallback is a last resort, not the plan.

## Judging narrative

Lead with the pipeline diagram (`wireframe.png` / `docs/ARCHITECTURE.md`) for ~10 seconds to frame "9 stages, mostly running locally in the browser, Gemini only called for the two things a human coach actually thinks about" - then go straight into the live rep. The technical depth (WASM pose tracking, DTW alignment, two-stage Gemini split) should come out in the Q&A, not the scripted walkthrough.
