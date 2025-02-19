
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
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
        // Enhanced cache busting with more specific patterns
        entryFileNames: 'assets/[name]-[hash]-[timestamp].js',
        chunkFileNames: 'assets/[name]-[hash]-[timestamp].js',
        assetFileNames: 'assets/[name]-[hash]-[timestamp].[ext]',
      },
    },
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
  },
  // Add optimizeDeps to ensure proper module pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));

