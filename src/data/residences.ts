/**
 * RESIDENCES
 * ------------------------------------------------------------------
 * PLACEHOLDER DATA — structure is final, values are not.
 * Replace with RAHA's official unit schedule. Image paths are relative to
 * /src/assets/images; when a file is missing a placeholder of the same
 * ratio is rendered instead, so layouts stay intact.
 */
import type { MediaRef } from './types';

export interface ResidenceType {
  id: string;
  name: string; // shown as large display title
  bedrooms: string;
  areaRange: string;
  summary: string;
  cta: string;
  image: MediaRef;
}

export interface Residence {
  slug: string;
  number: string;
  typeId: string;
  block: string;
  floor: string;
  bedrooms: number;
  bathrooms: number;
  interior: number; // m²
  terrace?: number; // m²
  garden?: number; // m²
  solarium?: number; // m²
  completion: string;
  orientation: number; // degrees, used to rotate the compass
  status: 'available' | 'reserved' | 'sold';
  info: string;
  features: string[];
  floorplans: MediaRef[];
  gallery: MediaRef[];
  pdf?: string;
}

export const residenceTypes: ResidenceType[] = [
  {
    id: 'garden',
    name: 'Garden residence',
    bedrooms: '3',
    areaRange: '130 — 135 m²',
    summary: 'Private garden, direct outdoor lawn access and open living spaces.',
    cta: 'Explore garden residences',
    image: { src: 'raaha_hires/raaha_30.jpg', alt: 'Garden residence cottages and grounds', tone: 'stone', label: 'Type · Garden' },
  },
  {
    id: 'terrace',
    name: 'Terrace residence',
    bedrooms: '2 — 3',
    areaRange: '75 — 92 m²',
    summary: 'Single-level living that opens onto a generous covered lounge terrace.',
    cta: 'Explore terrace residences',
    image: { src: 'raaha_hires/raaha_03.jpg', alt: 'Terrace residence living room and lounge', tone: 'interior', label: 'Type · Terrace' },
  },
  {
    id: 'penthouse',
    name: 'Penthouse duplex',
    bedrooms: '3 — 4',
    areaRange: '120 — 152 m²',
    summary: 'Two levels, direct poolside setting and sweeping views across the palms.',
    cta: 'Explore penthouses',
    image: { src: 'raaha_hires/raaha_05.jpg', alt: 'Penthouse villa by the pool and palms', tone: 'sky', label: 'Type · Penthouse' },
  },
];

const baseFeatures = [
  'Underfloor heating and climate control',
  'High-speed Wi-Fi and smart lock access',
  'Spacious ensuite bathrooms with stone finishes',
  'Private terrace or garden lawn',
  'Dedicated parking space and 24-hour security',
];

type Seed = Pick<Residence, 'number' | 'typeId' | 'block' | 'floor' | 'bedrooms' | 'interior'> &
  Partial<Residence>;

const seeds: Seed[] = [
  { number: '001', typeId: 'garden', block: 'A', floor: '0', bedrooms: 3, interior: 130, terrace: 30, garden: 45, orientation: 200 },
  { number: '002', typeId: 'garden', block: 'A', floor: '0', bedrooms: 3, interior: 130, terrace: 30, garden: 40, orientation: 200 },
  { number: '003', typeId: 'garden', block: 'B', floor: '0', bedrooms: 3, interior: 135, terrace: 45, garden: 50, orientation: 180, status: 'reserved' },
  { number: '004', typeId: 'garden', block: 'B', floor: '0', bedrooms: 3, interior: 135, terrace: 44, garden: 38, orientation: 180 },
  { number: '101', typeId: 'terrace', block: 'A', floor: '1', bedrooms: 2, interior: 75, terrace: 30, orientation: 210 },
  { number: '102', typeId: 'terrace', block: 'A', floor: '1', bedrooms: 2, interior: 75, terrace: 30, orientation: 210 },
  { number: '103', typeId: 'terrace', block: 'B', floor: '1', bedrooms: 3, interior: 90, terrace: 35, orientation: 170 },
  { number: '104', typeId: 'terrace', block: 'B', floor: '1', bedrooms: 3, interior: 92, terrace: 36, orientation: 170, status: 'sold' },
  { number: '201', typeId: 'penthouse', block: 'A', floor: '2', bedrooms: 3, interior: 120, terrace: 40, solarium: 60, orientation: 190 },
  { number: '202', typeId: 'penthouse', block: 'A', floor: '2', bedrooms: 3, interior: 122, terrace: 42, solarium: 62, orientation: 190 },
  { number: '203', typeId: 'penthouse', block: 'B', floor: '2', bedrooms: 4, interior: 150, terrace: 55, solarium: 80, orientation: 160 },
  { number: '204', typeId: 'penthouse', block: 'B', floor: '2', bedrooms: 4, interior: 152, terrace: 55, solarium: 82, orientation: 160 },
];

const galleryByType: Record<string, { src: string; alt: string; tone: (typeof tones)[number]; label: string }[]> = {
  garden: [
    { src: 'raaha_hires/raaha_30.jpg', alt: 'Garden residence exterior cottages and open lawns', tone: 'stone', label: 'Exterior · Grounds' },
    { src: 'raaha_hires/raaha_02.jpg', alt: 'Primary bedroom suite — A pause from the ordinary', tone: 'interior', label: 'Suite · Bedroom' },
    { src: 'raaha_hires/raaha_08.jpg', alt: 'Panoramic garden window view from bedroom', tone: 'garden', label: 'View · Garden Court' },
    { src: 'raaha_hires/raaha_06.jpg', alt: 'Modern stone bathroom with walk-in shower', tone: 'interior', label: 'Bath · Ensuite' },
  ],
  terrace: [
    { src: 'raaha_hires/raaha_03.jpg', alt: 'Terrace residence expansive open living and dining', tone: 'interior', label: 'Living · Open Hall' },
    { src: 'raaha_hires/raaha_04.jpg', alt: 'Bedroom suite with warm natural daylight', tone: 'interior', label: 'Suite · Bedroom' },
    { src: 'raaha_hires/raaha_31.jpg', alt: 'Spacious lounge and entertainment pavilion', tone: 'stone', label: 'Lounge · Living Pavilion' },
    { src: 'raaha_hires/raaha_06.jpg', alt: 'Modern ensuite bathroom with stone finishes', tone: 'interior', label: 'Bath · Ensuite' },
  ],
  penthouse: [
    { src: 'raaha_hires/raaha_05.jpg', alt: 'Penthouse duplex facade and swimming pool under the palms', tone: 'sky', label: 'Exterior · Poolside' },
    { src: 'raaha_hires/raaha_16.jpg', alt: 'Expansive penthouse living room pavilion', tone: 'interior', label: 'Living · Grand Lounge' },
    { src: 'raaha_hires/raaha_32.jpg', alt: 'Poolside cabana, sun loungers and wooden pergola deck', tone: 'sky', label: 'Pool · Sun Deck' },
    { src: 'raaha_hires/raaha_07.jpg', alt: 'Dusk illumination and evening ambiance across the retreat', tone: 'sea', label: 'Sunset · Evening Glow' },
  ],
};

const tones = ['interior', 'stone', 'sky', 'garden'] as const;

export const residences: Residence[] = seeds.map((s) => {
  const type = residenceTypes.find((t) => t.id === s.typeId)!;
  const galleries = galleryByType[s.typeId] ?? galleryByType.garden;
  return {
    slug: s.number,
    bathrooms: s.bedrooms,
    completion: '4Q 2027',
    status: s.status ?? 'available',
    orientation: s.orientation ?? 180,
    info: `${s.bedrooms} bedrooms, open-plan living and a ${s.typeId === 'penthouse' ? 'direct connection to the pool and gardens' : 'generous private terrace opening onto the grounds'}.`,
    features: baseFeatures,
    floorplans: [
      {
        src: `residences/${s.number}/plan-1.png`,
        alt: `Residence ${s.number} floor plan`,
        placeholder: s.typeId === 'terrace' ? 'plan-single' : 'plan-duplex',
        label: s.typeId === 'terrace' ? 'Floor plan' : 'Ground floor + lower level',
      },
    ],
    gallery: galleries.map((g, idx) => ({
      ...g,
      label: `Residence ${s.number} · ${g.label}`,
    })),
    ...s,
  } as Residence;
});

export const typeById = (id: string) => residenceTypes.find((t) => t.id === id)!;

export const formatArea = (n?: number) => (n ? `${n} m²` : '—');
