/**
 * data-fit="0.94" → shrink a no-wrap display heading until it fits within that
 * fraction of its container (never enlarges). Keeps editorial one-line titles
 * safe when real copy is longer than the placeholder.
 */
import { $$ } from './dom';

export function initFit(scope: ParentNode = document) {
  const els = $$('[data-fit]', scope);
  if (!els.length) return;
  const range = document.createRange();

  const run = () => {
    for (const el of els) {
      el.style.fontSize = '';
      const ratio = parseFloat(el.dataset.fit || '0.94');
      const box = Math.min(el.parentElement?.clientWidth ?? window.innerWidth, document.documentElement.clientWidth);
      range.selectNodeContents(el);
      const width = range.getBoundingClientRect().width;
      const max = box * ratio;
      if (width > max) el.style.fontSize = `${(parseFloat(getComputedStyle(el).fontSize) * max) / width}px`;
    }
  };

  run();
  let t = 0;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = window.setTimeout(run, 120);
  });
}
