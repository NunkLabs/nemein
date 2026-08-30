import { existsSync } from "node:fs";
import {
  createServer as createHttpServer,
  type Server,
  type ServerResponse,
} from "node:http";
import { join } from "node:path";
import { nanoid } from "nanoid";
import sirv from "sirv";
import logger from "./utils/Logger.js";
import { SocketServer } from "./websocket/Server.js";
import { Socket } from "./websocket/Socket.js";

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; connect-src 'self' ws: nemein.io *.nemein.io ; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "strict-origin",
  Server: "nemein",
  "X-Content-Type-Options": "nosniff",
  "X-DNS-Prefetch-Control": "on",
  "X-Frame-Options": "SAMEORIGIN",
};
const HASHED_ASSET_PATH = /[.-][a-f0-9]{8,}\./i;

export interface ServerOptions {
  webRoot?: string;
}

export function createServer(options: ServerOptions = {}): Server {
  const { webRoot } = options;

  if (webRoot) {
    const indexPath = join(webRoot, "index.html");
    if (!existsSync(indexPath)) {
      throw new Error(`Web root does not contain index.html: ${webRoot}`);
    }
  }

  const wss = new SocketServer({ noServer: true });

  wss.on("connection", (socket) => {
    const id = nanoid();

    const gameSocket = new Socket(id, socket);

    wss.sockets.set(id, gameSocket);

    let cleanedUp = false;
    const cleanup = () => {
      if (cleanedUp) {
        return;
      }
      cleanedUp = true;

      gameSocket.destroy();
      wss.sockets.delete(id);
    };

    socket
      .on("error", (err) => {
        logger.error(err.stack);
        cleanup();
      })
      .on("close", () => {
        logger.info(`[Socket]: Connection ended with client (ID: ${id})`);
        cleanup();
      });

    logger.info(`[Socket]: Connection established with client (ID: ${id})`);
  });

  const serve = webRoot
    ? sirv(webRoot, {
        dev: process.env.NODE_ENV === "development",
        dotfiles: false,
        setHeaders: (res: ServerResponse, pathname: string) => {
          if (pathname === "/" || pathname.endsWith(".html")) {
            res.setHeader("Cache-Control", "no-cache, must-revalidate");
          } else if (
            pathname.startsWith("/assets/") ||
            HASHED_ASSET_PATH.test(pathname)
          ) {
            res.setHeader(
              "Cache-Control",
              "public, max-age=31536000, immutable"
            );
          }
        },
        single: true,
      })
    : null;

  const server = createHttpServer((req, res) => {
    if (serve) {
      for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
        res.setHeader(header, value);
      }
      serve(req, res, () => {
        res.statusCode = 404;
        res.end("Not Found");
      });
      return;
    }

    res.statusCode = 404;
    res.end("Not Found");
  });

  server.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url ?? "", "http://localhost");

    if (url.pathname === "/ws") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n");
      socket.destroy();
    }
  });

  server.on("close", () => {
    wss.close();
  });

  return server;
}
