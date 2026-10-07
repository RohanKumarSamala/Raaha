/** Preloader (first visit), curtain page transitions and in-page anchors. */
import { gsap, CustomEase, root, reduced } from '../core/gsap';
import { $, $$ } from '../core/dom';
import { scrollToTarget } from '../core/scroll';

// ERA Residence Custom Eases
CustomEase.create('loaderEase', 'M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1');
CustomEase.create('eraInOut', '0.75, 0, 0.25, 1');
CustomEase.create('diveIn', '0.6, 0, 0, 1');
CustomEase.create('eraOut', '0.25, 1, 0.5, 1');

/** Resolves when the page is uncovered enough for intro animations to start. */
export function reveal(): Promise<void> {
  const preloader = $('[data-preloader]');
  const curtain = $('[data-curtain]');

  if (root.classList.contains('has-preloader') && preloader) {
    return new Promise((resolve) => {
      // 1. Accurately detect if the page load is a reload (F5 / Refresh button)
      let isReload = false;
      try {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
          const navType = (navEntries[0] as PerformanceNavigationTiming).type;
          isReload = navType === 'reload';
        } else if (window.performance && window.performance.navigation) {
          isReload = window.performance.navigation.type === 1; // TYPE_RELOAD
        }
      } catch (e) {}

      // Clean up legacy raha-visited so stale session storage never blocks the first-time intro
      try {
        sessionStorage.removeItem('raha-visited');
      } catch (e) {}

      // URL parameters to force full intro or reload mode for preview/testing if needed
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('intro') || urlParams.has('full') || urlParams.has('first') || urlParams.has('preloader')) {
        isReload = false;
      } else if (urlParams.has('reload')) {
        isReload = true;
      }

      const isDesktop = window.innerWidth >= 992;
      const initialArchW = isDesktop ? '24vw' : '40vw';
      const midArchW = isDesktop ? '36vw' : '50vw';
      const heroScale = isDesktop ? 1.15 : 1.1;

      const ctn = $('.preloader_ctn', preloader);
      const count = $('[data-preloader-count]', preloader);
      const track = $('[data-preloader-track]', preloader);
      const symbol = $('[data-part="ctn"]', preloader);
      const headings = $$('[data-part="h"]', preloader);
      const scriptWords = $$('[data-part="a"]', preloader);
      const taglines = $$('[data-part="p"]', preloader);
      const watermark = $('.preloader_bg_a', preloader);
      const decor = $('.preloader_bg_decor', preloader);
      const heroMedia = $('[data-hero-media]') || $('.hero__media');

      const durL = 1.2;

      // Set initial states
      gsap.set(preloader, {
        '--arch-w': initialArchW,
        '--arch-y': '104vh',
      });

      if (heroMedia) {
        gsap.set(heroMedia, { scale: heroScale, transformOrigin: 'center top' });
      }

      if (isReload) {
        // ==========================================
        // RELOAD: SHORT ARCH PORTAL DIVE
        // (Cathedral arch portal immediately sweeps open into hero)
        // ==========================================
        if (ctn) gsap.set(ctn, { display: 'none' });
        if (watermark) gsap.set(watermark, { opacity: 0 });
        if (decor) gsap.set(decor, { opacity: 0 });

        const tl = gsap.timeline();

        tl.fromTo(watermark, { opacity: 0 }, { opacity: 0.05, duration: durL, ease: 'eraOut' }, 0)
          .fromTo(decor, { opacity: 0 }, { opacity: 1, duration: durL, ease: 'eraOut' }, 0)
          .fromTo(
            preloader,
            { '--arch-w': initialArchW, '--arch-y': '104vh' },
            { '--arch-w': midArchW, '--arch-y': '15vh', duration: 1.25 * durL, ease: 'eraInOut' },
            0.1
          )
          .to(
            preloader,
            { '--arch-w': '125vw', '--arch-y': '-100vh', duration: 2 * durL, ease: 'diveIn' },
            '<90%'
          );

        if (heroMedia) {
          tl.fromTo(
            heroMedia,
            { scale: heroScale },
            { scale: 1, duration: 1.25 * durL, ease: 'eraInOut' },
            '<'
          );
        }

        tl.add(() => resolve(), '<25%');

        tl.add(() => {
          preloader.remove();
          root.classList.remove('has-preloader');
        });
      } else {
        // ==========================================
        // FIRST TIME VISIT: FULL EDITORIAL INTRO ("THIS ONE")
        // (Mark, titles, counter 00 -> 100, tagline, then arch dive)
        // ==========================================
        const counter = { v: 0 };

        if (symbol) gsap.set(symbol, { opacity: 0, scale: 0.85 });
        if (headings.length) gsap.set(headings, { opacity: 0, y: 30 });
        if (scriptWords.length) gsap.set(scriptWords, { opacity: 0, x: 20 });
        if (taglines.length) gsap.set(taglines, { opacity: 0, y: 20 });
        if (watermark) gsap.set(watermark, { opacity: 0 });
        if (decor) gsap.set(decor, { opacity: 0 });
        if (track) gsap.set(track, { yPercent: -100 });

        const tl = gsap.timeline();

        // 1. Initial Elements Reveal
        if (symbol) tl.to(symbol, { opacity: 1, scale: 1, duration: 0.9, ease: 'eraOut' }, 0.1);
        if (headings.length) tl.to(headings, { opacity: 1, y: 0, duration: 1.0, stagger: 0.08, ease: 'eraOut' }, 0.2);
        if (scriptWords.length) tl.to(scriptWords, { opacity: 1, x: 0, duration: 1.1, ease: 'eraOut' }, 0.35);
        if (taglines.length) tl.to(taglines, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: 'eraOut' }, 0.4);
        if (watermark) tl.to(watermark, { opacity: 0.05, duration: 1.2, ease: 'eraOut' }, 0.3);
        if (decor) tl.to(decor, { opacity: 1, duration: 1.2, ease: 'eraOut' }, 0.3);

        // 2. Vertical Progress Track and Numeric Counter
        if (track) {
          tl.to(track, { yPercent: 0, duration: 3.2, ease: 'loaderEase' }, 0.4);
        }

        if (count) {
          tl.to(
            counter,
            {
              v: 100,
              duration: 3.2,
              ease: 'loaderEase',
              onUpdate: () => {
                count.textContent = String(Math.round(counter.v)).padStart(2, '0');
              },
            },
            0.4
          );
        }

        // 3. Fade out content as arch prepares to open
        const contentElements = [
          symbol,
          ...headings,
          ...scriptWords,
          ...taglines,
          $('.preloader_progress', preloader),
        ].filter(Boolean);

        tl.to(
          contentElements,
          { opacity: 0, y: -20, duration: 0.6, ease: 'power2.in' },
          '+=0.15'
        );
        tl.to(
          [watermark, decor].filter(Boolean),
          { opacity: 0, duration: 0.6, ease: 'power2.in' },
          '<'
        );

        // 4. The Iconic ERA Arch Portal Opening
        tl.fromTo(
          preloader,
          { '--arch-w': initialArchW, '--arch-y': '104vh' },
          { '--arch-w': midArchW, '--arch-y': '15vh', duration: 1.25 * durL, ease: 'eraInOut' },
          '-=0.2'
        ).to(
          preloader,
          { '--arch-w': '125vw', '--arch-y': '-100vh', duration: 2 * durL, ease: 'diveIn' },
          '<90%'
        );

        // 5. Hero zoom out simultaneously
        if (heroMedia) {
          tl.fromTo(
            heroMedia,
            { scale: heroScale },
            { scale: 1, duration: 1.25 * durL, ease: 'eraInOut' },
            '<'
          );
        }

        // 6. Uncover page reveals as arch sweeps up
        tl.add(() => resolve(), '<25%');

        // 7. Cleanup
        tl.add(() => {
          preloader.remove();
          root.classList.remove('has-preloader');
        });
      }
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
