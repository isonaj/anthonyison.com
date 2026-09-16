import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://anthonyison.com',
  output: 'static',
  integrations: [
    // Batches are fragments of the feed, not pages worth indexing.
    sitemap({ filter: (page) => !page.includes('/batches/') })
  ]
});
