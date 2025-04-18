// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const API_BASE = process.env.VITE_API_BASE_URL;

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,
    // only proxy if we're hitting localhost
    proxy:
      API_BASE === "http://localhost:8000"
        ? {
            "/predict": {
              target: API_BASE,
              changeOrigin: true,
              rewrite: (p) => p.replace(/^\/predict/, "/predict"),
            },
            "/batch_predict": {
              target: API_BASE,
              changeOrigin: true,
              rewrite: (p) => p.replace(/^\/batch_predict/, "/batch_predict"),
            },
          }
        : undefined,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
