/**
 * Declarative scroll reveals.
 *   data-reveal="lines | words | chars | chars-blur | fade | image | image-side | line-y | line-x | script | stagger"
 *   data-delay="0.2"   data-start="top 80%"
 * Elements inside horizontal tracks set data-reveal-horizontal (handled by the track module).
 */
import { gsap, ScrollTrigger, SplitText, reduced } from '../core/gsap';
import { $$ } from '../core/dom';

type Opts = { containerAnimation?: gsap.core.Animation; start?: string };

export function reveal(el: HTMLElement, opts: Opts = {}) {
  const type = el.dataset.reveal ?? 'fade';
  const delay = parseFloat(el.dataset.delay ?? '0');
  if (reduced) {
    gsap.set(el, { visibility: 'visible' });
    return;
  }

  const st: ScrollTrigger.Vars = {
    trigger: el,
    start: el.dataset.start ?? opts.start ?? (opts.containerAnimation ? 'left 85%' : 'top 88%'),
    once: true,
    containerAnimation: opts.containerAnimation,
  };
  const show = () => gsap.set(el, { visibility: 'visible' });

  switch (type) {
    case 'lines':
    case 'words':
    case 'chars': {
      SplitText.create(el, {
        type: type === 'chars' ? 'words,chars' : type,
        mask: type,
        autoSplit: true,
        linesClass: 'split-line',
        onSplit(self) {
          show();
          const targets = type === 'lines' ? self.lines : type === 'words' ? self.words : self.chars;
          return gsap.from(targets, {
            yPercent: 115,
            duration: type === 'chars' ? 1.1 : 1.25,
            stagger: type === 'chars' ? 0.028 : 0.085,
            delay,
            scrollTrigger: st,
          });
        },
      });
      break;
    }
    case 'chars-blur': {
      SplitText.create(el, {
        type: 'words,chars',
        autoSplit: true,
        onSplit(self) {
          show();
          return gsap.from(self.chars, {
            opacity: 0,
            yPercent: 35,
            filter: 'blur(14px)',
            duration: 1.6,
            stagger: 0.05,
            delay,
            ease: 'raha.soft',
            scrollTrigger: st,
          });
        },
      });
      break;
    }
    case 'image':
    case 'image-side': {
      const inner = el.querySelector('[data-media-inner]') ?? el.firstElementChild;
      const from = type === 'image' ? 'inset(100% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)';
      show();
      const tl = gsap.timeline({ delay, scrollTrigger: st });
      tl.fromTo(el, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'raha.inOut' });
      if (inner) tl.fromTo(inner, { scale: 1.3 }, { scale: 1, duration: 2, ease: 'raha.out' }, 0);
      break;
    }
    case 'line-y':
    case 'line-x': {
      show();
      gsap.fromTo(
        el,
        { [type === 'line-y' ? 'scaleY' : 'scaleX']: 0 },
        { [type === 'line-y' ? 'scaleY' : 'scaleX']: 1, transformOrigin: type === 'line-y' ? 'top' : 'left', duration: 1.6, ease: 'raha.inOut', delay, scrollTrigger: st },
      );
      break;
    }
    case 'script': {
      show();
      gsap.fromTo(
        el,
        { clipPath: 'inset(-60% 100% -60% -30%)' },
        { clipPath: 'inset(-60% -30% -60% -30%)', duration: 2, ease: 'power2.inOut', delay, scrollTrigger: st },
      );
      break;
    }
    case 'stagger': {
      show();
      const items = $$('[data-reveal-item]', el);
      gsap.from(items, { autoAlpha: 0, y: 36, duration: 1.2, stagger: 0.1, delay, scrollTrigger: st });
      break;
    }
    default: {
      show();
      gsap.from(el, { autoAlpha: 0, y: 40, duration: 1.3, delay, scrollTrigger: st });
    }
  }
}

export function initReveals(scope: ParentNode = document) {
  $$('[data-reveal]', scope)
    .filter((el) => !el.closest('[data-reveal-manual]') && !el.hasAttribute('data-reveal-horizontal'))
    .forEach((el) => reveal(el));
}

/** data-parallax="12" → media inner layer drifts ±12% while the frame scrolls through. */
export function initParallax(scope: ParentNode = document) {
  if (reduced) return;
  $$('[data-parallax]', scope).forEach((el) => {
    const amt = parseFloat(el.dataset.parallax ?? '10');
    const target = el.querySelector('[data-media-inner]') ?? el;
    gsap.set(target, { scale: 1 + (Math.abs(amt) * 2.2) / 100 });
    gsap.fromTo(
      target,
      { yPercent: -amt },
      { yPercent: amt, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });

  // data-speed="0.15" → element travels relative to scroll (collage depth).
  $$('[data-speed]', scope).forEach((el) => {
    const speed = parseFloat(el.dataset.speed ?? '0.1');
    gsap.fromTo(
      el,
      { y: () => window.innerHeight * speed },
      { y: () => -window.innerHeight * speed, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } },
    );
  });
}
