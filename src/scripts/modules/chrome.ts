/** Header colour probing, scroll rail and rotating badge. */
import { gsap, ScrollTrigger, root } from '../core/gsap';
import { $, $$ } from '../core/dom';
import { scrollToTarget, scrollVelocity } from '../core/scroll';

/**
 * The header adopts the surface beneath it: we hit-test the point under the
 * header and walk up to the nearest [data-header]. Works with pins, arches
 * and overlapping layers where section-boundary triggers would not.
 */
export function initHeaderTheme() {
  let lastY = -1;
  let lastW = -1;
  const probe = () => {
    if (root.classList.contains('menu-open')) return;
    const y = window.scrollY;
    if (y === lastY && window.innerWidth === lastW) return;
    lastY = y;
    lastW = window.innerWidth;
    const surfaceAt = (x: number, y: number) => {
      for (const el of document.elementsFromPoint(x, y)) {
        const host = (el as HTMLElement).closest<HTMLElement>('[data-header]:not(html)');
        if (host) return host.dataset.header;
      }
    };
    const header = surfaceAt(window.innerWidth / 2, Math.min(56, window.innerHeight * 0.06));
    if (header && root.dataset.header !== header) root.dataset.header = header;
    // The rail sits mid-height on the left, often over a different surface.
    const rail = surfaceAt(Math.max(8, window.innerWidth * 0.07), window.innerHeight * 0.55) ?? header;
    if (rail && root.dataset.rail !== rail) root.dataset.rail = rail;
  };
  gsap.ticker.add(probe);
  window.addEventListener('resize', () => (lastY = -1));
}

export function initRail() {
  const rail = $('[data-rail]');
  if (!rail) return;
  const track = $('.rail__track', rail)!;
  const num = $('[data-rail-num]', rail)!;
  let last = -1;

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const p = self.progress;
      track.style.setProperty('--p', p.toFixed(4));
      const pct = Math.round(p * 100);
      if (pct !== last) {
        num.textContent = String(pct).padStart(2, '0');
        last = pct;
      }
      root.classList.toggle('rail-end', p > 0.985);
    },
  });

  $('[data-rail-scroll]', rail)?.addEventListener('click', () => {
    if (root.classList.contains('rail-end')) scrollToTarget(0);
    else scrollToTarget(window.scrollY + window.innerHeight * 0.9);
  });
}

export function initBadges() {
  const rings = $$('[data-badge-ring]');
  if (!rings.length) return;
  let angle = 0;
  let lastY = window.scrollY;
  gsap.ticker.add((_t, delta) => {
    const y = window.scrollY;
    const v = scrollVelocity() || y - lastY;
    lastY = y;
    angle += (delta / 1000) * 6 + v * 0.12;
    const t = `rotate(${angle % 360}deg)`;
    for (const r of rings) r.style.transform = t;
  });
}
