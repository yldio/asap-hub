import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  server: {
    open: true,
    port: 3000,
  },
  define: {
    global: 'globalThis',
  },
});
