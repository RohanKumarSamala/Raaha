/**
 * GLOBAL SITE CONTENT
 * ------------------------------------------------------------------
 * Everything here is PLACEHOLDER until RAHA supplies final details.
 * Values are intentionally neutral; do not publish before replacing.
 * Search the project for "PLACEHOLDER" to find every temporary value.
 */

export const site = {
  brand: {
    name: 'RAHA', // PLACEHOLDER wordmark text — replaced by the supplied logo in components/brand
    descriptor: 'Residences', // PLACEHOLDER
    badgeText: 'RAHA · RESIDENCES · RAHA · RESIDENCES · ', // circular badge copy
    legalName: 'RAHA Residences', // PLACEHOLDER
  },

  seo: {
    titleTemplate: '%s — RAHA Residences',
    defaultTitle: 'RAHA Residences', // PLACEHOLDER
    description:
      'RAHA — a private collection of contemporary residences shaped around architecture, light and landscape.', // PLACEHOLDER
    ogImage: '/og-default.jpg', // PLACEHOLDER — add /public/og-default.jpg (1200×630)
    themeColor: '#33122a',
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
      { label: 'Contact', href: '/#contact' },
    ],
    menu: [
      { label: 'Home', href: '/' },
      { label: 'Location', href: '/#location' },
      { label: 'Concept', href: '/#concept' },
      { label: 'Residences', href: '/residences' },
      { label: 'Amenities', href: '/#amenities' },
      { label: 'Architecture', href: '/#architecture' },
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
