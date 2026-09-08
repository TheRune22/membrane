import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'

export default defineConfig({
  // GitHub Pages serves project sites beneath the repository name.
  base: '/membrane/',
  plugins: [solid()],
  test: {
    environment: 'node',
  },
})
