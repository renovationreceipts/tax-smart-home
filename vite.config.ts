
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
    },
    mainFields: ['module', 'main'],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  // Add optimizeDeps to ensure proper module pre-bundling
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'zod',
      '@hookform/resolvers/zod'
    ],
    esbuildOptions: {
      target: 'es2020',
    },
  },
}));
