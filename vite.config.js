import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Optimized for Vercel root deployment. 
  base: './',
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 3000
  }
}))
