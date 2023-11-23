import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: 'https://dev.hub.asap.science',
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
  },
});
