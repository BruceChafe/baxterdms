import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-redirects',
      buildEnd() {
        // Copy _redirects file to the dist directory
        copyFileSync(resolve(__dirname, '_redirects'), resolve(__dirname, 'dist/_redirects'))
      }
    }
  ],
  css: {
    preprocessorOptions: {
      css: {
        import: true
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    copyPublicDir: true
  }
})
