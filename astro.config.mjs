import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://smar-soft.com',
  integrations: [tailwind()],
});
