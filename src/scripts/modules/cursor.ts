/** Custom cursor with interpolated ring, contextual states and magnetic targets. */
import { gsap, finePointer, reduced, root } from '../core/gsap';
import { $, $$ } from '../core/dom';

const LABELS: Record<string, string> = { view: 'View', drag: 'Drag' };

export function initCursor() {
  const el = $('[data-cursor-root]');
  if (!el || !finePointer || reduced) return;

  const ring = $('[data-cursor-ring]', el)!;
  const dot = $('[data-cursor-dot]', el)!;
  const label = $('[data-cursor-label]', el)!;
  root.classList.add('has-cursor');

  const mouse = { x: -100, y: -100 };
  const r = { x: -100, y: -100 };
  const d = { x: -100, y: -100 };
  let started = false;
  let state = '';

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!started) {
        r.x = d.x = mouse.x;
        r.y = d.y = mouse.y;
        started = true;
      }
      el.classList.remove('cursor--out');
    },
    { passive: true },
  );
  document.documentElement.addEventListener('pointerleave', () => el.classList.add('cursor--out'));
  window.addEventListener('pointerdown', () => el.classList.add('cursor--down'));
  window.addEventListener('pointerup', () => el.classList.remove('cursor--down'));

  gsap.ticker.add((_t, delta) => {
    const k = Math.min(delta / 16.7, 3);
    d.x += (mouse.x - d.x) * Math.min(0.55 * k, 1);
    d.y += (mouse.y - d.y) * Math.min(0.55 * k, 1);
    r.x += (mouse.x - r.x) * Math.min(0.15 * k, 1);
    r.y += (mouse.y - r.y) * Math.min(0.15 * k, 1);
    dot.style.transform = `translate3d(${d.x}px, ${d.y}px, 0)`;
    ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
  });

  const setState = (next: string, text = '') => {
    if (next === state && label.textContent === text) return;
    if (state) el.classList.remove(`cursor--${state}`);
    state = next;
    if (state) el.classList.add(`cursor--${state}`);
    label.textContent = text;
  };

  document.addEventListener('pointerover', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, input, textarea, select, label');
    if (!t) return setState('');
    const s = t.dataset.cursor ?? (t.matches('input, textarea, select') ? 'text' : 'link');
    setState(s, t.dataset.cursorLabel ?? LABELS[s] ?? '');
  });
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
