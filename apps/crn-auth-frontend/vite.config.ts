import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base:
    process.env.CRN_AUTH_FRONTEND_BASE_URL ||
    'https://dev.hub.asap.science/.auth/',
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
