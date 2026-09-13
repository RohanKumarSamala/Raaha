/** Clip-path wipe slider with progress bar, arrows, keys and swipe. */
import { gsap, reduced } from '../core/gsap';
import { $, $$ } from '../core/dom';

export function initSliders(scope: ParentNode = document) {
  $$('[data-slider]', scope).forEach((slider) => {
    const slides = $$('[data-slide]', slider);
    if (slides.length < 2) return;
    const viewport = $('[data-slider-viewport]', slider)!;
    const current = $('[data-slider-current]', slider);
    const bar = $('[data-slider-bar]', slider);
    const prev = $<HTMLButtonElement>('[data-slider-prev]', slider);
    const next = $<HTMLButtonElement>('[data-slider-next]', slider);
    let index = 0;
    let busy = false;

    const go = (to: number) => {
      const n = slides.length;
      const target = (to + n) % n;
      if (busy || target === index) return;
      busy = true;
      const dir = to > index || (index === n - 1 && target === 0 && to >= n) ? 1 : -1;
      const out = slides[index];
      const inn = slides[target];
      const outInner = $('[data-media-inner]', out);
      const inInner = $('[data-media-inner]', inn);

      inn.classList.add('is-active');
      inn.setAttribute('aria-hidden', 'false');
      out.setAttribute('aria-hidden', 'true');
      gsap.set(inn, { zIndex: 2 });
      gsap.set(out, { zIndex: 1 });

      const d = reduced ? 0 : 1.2;
      gsap
        .timeline({
          onComplete: () => {
            out.classList.remove('is-active');
            gsap.set([out, inn, outInner, inInner], { clearProps: 'zIndex,clipPath,xPercent,scale' });
            busy = false;
          },
        })
        .fromTo(
          inn,
          { clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: d, ease: 'raha.inOut' },
        )
        .fromTo(inInner, { xPercent: dir * 18, scale: 1.12 }, { xPercent: 0, scale: 1, duration: d * 1.3, ease: 'raha.out' }, 0)
        .to(outInner, { xPercent: -dir * 14, duration: d, ease: 'raha.inOut' }, 0);

      index = target;
      if (current) current.textContent = String(index + 1);
      if (bar) bar.style.transform = `scaleX(${(index + 1) / n})`;
    };

    prev?.addEventListener('click', () => go(index - 1));
    next?.addEventListener('click', () => go(index + 1));
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    });

    // Swipe / drag
    let startX = 0;
    let dragging = false;
    viewport.addEventListener('pointerdown', (e) => {
      dragging = true;
      startX = e.clientX;
    });
    window.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    });
  });
}
