import { gsap, Flip, ScrollTrigger, reduced } from '../core/gsap';
import { $, $$ } from '../core/dom';

/* -------------------------------------------------------------------------- */
/* Listing — accessible dropdown filters + Flip-animated grid                  */
/* -------------------------------------------------------------------------- */
export function listing() {
  const sec = $('[data-listing]');
  if (!sec) return;
  const grid = $('[data-listing-grid]', sec)!;
  const cards = $$('[data-card]', grid);
  const promos = $$('[data-promo]', grid);
  const count = $('[data-listing-count]', sec)!;
  const empty = $('[data-listing-empty]', sec)!;
  const reset = $('[data-filters-reset]', sec)!;
  const state: Record<string, string> = { type: '', beds: '', sort: '' };
  const originalOrder = [...grid.children];

  const params = new URLSearchParams(location.search);
  if (params.get('type')) state.type = params.get('type')!;

  const filterEls = $$('[data-filter]', sec);

  const syncUI = () => {
    filterEls.forEach((f) => {
      const key = f.dataset.filter!;
      const opts = $$('[role="option"]', f);
      opts.forEach((o) => o.setAttribute('aria-selected', String(o.dataset.value === state[key])));
      const sel = opts.find((o) => o.dataset.value === state[key]) ?? opts[0];
      $('[data-filter-value]', f)!.textContent = sel.textContent!.trim();
    });
    reset.classList.toggle('is-on', Object.values(state).some(Boolean));
  };

  const apply = (animate = true) => {
    const flipState = Flip.getState([...cards, ...promos]);
    const filtered = !!(state.type || state.beds);
    let visible = 0;
    cards.forEach((c) => {
      const show = (!state.type || c.dataset.type === state.type) && (!state.beds || c.dataset.beds === state.beds);
      c.hidden = !show;
      if (show && c.dataset.status !== 'sold') visible++;
    });
    promos.forEach((p) => (p.hidden = filtered || !!state.sort));

    const ordered = state.sort
      ? [...cards].sort((a, b) => {
          if (state.sort === 'area-asc') return +a.dataset.area! - +b.dataset.area!;
          if (state.sort === 'area-desc') return +b.dataset.area! - +a.dataset.area!;
          return a.dataset.number!.localeCompare(b.dataset.number!);
        })
      : originalOrder;
    ordered.forEach((el) => grid.appendChild(el));

    count.textContent = String(visible);
    empty.hidden = cards.some((c) => !c.hidden);
    syncUI();

    if (animate && !reduced) {
      Flip.from(flipState, {
        duration: 0.9,
        ease: 'raha.inOut',
        stagger: 0.015,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.25 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.96, duration: 0.5 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    } else ScrollTrigger.refresh();

    const url = new URL(location.href);
    Object.entries(state).forEach(([k, v]) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k)));
    history.replaceState(null, '', url);
  };

  // Dropdowns
  const closeAll = (except?: HTMLElement) =>
    filterEls.forEach((f) => {
      if (f === except) return;
      $('[data-filter-btn]', f)!.setAttribute('aria-expanded', 'false');
      $('[data-filter-list]', f)!.hidden = true;
    });

  filterEls.forEach((f) => {
    const btn = $<HTMLButtonElement>('[data-filter-btn]', f)!;
    const list = $('[data-filter-list]', f)!;
    const opts = $$('[role="option"]', f);

    const open = () => {
      closeAll(f);
      btn.setAttribute('aria-expanded', 'true');
      list.hidden = false;
      gsap.fromTo(list, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.5 });
      (opts.find((o) => o.getAttribute('aria-selected') === 'true') ?? opts[0]).focus();
    };
    const close = (focusBtn = true) => {
      btn.setAttribute('aria-expanded', 'false');
      list.hidden = true;
      if (focusBtn) btn.focus();
    };
    const choose = (o: HTMLElement) => {
      state[f.dataset.filter!] = o.dataset.value ?? '';
      close();
      apply();
    };

    btn.addEventListener('click', () => (list.hidden ? open() : close()));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        open();
      }
    });
    opts.forEach((o, i) => {
      o.addEventListener('click', () => choose(o));
      o.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') (e.preventDefault(), opts[Math.min(i + 1, opts.length - 1)].focus());
        if (e.key === 'ArrowUp') (e.preventDefault(), opts[Math.max(i - 1, 0)].focus());
        if (e.key === 'Enter' || e.key === ' ') (e.preventDefault(), choose(o));
        if (e.key === 'Escape' || e.key === 'Tab') close(e.key === 'Escape');
      });
    });
  });
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('[data-filter]')) closeAll();
  });
  reset.addEventListener('click', () => {
    Object.keys(state).forEach((k) => (state[k] = ''));
    apply();
  });

  if (state.type) apply(false);
  else syncUI();

  // Staggered card entrance
  if (!reduced) {
    gsap.set(grid.children, { autoAlpha: 0, y: 60 });
    return () =>
      ScrollTrigger.batch([...grid.children], {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }),
      });
  }
}

/* -------------------------------------------------------------------------- */
/* Residence detail — tabs, mobile action bar                                  */
/* -------------------------------------------------------------------------- */
export function unit() {
  const sec = $('[data-unit]');
  if (!sec) return;

  const tabs = $$<HTMLButtonElement>('[data-tab]', sec);
  const panels = $$('[data-tabpanel]', sec);
  const line = $('[data-tab-line]', sec)!;
  const moveLine = (t: HTMLElement) => {
    line.style.width = `${t.offsetWidth}px`;
    line.style.transform = `translateX(${t.offsetLeft}px)`;
  };
  const select = (i: number, focus = false) => {
    tabs.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
    });
    panels.forEach((p, k) => {
      if (k === i) {
        p.hidden = false;
        gsap.fromTo(p, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7 });
      } else p.hidden = true;
    });
    moveLine(tabs[i]);
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') select((i + 1) % tabs.length, true);
      if (e.key === 'ArrowLeft') select((i - 1 + tabs.length) % tabs.length, true);
    });
  });
  moveLine(tabs[0]);
  window.addEventListener('resize', () => moveLine(tabs.find((t) => t.getAttribute('aria-selected') === 'true')!));

  const bar = $('.unit__mobile-bar', sec);
  if (bar) {
    ScrollTrigger.create({
      trigger: $('.unit__actions', sec),
      start: 'bottom top',
      endTrigger: sec,
      end: 'bottom bottom',
      onToggle: (self) => bar.classList.toggle('is-visible', self.isActive),
    });
  }
}

export function similar() {
  const sec = $('[data-similar]');
  if (!sec) return;
  const rail = $('[data-similar-rail]', sec)!;
  const step = () => (rail.firstElementChild as HTMLElement).offsetWidth + 16;
  $('[data-similar-prev]', sec)?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('[data-similar-next]', sec)?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));

  // Mouse drag-to-scroll
  let down = false;
  let moved = false;
  let sx = 0;
  let sl = 0;
  rail.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true;
    moved = false;
    sx = e.clientX;
    sl = rail.scrollLeft;
    rail.style.scrollSnapType = 'none';
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 4) moved = true;
    rail.scrollLeft = sl - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    rail.style.scrollSnapType = '';
  });
  rail.addEventListener('click', (e) => moved && e.preventDefault(), true);
}
