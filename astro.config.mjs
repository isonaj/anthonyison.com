import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://anthonyison.com',
  output: 'static',
  integrations: [sitemap()]
});
