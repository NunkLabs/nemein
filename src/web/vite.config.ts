import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const webRoot = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(webRoot, "../../dist/web");

const COMPRESSIBLE = /\.(?:css|html|js|json|map|svg)$/;
const MIN_COMPRESS_BYTES = 512;

function precompress(): Plugin {
  return {
    apply: "build",
    closeBundle() {
      for (const entry of readdirSync(outDir, {
        recursive: true,
        withFileTypes: true,
      })) {
        if (!(entry.isFile() && COMPRESSIBLE.test(entry.name))) {
          continue;
        }

        const file = path.join(entry.parentPath, entry.name);
        const raw = readFileSync(file);

        if (raw.byteLength < MIN_COMPRESS_BYTES) {
          continue;
        }

        const brotli = brotliCompressSync(raw, {
          params: {
            [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
            [constants.BROTLI_PARAM_SIZE_HINT]: raw.byteLength,
          },
        });

        const gzip = gzipSync(raw, { level: constants.Z_BEST_COMPRESSION });

        if (brotli.byteLength < raw.byteLength) {
          writeFileSync(`${file}.br`, brotli);
        }

        if (gzip.byteLength < raw.byteLength) {
          writeFileSync(`${file}.gz`, gzip);
        }
      }
    },
    name: "nemein:precompress",
  };
}

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir,
  },
  plugins: [
    react({ compiler: { logDiagnostics: true } }),
    tailwindcss(),
    precompress(),
  ],
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
