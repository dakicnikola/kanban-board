import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  include: ['__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./__tests__/setup.js"],
    css: true
  },
})
