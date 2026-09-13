// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Replace with the production domain once RAHA's URL is confirmed.
const SITE_URL = process.env.SITE_URL ?? 'https://www.raha-residences.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: {
    // AVIF + WebP are generated per <Media>; keep quality high for architectural photography.
    responsiveStyles: false,
  },
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: { assetsInlineLimit: 2048 },
  },
});
