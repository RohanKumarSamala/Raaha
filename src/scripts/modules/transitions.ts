/** Preloader (first visit), curtain page transitions and in-page anchors. */
import { gsap, root, reduced } from '../core/gsap';
import { $ } from '../core/dom';
import { scrollToTarget } from '../core/scroll';

/** Resolves when the page is uncovered enough for intro animations to start. */
export function reveal(): Promise<void> {
  const preloader = $('[data-preloader]');
  const curtain = $('[data-curtain]');

  if (root.classList.contains('has-preloader') && preloader) {
    return new Promise((resolve) => {
      const count = $('[data-preloader-count]', preloader)!;
      const counter = { v: 0 };
      try {
        sessionStorage.setItem('raha-visited', '1');
      } catch {}
      gsap
        .timeline()
        .to(counter, {
          v: 100,
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate: () => (count.textContent = String(Math.round(counter.v)).padStart(2, '0')),
        })
        .to(preloader.querySelector('.preloader__center'), { autoAlpha: 0, y: -20, duration: 0.6, ease: 'power2.in' })
        .to(preloader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.3, ease: 'raha.inOut' }, '-=0.15')
        .add(() => resolve(), '-=0.75')
        .add(() => {
          preloader.remove();
          root.classList.remove('has-preloader');
        });
    });
  }

  if (root.classList.contains('is-transitioning') && curtain) {
    return new Promise((resolve) => {
      gsap
        .timeline({ delay: 0.1 })
        .to(curtain, { yPercent: -100, duration: 1.1, ease: 'raha.inOut' })
        .add(() => resolve(), 0.45)
        .add(() => {
          root.classList.remove('is-transitioning');
          gsap.set(curtain, { clearProps: 'transform' });
        });
    });
  }

  return Promise.resolve();
}

export function initTransitions() {
  const curtain = $('[data-curtain]');

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download') || a.dataset.noTransition !== undefined) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/^https?:/.test(url.protocol)) return;

    // Same page (with or without hash) → smooth scroll instead of reload.
    if (url.pathname === location.pathname && url.search === location.search) {
      e.preventDefault();
      if (url.hash) {
        scrollToTarget(url.hash);
        history.replaceState(null, '', url.hash);
      } else scrollToTarget(0);
      return;
    }

    if (!curtain || reduced) return;
    e.preventDefault();
    try {
      sessionStorage.setItem('raha-transition', '1');
    } catch {}
    (window as any).__rahaCloseMenu?.();
    gsap.set(curtain, { yPercent: 100 });
    gsap.to(curtain, {
      yPercent: 0,
      duration: 0.95,
      ease: 'raha.inOut',
      onComplete: () => {
        location.href = url.href;
      },
    });
  });

  // Back/forward cache restores the page mid-transition — uncover it.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted && curtain) gsap.set(curtain, { yPercent: 100 });
  });
}

export function scrollToInitialHash() {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (target) setTimeout(() => scrollToTarget(location.hash, { immediate: true }), 50);
}
