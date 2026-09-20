/**
 * AMENITIES — PLACEHOLDER copy & imagery.
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
    text: 'Walking paths connect the private cottages through open lawns and gardens — closer to a collection of private homes than a standard resort.',
    image: { src: 'raaha_hires/raaha_30.jpg', alt: 'Cottages and walking paths through open lawns', tone: 'night', label: 'Amenity · Community' },
  },
  {
    id: 'pool',
    name: 'Reflecting pool',
    text: 'A sparkling swimming pool framed by sun loungers, native palms and peaceful corners for afternoon relaxation.',
    image: { src: 'raaha_hires/raaha_05.jpg', alt: 'Swimming pool and pink cottages under palms', tone: 'sea', label: 'Amenity · Pool' },
  },
  {
    id: 'spa',
    name: 'Sports & recreation',
    text: 'Private pickleball and multi-sports court bordered by lush palms, designed for active wellness and friendly matches.',
    image: { src: 'raaha_hires/raaha_18.jpg', alt: 'Outdoor pickleball court at Raaha Retreat', tone: 'interior', label: 'Amenity · Sports' },
  },
  {
    id: 'landscape',
    name: 'Celebration lawns',
    text: 'Manicured green lawns and open spaces crafted for milestone weddings, intimate gatherings and retreat events.',
    image: { src: 'raaha_hires/raaha_10.jpg', alt: 'Vast manicured celebration lawn and palms at Raaha', tone: 'garden', label: 'Amenity · Lawns' },
  },
  {
    id: 'parking',
    name: 'Arrival & security',
    text: 'Gated entrance with ample private parking, discreet 24-hour security and dedicated guest assistance.',
    image: { src: 'raaha_hires/raaha_07.jpg', alt: 'Arrival grounds and illuminated lanterns at dusk', tone: 'stone', label: 'Amenity · Arrival' },
  },
];
