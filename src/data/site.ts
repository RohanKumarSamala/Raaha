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
    // the first number is the primary one (menu, enquiry page, search-engine data)
    phone: '+91 83416 85800',
    phoneHref: 'tel:+918341685800',
    phones: [
      // `whatsapp` opens a chat with that number (used by the footer)
      { label: '+91 83416 85800', href: 'tel:+918341685800', whatsapp: 'https://wa.me/918341685800' },
      { label: '+91 77996 23050', href: 'tel:+917799623050', whatsapp: 'https://wa.me/917799623050' },
    ],
    email: 'raaharetreat.hyd@gmail.com',
    officeLabel: 'Sales office',
    address: ['Address line one', 'City, Region, Country'], // PLACEHOLDER
    mapUrl: 'https://maps.google.com', // PLACEHOLDER
  },

  socials: [
    { label: 'Instagram · @raaha.retreat_', href: 'https://www.instagram.com/raaha.retreat_/' },
    { label: 'Instagram · @raaha_retreat', href: 'https://www.instagram.com/raaha_retreat/' },
  ],

  nav: {
    secondary: [
      { label: 'Book a call', action: 'booking' },
      { label: 'Enquire', href: '/#footer' },
    ],
    menu: [
      { label: 'Home', href: '/' },
      { label: 'Location', href: '/#location' },
      { label: 'Concept', href: '/#concept' },
      { label: 'Amenities', href: '/#amenities' },
      { label: 'Architecture', href: '/#architecture' },
      { label: 'Enquire', href: '/#footer' },
      { label: 'Contact', href: '/#contact' },
    ],
  },

  legal: {
    copyright: `©${new Date().getFullYear()} All rights reserved`,
    links: [
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of use', href: '/terms' },
    ],
  },

  credits: { label: 'Made by', value: 'Arclume', href: 'https://arclume.co.in/' },

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
