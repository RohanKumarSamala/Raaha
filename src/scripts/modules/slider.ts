/**
 * Image slider: diagonal wipe between slides, progress bar, arrows, keys and swipe.
 * With data-autoplay="3" it advances on its own every 3s while on screen, and the
 * progress bar becomes the countdown.
 */
import { gsap, CustomEase, reduced } from '../core/gsap';
import { $, $$ } from '../core/dom';

const EASE_INOUT = CustomEase.create('slider.inOut', '0.75, 0, 0.25, 1');
const EASE_OUT = CustomEase.create('slider.out', '0.25, 1, 0.5, 1');

export function initSliders(scope: ParentNode = document) {
  $$('[data-slider]', scope).forEach((slider) => {
    const slides = $$('[data-slide]', slider);
    if (slides.length < 2) return;
    const viewport = $('[data-slider-viewport]', slider)!;
    const current = $('[data-slider-current]', slider);
    const bar = $('[data-slider-bar]', slider)?.parentElement ?? null; // the track: it carries --p
    const captions = $$('[data-slider-caption]', slider);
    const prev = $<HTMLButtonElement>('[data-slider-prev]', slider);
    const next = $<HTMLButtonElement>('[data-slider-next]', slider);
    const hold = parseFloat(slider.dataset.autoplay ?? '0');
    const n = slides.length;
    let index = 0;
    let busy = false;
    let inView = false;
    let timer: gsap.core.Tween | null = null;

    // autoplay: the bar fills over `hold` seconds, then the next slide takes over
    const startTimer = () => {
      if (!hold || !bar || reduced) return;
      timer?.kill();
      timer = gsap.fromTo(bar, { '--p': 0 }, { '--p': 1, duration: hold, ease: 'none', paused: !inView, onComplete: () => go(index + 1) });
    };

    const go = (to: number) => {
      const target = (to + n) % n;
      if (busy || target === index) return;
      busy = true;
      timer?.kill();
      const dir = to > index ? 1 : -1;
      const out = slides[index];
      const inn = slides[target];
      const outInner = $('[data-media-inner]', out);
      const inInner = $('[data-media-inner]', inn);

      inn.classList.add('is-active');
      inn.setAttribute('aria-hidden', 'false');
      out.setAttribute('aria-hidden', 'true');
      gsap.set(inn, { zIndex: 2 });
      gsap.set(out, { zIndex: 1 });

      // the new photo wipes across on a slanted edge from the side it is coming from,
      // settling back from a zoom; the old one drifts the other way underneath
      const from = dir > 0 ? 'polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)' : 'polygon(-25% 0%, -1% 0%, 0% 100%, 0% 100%)';
      const d = reduced ? 0 : 1.2;
      gsap
        .timeline({
          onComplete: () => {
            out.classList.remove('is-active');
            gsap.set([out, inn], { clearProps: 'zIndex,clipPath' });
            gsap.set([outInner, inInner], { clearProps: 'transform' });
            busy = false;
            startTimer();
          },
        })
        .fromTo(inn, { clipPath: from }, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: d, ease: EASE_INOUT })
        .fromTo(inInner, { xPercent: dir * 22, scale: 1.4 }, { xPercent: 0, scale: 1, duration: d, ease: EASE_INOUT }, 0)
        .to(outInner, { xPercent: -dir * 16, scale: 1.15, duration: d, ease: EASE_INOUT }, 0);

      // caption under the photo follows the slide
      if (captions.length) {
        const outCap = captions[index];
        const inCap = captions[target];
        gsap.to(outCap, { autoAlpha: 0, y: -10, duration: d * 0.3, ease: 'power2.in', onComplete: () => outCap.classList.remove('is-active') });
        inCap.classList.add('is-active');
        gsap.fromTo(inCap, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: d * 0.8, delay: d * 0.4, ease: EASE_OUT, clearProps: 'all' });
      }

      index = target;
      if (current) current.textContent = String(index + 1);
      if (bar && !hold) bar.style.setProperty('--p', String((index + 1) / n));
      if (bar && hold && !reduced) gsap.to(bar, { '--p': 0, duration: 0.3, ease: 'power2.out' });
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

    if (hold && bar && !reduced) {
      new IntersectionObserver(
        ([e]) => {
          inView = e.isIntersecting;
          if (inView) timer?.play();
          else timer?.pause();
        },
        { threshold: 0.4 },
      ).observe(viewport);
      startTimer();
    }
  });
}
