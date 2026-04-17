import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    // Local dev only — proxies /api to your local Express server
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
});
