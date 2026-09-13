/** Full-screen menu and booking modal. */
import { gsap, root, reduced } from '../core/gsap';
import { $, $$, trapFocus, firstFocusable } from '../core/dom';
import { startScroll, stopScroll, scrollToTarget } from '../core/scroll';

let menuOpen = false;
let modalOpen = false;

/* -------------------------------------------------------------------------- */
/* Menu                                                                        */
/* -------------------------------------------------------------------------- */

export function initMenu() {
  const menu = $('[data-menu]');
  if (!menu) return;
  const toggles = $$('[data-menu-toggle]');
  const anim = $$('[data-menu-anim]', menu);
  let release: (() => void) | null = null;
  let lastFocus: HTMLElement | null = null;
  let tl: gsap.core.Timeline | null = null;

  const setExpanded = (v: boolean) => toggles.forEach((t) => t.setAttribute('aria-expanded', String(v)));

  const open = () => {
    if (menuOpen) return;
    menuOpen = true;
    lastFocus = document.activeElement as HTMLElement;
    menu.hidden = false;
    root.classList.add('menu-open');
    setExpanded(true);
    stopScroll();
    tl?.kill();
    tl = gsap
      .timeline()
      .fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: reduced ? 0 : 1.1, ease: 'raha.inOut' })
      .fromTo(anim, { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: 1.2, stagger: 0.055 }, reduced ? 0 : 0.45);
    release = trapFocus(menu);
    setTimeout(() => firstFocusable(menu)?.focus({ preventScroll: true }), 400);
  };

  const close = (after?: () => void) => {
    if (!menuOpen) return after?.();
    menuOpen = false;
    setExpanded(false);
    release?.();
    tl?.kill();
    tl = gsap
      .timeline({
        onComplete: () => {
          menu.hidden = true;
          startScroll();
          after?.();
        },
      })
      .to(anim, { autoAlpha: 0, yPercent: -30, duration: 0.5, stagger: 0.02, ease: 'power2.in' })
      .to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: reduced ? 0 : 0.9, ease: 'raha.inOut' }, 0.15)
      .add(() => root.classList.remove('menu-open'), 0.5);
    if (!after) lastFocus?.focus({ preventScroll: true });
  };

  toggles.forEach((t) => t.addEventListener('click', () => (menuOpen ? close() : open())));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && menuOpen && close());

  // Same-page anchors close the menu first, then glide to the section.
  $$<HTMLAnchorElement>('[data-menu-link]', menu).forEach((a) =>
    a.addEventListener('click', (e) => {
      const url = new URL(a.href);
      if (url.pathname === location.pathname && url.hash) {
        e.preventDefault();
        e.stopPropagation();
        close(() => scrollToTarget(url.hash));
      }
    }),
  );

  (window as any).__rahaCloseMenu = close;
}

/* -------------------------------------------------------------------------- */
/* Booking modal                                                               */
/* -------------------------------------------------------------------------- */

export function initModal() {
  const modal = $('[data-modal]');
  if (!modal) return;
  const panel = $('[data-modal-panel]', modal)!;
  const overlay = $('.modal__overlay', modal)!;
  const mark = $('.modal__mark', modal);
  const content = $('.bpanel', modal)!;
  let release: (() => void) | null = null;
  let lastFocus: HTMLElement | null = null;
  let tl: gsap.core.Timeline | null = null;

  const open = (context = '') => {
    if (modalOpen) return;
    modalOpen = true;
    lastFocus = document.activeElement as HTMLElement;
    const ctx = $<HTMLInputElement>('[data-form-context]', modal);
    if (ctx) ctx.value = context;
    modal.hidden = false;
    stopScroll();
    tl?.kill();
    tl = gsap
      .timeline()
      .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' })
      .fromTo(panel, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: reduced ? 0 : 1.1, ease: 'raha.inOut' }, 0.1)
      .fromTo(content, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.6)
      .fromTo(mark, { opacity: 0, y: 12 }, { opacity: 0.8, y: 0, duration: 1 }, 0.8);
    release = trapFocus(modal);
    setTimeout(() => $<HTMLInputElement>('input[name="name"]', modal)?.focus({ preventScroll: true }), 700);
  };

  const close = () => {
    if (!modalOpen) return;
    modalOpen = false;
    release?.();
    tl?.kill();
    tl = gsap
      .timeline({
        onComplete: () => {
          modal.hidden = true;
          if (!menuOpen) startScroll();
        },
      })
      .to([content, mark], { autoAlpha: 0, duration: 0.35, ease: 'power2.in' })
      .to(panel, { clipPath: 'inset(0% 0% 100% 0%)', duration: reduced ? 0 : 0.9, ease: 'raha.inOut' }, 0.1)
      .to(overlay, { opacity: 0, duration: 0.6 }, 0.5);
    lastFocus?.focus({ preventScroll: true });
  };

  document.addEventListener('click', (e) => {
    const trigger = (e.target as HTMLElement).closest<HTMLElement>('[data-action="booking"]');
    if (trigger) {
      e.preventDefault();
      const ctx = trigger.dataset.context ?? '';
      if (menuOpen) (window as any).__rahaCloseMenu?.(() => open(ctx));
      else open(ctx);
      return;
    }
    if ((e.target as HTMLElement).closest('[data-modal-close]')) close();
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && modalOpen && close());
}
