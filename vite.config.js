import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Capacitor needs assets in /assets/ with stable filenames
    outDir: "dist",
    assetsDir: "assets",
    // Keep chunk size sensible for WebView
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Single chunk for offline reliability — no dynamic imports to fail
        manualChunks: undefined,
      },
    },
  },
  // Capacitor serves from the device filesystem (file://)
  base: "./",
});
