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
    cta: { label: 'View available residences', href: '/residences' },
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
    text: 'Instead of corridors, walking paths connect the residences — making RAHA feel closer to a group of private homes than a standard development',
    author: ['Architecture team', 'RAAHA Residences'],
    image: { src: 'raaha_hires/raaha_26.jpg', alt: 'Sunset over Raaha lawn and palms', tone: 'sea', label: 'Quote · Sunset at Raaha' } as MediaRef,
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
      cta: { label: 'View available residences', href: '/residences' },
    },
    map: {
      points: [
        { x: 8, y: 70, name: 'Airport', time: '50 min' },
        { x: 30, y: 48, name: 'City Center', time: '20 min' },
        { x: 52, y: 58, name: 'RAAHA', time: '', home: true },
        { x: 72, y: 40, name: 'Clubhouse', time: '5 min' },
        { x: 92, y: 30, name: 'Lakeside', time: '15 min' },
      ],
    },
  },

  location: {
    image: { src: 'raaha_hires/raaha_07.jpg', alt: 'Sunset over palms and lanterns at Raaha Retreat', tone: 'aerial', label: 'Location · Sunset Palms' } as MediaRef,
    caption: ['Private Sanctuary', 'Retreat', 'Destination'],
    headline: ['The retreat', 'you wanted'],
    script: 'yours',
    sub: 'This year',
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
      ornament: { src: 'raaha_hires/raaha_07.jpg', alt: 'Sunset lanterns', tone: 'deep', label: 'Ornament' } as MediaRef,
      terrace: { src: 'raaha_hires/raaha_16.jpg', alt: 'Spacious open living room and dining area', tone: 'sky', label: 'Space · Living & Lounge' } as MediaRef,
    },
    slider: [
      { src: 'raaha_hires/raaha_02.jpg', alt: 'Primary bedroom suite — A pause from the ordinary', tone: 'interior', label: 'Suite · Bedroom' },
      { src: 'raaha_hires/raaha_03.jpg', alt: 'Grand open living pavilion with panoramic glass windows', tone: 'stone', label: 'Living · Open Hall' },
      { src: 'raaha_hires/raaha_08.jpg', alt: 'Bedroom with panoramic garden window view', tone: 'interior', label: 'Suite · Window View' },
    ] as MediaRef[],
    cta: { label: 'View available residences', href: '/residences' },
  },

  architecture: {
    word: 'Architecture',
    pair: [
      { src: 'raaha_hires/raaha_30.jpg', alt: 'Modern pink cottages and manicured green lawn', tone: 'sky', label: 'Architecture · The Outside' },
      { src: 'raaha_hires/raaha_32.jpg', alt: 'Poolside sun loungers and pergolas', tone: 'sky', label: 'Architecture · Poolside' },
    ] as MediaRef[],
    quote: 'The architecture of RAHA balances clean contemporary lines with warmth and natural texture',
    author: ['Architecture team', 'RAHA Retreat'],
    image: { src: 'raaha_hires/raaha_09.jpg', alt: 'Expansive celebration lawn and palm trees at Raaha Retreat', tone: 'stone', label: 'Architecture · Celebration Lawn' } as MediaRef,
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
    sub: '& everything in between',
    image: { src: 'raaha_hires/raaha_07.jpg', alt: 'Nighttime lanterns and illuminated grounds — That’s RAAHA', tone: 'dusk', label: 'CTA · That’s RAAHA' } as MediaRef,
    button: { label: 'View available residences', href: '/residences' },
  },

  contact: {
    script: 'Book a call',
    note: 'Leave your details and we will get back to you within 24 hours.', // PLACEHOLDER
  },
};
