// Stage 6-7: the distilled coaching cue and its spoken form.

export interface CoachingCue {
  /** Root cause distilled into a ~5-word spoken correction, e.g. "Push your left knee outward!" */
  text: string;
  createdAt: number;
}

export interface SpokenCue extends CoachingCue {
  audioUrl: string;
}
