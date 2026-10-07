/**
 * Page modules, in document order (ScrollTrigger pins must be created top → bottom).
 * Each returns an optional intro callback that runs once the page is uncovered.
 */
import { hero, arch, reasons, concept, location, types, amenities, architecture, credentials, cta } from './home';
import { listing, unit, similar } from './residences';

type Module = () => void | (() => void);

export const pageModules: Module[] = [
  hero,
  arch('.reasons'),
  reasons,
  listing,
  unit,
  concept,
  location,
  types,
  amenities,
  arch('.space'),
  architecture,
  credentials,
  similar,
  cta,
];
