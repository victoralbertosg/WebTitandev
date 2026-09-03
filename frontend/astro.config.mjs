import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), react()],
  output: 'static',
  site: 'https://titandevdatadynamics.com',
  vite: {
    server: {
      proxy: {
        // Redirige llamadas del frontend /api/v1 al backend FastAPI en puerto 8000
        '/api/v1': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        }
      }
    }
  }
});
