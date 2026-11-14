import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': { target: 'http://localhost:8484', changeOrigin: true }, '/order-items': { target: 'http://localhost:8484', changeOrigin: true } } },
})
