
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    headers: {
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Enhanced cache busting with valid pattern
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    target: 'esnext',
    // Ensure source maps are generated for better debugging
    sourcemap: true,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "stream": "stream-browserify",
      "util": "util",
      "process": "process/browser",
      "buffer": "buffer",
      "crypto": "crypto-browserify"
    },
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'zod',
      '@hookform/resolvers/zod',
      '@supabase/supabase-js',
      '@supabase/postgrest-js',
      '@supabase/realtime-js',
      '@supabase/storage-js',
      '@supabase/functions-js',
      'cross-fetch',
      'buffer',
      'events'
    ],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'Buffer.prototype': 'Buffer.prototype',
  },
}));
