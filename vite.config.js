import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3001' },
  },
  // Source maps are kept on purpose so REA can map bundled code back to src/.
  build: { sourcemap: true },
});
