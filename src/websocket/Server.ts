import { WebSocketServer } from "ws";
import logger from "../utils/Logger.js";
import type { Socket } from "./Socket.js";

const LAST_SEEN_DURATION = 120_000;
const SWEEP_INTERVAL = 60_000;

export class SocketServer extends WebSocketServer {
  sockets: Map<string, Socket>;

  private sweepTimer: NodeJS.Timeout | null = null;

  constructor(options = {}) {
    super(options);

    this.sockets = new Map();

    this.init();
  }

  init() {
    /* Sweeps sockets after they become inactive for too long */
    this.sweepTimer = setInterval(() => {
      const currentTimestamp = Date.now();

      for (const socket of this.sockets.values()) {
        if (currentTimestamp - socket.timestamp < LAST_SEEN_DURATION) {
          continue;
        }

        socket.destroy();

        this.sockets.delete(socket.id);

        logger.info(
          `[Socket]: Connection ended with client (ID: ${socket.id})`
        );
      }
    }, SWEEP_INTERVAL);

    if (this.sweepTimer.unref) {
      this.sweepTimer.unref();
    }

    this.on("close", () => {
      if (this.sweepTimer) {
        clearInterval(this.sweepTimer);
        this.sweepTimer = null;
      }
    });
  }
}
