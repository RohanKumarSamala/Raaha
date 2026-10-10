/**
 * Page modules, in document order (ScrollTrigger pins must be created top → bottom).
 * Each returns an optional intro callback that runs once the page is uncovered.
 */
import { hero, arch, reasons, concept, types, statement, flowers, amenities, architecture, credentials, cta } from './home';

type Module = () => void | (() => void);

export const pageModules: Module[] = [
  hero,
  arch('.reasons'),
  reasons,
  concept,
  types,
  statement,
  amenities,
  arch('.space'),
  architecture,
  credentials,
  cta,
  flowers,
];
