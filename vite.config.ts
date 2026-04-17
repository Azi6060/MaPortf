import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  server: {
    // Local dev only — proxies /api to your local Express server
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
});