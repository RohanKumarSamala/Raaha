# RAHA Residences — website

Luxury real-estate site for RAHA, built to the interaction and layout standard of the
reference (era-residence.com): fluid editorial type, arch reveals over sticky imagery,
a pinned horizontal "concept" track, a scroll-driven amenities sequence, an expanding
architecture frame, rounded residence cards, and a split residence page with a sticky panel.

**Every piece of copy, imagery, contact detail and legal text is a PLACEHOLDER.**

## Commands

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output → dist/
npm run preview
npm run check     # type + template check
```

## Stack

- **Astro 7** (static, file routing, AVIF/WebP via `astro:assets`, sitemap)
- **GSAP 3.15** — ScrollTrigger, SplitText, Flip, CustomEase
- **Lenis** smooth scroll (disabled for `prefers-reduced-motion`)
- Self-hosted fonts via Fontsource (no third-party requests)

## Structure

```
src/
  data/                 ← ALL CONTENT LIVES HERE
    site.ts             brand, SEO defaults, contact, socials, nav, legal, form endpoint
    home.ts             every home-page section (copy + image paths)
    residences.ts       residence types + unit schedule
    amenities.ts        amenity sequence
    legal.ts            privacy / terms
  assets/images/        drop real imagery here (paths referenced in data/*.ts)
  components/
    brand/              Mark (placeholder symbol), Badge (circular logo)
    chrome/             Header, Menu, ScrollRail, Preloader, Curtain, Cursor, BookingModal, Footer
    forms/              BookingForm, BookingPanel (modal + contact section)
    sections/           Hero, Reasons, Quote, Concept, Location, ResidenceTypes, Amenities,
                        Space, Architecture, Credentials, Cta, Contact, LegalPage
    residences/         ResidenceCard, Filters
    ui/                 Media, Slider, CircleButton, PillButton, RollText, PlanPlaceholder
  layouts/BaseLayout.astro   SEO, JSON-LD, global chrome
  pages/                index, residences/, residences/[slug], privacy, terms, 404
  scripts/
    main.ts             boot order (scroll → modules → uncover → intros/reveals)
    core/               gsap setup, Lenis, fit-text, DOM helpers
    modules/            reveals, cursor/magnetic, menu/modal, form, slider, transitions, chrome
    sections/           per-section behaviour (home.ts, residences.ts)
  styles/
    tokens.css          palette, fonts, fluid unit + type scale per breakpoint
    base.css            reset, type classes, themes, buttons, reveal states
```

## Design system

Sizes are authored in design pixels on a **1600px** canvas (desktop), **1024px** (tablet)
and **416px** (mobile), multiplied by `--u` (`100vw / canvas`). So the whole composition
scales proportionally, the same way the reference does. Small text keeps a px floor for legibility.

| Token | Use |
|---|---|
| `.h1`–`.h6` | condensed display serif, uppercase |
| `.a1` `.a2` | script accents |
| `.p1` `.p2` | body |
| `.l1` `.l2` | tracked uppercase labels |
| `.c1` | widely spaced display caption |
| `.t-light` `.t-mist` `.t-deep` `.t-image` | section surfaces; header/rail colour follows automatically |

Declarative motion: `data-reveal="lines|words|chars|chars-blur|fade|image|image-side|line-y|script|stagger"`,
`data-parallax="8"`, `data-speed="0.06"`, `data-magnetic`, `data-cursor="link|view|drag|hide"`, `data-fit`.

## Replacing placeholders with RAHA assets

1. **Logo / symbol** — replace the SVG in `components/brand/Mark.astro` (keep `currentColor`);
   badge ring text is `site.brand.badgeText`. Replace `public/favicon.svg`; add `public/og-default.jpg` (1200×630).
2. **Photography & renders** — save files in `src/assets/images/` using the paths in `data/*.ts`
   (e.g. `home/hero-day.jpg`). Anything present is served as responsive AVIF + WebP; anything missing
   stays a same-ratio placeholder. Supply ≥2560px long edge for full-bleed frames.
   Re-crop with `position: '50% 70%'` on the media entry.
3. **Video** — put files in `public/video/` and set `video: '/video/hero.mp4'` on a media entry (image becomes the poster).
4. **Floor plans** — `residences/<number>/plan-1.png` (transparent or white background).
5. **Residences** — replace `seeds`/`residenceTypes` in `data/residences.ts`; add `pdf` for downloadable plans.
6. **Copy** — `data/home.ts`, `data/amenities.ts`; display headings are arrays so line breaks stay editorial.
7. **Contact, socials, legal, credits, SEO** — `data/site.ts`, `data/legal.ts`; set `SITE_URL` for canonical/sitemap
   (also update `public/robots.txt`).
8. **Brand colours** — `styles/tokens.css` palette block.
9. **Brand fonts** — swap `--font-display` / `--font-script` / `--font-body` in `tokens.css` and the imports at the top
   of `BaseLayout.astro`. Set `--display-stretch: normal` for a non-variable display face and tune `--display-optical`
   so cap heights match.
10. **Form** — set `site.forms.endpoint` (Formspree, HubSpot, custom API). Until then submissions are simulated;
    append `?form=error` to any URL to preview the error state.

Search the codebase for `PLACEHOLDER` to find every temporary value.

## Notes

- **Typography.** The reference's display face (Ambroise François) and script (Sloop Script) are commercial
  Adobe Fonts. The closest open-licence stand-ins are used instead: Noto Serif Display at 62.5% width
  (high-contrast condensed Didone), Pinyon Script and Archivo Expanded. Ambroise is narrower than any free
  alternative, so long headings use `data-fit` to stay on one line.
- **Custom cursor** only activates on fine pointers without reduced motion; touch devices keep native behaviour.
- **Reduced motion** disables smooth scrolling, intro timelines and scrubbed reveals; all content stays visible.
- **Mobile** re-composes rather than shrinks: the horizontal track stacks, amenities become a swipe carousel,
  the residence page moves the key facts first and adds a sticky request bar.
# Raaha
