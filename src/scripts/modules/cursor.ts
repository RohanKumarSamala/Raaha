/** Custom cursor module — default native mouse enabled. */
import { finePointer, reduced, gsap } from '../core/gsap';
import { $, $$ } from '../core/dom';

export function initCursor() {
  // Disabled — using default native mouse cursor
  return;
}

export function initMagnetic(scope: ParentNode = document) {
  if (!finePointer || reduced) return;
  $$('[data-magnetic]', scope).forEach((btn) => {
    const inner = $('[data-magnetic-inner]', btn);
    const strength = parseFloat(btn.dataset.magnetic || '0.28');
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.8, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.8, ease: 'power3.out' });
    const ixTo = inner && gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'power3.out' });
    const iyTo = inner && gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'power3.out' });

    btn.addEventListener('pointermove', (e) => {
      const b = btn.getBoundingClientRect();
      const dx = e.clientX - (b.left + b.width / 2);
      const dy = e.clientY - (b.top + b.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      ixTo?.(dx * strength * 0.5);
      iyTo?.(dy * strength * 0.5);
    });
    btn.addEventListener('pointerleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 1.3, ease: 'elastic.out(1, 0.45)' });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1.3, ease: 'elastic.out(1, 0.45)' });
    });
  });
}
