// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
    srcDir:'./src/client',

    vite: {
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:8787"
        }
      }
    }
  },

    integrations: [vue()]
});
