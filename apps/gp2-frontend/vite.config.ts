import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    target: browserslistToEsbuild(),
  },
  server: {
    open: true,
    port: 4000,
  },
  define: {
    global: 'globalThis',
  },
});
