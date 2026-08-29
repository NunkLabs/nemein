import EventEmitter from "eventemitter3";

import { GameStates } from "./Store";

export enum Opcodes {
  /* Base socket events */
  SOCKET_OPEN,
  SOCKET_READY,
  SOCKET_PING,
  SOCKET_HEARTBEAT,

  /* Game events */
  GAME_KEYDOWN,
  GAME_STATES,
  GAME_TOGGLE,
}

type SocketOpen = {
  op: Opcodes.SOCKET_OPEN;
  data: number;
};

type SocketReady = {
  op: Opcodes.SOCKET_READY;
  data: "classic" | "nemein";
};

type SocketPing = {
  op: Opcodes.SOCKET_PING;
  data: number;
};

type SocketHeartbeat = {
  op: Opcodes.SOCKET_HEARTBEAT;
  data: number;
};

type SocketGameKeydown = {
  op: Opcodes.GAME_KEYDOWN;
  data: string;
};

type SocketGameStates = {
  op: Opcodes.GAME_STATES;
  data: GameStates;
};

type SocketGameToggle = {
  op: Opcodes.GAME_TOGGLE;
  data: boolean;
};

type SocketData =
  | SocketOpen
  | SocketReady
  | SocketPing
  | SocketHeartbeat
  | SocketGameKeydown
  | SocketGameStates
  | SocketGameToggle;

const WS_CLOSURE_CODE = 1000;
const HEARTBEAT_INTERVAL_MS = 5000;
const PING_INTERVAL_MS = 100;
const PING_ATTEMPT_LIMIT = 5;

export class GameSocket extends EventEmitter {
  private socket: WebSocket | null;

  private heartbeat: number | null;

  private pingInterval: number | null;

  constructor() {
    super();

    this.socket = null;
    this.heartbeat = null;
    this.pingInterval = null;

    this.init();
  }

  /**
   * @brief: init: This function initializes a new Tetris client socket by
   * setting up socket events and forwarding them to the Tetris React component.
   */
  async init() {
    if (this.socket) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
    this.socket = socket;

    let pingResponses = 0;

    socket.onmessage = (message: MessageEvent) => {
      const { op, data }: SocketData = JSON.parse(message.data);

      switch (op) {
        case Opcodes.SOCKET_OPEN: {
          const heartbeatInterval = data || HEARTBEAT_INTERVAL_MS;

          this.pingInterval = window.setInterval(() => {
            if (pingResponses >= PING_ATTEMPT_LIMIT) {
              if (this.pingInterval !== null) {
                clearInterval(this.pingInterval);
                this.pingInterval = null;
              }

              this.emit("progress", { percent: 60 });
              this.setHeartbeat(heartbeatInterval);
              this.emit("progress", { percent: 100 });

              return;
            }

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
              this.socket.send(
                JSON.stringify({
                  op: Opcodes.SOCKET_PING,
                  data: Date.now(),
                }),
              );
            }
          }, PING_INTERVAL_MS);

          break;
        }

        case Opcodes.SOCKET_PING: {
          pingResponses += 1;
          break;
        }

        default:
          this.emit("data", { op, data });
      }
    };
  }

  /**
   * @brief: destroy: This function cleans up the current Tetris client socket
   * by clearing the heartbeat interval timer and closing the connection.
   */
  destroy() {
    if (!this.socket) return;

    if (this.heartbeat !== null) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    this.socket.close(WS_CLOSURE_CODE);
    this.socket = null;
  }

  /**
   * @brief: send: This function handles outgoing communications with the server
   * @param:   {SocketData}   data   Data to send to the server
   */
  send(data: SocketData) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

    this.socket.send(JSON.stringify(data));
  }

  /**
   * @brief: setHeartbeat: This function sets up an interval to send heartbeats
   * to the server
   * @param:   {number}   duration   Interval between heartbeats in milliseconds
   */
  setHeartbeat(duration?: number) {
    if (duration && !Number.isNaN(duration)) {
      if (this.heartbeat !== null) {
        clearInterval(this.heartbeat);

        this.heartbeat = null;
      }

      if (duration >= 0) {
        this.heartbeat = window.setInterval(
          this.setHeartbeat.bind(this),
          duration,
        );
      }

      return;
    }

    this.send({
      op: Opcodes.SOCKET_HEARTBEAT,
      data: Date.now(),
    });
  }
}
