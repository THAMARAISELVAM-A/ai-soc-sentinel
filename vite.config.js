import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // In production (GH Pages), set base to repo subpath. Locally use './'
  base: mode === 'production' ? '/ai-soc-sentinel/' : './',
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 3000
  }
}))
