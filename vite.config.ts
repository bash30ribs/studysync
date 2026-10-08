import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import type { Plugin } from 'vite';

function expressBackendPlugin(): Plugin {
  return {
    name: 'express-backend',
    async configureServer(server) {
      try {
        const { default: app } = await import('./server/index.js');
        server.middlewares.use(app);
      } catch (err) {
        console.warn('[Vite] Could not mount backend API in dev server:', err);
      }
    },
    async configurePreviewServer(server) {
      try {
        const { default: app } = await import('./server/index.js');
        server.middlewares.use(app);
      } catch (err) {
        console.warn('[Vite] Could not mount backend API in preview server:', err);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    expressBackendPlugin(),
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['studysync-ohdj.onrender.com', '.onrender.com'],
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: ['studysync-ohdj.onrender.com', '.onrender.com'],
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lucide-icons': ['lucide-react'],
        },
      },
    },
  },
});

