import path from "path"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          pocketbase: ["pocketbase"],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8090",
        changeOrigin: true,
      },
      "/_": {
        target: "http://localhost:8090",
        changeOrigin: true,
      },
    },
  },
})
