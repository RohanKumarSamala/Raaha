/**
 * AMENITIES — PLACEHOLDER copy & imagery.
 * Names and statements are set in the display face, which has no digits, commas,
 * full stops, hyphens or ampersands — so the wording here avoids them.
 * Order here defines the order of the pinned amenity sequence.
 */
import type { MediaRef } from './types';

export interface Amenity {
  id: string;
  name: string;
  text: string;
  image: MediaRef;
}

export const amenities: Amenity[] = [
  {
    id: 'community',
    name: 'Retreat community',
    text: 'Walking paths connect the private cottages through open lawns and gardens — closer to a collection of private homes than a standard resort',
    image: { src: 'raaha_hires/amen-community.jpg', alt: 'A pink cottage mirrored in still water, framed by palms at dusk', tone: 'dusk', label: 'Amenity · Community', position: 'center 47%' },
  },
  {
    id: 'pool',
    name: 'Reflecting pool',
    text: 'A sparkling pool framed by sun loungers and native palms — with quiet corners made for a slow afternoon',
    image: { src: 'raaha_hires/amen-pool.jpg', alt: 'The pool and pergola beside the pink residences under a sunset sky', tone: 'dusk', label: 'Amenity · Pool', position: 'center 70%' },
  },
  {
    id: 'spa',
    name: 'Sports and recreation',
    text: 'A private pickleball and multi sport court bordered by palms — made for active mornings and friendly matches',
    image: { src: 'raaha_hires/amen-sports.jpg', alt: 'The sports court at sunset, ringed by palms', tone: 'dusk', label: 'Amenity · Sports', position: 'center 70%' },
  },
  {
    id: 'landscape',
    name: 'Celebration lawns',
    text: 'Manicured lawns under open skies — crafted for weddings and intimate gatherings and long evenings outdoors',
    image: { src: 'raaha_hires/amen-lawn.jpg', alt: 'The open celebration lawn at sunset with palms on the horizon', tone: 'dusk', label: 'Amenity · Lawns', position: 'center 60%' },
  },
  {
    id: 'parking',
    name: 'Arrival and security',
    text: 'A gated entrance with ample private parking — discreet security round the clock and dedicated guest assistance',
    image: { src: 'raaha_hires/raaha_07.jpg', alt: 'Arrival grounds and illuminated lanterns at dusk', tone: 'stone', label: 'Amenity · Arrival' },
  },
];
