import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    // il must be jsdom for vitest
    environment: 'jsdom',
    globals:true, 
  }
})
