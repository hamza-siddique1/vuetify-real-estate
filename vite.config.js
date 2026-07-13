import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [ vue() ],

  // Only set base when building for WordPress
  base: command === 'build'
    ? '/wp-content/plugins/real-estate-repliers/dist/'
    : '/',   // 👈 local dev uses /

  build: {
    outDir: '../real-estate-repliers/dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 3000,
  }
}))
