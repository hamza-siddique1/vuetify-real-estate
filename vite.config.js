import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    // 👇 removed vueDevTools — not needed in production
  ],

  base: '/wp-content/plugins/real-estate-repliers/dist/',  // 👈 change to your plugin folder name

  build: {
    outDir: '../real-estate-repliers/dist',  // 👈 builds directly into your plugin folder
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',    // predictable filename, no hash
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
})
