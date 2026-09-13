/** Shared content types. */

export type Tone = 'sky' | 'dusk' | 'night' | 'interior' | 'stone' | 'garden' | 'sea' | 'aerial' | 'deep';

export interface MediaRef {
  /** Path relative to /src/assets/images (e.g. "home/hero-day.jpg"). */
  src?: string;
  /** Optional video in /public (e.g. "/video/hero.mp4"). Poster comes from `src`. */
  video?: string;
  alt: string;
  /** Placeholder palette used until the real asset exists. */
  tone?: Tone;
  /** Placeholder caption (dev aid) — never rendered once the asset exists. */
  label?: string;
  /** Placeholder drawing variant for plans. */
  placeholder?: 'plan-single' | 'plan-duplex';
  /** CSS object-position, e.g. "50% 70%" — recalculate crops per asset. */
  position?: string;
}
