import { gsap, ScrollTrigger, SplitText, CustomEase, reduced, mq } from '../core/gsap';
import { $, $$ } from '../core/dom';
import { reveal } from '../modules/reveals';
import { scrollToTarget, getLenis } from '../core/scroll';

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
  const bar = $('[data-reasons-bar]', sec);
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
    timer = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: HOLD, ease: 'none', paused: !inView, onComplete: () => set(active + 1) });
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

    // Text is split only for the length of the move, so ligatures and wrapping stay native at rest
    const outChars = new SplitText(titles[prev], { type: 'words,chars' });
    const outLines = new SplitText($$('p', bodies[prev]), { type: 'lines', mask: 'lines' });
    let inChars: SplitText | null = null;
    let inLines: SplitText | null = null;

    inSlide.classList.add('is-active');
    gsap.set(inSlide, { zIndex: 2 });
    gsap.set(outSlide, { zIndex: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        inChars?.revert();
        inLines?.revert();
        outSlide.classList.remove('is-active');
        gsap.set([inSlide, outSlide], { clearProps: 'zIndex,clipPath' });
        gsap.set([$('[data-media-inner]', inSlide), $('[data-media-inner]', outSlide)], { clearProps: 'transform' });
        animating = false;
      },
    });

    // Out
    tl.to(outChars.chars, { opacity: 0, yPercent: -50, rotateY: -90, duration: S, stagger: STAGGER * 0.25, ease: EASE_IN }, 0)
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
      outChars.revert();
      outLines.revert();
      show(prev, false);
      show(i, true);
      inChars = new SplitText(titles[i], { type: 'words,chars' });
      inLines = new SplitText($$('p', bodies[i]), { type: 'lines', mask: 'lines' });
      tl.fromTo(
        inChars.chars,
        { opacity: 0, yPercent: 50, rotateY: 90 },
        { opacity: 1, yPercent: 0, rotateY: 0, duration: L, stagger: STAGGER * 0.5, ease: EASE_OUT },
        M,
      ).fromTo(inLines.lines, { yPercent: 110 }, { yPercent: 0, duration: L, stagger: STAGGER, ease: EASE_OUT }, M);
    }, M);
  };

  $('[data-reasons-prev]', sec)?.addEventListener('click', () => set(active - 1));
  $('[data-reasons-next]', sec)?.addEventListener('click', () => set(active + 1));

  // Only count down while the carousel is on screen
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 70%',
    end: 'bottom 30%',
    onToggle: (self) => {
      inView = self.isActive;
      if (inView) timer?.play();
      else timer?.pause();
    },
  });
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
  const points = $$('[data-map-point]', sec);
  const horizontal = $$('[data-reveal-horizontal]', sec);

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

    $$('[data-place-line]', sec).forEach((line, i) => {
      gsap.fromTo(
        line,
        { x: () => window.innerWidth * (0.08 + i * 0.07) },
        { x: 0, ease: 'none', scrollTrigger: { trigger: line, containerAnimation: tween, start: 'left right', end: 'right 60%', scrub: true, invalidateOnRefresh: true } },
      );
    });

    const mapPanel = $('[data-concept-map]', sec)!;
    if (path) {
      gsap.fromTo(path, { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: mapPanel, containerAnimation: tween, start: 'left 85%', end: 'right right', scrub: true },
      });
    }
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
    if (path) {
      gsap.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: path, start: 'top 85%', end: 'bottom 40%', scrub: true } });
    }
  });

  // Reveals are created once the page is uncovered so the first panel animates in view.
  return () => horizontal.forEach((el) => reveal(el, container ? { containerAnimation: container } : {}));
}

/* -------------------------------------------------------------------------- */
/* Location — fog parts to reveal the aerial                                   */
/* -------------------------------------------------------------------------- */
export function location() {
  const sec = $('[data-location]');
  if (!sec) return;
  const clouds = $$('[data-cloud]', sec);
  const head = $('[data-location-head]', sec)!;
  const caption = $('[data-location-caption]', sec)!;
  const media = $('[data-location-media] [data-media-inner]', sec);

  if (reduced) {
    gsap.set(clouds, { opacity: 0 });
    gsap.set(caption, { opacity: 1 });
    sec.dataset.header = 'light';
    return;
  }

  const titleSplit = SplitText.create($('.location__title', head)!, { type: 'lines', mask: 'lines' });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const next = self.progress < 0.38 ? 'ink' : 'light';
          if (sec.dataset.header !== next) sec.dataset.header = next;
        },
      },
    })
    .from(titleSplit.lines, { yPercent: 110, stagger: 0.05, duration: 0.18 }, 0)
    .from($('.location__script', head), { clipPath: 'inset(-60% 100% -60% -30%)', duration: 0.2 }, 0.06)
    .from($('.location__sub', head), { opacity: 0, duration: 0.15 }, 0.12)
    .to(head, { opacity: 0, y: -80, duration: 0.2 }, 0.34)
    .to(clouds, {
      xPercent: (i) => (i % 2 ? 70 : -70) * (1 + (i % 3) * 0.3),
      yPercent: (i) => (i > 3 ? 40 : -30),
      opacity: 0,
      scale: 1.4,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power1.in',
    }, 0.3)
    .fromTo(media, { scale: 1.35 }, { scale: 1, duration: 0.8, ease: 'power2.out' }, 0.25)
    .to(caption, { opacity: 1, duration: 0.15 }, 0.82);
}

/* -------------------------------------------------------------------------- */
/* Residence types carousel                                                    */
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
  const bar = $('[data-types-bar]', sec)!;
  const splits = titles.map((t) => new SplitText(t, { type: 'words,chars', mask: 'chars' }));
  let index = 0;
  let busy = false;

  const go = (to: number) => {
    const target = (to + n) % n;
    if (busy || target === index) return;
    busy = true;
    const dir = to > index ? 1 : -1;
    const d = reduced ? 0.01 : 1;
    const outSlide = slides[index];
    const inSlide = slides[target];
    const outPanels = [statSets[index], asideSets[index]];
    const inPanels = [statSets[target], asideSets[target]];
    const outTitle = titles[index];

    inSlide.classList.add('is-active');
    gsap.set(inSlide, { zIndex: 2 });
    gsap.set(outSlide, { zIndex: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        outSlide.classList.remove('is-active');
        gsap.set([inSlide, outSlide], { clearProps: 'zIndex,clipPath' });
        busy = false;
      },
    });
    tl.fromTo(inSlide, { clipPath: dir > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: d * 1.3, ease: 'raha.inOut' }, 0)
      .fromTo($('[data-media-inner]', inSlide), { scale: 1.25 }, { scale: 1, duration: d * 1.8 }, 0)
      .fromTo(splits[index].chars, { yPercent: 0 }, { yPercent: -110 * dir, duration: d * 0.6, stagger: 0.012, ease: 'power3.in', immediateRender: false }, 0)
      .add(() => {
        outTitle.classList.remove('is-active');
        titles[target].classList.add('is-active');
        titles.forEach((t, i) => t.setAttribute('aria-hidden', String(i !== target)));
      }, d * 0.6)
      .fromTo(splits[target].chars, { yPercent: 110 * dir }, { yPercent: 0, duration: d * 1.1, stagger: 0.018 }, d * 0.6)
      .to(outPanels, { autoAlpha: 0, y: -14, duration: d * 0.45, ease: 'power2.in' }, 0)
      .add(() => {
        outPanels.forEach((p) => {
          p.classList.remove('is-active');
          p.setAttribute('aria-hidden', 'true');
        });
        inPanels.forEach((p) => {
          p.classList.add('is-active');
          p.removeAttribute('aria-hidden');
        });
      }, d * 0.45)
      .fromTo(inPanels, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: d, stagger: 0.08, clearProps: 'visibility' }, d * 0.5);

    index = target;
    current.textContent = String(index + 1);
    bar.style.transform = `scaleX(${(index + 1) / n})`;
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

  // Entrance
  if (!reduced) {
    gsap.from(vp, {
      clipPath: 'inset(100% 0% 0% 0%)',
      duration: 1.6,
      ease: 'raha.inOut',
      scrollTrigger: { trigger: sec, start: 'top 60%', once: true },
    });
    gsap.from(splits[0].chars, { yPercent: 110, stagger: 0.02, duration: 1.2, scrollTrigger: { trigger: sec, start: 'top 45%', once: true } });
  }
}

/* -------------------------------------------------------------------------- */
/* Amenities — sticky sequence driven by scroll                               */
/* -------------------------------------------------------------------------- */
export function amenities() {
  const sec = $('[data-amen]');
  const spacer = $('[data-amen-spacer]');
  if (!sec || !spacer) return;
  const bgs = $$('[data-amen-bg]', sec);
  const items = $$<HTMLButtonElement>('[data-amen-item]', sec);
  const texts = $$('[data-amen-text]', sec);
  const rail = $('[data-amen-rail]', sec)!;
  const n = bgs.length;
  let active = 0;
  let st: ScrollTrigger | null = null;

  const set = (i: number) => {
    if (i === active) return;
    const prev = active;
    active = i;
    const dir = i > prev ? 1 : -1;
    items.forEach((it, k) => {
      it.classList.toggle('is-active', k === i);
      it.toggleAttribute('aria-current', k === i);
    });
    rail.style.transform = `translateY(${i * 100}%)`;

    const inBg = bgs[i];
    const outBg = bgs[prev];
    gsap.killTweensOf([inBg, outBg]);
    bgs.forEach((b, k) => {
      if (k !== i && k !== prev) b.classList.remove('is-active');
    });
    inBg.classList.add('is-active');
    gsap.set(inBg, { zIndex: 2 });
    gsap.set(outBg, { zIndex: 1 });
    gsap.fromTo(inBg, { clipPath: dir > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: reduced ? 0 : 1.3,
      ease: 'raha.inOut',
      onComplete: () => {
        outBg.classList.remove('is-active');
        gsap.set(inBg, { clearProps: 'clipPath,zIndex' });
      },
    });
    gsap.fromTo($('[data-media-inner]', inBg), { scale: 1.2 }, { scale: 1, duration: 2 });

    texts.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-hidden', String(!on));
      if (on) {
        t.classList.add('is-active');
        gsap.fromTo(t.children, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, delay: 0.25 });
      } else if (k === prev) {
        gsap.to(t.children, { autoAlpha: 0, y: -20, duration: 0.4, onComplete: () => t.classList.remove('is-active') });
      } else t.classList.remove('is-active');
    });
  };

  const mm = gsap.matchMedia();
  mm.add(mq.desktop, () => {
    st = ScrollTrigger.create({
      trigger: spacer,
      start: 'top bottom',
      end: 'bottom bottom',
      onUpdate: (self) => set(Math.min(n - 1, Math.floor(self.progress * n))),
    });
    return () => {
      st = null;
    };
  });

  items.forEach((it, i) =>
    it.addEventListener('click', () => {
      if (!st) return set(i);
      scrollToTarget(st.start + ((i + 0.5) / n) * (st.end - st.start));
    }),
  );
}

/* -------------------------------------------------------------------------- */
/* Architecture — portrait expands into a full-bleed frame                     */
/* -------------------------------------------------------------------------- */
export function architecture() {
  const sec = $('[data-archi]');
  if (!sec) return;
  const stage = $('[data-archi-stage]', sec)!;
  const ghost = $('[data-archi-ghost]', sec)!;
  const b = $('[data-archi-b]', sec)!;
  const a = $('[data-archi-a]', sec)!;
  const word = $('[data-archi-word]', sec)!;

  const fit = () => {
    word.style.fontSize = '';
    const target = stage.clientWidth * 0.955;
    const w = word.scrollWidth;
    if (w) word.style.fontSize = `${(parseFloat(getComputedStyle(word).fontSize) * target) / w}px`;
  };
  fit();
  window.addEventListener('resize', fit);

  const inset = () => {
    const s = stage.getBoundingClientRect();
    const g = ghost.getBoundingClientRect();
    return `inset(${g.top - s.top}px ${s.right - g.right}px ${s.bottom - g.bottom}px ${g.left - s.left}px)`;
  };

  if (reduced) {
    gsap.set(b, { clipPath: 'inset(0px 0px 0px 0px)' });
    return;
  }

  const split = SplitText.create(word, { type: 'chars', mask: 'chars' });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: () => `+=${window.innerHeight * 1.6}`,
        pin: stage,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })
    .fromTo(b, { clipPath: inset }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1, ease: 'power2.inOut' }, 0)
    .fromTo($('[data-media-inner]', b), { scale: 1.25 }, { scale: 1, duration: 1, ease: 'power1.out' }, 0)
    .to(a, { y: () => -window.innerHeight * 0.5, opacity: 0, duration: 0.7, ease: 'power1.in' }, 0)
    .from(split.chars, { yPercent: 110, duration: 0.55, stagger: 0.025, ease: 'power3.out' }, 0.45)
    .to({}, { duration: 0.25 });

  // Parallax the pre-expansion pair on approach
  gsap.fromTo(a, { y: () => window.innerHeight * 0.25 }, { y: 0, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true } });
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
