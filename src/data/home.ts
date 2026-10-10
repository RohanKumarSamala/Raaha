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
    title: 'RAAHA RESORT', // PLACEHOLDER
    description:
      'A private collection of contemporary residences designed around privacy, wellbeing and timeless architecture.', // PLACEHOLDER
  },

  hero: {
    titleLines: ['RAAHA', 'RETREAT'],
    script: '',
    phrase: ['A place', 'to return to'],
    day: { src: 'home/24.png', alt: 'RAAHA Retreat swimming pool and terracotta villas under evening sunset skies', tone: 'dusk', position: 'center 50%', label: 'Hero · Evening Pool & Sanctuary' } as MediaRef,
    hotspots: [
      { x: 18, y: 66, title: 'Shaded Pergola', text: 'Private outdoor lounge oriented to evening sunsets.' },
      { x: 53, y: 62, title: 'Sanctuary Villas', text: 'Terracotta suites crafted with floor-to-ceiling glass and private decks.' },
      { x: 64, y: 88, title: 'Reflecting Pool', text: 'Tranquil central pool framed by lush palms and open skies.' },
    ],
  },

  reasons: {
    arcText: 'Three reasons to choose RAAHA',
    region: ['Boutique', 'Retreat'],
    caption: ['A place to live — to return', 'year after year'],
    items: [
      {
        title: ['Real-life location'],
        text: 'Nestled amidst lush palms and open skies, RAAHA offers a rare balance of secluded retreat living and effortless hospitality — a serene sanctuary for weekends, celebrations and unforgettable stays.',
        statement: ['Designed as a community,', 'not a complex'],
        images: [
          { src: 'raaha_hires/IMG_6071.jpg', alt: 'Golden sunset over the Raaha lawns, framed by canna lilies and a textured wall', tone: 'dusk', label: 'Sunset on the grounds', position: 'center 62%' },
          { src: 'raaha_hires/raaha_32.jpg', alt: 'Poolside loungers and wooden pergola deck under the palms', tone: 'garden', label: 'Under the palms', position: 'center 85%' },
        ] as MediaRef[],
      },
      {
        title: ['Quiet architecture'],
        text: 'Clean contemporary volumes, warm pink facade tones and deep shaded pergolas — an architectural language crafted to feel calm, tactile and intimate from the moment you arrive.',
        statement: ['Crafted to feel', 'like a private home'],
        images: [
          { src: 'raaha_hires/25.png', alt: 'Pink Raaha cottages with shaded verandas under a sunset sky', tone: 'dusk', label: 'Architecture · Cottages', position: 'center 72%' },
          { src: 'raaha_hires/raaha_08.jpg', alt: 'Bedroom window view onto the private garden court', tone: 'interior', label: 'Architecture · Garden View' },
        ] as MediaRef[],
      },
      {
        title: ['Wellbeing by design'],
        text: 'Lawns, pool water and sunlight are woven seamlessly with every space. Every cottage connects directly to manicured outdoor grounds, courts and open-air lounges.',
        statement: ['Space to breathe,', 'every single day'],
        images: [
          { src: 'home/24.png', alt: 'Raaha swimming pool and terracotta villas under an evening sky', tone: 'dusk', label: 'Evenings at Raaha', position: 'center 65%' },
          { src: 'raaha_hires/raaha_18.jpg', alt: 'Private pickleball and multi-sports court surrounded by palm trees', tone: 'garden', label: 'Wellbeing · Court' },
        ] as MediaRef[],
      },
    ],
  },

  quote: {
    text: 'Instead of corridors, walking paths connect the residences — making RAAHA feel closer to a group of private homes than a standard development',
    author: ['Architecture team', 'RAAHA Residences'],
    image: { src: 'raaha_hires/26.png', alt: 'Poolside pergola lounge, palms and pink villa at Raaha', tone: 'garden', label: 'Quote · By the pool' } as MediaRef,
  },

  concept: {
    label: 'The concept',
    statement:
      'RAAHA is a boutique sanctuary of private villas, designed around privacy, wellbeing and timeless retreat living',
    text: 'Combining contemporary architecture with warm materials, expansive lawns and carefully curated gathering spaces, RAAHA is crafted for pauses from the ordinary.',
    location: {
      country: 'Retreat',
      lines: ['The', 'Private', 'Sanctuary'],
      image: { src: 'raaha_hires/raaha_03.jpg', alt: 'Sunlit living and dining pavilion with panoramic windows', tone: 'sky', label: 'Living · Open Lounge' } as MediaRef,
      title: 'A pause from the ordinary',
      text: 'Surrounded by palms, open lawns and tranquil water, the retreat combines total privacy with effortless comfort. A location designed not around movement — but around returning.',
    },
    map: {
      label: 'Getting here',
      // PLACEHOLDER copy — replace with the real route once the addresses are confirmed
      heading: ['The quiet you wanted', 'than you think'],
      script: 'closer',
      text: 'Under an hour from the airport and minutes from the city — yet a world away from the moment you turn in at the gate.',
      points: [
        { x: 8, y: 70, name: 'Airport', time: '50 min' },
        { x: 30, y: 48, name: 'City Center', time: '20 min' },
        { x: 52, y: 58, name: 'RAAHA', time: '', home: true },
        { x: 72, y: 40, name: 'Clubhouse', time: '5 min' },
        { x: 92, y: 30, name: 'Lakeside', time: '15 min' },
      ],
    },
  },

  // Stays carousel — one slide per kind of space. Values are written out in words
  // because they are set in the display face.
  types: [
    {
      id: 'lawn',
      name: 'Celebration lawn',
      stats: [{ label: 'Open lawn, around', value: 'Two acres' }],
      summary:
        'Two acres of open lawn framed by palms — made for weddings and milestone evenings, long-table dinners under the sky, music after dark, or a slow morning with nothing planned at all.',
      features: ['Weddings and celebrations', 'Long-table dinners outdoors', 'Open skies from every side'],
      image: { src: 'raaha_hires/raaha_07.jpg', alt: 'The open lawn at Raaha under a sunset sky, palms beyond', tone: 'dusk', label: 'Stays · Lawn at sunset', position: 'center 55%' } as MediaRef,
    },
    {
      id: 'blocks',
      name: 'Block residences',
      stats: [{ label: 'Bedrooms', value: 'Four blocks' }],
      summary:
        'Four private bedroom blocks set around the lawns and the pool — each with its own shaded veranda, tall glass that pulls the garden inside, and a door that opens straight onto the grounds.',
      features: ['Shaded private verandas', 'Floor-to-ceiling glass', 'Steps from the pool'],
      image: { src: 'raaha_hires/raaha_30.jpg', alt: 'Pink bedroom blocks with shaded verandas at Raaha', tone: 'stone', label: 'Stays · Blocks' } as MediaRef,
    },
  ],

  // Figures are written out in words because they are set in the display face.
  statement: {
    caption: ['A place to live — to return', 'year after year'],
    // no commas, digits or full stops in the title: the display face has no glyphs for them
    text: 'RAAHA is set across three acres',
    note: 'Three acres where the day slows down. Wake to palms and birdsong, cross the lawn barefoot to the pool, gather your people under an open sky — and stay long after the lanterns come on. Arrive as a guest; leave already planning your way back.',
  },

  space: {
    lines: ['The', 'Space', 'To'],
    script: 'Live in',
    upgrades: {
      title: 'Optional upgrades are available:',
      items: ['Private plunge pool', 'EV charging point', 'Photovoltaic panels'],
    },
    statement: 'Every detail was selected to create homes that feel elegant, intuitive and effortless to live in',
    specs:
      'Spacious high-ceiling suites. Private terraces overlooking lush palms. Climate automation systems. Premium wooden joinery and natural finishes throughout.',
    images: {
      ornament: { src: 'raaha_hires/raaha_32.jpg', alt: 'Loungers under the pergola, framed by palms', tone: 'garden', label: 'Space · Pergola lounge', position: 'center 70%' } as MediaRef,
      terrace: { src: 'raaha_hires/raaha_16.jpg', alt: 'Spacious open living room and dining area', tone: 'sky', label: 'Space · Living & Lounge' } as MediaRef,
    },
    slider: [
      { src: 'raaha_hires/space-slide-1.png', alt: 'Bedroom with a low timber bed, warm wall lighting and an armchair by the window', tone: 'interior', label: 'Space · Bedroom', caption: 'The bedroom', position: 'center 64%' },
      { src: 'raaha_hires/space-slide-2.png', alt: 'Open living hall with cove lighting, sofas and tall windows onto the pool', tone: 'interior', label: 'Space · Living hall', caption: 'The living hall' },
      { src: 'raaha_hires/space-slide-3.png', alt: 'Long timber dining table with leather chairs beside garden-facing windows', tone: 'interior', label: 'Space · Dining', caption: 'The dining table', position: 'center 70%' },
    ] as MediaRef[],
  },

  architecture: {
    word: 'Architecture',
    frame: { src: 'raaha_hires/archi-frame.png', alt: 'The pergola lounge, palms and pink villa at Raaha under a sunset sky', tone: 'dusk', label: 'Architecture · Pergola at sunset', position: 'center 40%' } as MediaRef,
    quote: 'The architecture of RAAHA balances clean contemporary lines with warmth and natural texture',
    author: ['Architecture team', 'RAAHA Retreat'],
  },

  credentials: {
    caption: ['A place to live — to return', 'year after year'],
    items: [
      { title: 'Developer', text: 'Raaha Retreats & Hospitality.' },
      { title: 'Hospitality & curation', text: 'Curated boutique stays and private gatherings.' },
      { title: 'License obtained', text: 'The property holds all required permits and certifications. Documentation available on request.' },
      { title: 'Operational', text: 'Open for private bookings, weekend retreats, and milestone celebrations.' },
    ],
  },

  cta: {
    intro: 'A short conversation is enough to understand which residence fits you — whether it is a private villa, an extended stay, or a space for your next celebration.',
    lines: ['Your space for', 'celebrations'],
    // (no ampersand: this line is set in the display face, which has no glyph for it)
    sub: 'and everything in between',
    image: { src: 'raaha_hires/cta-villa.png', alt: 'A pink Raaha villa with its shaded veranda under a sunset sky', tone: 'dusk', label: 'CTA · Villa at sunset', position: 'center 62%' } as MediaRef,
  },

  contact: {
    script: 'Book a call',
    note: 'Leave your details and we will get back to you within 24 hours.', // PLACEHOLDER
  },
};
