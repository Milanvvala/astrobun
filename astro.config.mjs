// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import vue from '@astrojs/vue';

import cloudflare from '@astrojs/cloudflare';

import { resolve } from 'path';

// https://astro.build/config
export default defineConfig({
  srcDir: './src/client',
  output: 'server',

  vite: {
    resolve: {
      alias: {
        '@': resolve('./src/client')
      }
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8787"
        }
      }
    }
  },

  integrations: [react(), vue()],
  adapter: cloudflare()
});