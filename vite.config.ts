import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  // For testing with Cloudflare Quick Tunnel
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
  test: {
    environment: 'node',
  },
})
