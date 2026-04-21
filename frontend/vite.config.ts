import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    TanStackRouterVite(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
    watch: {
      usePolling: false,
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-router',
      '@tanstack/react-query',
      'lucide-react',
      'axios',
      'clsx',
      'tailwind-merge'
    ],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    sourcemap: false,
  },
})
