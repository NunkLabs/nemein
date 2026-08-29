import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";

import { createServer } from "./server.js";
import logger from "./utils/Logger.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;
const isDev = process.env.NODE_ENV === "development";
const defaultWebRoot = fileURLToPath(new URL("../web", import.meta.url));
const webRoot = isDev ? undefined : defaultWebRoot;

let server;
try {
  server = createServer({ webRoot });
} catch (error) {
  logger.error(`Failed to initialize server: ${(error as Error).message}`);
  throw error;
}

server.listen(PORT, () => {
  logger.info(
    `[Server]: Listening on port ${PORT} (mode: ${isDev ? "development" : "production"})`,
  );
});
