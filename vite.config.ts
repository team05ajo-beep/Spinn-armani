
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Menggunakan penggantian string literal yang lebih aman untuk API_KEY
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  server: {
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
