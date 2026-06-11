import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/vue-prototype/',
  plugins: [vue()],
})
// Restarting server to pick up new npm dependencies
