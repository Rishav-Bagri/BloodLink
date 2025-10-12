import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // allow access outside container
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,       // <-- force polling
      interval: 500          // check every 1 second
    }
  }
});
