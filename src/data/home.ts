/**
 * HOME PAGE CONTENT
 * ------------------------------------------------------------------
 * PLACEHOLDER COPY & IMAGERY. The structure mirrors the final storytelling
 * sequence; swap strings and image paths once RAHA material is supplied.
 * Line breaks in display headings are explicit arrays so the editorial
 * rag can be tuned per language without touching components.
 */
import type { MediaRef } from './types';

export const home = {
  seo: {
    title: 'RAHA Residences', // PLACEHOLDER
    description:
      'A private collection of contemporary residences designed around privacy, wellbeing and timeless architecture.', // PLACEHOLDER
  },

  hero: {
    titleLines: ['RAHA', 'Residences'],
    script: 'Location', // PLACEHOLDER — city or district name
    phrase: ['A place', 'to return to'],
    day: { src: 'home/hero-day.jpg', alt: 'RAHA residences exterior by day', tone: 'sky', label: 'Hero · Day render' } as MediaRef,
    night: { src: 'home/hero-night.jpg', alt: 'RAHA residences exterior by night', tone: 'night', label: 'Hero · Night render' } as MediaRef,
    toggle: ['By day', 'By night'],
    cta: { label: 'View available residences', href: '/residences' },
    hotspots: [
      { x: 27, y: 66, title: 'Rooftop solarium', text: 'Private terraces oriented to the evening light.' }, // PLACEHOLDER
      { x: 57, y: 72, title: 'Garden residences', text: 'Direct access to landscaped communal gardens.' }, // PLACEHOLDER
    ],
  },

  reasons: {
    arcText: 'Three reasons to choose RAHA',
    region: ['Region', 'Country'], // PLACEHOLDER
    caption: ['A place to live — to return', 'year after year'],
    items: [
      {
        title: ['Real-life location'],
        text: 'Nestled between the coast, the hills and everyday conveniences, RAHA offers a rare balance of seclusion and effortless access to the finest local lifestyle.', // PLACEHOLDER
        statement: ['Designed as a community,', 'not a complex'],
        images: [
          { src: 'home/reason-1a.jpg', alt: 'Residences framed by landscaping', tone: 'sky', label: 'Reason 1 · Image A' },
          { src: 'home/reason-1b.jpg', alt: 'Walking paths between residences', tone: 'garden', label: 'Reason 1 · Image B' },
        ] as MediaRef[],
      },
      {
        title: ['Quiet architecture'],
        text: 'Clean contemporary volumes, warm natural stone and deep shaded terraces — a language that ages gracefully and feels calm from the first visit.', // PLACEHOLDER
        statement: ['Crafted to feel', 'like a private home'],
        images: [
          { src: 'home/reason-2a.jpg', alt: 'Stone facade detail', tone: 'stone', label: 'Reason 2 · Image A' },
          { src: 'home/reason-2b.jpg', alt: 'Shaded terrace', tone: 'interior', label: 'Reason 2 · Image B' },
        ] as MediaRef[],
      },
      {
        title: ['Wellbeing by design'],
        text: 'Gardens, water and light are planned before walls. Every residence has private outdoor space and a direct connection to the landscape.', // PLACEHOLDER
        statement: ['Space to breathe,', 'every single day'],
        images: [
          { src: 'home/reason-3a.jpg', alt: 'Pool and gardens', tone: 'sea', label: 'Reason 3 · Image A' },
          { src: 'home/reason-3b.jpg', alt: 'Wellness area', tone: 'garden', label: 'Reason 3 · Image B' },
        ] as MediaRef[],
      },
    ],
  },

  quote: {
    text: 'Instead of corridors, walking paths connect the residences — making RAHA feel closer to a group of private homes than a standard development', // PLACEHOLDER
    author: ['Architecture team', 'RAHA Residences'],
    image: { src: 'home/quote.jpg', alt: 'Pool and residences at golden hour', tone: 'sea', label: 'Quote · Full-bleed' } as MediaRef,
  },

  concept: {
    label: 'The concept',
    statement:
      'RAHA is a boutique gated community of only a few residences, designed around privacy, wellbeing and timeless living', // PLACEHOLDER
    text: 'Inspired by the atmosphere of the coast, the project combines contemporary architecture with warm materials, natural landscaping and carefully curated spaces.', // PLACEHOLDER
    location: {
      country: 'Country', // PLACEHOLDER
      lines: ['New', 'Golden', 'District'], // PLACEHOLDER
      image: { src: 'home/concept-terrace.jpg', alt: 'Terrace overlooking the coast', tone: 'sky', label: 'Concept · Portrait' } as MediaRef,
      title: 'Between the city and the sea', // PLACEHOLDER
      text: 'Surrounded by beaches, golf courses, wellness clubs and established lifestyle destinations, the project combines privacy with effortless connectivity. A location designed not around movement — but around returning.', // PLACEHOLDER
      cta: { label: 'View available residences', href: '/residences' },
    },
    map: {
      // Points sit on the drawn route; x/y are % of the map panel. PLACEHOLDER destinations.
      points: [
        { x: 8, y: 70, name: 'Airport', time: '50 min' },
        { x: 30, y: 48, name: 'Old town', time: '10 min' },
        { x: 52, y: 58, name: 'RAHA', time: '', home: true },
        { x: 72, y: 40, name: 'Marina', time: '8 min' },
        { x: 92, y: 30, name: 'Golf club', time: '15 min' },
      ],
    },
  },

  location: {
    image: { src: 'home/aerial.jpg', alt: 'Aerial view of the coastline and surroundings', tone: 'aerial', label: 'Location · Aerial' } as MediaRef,
    caption: ['New Golden District', 'Region', 'Country'], // PLACEHOLDER
    headline: ['The coast', 'you wanted'],
    script: 'yours',
    sub: 'This year',
  },

  space: {
    lines: ['The', 'Space', 'To'],
    script: 'Live in',
    upgrades: {
      title: 'Optional upgrades are available:',
      items: ['Private jacuzzi', 'EV charging point', 'Photovoltaic panels'], // PLACEHOLDER
    },
    statement: 'Every detail was selected to create homes that feel elegant, intuitive and effortless to live in', // PLACEHOLDER
    specs:
      'Underfloor heating throughout the property. Climate automation systems. Smart lock access. Electrically adjustable aluminium shutters. Premium switches and mechanisms.', // PLACEHOLDER
    images: {
      ornament: { src: 'home/space-ornament.png', alt: '', tone: 'deep', label: 'Ornament / cut-out' } as MediaRef,
      terrace: { src: 'home/space-terrace.jpg', alt: 'Covered terrace with lounge seating', tone: 'sky', label: 'Space · Terrace' } as MediaRef,
    },
    slider: [
      { src: 'home/interior-1.jpg', alt: 'Primary bedroom opening onto the terrace', tone: 'interior', label: 'Interior · 1' },
      { src: 'home/interior-2.jpg', alt: 'Open-plan living and dining', tone: 'stone', label: 'Interior · 2' },
      { src: 'home/interior-3.jpg', alt: 'Bathroom in natural stone', tone: 'interior', label: 'Interior · 3' },
    ] as MediaRef[],
    cta: { label: 'View available residences', href: '/residences' },
  },

  architecture: {
    word: 'Architecture',
    pair: [
      { src: 'home/arch-1.jpg', alt: 'Stepped white volumes with planting', tone: 'sky', label: 'Architecture · A' },
      { src: 'home/arch-2.jpg', alt: 'Facade detail against the sky', tone: 'sky', label: 'Architecture · B' },
    ] as MediaRef[],
    quote: 'The architecture of RAHA balances clean contemporary lines with warmth and natural texture', // PLACEHOLDER
    author: ['By Architect name', 'Architecture studio'], // PLACEHOLDER
    image: { src: 'home/arch-full.jpg', alt: 'Facade of the residences with gardens', tone: 'stone', label: 'Architecture · Full-bleed' } as MediaRef,
  },

  credentials: {
    caption: ['A place to live — to return', 'year after year'],
    items: [
      { title: 'Developer', text: 'Developer company name.' }, // PLACEHOLDER
      { title: 'Sales & marketing', text: 'Sales agency name.' }, // PLACEHOLDER
      { title: 'License obtained', text: 'The project holds all required permits and an active construction license. Documentation is available on request.' }, // PLACEHOLDER
      { title: '2027', text: 'Currently under construction. Completion is anticipated in 2027.' }, // PLACEHOLDER
    ],
  },

  cta: {
    intro: 'A short conversation is enough to understand which residence fits you — whether it is a second home, a longer stay, or a place to return to year after year.', // PLACEHOLDER
    lines: ['Perfect', 'Sea views'], // PLACEHOLDER
    sub: 'From rooftop terraces',
    image: { src: 'home/cta.jpg', alt: 'Rooftop terrace dining with sea view', tone: 'dusk', label: 'CTA · Full-bleed' } as MediaRef,
    button: { label: 'View available residences', href: '/residences' },
  },

  contact: {
    script: 'Book a call',
    note: 'Leave your details and we will get back to you within 24 hours.', // PLACEHOLDER
  },
};
