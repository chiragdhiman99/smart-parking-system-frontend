import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ open: true })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "chart-vendor": ["recharts"],
          "map-vendor": ["leaflet", "react-leaflet"],
          "animation-vendor": ["framer-motion"],
          "pdf-vendor": ["react-to-pdf", "jspdf", "html2canvas"],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
