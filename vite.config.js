import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
<<<<<<< HEAD
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
=======
>>>>>>> back-up

export default defineConfig({
  plugins: [react()],
  build: {
<<<<<<< HEAD
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    chunkSizeWarningLimit: 500,
  },
  css: {
    preprocessorOptions: {
      css: {
        import: true,
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  buildEnd() {
    const srcPath = path.resolve(__dirname, '_redirects');
    const destPath = path.resolve(__dirname, 'dist', '_redirects');
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log('Copied _redirects file to dist directory.');
    } else {
      console.error('Error: _redirects file not found.');
    }
  },
=======
    outDir: 'dist'
  }
>>>>>>> back-up
});
