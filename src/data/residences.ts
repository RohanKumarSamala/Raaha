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
    areaRange: '000 — 000 m²',
    summary: 'Private garden, direct outdoor access and a dedicated lower level.',
    cta: 'Explore garden residences',
    image: { src: 'residences/type-garden.jpg', alt: 'Garden residence courtyard', tone: 'stone', label: 'Type · Garden' },
  },
  {
    id: 'terrace',
    name: 'Terrace residence',
    bedrooms: '2 — 3',
    areaRange: '000 — 000 m²',
    summary: 'Single-level living that opens onto a generous covered terrace.',
    cta: 'Explore terrace residences',
    image: { src: 'residences/type-terrace.jpg', alt: 'Terrace residence living room', tone: 'interior', label: 'Type · Terrace' },
  },
  {
    id: 'penthouse',
    name: 'Penthouse duplex',
    bedrooms: '3 — 4',
    areaRange: '000 — 000 m²',
    summary: 'Two levels, a private rooftop solarium and open views to the horizon.',
    cta: 'Explore penthouses',
    image: { src: 'residences/type-penthouse.jpg', alt: 'Penthouse rooftop solarium', tone: 'sky', label: 'Type · Penthouse' },
  },
];

const baseFeatures = [
  'Underfloor heating throughout',
  'Climate automation system',
  'Smart lock access',
  'Electric aluminium shutters',
  'Private parking space and storage',
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

const tones = ['interior', 'stone', 'sky', 'garden'] as const;

export const residences: Residence[] = seeds.map((s, i) => {
  const type = residenceTypes.find((t) => t.id === s.typeId)!;
  return {
    slug: s.number,
    bathrooms: s.bedrooms,
    completion: '4Q 2027', // PLACEHOLDER
    status: 'available',
    orientation: 180,
    info: `${s.bedrooms} bedrooms, open-plan living and a ${s.typeId === 'penthouse' ? 'private rooftop solarium' : 'large terrace'} that connects to the communal gardens.`, // PLACEHOLDER
    features: baseFeatures,
    floorplans: [
      {
        src: `residences/${s.number}/plan-1.png`,
        alt: `Residence ${s.number} floor plan`,
        placeholder: s.typeId === 'terrace' ? 'plan-single' : 'plan-duplex',
        label: s.typeId === 'terrace' ? 'Floor plan' : 'Ground floor + lower level',
      },
    ],
    gallery: [0, 1, 2].map((n) => ({
      src: `residences/${s.number}/image-${n + 1}.jpg`,
      alt: `${type.name} ${s.number} interior view ${n + 1}`,
      tone: tones[(i + n) % tones.length],
      label: `Residence ${s.number} · Image ${n + 1}`,
    })),
    ...s,
  } as Residence;
});

export const typeById = (id: string) => residenceTypes.find((t) => t.id === id)!;

export const formatArea = (n?: number) => (n ? `${n} m²` : '—');
