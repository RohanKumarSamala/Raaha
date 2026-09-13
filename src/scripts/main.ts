/**
 * Entry point. Order matters:
 *   1. smooth scroll + global chrome
 *   2. page modules set their initial states (hidden titles, pins…)
 *   3. preloader / curtain uncovers the page
 *   4. intro timelines + scroll reveals start
 */
import { ScrollTrigger } from './core/gsap';
import { initSmoothScroll } from './core/scroll';
import { initFit } from './core/fit';
import { initReveals, initParallax } from './modules/reveals';
import { initHeaderTheme, initRail, initBadges } from './modules/chrome';
import { initCursor, initMagnetic } from './modules/cursor';
import { initMenu, initModal } from './modules/overlays';
import { initForms } from './modules/form';
import { initSliders } from './modules/slider';
import { initTransitions, reveal, scrollToInitialHash } from './modules/transitions';
import { pageModules } from './sections';

async function boot() {
  initSmoothScroll();
  initTransitions();
  initMenu();
  initModal();
  initForms();
  initCursor();
  initMagnetic();
  initSliders();
  initBadges();
  initRail();

  await document.fonts.ready;
  initFit();

  const intros = pageModules.map((m) => m()).filter(Boolean) as Array<() => void>;

  initParallax();
  initHeaderTheme();
  ScrollTrigger.refresh();
  scrollToInitialHash();

  await reveal();

  intros.forEach((play) => play());
  initReveals();
  ScrollTrigger.refresh();

  // Late-loading images can change layout — keep pins honest.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

boot();
