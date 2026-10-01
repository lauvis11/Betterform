// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService()
  },
  integrations: [react()],
  redirects: {
    '/inicio': '/',
    '/ejercicios': '/exercises',
    '/informacion': '/about'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});