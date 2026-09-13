import Lenis from 'lenis';
import { gsap, ScrollTrigger, reduced } from './gsap';

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (reduced) return null;
  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.95,
    smoothWheel: true,
    syncTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

export function scrollToTarget(target: string | number | HTMLElement, opts: { offset?: number; immediate?: boolean } = {}) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, {
      offset: opts.offset ?? 0,
      immediate: opts.immediate,
      duration: 1.8,
      easing: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2),
    });
    return;
  }
  const y = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
  window.scrollTo({ top: y, behavior: reduced || opts.immediate ? 'auto' : 'smooth' });
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
export const scrollVelocity = () => lenis?.velocity ?? 0;
