import type { Server } from "node:http";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

import { createServer } from "./server.js";
import logger from "./utils/Logger.js";

try {
  loadEnvFile();
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
    throw error;
  }
}

const PORT = Number(process.env.PORT) || 8080;
const isDev = process.env.NODE_ENV === "development";
const defaultWebRoot = fileURLToPath(new URL("../web", import.meta.url));
const webRoot = isDev ? undefined : defaultWebRoot;

let server: Server;
try {
  server = createServer({ webRoot });
} catch (error) {
  logger.error(`Failed to initialize server: ${(error as Error).message}`);
  throw error;
}

server.listen(PORT, () => {
  logger.info(
    `[Server]: Listening on port ${PORT} (mode: ${isDev ? "development" : "production"})`
  );
});
