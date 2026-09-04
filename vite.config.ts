import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Target backend untuk proxy /api saat dev server jalan — di-proxy di level
// server (bukan browser) supaya tidak kena CORS, walau target-nya cross-origin
// (mis. domain production). Adjustable lewat VITE_API_PROXY_TARGET di .env.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'https://azerakol.id'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
