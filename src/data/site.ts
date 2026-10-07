/**
 * GLOBAL SITE CONTENT
 * ------------------------------------------------------------------
 * Everything here is PLACEHOLDER until RAHA supplies final details.
 * Values are intentionally neutral; do not publish before replacing.
 * Search the project for "PLACEHOLDER" to find every temporary value.
 */

export const site = {
  brand: {
    name: 'RAAHA',
    descriptor: 'Retreat',
    badgeText: 'RAAHA · RETREAT · RAAHA · RETREAT · ',
    legalName: 'RAAHA Retreat',
  },

  seo: {
    titleTemplate: '%s — RAAHA Retreat',
    defaultTitle: 'RAAHA Retreat',
    description:
      'RAAHA — a boutique retreat designed around tranquility, wellbeing and timeless architecture.',
    ogImage: '/og-default.jpg',
    themeColor: '#7c3821',
    locale: 'en_GB',
  },

  contact: {
    phone: '+00 (000) 000-000', // PLACEHOLDER
    phoneHref: 'tel:+00000000000', // PLACEHOLDER
    email: 'hello@raha-residences.com', // PLACEHOLDER
    officeLabel: 'Sales office',
    address: ['Address line one', 'City, Region, Country'], // PLACEHOLDER
    mapUrl: 'https://maps.google.com', // PLACEHOLDER
  },

  socials: [
    { label: 'Instagram', href: '#' }, // PLACEHOLDER
    { label: 'Facebook', href: '#' }, // PLACEHOLDER
    { label: 'LinkedIn', href: '#' }, // PLACEHOLDER
  ],

  nav: {
    primary: { label: ['Select', 'a residence'], href: '/residences' },
    secondary: [
      { label: 'Book a call', action: 'booking' },
      { label: 'Enquire', href: '/enquire' },
    ],
    menu: [
      { label: 'Home', href: '/' },
      { label: 'Location', href: '/#location' },
      { label: 'Concept', href: '/#concept' },
      { label: 'Residences', href: '/residences' },
      { label: 'Amenities', href: '/#amenities' },
      { label: 'Architecture', href: '/#architecture' },
      { label: 'Enquire', href: '/enquire' },
      { label: 'Contact', href: '/#contact' },
    ],
  },

  legal: {
    copyright: `©${new Date().getFullYear()} All rights reserved`,
    links: [
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of use', href: '/terms' },
    ],
    disclaimer:
      'Images are illustrative renders. Layouts, areas and specifications are indicative and may change during development.', // PLACEHOLDER
  },

  project: [
    { label: 'Developer', value: 'Developer name' }, // PLACEHOLDER
    { label: 'Status', value: 'Under construction' }, // PLACEHOLDER
  ],

  credits: { label: 'Website', value: 'Studio name', href: '#' }, // PLACEHOLDER

  forms: {
    /**
     * POST endpoint for booking/contact requests (Formspree, HubSpot, custom API…).
     * While empty, submissions are simulated so every UI state can be reviewed.
     * Append ?form=error to any URL to preview the error state.
     */
    endpoint: '',
  },
} as const;

export type Site = typeof site;
