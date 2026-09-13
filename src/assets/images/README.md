# RAHA imagery

Drop supplied photography, renders and plans here using the paths referenced in
`src/data/*.ts` (e.g. `home/hero-day.jpg`, `residences/001/plan-1.png`).

- Any file that exists is picked up automatically and served as responsive AVIF + WebP.
- Any file that is missing renders a placeholder of the same ratio.
- Supply the highest resolution available (≥ 2560px on the long edge for full-bleed images).
- Adjust crops with `position` on the media entry (e.g. `position: '50% 70%'`).
