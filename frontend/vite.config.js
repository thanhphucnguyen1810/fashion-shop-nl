import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  },
  server: {
    // host: '0.0.0.0',
    port: 5173,
    open: true,
    fs: {
      strict: false
    },
    historyApiFallback: true
  }
})
