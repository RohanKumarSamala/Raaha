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
    name: 'Gated community',
    text: 'Instead of corridors, walking paths connect the residences — closer to a group of private homes than a standard development.',
    image: { src: 'amenities/community.jpg', alt: 'Residences and pool at dusk', tone: 'night', label: 'Amenity · Community' },
  },
  {
    id: 'pool',
    name: 'Swimming pool',
    text: 'A long reflecting pool framed by sun terraces, planting and quiet corners for the late afternoon.',
    image: { src: 'amenities/pool.jpg', alt: 'Swimming pool', tone: 'sea', label: 'Amenity · Pool' },
  },
  {
    id: 'spa',
    name: 'Spa & gym',
    text: 'A private wellness level with sauna, treatment room and a gym opening onto the gardens.',
    image: { src: 'amenities/spa.jpg', alt: 'Spa interior', tone: 'interior', label: 'Amenity · Spa' },
  },
  {
    id: 'landscape',
    name: 'Landscaping',
    text: 'Native planting, shaded pergolas and water features designed to mature with the architecture.',
    image: { src: 'amenities/landscape.jpg', alt: 'Landscaped gardens', tone: 'garden', label: 'Amenity · Landscape' },
  },
  {
    id: 'parking',
    name: 'Parking & security',
    text: 'Underground parking with storage, controlled access and discreet 24-hour security.',
    image: { src: 'amenities/parking.jpg', alt: 'Arrival court', tone: 'stone', label: 'Amenity · Parking' },
  },
];
