import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const webRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: path.resolve(webRoot, "../../dist/web"),
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(webRoot),
      components: path.resolve(webRoot, "components"),
      libs: path.resolve(webRoot, "libs"),
    },
  },
  root: webRoot,
  server: {
    port: 3000,
    proxy: {
      "/ws": {
        target: "ws://127.0.0.1:8080",
        ws: true,
      },
    },
    strictPort: true,
  },
});
