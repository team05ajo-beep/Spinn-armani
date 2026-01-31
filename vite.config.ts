import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Memastikan process.env.API_KEY tersedia baik di objek global maupun process
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || '')
    }
  },
  server: {
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000, // Menghilangkan peringatan chunk size besar
    rollupOptions: {
      output: {
        // Memecah library vendor menjadi file tersendiri untuk performa load lebih baik
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('html2canvas')) return 'vendor-html2canvas';
            if (id.includes('@google/genai')) return 'vendor-genai';
            return 'vendor';
          }
        }
      }
    }
  }
});