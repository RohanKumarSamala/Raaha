import { gsap, ScrollTrigger, SplitText, CustomEase, reduced, mq } from '../core/gsap';
import { $, $$ } from '../core/dom';
import { reveal } from '../modules/reveals';
import { getLenis } from '../core/scroll';
import { initWind } from '../modules/wind';

/* -------------------------------------------------------------------------- */
/* Hero — intro timeline, scroll exit, day/night                              */
/* -------------------------------------------------------------------------- */
export function hero() {
  const el = $('[data-hero]');
  if (!el) return;
  const content = $('[data-hero-content]', el);
  const cta = $('[data-hero-cta]', el);
  const hotspots = $$('[data-hotspot]', el);
  const lines = $$('[data-hero-line]', el);
  const script = $('[data-hero-script]', el);
  const phrases = $$('[data-hero-phrase]', el);

  // Smooth fade-out of hero text and CTA as Reasons arch overlays over the photo
  if (!reduced) {
    const fadeTargets = [content, cta, ...hotspots].filter(Boolean);
    gsap.to(fadeTargets, {
      opacity: 0,
      y: -60,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=220',
        scrub: true,
      },
    });
  }

  if (reduced) return;

  const splits = lines.map((l) => new SplitText(l, { type: 'chars' }));
  const chars = splits.flatMap((s) => s.chars);
  gsap.set(chars, { opacity: 0, yPercent: 30, filter: 'blur(16px)' });
  if (script) gsap.set(script, { clipPath: 'inset(-60% 100% -60% -30%)' });
  gsap.set(phrases[0], { xPercent: 30, opacity: 0 });
  gsap.set(phrases[1], { xPercent: -30, opacity: 0 });
  if (cta) gsap.set(cta, { opacity: 0, scale: 0.92 });
  gsap.set(hotspots, { opacity: 0 });

  return () => {
    const tl = gsap
      .timeline({ onComplete: () => splits.forEach((s) => s.revert()) })
      .to(chars, { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 1.7, stagger: 0.055, ease: 'raha.soft' }, 0.15);
    if (script) {
      tl.to(script, { clipPath: 'inset(-60% -30% -60% -30%)', duration: 2, ease: 'power2.inOut' }, 0.9);
    }
    tl.to(phrases, { xPercent: 0, opacity: 1, duration: 1.8, ease: 'raha.out' }, 1.1);
    if (cta) {
      tl.to(cta, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 1.3);
    }
    if (hotspots.length) {
      tl.to(hotspots, { opacity: 1, stagger: 0.1, duration: 1.2, ease: 'power2.out' }, 1.5);
    }
  };
}

/* -------------------------------------------------------------------------- */
/* Arches — dome sections widen as they rise; arc text expands along its path */
/* -------------------------------------------------------------------------- */
export const arch = (selector: string) => () => {
  $$(`${selector}[data-arch]`).forEach((sec) => {
    const textPath = $<SVGTextPathElement>('[data-arch-offset]', sec);
    if (reduced) {
      if (textPath) textPath.setAttribute('textLength', '1240');
      return;
    }
    // 1. Subtle, ultra-smooth dome widening as it rises
    gsap.fromTo(
      sec,
      { clipPath: 'inset(0% 2% 0% 2% round 50vw 50vw 0px 0px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 50vw 50vw 0px 0px)',
        ease: 'power1.out',
        scrollTrigger: {
          trigger: sec,
          start: 'top bottom',
          end: 'top 15%',
          scrub: 0.6,
        },
      },
    );

    // 2. Arc text: starts compressed at the apex (Pic 2) and expands smoothly
    //    outward symmetrically along the curve as the arch rises (Pic 3)
    if (textPath) {
      const len = { v: 680 };
      gsap.fromTo(
        len,
        { v: 680 },
        {
          v: 1240,
          ease: 'power1.out',
          onUpdate: () => {
            textPath.setAttribute('textLength', len.v.toFixed(1));
          },
          scrollTrigger: {
            trigger: sec,
            start: 'top bottom',
            end: 'top 10%',
            scrub: 0.6,
          },
        },
      );
    }
  });
};

/* -------------------------------------------------------------------------- */
/* Reasons — auto-advancing carousel (every 5s while in view) + pager          */
/*   out: title letters flip up, copy lines slide out, photo wipes off left    */
/*   in:  photo wipes in on a diagonal, then letters and lines rise into place */
/* -------------------------------------------------------------------------- */
export function reasons() {
  const sec = $('[data-reasons-carousel]');
  if (!sec) return;

  const titles = $$('[data-reasons-title]', sec);
  const slides = $$('[data-reasons-slide]', sec);
  const bodies = $$('[data-reasons-body]', sec);
  const currentEl = $('[data-reasons-current]', sec);
  const nextEl = $('[data-reasons-next-num]', sec);
  const bar = $('[data-reasons-bar]', sec)?.parentElement ?? null; // the track: it carries --p
  const n = titles.length;
  const HOLD = 5;
  const S = 0.4;
  const M = 0.8;
  const L = 1.2;
  const STAGGER = 0.1;
  const EASE_IN = CustomEase.create('reasons.in', '0.5, 0, 0.75, 0');
  const EASE_OUT = CustomEase.create('reasons.out', '0.25, 1, 0.5, 1');
  const EASE_INOUT = CustomEase.create('reasons.inOut', '0.75, 0, 0.25, 1');
  const EASE_SETTLE = CustomEase.create('reasons.settle', '0.25, 0.1, 0.25, 1');

  if (n < 2) return;

  let active = 0;
  let animating = false;
  let inView = false;
  let timer: gsap.core.Tween | null = null;

  // Split each title into letters once and leave it that way. Splitting only for the
  // animation and merging afterwards changed the letter and word spacing a moment
  // after the title landed, which read as a jump.
  const chars = reduced ? [] : titles.map((t) => new SplitText(t, { type: 'words,chars' }));

  const paint = () => {
    if (currentEl) currentEl.textContent = String(active + 1);
    if (nextEl) nextEl.textContent = String(((active + 1) % n) + 1);
  };

  const show = (i: number, on: boolean) => {
    [titles[i], bodies[i]].forEach((el) => {
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', String(!on));
    });
  };

  // The pager bar fills over HOLD seconds, then hands over to the next reason
  const startTimer = () => {
    timer?.kill();
    timer = null;
    if (!bar || reduced) return;
    timer = gsap.fromTo(bar, { '--p': 0 }, { '--p': 1, duration: HOLD, ease: 'none', paused: !inView, onComplete: () => set(active + 1) });
  };

  const set = (to: number) => {
    const i = (to + n) % n;
    if (i === active || animating) return;
    const prev = active;
    active = i;
    paint();

    const outSlide = slides[prev];
    const inSlide = slides[i];

    if (reduced) {
      show(prev, false);
      show(i, true);
      outSlide.classList.remove('is-active');
      inSlide.classList.add('is-active');
      return;
    }

    animating = true;
    startTimer();

    // Titles stay split for good (see `chars` above); the copy is split per move so it re-wraps freely
    const outLines = new SplitText($$('p', bodies[prev]), { type: 'lines', mask: 'lines' });
    let inLines: SplitText | null = null;

    inSlide.classList.add('is-active');
    gsap.set(inSlide, { zIndex: 2 });
    gsap.set(outSlide, { zIndex: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        inLines?.revert();
        outSlide.classList.remove('is-active');
        gsap.set([inSlide, outSlide], { clearProps: 'zIndex,clipPath' });
        gsap.set([$('[data-media-inner]', inSlide), $('[data-media-inner]', outSlide)], { clearProps: 'transform' });
        animating = false;
      },
    });

    // Out
    tl.to(chars[prev].chars, { opacity: 0, yPercent: -50, rotateY: -90, duration: S, stagger: STAGGER * 0.25, ease: EASE_IN }, 0)
      .to(outLines.lines, { yPercent: -110, duration: S, stagger: STAGGER * 0.5, ease: EASE_IN }, 0)
      .fromTo(
        outSlide,
        { clipPath: 'polygon(0% 0%, 100% 0%, 125% 100%, 0% 100%)' },
        { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', duration: L, ease: EASE_INOUT },
        0,
      )
      .to($('[data-media-inner]', outSlide), { scale: 1.5, xPercent: -25, duration: L, ease: EASE_INOUT }, 0);

    // In — photo
    tl.fromTo(
      inSlide,
      { clipPath: 'polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)' },
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: L, ease: EASE_INOUT },
      0,
    ).fromTo($('[data-media-inner]', inSlide), { scale: 1.5, xPercent: 25 }, { scale: 1, xPercent: 0, duration: L, ease: EASE_INOUT }, 0);

    // In — text, once the old copy has cleared
    tl.add(() => {
      gsap.set(chars[prev].chars, { clearProps: 'opacity,transform' }); // (not 'all': the letters need their inline-block)
      outLines.revert();
      show(prev, false);
      show(i, true);
      inLines = new SplitText($$('p', bodies[i]), { type: 'lines', mask: 'lines' });
      tl.fromTo(
        chars[i].chars,
        { opacity: 0, yPercent: 50, rotateY: 90 },
        { opacity: 1, yPercent: 0, rotateY: 0, duration: L, stagger: STAGGER * 0.5, ease: EASE_OUT },
        M,
      ).fromTo(inLines.lines, { yPercent: 110 }, { yPercent: 0, duration: L, stagger: STAGGER, ease: EASE_OUT }, M);
    }, M);
  };

  $('[data-reasons-prev]', sec)?.addEventListener('click', () => set(active - 1));
  $('[data-reasons-next]', sec)?.addEventListener('click', () => set(active + 1));

  // Only count down while the carousel is on screen. (An observer rather than a
  // scroll trigger: it also reports correctly when the page is reloaded mid-section.)
  new IntersectionObserver(
    ([e]) => {
      inView = e.isIntersecting;
      if (inView) timer?.play();
      else timer?.pause();
    },
    { threshold: 0.4 },
  ).observe(sec);
  paint();
  startTimer();

  // Settle: when scrolling comes to rest with most of the stage on screen, ease it to full view
  const lenis = getLenis();
  if (lenis) {
    const mm = gsap.matchMedia();
    mm.add(mq.desktop, () => {
      let t = 0;
      const off = lenis.on('scroll', () => {
        clearTimeout(t);
        t = window.setTimeout(() => {
          const vh = window.innerHeight;
          const r = sec.getBoundingClientRect();
          const visible = (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / Math.min(r.height, vh);
          if (visible > 0.5 && Math.abs(r.top) > 1) lenis.scrollTo(sec, { duration: L, easing: EASE_SETTLE });
        }, 80);
      });
      return () => {
        clearTimeout(t);
        off();
      };
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Concept — pinned horizontal track                                           */
/* -------------------------------------------------------------------------- */
export function concept() {
  const sec = $('[data-concept]');
  if (!sec) return;
  const track = $('[data-concept-track]', sec)!;

  const path = $<SVGPathElement>('[data-map-path]', sec);
  const road = $$<SVGPathElement>('[data-map-road]', sec);
  const car = $('[data-map-car]', sec);
  const points = $$('[data-map-point]', sec);

  // The road draws itself with scroll and a marker rides its leading end.
  // The svg box is 1000×600 stretched over the map area, so path units map to %.
  const total = path?.getTotalLength() ?? 0;
  const drive = (p: number) => {
    if (!path || !car) return;
    const at = path.getPointAtLength(total * p);
    car.style.left = `${at.x / 10}%`;
    car.style.top = `${at.y / 6}%`;
    car.style.opacity = p > 0.005 && p < 0.995 ? '1' : '0';
  };
  const drawRoad = (scrollTrigger: ScrollTrigger.Vars) => {
    if (!path) return;
    gsap.fromTo([path, ...road], { strokeDashoffset: 1 }, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger,
      onUpdate() {
        drive(this.progress());
      },
    });
  };
  const horizontal = $$('[data-reveal-horizontal]', sec);

  // Flowers: each one grows in as it arrives (the breeze itself is started page-wide)
  const flowers = $$('[data-flower]', sec);
  const growIn = (el: HTMLElement, st: ScrollTrigger.Vars) => ScrollTrigger.create({ ...st, trigger: el, once: true, onEnter: () => el.classList.add('is-in') });

  let container: gsap.core.Tween | null = null;
  const mm = gsap.matchMedia();
  mm.add(mq.desktop, () => {
    const dist = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: () => `+=${dist()}`,
        pin: true,
        scrub: reduced ? true : 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    container = tween;

    flowers.forEach((el, i) => growIn(el, i === 0 ? { start: 'top 65%' } : { containerAnimation: tween, start: 'left 96%' }));

    $$('[data-place-line]', sec).forEach((line, i) => {
      gsap.fromTo(
        line,
        { x: () => window.innerWidth * (0.08 + i * 0.07) },
        { x: 0, ease: 'none', scrollTrigger: { trigger: line, containerAnimation: tween, start: 'left right', end: 'right 60%', scrub: true, invalidateOnRefresh: true } },
      );
    });

    // Flowers drift against the track for depth (the bush slides back as you pass it)
    $$('[data-flower-drift]', sec).forEach((el) => {
      gsap.fromTo(
        el,
        { xPercent: 0 },
        { xPercent: parseFloat(el.dataset.flowerDrift ?? '-20'), ease: 'none', scrollTrigger: { trigger: el, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } },
      );
    });

    const mapPanel = $('[data-concept-map]', sec)!;
    drawRoad({ trigger: mapPanel, containerAnimation: tween, start: 'left 85%', end: 'right right', scrub: true });
    points.forEach((p, i) => {
      gsap.from(p, {
        autoAlpha: 0,
        y: 16,
        duration: 1,
        scrollTrigger: { trigger: mapPanel, containerAnimation: tween, start: `left+=${(i / points.length) * 70}% 80%`, toggleActions: 'play none none reverse' },
      });
    });
  });

  mm.add(mq.mobile, () => {
    container = null;
    flowers.forEach((el) => growIn(el, { start: 'top 85%' }));
    drawRoad({ trigger: path, start: 'top 85%', end: 'bottom 40%', scrub: true });
  });

  // Reveals are created once the page is uncovered so the first panel animates in view.
  return () => horizontal.forEach((el) => reveal(el, container ? { containerAnimation: container } : {}));
}

/* -------------------------------------------------------------------------- */
/* Stays carousel — same move as the reasons: letters flip, copy lifts away,   */
/* the photo wipes across on a diagonal                                        */
/* -------------------------------------------------------------------------- */
export function types() {
  const sec = $('[data-types]');
  if (!sec) return;
  const slides = $$('[data-type-slide]', sec);
  const titles = $$('[data-type-title]', sec);
  const statSets = $$('.types__stat-set', sec);
  const asideSets = $$('.types__aside-set', sec);
  const n = slides.length;
  const current = $('[data-types-current]', sec)!;
  const bar = $('[data-types-bar]', sec)!.parentElement!; // the track: it carries --p
  const splits = titles.map((t) => new SplitText(t, { type: 'words,chars' }));
  const S = 0.4;
  const M = 0.8;
  const L = 1.2;
  const EASE_IN = CustomEase.create('types.in', '0.5, 0, 0.75, 0');
  const EASE_OUT = CustomEase.create('types.out', '0.25, 1, 0.5, 1');
  const EASE_INOUT = CustomEase.create('types.inOut', '0.75, 0, 0.25, 1');
  const HOLD = 4;
  let index = 0;
  let busy = false;
  let inView = false;
  let timer: gsap.core.Tween | null = null;

  // the pager bar fills over HOLD seconds, then the next slide takes over
  const startTimer = () => {
    timer?.kill();
    timer = null;
    if (reduced) {
      gsap.set(bar, { '--p': (index + 1) / n });
      return;
    }
    timer = gsap.fromTo(bar, { '--p': 0 }, { '--p': 1, duration: HOLD, ease: 'none', paused: !inView, onComplete: () => go(index + 1) });
  };

  // every line of copy in a slide's two side panels, in reading order
  const copy = (i: number) => [...Array.from(statSets[i].children), ...Array.from(asideSets[i].children).flatMap((c) => (c.tagName === 'UL' ? Array.from(c.children) : [c]))];

  const go = (to: number) => {
    const target = (to + n) % n;
    if (busy || target === index) return;
    const prev = index;
    index = target;
    current.textContent = String(index + 1);
    timer?.kill();

    const outSlide = slides[prev];
    const inSlide = slides[target];
    const swap = () => {
      [statSets, asideSets].forEach((set) => {
        set[prev].classList.remove('is-active');
        set[prev].setAttribute('aria-hidden', 'true');
        set[target].classList.add('is-active');
        set[target].removeAttribute('aria-hidden');
      });
      titles[prev].classList.remove('is-active');
      titles[target].classList.add('is-active');
      titles.forEach((t, i) => t.setAttribute('aria-hidden', String(i !== target)));
    };

    if (reduced) {
      swap();
      outSlide.classList.remove('is-active');
      inSlide.classList.add('is-active');
      startTimer();
      return;
    }

    busy = true;
    gsap.to(bar, { '--p': 0, duration: S, ease: 'power2.out' });
    inSlide.classList.add('is-active');
    gsap.set(inSlide, { zIndex: 2 });
    gsap.set(outSlide, { zIndex: 1 });

    const outMedia = $('[data-media-inner]', outSlide);
    const inMedia = $('[data-media-inner]', inSlide);
    const tl = gsap.timeline({
      onComplete: () => {
        outSlide.classList.remove('is-active');
        gsap.set([inSlide, outSlide], { clearProps: 'zIndex,clipPath' });
        gsap.set([inMedia, outMedia], { clearProps: 'transform' });
        gsap.set(copy(prev), { clearProps: 'opacity,visibility,transform' });
        busy = false;
        startTimer();
      },
    });

    // out
    tl.to(splits[prev].chars, { opacity: 0, yPercent: -50, rotateY: -90, duration: S, stagger: 0.02, ease: EASE_IN }, 0)
      .to(copy(prev), { autoAlpha: 0, y: -18, duration: S, stagger: 0.03, ease: EASE_IN }, 0)
      .fromTo(
        outSlide,
        { clipPath: 'polygon(0% 0%, 100% 0%, 125% 100%, 0% 100%)' },
        { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', duration: L, ease: EASE_INOUT },
        0,
      )
      .to(outMedia, { scale: 1.5, xPercent: -25, duration: L, ease: EASE_INOUT }, 0);

    // in — photo
    tl.fromTo(
      inSlide,
      { clipPath: 'polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)' },
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: L, ease: EASE_INOUT },
      0,
    ).fromTo(inMedia, { scale: 1.5, xPercent: 25 }, { scale: 1, xPercent: 0, duration: L, ease: EASE_INOUT }, 0);

    // in — title and copy, once the old ones have cleared
    tl.add(swap, M)
      .fromTo(
        splits[target].chars,
        { opacity: 0, yPercent: 50, rotateY: 90 },
        { opacity: 1, yPercent: 0, rotateY: 0, duration: L, stagger: 0.05, ease: EASE_OUT, immediateRender: false },
        M,
      )
      .fromTo(copy(target), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: L, stagger: 0.09, ease: EASE_OUT, immediateRender: false, clearProps: 'visibility' }, M);
  };

  $('[data-types-prev]', sec)?.addEventListener('click', () => go(index - 1));
  $('[data-types-next]', sec)?.addEventListener('click', () => go(index + 1));
  const vp = $('[data-types-viewport]', sec)!;
  let sx = 0;
  let down = false;
  vp.addEventListener('pointerdown', (e) => ((down = true), (sx = e.clientX)));
  window.addEventListener('pointerup', (e) => {
    if (!down) return;
    down = false;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  });

  // Only count down while the carousel is on screen. (An observer rather than a
  // scroll trigger: it also reports correctly when the page is reloaded mid-section.)
  new IntersectionObserver(
    ([e]) => {
      inView = e.isIntersecting;
      if (inView) timer?.play();
      else timer?.pause();
    },
    { threshold: 0.4 },
  ).observe(sec);
  startTimer();

  // Entrance: the photo opens on the same diagonal, then the title and copy arrive
  if (!reduced) {
    const first = slides[0];
    gsap
      .timeline({ scrollTrigger: { trigger: sec, start: 'top 55%', once: true } })
      .fromTo(
        vp,
        { clipPath: 'polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)' },
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.5, ease: EASE_INOUT, clearProps: 'clipPath' },
        0,
      )
      .fromTo($('[data-media-inner]', first), { scale: 1.5, xPercent: 25 }, { scale: 1, xPercent: 0, duration: 1.5, ease: EASE_INOUT, clearProps: 'transform' }, 0)
      .from(splits[0].chars, { opacity: 0, yPercent: 50, rotateY: 90, duration: L, stagger: 0.05, ease: EASE_OUT }, 0.6)
      .from(copy(0), { autoAlpha: 0, y: 26, duration: L, stagger: 0.09, ease: EASE_OUT, clearProps: 'all' }, 0.7);
  }
}

/* -------------------------------------------------------------------------- */
/* Estate statement — flower grows in from the corner as the section arrives   */
/* -------------------------------------------------------------------------- */
export function statement() {
  const sec = $('[data-statement]');
  if (!sec) return;
  $$('[data-flower]', sec).forEach((el) => ScrollTrigger.create({ trigger: sec, start: 'top 60%', once: true, onEnter: () => el.classList.add('is-in') }));
}

/* -------------------------------------------------------------------------- */
/* Breeze through every cut-out flower on the page                             */
/* -------------------------------------------------------------------------- */
export function flowers() {
  initWind();
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }),
    { threshold: 0.12 },
  );
  $$('[data-flower]').forEach((el) => io.observe(el));
}

/* -------------------------------------------------------------------------- */
/* Amenities — one full-screen photo; the list on the right chooses which.     */
/* Nothing changes with scroll: scrolling simply moves on to the next section. */
/* -------------------------------------------------------------------------- */
export function amenities() {
  const sec = $('[data-amen]');
  if (!sec) return;
  const bgs = $$('[data-amen-bg]', sec);
  const items = $$<HTMLButtonElement>('[data-amen-item]', sec);
  const texts = $$('[data-amen-text]', sec);
  const rail = $('[data-amen-rail]', sec)!;
  const S = 0.4;
  const L = 1.2;
  const EASE_IN = CustomEase.create('amen.in', '0.5, 0, 0.75, 0');
  const EASE_OUT = CustomEase.create('amen.out', '0.25, 1, 0.5, 1');
  const EASE_INOUT = CustomEase.create('amen.inOut', '0.75, 0, 0.25, 1');
  let active = 0;
  let split: SplitText | null = null;

  const set = (i: number) => {
    if (i === active) return;
    const prev = active;
    active = i;
    items.forEach((it, k) => {
      it.classList.toggle('is-active', k === i);
      it.toggleAttribute('aria-current', k === i);
    });
    rail.style.transform = `translateY(${i * 100}%)`;

    const inBg = bgs[i];
    const outBg = bgs[prev];
    const inText = texts[i];
    const outText = texts[prev];

    // settle anything still moving from a previous click
    gsap.killTweensOf([...bgs, ...bgs.map((b) => $('[data-media-inner]', b)), ...texts.flatMap((t) => Array.from(t.children))]);
    split?.revert();
    split = null;
    bgs.forEach((b, k) => {
      if (k !== i && k !== prev) {
        b.classList.remove('is-active');
        gsap.set(b, { clearProps: 'clipPath,zIndex' });
      }
    });
    texts.forEach((t, k) => {
      t.setAttribute('aria-hidden', String(k !== i));
      if (k !== i && k !== prev) t.classList.remove('is-active');
    });

    if (reduced) {
      outBg.classList.remove('is-active');
      inBg.classList.add('is-active');
      outText.classList.remove('is-active');
      inText.classList.add('is-active');
      return;
    }

    // photo: the new one wipes across on a diagonal while it settles from a zoom
    inBg.classList.add('is-active');
    gsap.set(inBg, { zIndex: 2 });
    gsap.set(outBg, { zIndex: 1, clipPath: 'none' });
    gsap.fromTo(
      inBg,
      { clipPath: 'polygon(100% 0%, 100% 0%, 101% 100%, 125% 100%)' },
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: L * 1.15,
        ease: EASE_INOUT,
        onComplete: () => {
          outBg.classList.remove('is-active');
          gsap.set([inBg, outBg], { clearProps: 'clipPath,zIndex' });
        },
      },
    );
    gsap.fromTo($('[data-media-inner]', inBg), { scale: 1.35, xPercent: 12 }, { scale: 1, xPercent: 0, duration: L * 1.15, ease: EASE_INOUT });
    gsap.to($('[data-media-inner]', outBg), { scale: 1.2, xPercent: -8, duration: L * 1.15, ease: EASE_INOUT, clearProps: 'transform' });

    // copy: the old lines lift away, the new ones rise line by line
    gsap.to(outText.children, {
      autoAlpha: 0,
      y: -22,
      duration: S,
      stagger: 0.04,
      ease: EASE_IN,
      onComplete: () => {
        outText.classList.remove('is-active');
        gsap.set(outText.children, { clearProps: 'all' });
      },
    });
    inText.classList.add('is-active');
    gsap.set(inText.children, { clearProps: 'all' });
    const label = inText.children[0];
    const quote = inText.children[1] as HTMLElement;
    split = new SplitText(quote, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    gsap.fromTo(label, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, ease: EASE_OUT, delay: 0.12 });
    gsap.fromTo(split.lines, { yPercent: 110 }, {
      yPercent: 0,
      duration: L,
      stagger: 0.08,
      ease: EASE_OUT,
      delay: 0.18,
      onComplete: () => {
        split?.revert();
        split = null;
      },
    });
  };

  items.forEach((it, i) => it.addEventListener('click', () => set(i)));

  if (reduced) return;
  const mm = gsap.matchMedia();
  mm.add(mq.desktop, () => {
    // Arrival: the list steps in, the rule draws, the copy rises
    const first = texts[0];
    gsap
      .timeline({ scrollTrigger: { trigger: sec, start: 'top 45%', once: true } })
      .from(rail.parentElement, { scaleY: 0, transformOrigin: 'top', duration: 1.2, ease: EASE_INOUT }, 0)
      .from(items, { autoAlpha: 0, x: 36, duration: 1, stagger: 0.09, ease: EASE_OUT, clearProps: 'all' }, 0.1)
      .from(first.children, { autoAlpha: 0, y: 34, duration: L, stagger: 0.12, ease: EASE_OUT, clearProps: 'all' }, 0.25)
      .from($('.amen__cta', sec), { autoAlpha: 0, scale: 0.9, duration: 1.2, ease: EASE_OUT, clearProps: 'all' }, 0.5);

    // Leaving: the photo eases forward and the overlay thins as the next section rises
    gsap
      .timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: () => `+=${window.innerHeight}`, scrub: true, invalidateOnRefresh: true } })
      .fromTo($('.amen__bgs', sec), { scale: 1 }, { scale: 1.18, ease: 'none' }, 0)
      .to([$('.amen__nav', sec), $('.amen__copy', sec), $('.amen__cta', sec)], { opacity: 0, y: -40, ease: 'power1.in' }, 0);
  });
}

/* -------------------------------------------------------------------------- */
/* Architecture — two offset windows slide level, join, and the frame grows    */
/* until the photo fills the screen; flowers are pushed aside; the statement    */
/* then rises over the same photo.                                             */
/* -------------------------------------------------------------------------- */
export function architecture() {
  const sec = $('[data-archi]');
  if (!sec) return;
  const stage = $('[data-archi-stage]', sec)!;
  const photo = $('[data-archi-photo]', sec)!;
  const mask = $('[data-archi-mask]', sec)!;
  const left = $('[data-archi-l]', sec)!;
  const right = $('[data-archi-r]', sec)!;
  const flowerL = $('[data-archi-flower="l"]', sec);
  const flowerR = $('[data-archi-flower="r"]', sec);
  const shade = $('[data-archi-shade]', sec);
  const quoteText = $('[data-archi-quote-text]', sec);
  const quoteParts = $$('[data-archi-quote-part]', sec);

  if (reduced) {
    gsap.set(mask, { display: 'none' });
    return;
  }

  // A window is a rectangular hole in its panel: the polygon runs round the panel,
  // dips in to trace the hole, and comes back out (same point count for every state,
  // so the shapes can be tweened).
  const hole = (x1: number, x2: number, y1: number, y2: number) =>
    `polygon(0% 0%, 0% 100%, ${x1}% 100%, ${x1}% ${y1}%, ${x2}% ${y1}%, ${x2}% ${y2}%, ${x1}% ${y2}%, ${x1}% 100%, 100% 100%, 100% 0%)`;

  const inner = $('[data-media-inner]', photo);
  const quoteLines = quoteText ? SplitText.create(quoteText, { type: 'lines', mask: 'lines' }) : null;
  const EASE = CustomEase.create('archi.inOut', '0.75, 0, 0.25, 1');

  const mm = gsap.matchMedia();
  const build = (g: { lx: [number, number]; rx: [number, number]; l0: [number, number]; r0: [number, number]; y: [number, number]; grow: number }) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: () => `+=${window.innerHeight * 3}`,
        pin: stage,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    // 1 · the windows slide level
    tl.fromTo(left, { clipPath: hole(g.lx[0], g.lx[1], g.l0[0], g.l0[1]) }, { clipPath: hole(g.lx[0], g.lx[1], g.y[0], g.y[1]), duration: 0.42, ease: 'none' }, 0)
      .fromTo(right, { clipPath: hole(g.rx[0], g.rx[1], g.r0[0], g.r0[1]) }, { clipPath: hole(g.rx[0], g.rx[1], g.y[0], g.y[1]), duration: 0.42, ease: 'none' }, 0)
      // 2 · the gap between them closes
      .to(left, { clipPath: hole(g.lx[0], 100, g.y[0], g.y[1]), duration: 0.08, ease: 'none' }, 0.42)
      .to(right, { clipPath: hole(0, g.rx[1], g.y[0], g.y[1]), duration: 0.08, ease: 'none' }, 0.42)
      // 3 · the frame grows to the edges of the screen; the photo eases up to full size
      .fromTo(mask, { scale: 1 }, { scale: g.grow, duration: 0.36, ease: EASE }, 0.5)
      .fromTo(inner, { scale: 1.24 }, { scale: 1, duration: 0.36, ease: EASE }, 0.5);
    if (flowerL) tl.to(flowerL, { xPercent: -80, duration: 0.36, ease: EASE }, 0.5);
    if (flowerR) tl.to(flowerR, { xPercent: 125, duration: 0.36, ease: EASE }, 0.5);
    tl.to({}, { duration: 0.06 });

    // 4 · still the same photograph: it eases forward, its lower half deepens, and the
    //     statement rises line by line
    tl.addLabel('statement')
      .to(inner, { scale: 1.1, yPercent: -3, duration: 0.5, ease: 'none' }, 'statement');
    if (shade) tl.to(shade, { opacity: 1, duration: 0.25, ease: 'none' }, 'statement');
    if (quoteLines) tl.fromTo(quoteText, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 'statement+=0.1').from(quoteLines.lines, { yPercent: 110, duration: 0.22, stagger: 0.05, ease: 'power3.out' }, 'statement+=0.1');
    if (quoteParts.length) tl.fromTo(quoteParts, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.05, ease: 'power2.out' }, 'statement+=0.18');
    tl.to({}, { duration: 0.2 });

    // On the way in, the photo drifts a little behind the windows
    gsap.fromTo(inner, { yPercent: -6 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top top', scrub: true } });
  };

  // window geometry, in % of each half-width panel (x) and of the stage height (y)
  mm.add(mq.desktop, () => build({ lx: [44.444, 98.889], rx: [1.111, 55.556], l0: [36, 99], r0: [1, 64], y: [18.5, 81.5], grow: 1.9 }));
  mm.add(mq.mobile, () => build({ lx: [14, 98], rx: [2, 86], l0: [42, 86], r0: [14, 58], y: [28, 72], grow: 2.4 }));
}

/* -------------------------------------------------------------------------- */
/* Credentials accordion                                                       */
/* -------------------------------------------------------------------------- */
export function credentials() {
  $$<HTMLButtonElement>('[data-cred-toggle]').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls')!)!;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        panel.hidden = false;
        gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.9, ease: 'raha.out', onComplete: () => ScrollTrigger.refresh() });
      } else {
        gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: 0.6,
          ease: 'raha.inOut',
          onComplete: () => {
            panel.hidden = true;
            ScrollTrigger.refresh();
          },
        });
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* CTA — frame tightens as the footer arrives                                  */
/* -------------------------------------------------------------------------- */
export function cta() {
  const frame = $('[data-cta-frame]');
  if (!frame || reduced) return;
  const mm = gsap.matchMedia();
  mm.add(mq.desktop, () => {
    gsap.fromTo(
      frame,
      { clipPath: 'inset(0% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 22% 14% 22%)',
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'bottom bottom', end: 'bottom top', scrub: true },
      },
    );
  });
  mm.add(mq.mobile, () => {
    gsap.fromTo(frame, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 6% 10% 6%)', ease: 'none', scrollTrigger: { trigger: frame, start: 'bottom bottom', end: 'bottom top', scrub: true } });
  });
}
