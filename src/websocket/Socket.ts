import { WebSocket } from "ws";

import {
  Classic,
  ClassicCommand,
  type ClassicStates,
} from "../core/classic/Classic.js";
import {
  Nemein,
  NemeinCommand,
  type NemeinStates,
} from "../core/nemein/Nemein.js";

const DEFAULT_HEARTBEAT_INTERVAL_MS = 5000;
const SPACE_KEY = " ";

enum Opcodes {
  /* Base socket events */
  SOCKET_OPEN = 0,
  SOCKET_READY = 1,
  SOCKET_PING = 2,
  SOCKET_HEARTBEAT = 3,

  /* Game events */
  GAME_KEYDOWN = 4,
  GAME_STATES = 5,
  GAME_TOGGLE = 6,
}

type GameInstance =
  | {
      type: "classic";
      game: Classic;
      states: ClassicStates | null;
      interval: NodeJS.Timeout | null;
    }
  | {
      type: "nemein";
      game: Nemein;
      states: NemeinStates | null;
      interval: NodeJS.Timeout | null;
    };

interface SocketOpen {
  data: number;
  op: Opcodes.SOCKET_OPEN;
}

interface SocketReady {
  data: "classic" | "nemein";
  op: Opcodes.SOCKET_READY;
}

interface SocketPing {
  data: number;
  op: Opcodes.SOCKET_PING;
}

interface SocketHeartbeat {
  data: number;
  op: Opcodes.SOCKET_HEARTBEAT;
}

interface SocketGameKeydown {
  data: string;
  op: Opcodes.GAME_KEYDOWN;
}

interface SocketGameStates {
  data: ClassicStates | NemeinStates;
  op: Opcodes.GAME_STATES;
}

interface SocketGameToggle {
  data: boolean;
  op: Opcodes.GAME_TOGGLE;
}

type SocketData =
  | SocketOpen
  | SocketReady
  | SocketPing
  | SocketHeartbeat
  | SocketGameKeydown
  | SocketGameStates
  | SocketGameToggle;

export class Socket {
  private readonly socket: WebSocket;

  private active: boolean;

  private instance: GameInstance;

  id: string;

  timestamp: number;

  constructor(id: string, socket: WebSocket) {
    this.socket = socket;

    this.active = false;

    this.instance = {
      game: new Nemein(),
      interval: null,
      states: null,
      type: "nemein",
    };

    this.id = id;

    this.timestamp = Date.now();

    this.init();
  }

  /**
   * @brief: init: This function initializes a new Tetris server socket by
   * providing the client with the initial game data as well as setting up game
   * intervals and socket events.
   */
  init() {
    /* Specifies client's heartbeat on open */
    this.send({
      data: DEFAULT_HEARTBEAT_INTERVAL_MS,
      op: Opcodes.SOCKET_OPEN,
    });

    /* Sends updated game states after an interval */
    const gameUpdateInterval = () => {
      if (!(this.active && this.instance.game)) {
        return;
      }

      const { type, game } = this.instance;

      this.instance.states =
        type === "nemein"
          ? game.updateNemeinStates(NemeinCommand.TickDown)
          : game.updateClassicStates(ClassicCommand.Down);

      this.send({
        data: this.instance.states,
        op: Opcodes.GAME_STATES,
      });

      if (!this.instance.states.gameOver) {
        return;
      }

      this.active = false;

      if (!this.instance.interval) {
        return;
      }

      clearInterval(this.instance.interval);

      this.instance.interval = null;
    };

    this.socket.on("message", (message) => {
      const { op, data }: SocketData = JSON.parse(message.toString());

      switch (op) {
        case Opcodes.SOCKET_READY: {
          this.active = true;

          this.instance =
            data === "nemein"
              ? {
                  game: new Nemein(),
                  interval: null,
                  states: null,
                  type: data,
                }
              : {
                  game: new Classic(),
                  interval: null,
                  states: null,
                  type: data,
                };

          this.send({
            data: this.instance.type,
            op: Opcodes.SOCKET_READY,
          });

          const { type, game } = this.instance;

          this.instance.states =
            type === "nemein"
              ? game.updateNemeinStates()
              : game.updateClassicStates();

          this.send({
            data: this.instance.states,
            op: Opcodes.GAME_STATES,
          });

          this.instance.interval = setInterval(
            gameUpdateInterval,
            this.instance.states.gameInterval
          );

          break;
        }

        case Opcodes.SOCKET_PING: {
          this.send({
            data,
            op: Opcodes.SOCKET_PING,
          });

          break;
        }

        case Opcodes.SOCKET_HEARTBEAT: {
          /* Updates the last seen timestamp */
          const clientTimestamp = data;

          this.timestamp = clientTimestamp;

          this.send({
            data: this.timestamp,
            op: Opcodes.SOCKET_HEARTBEAT,
          });

          break;
        }

        case Opcodes.GAME_KEYDOWN: {
          /* Updates and sends the game state after registering an input */
          const key = data;

          this.instance.states = this.instance.game.inputHandle(key);

          this.send({
            data: this.instance.states,
            op: Opcodes.GAME_STATES,
          });

          if (key !== SPACE_KEY || !this.instance.interval) {
            return;
          }

          clearInterval(this.instance.interval);

          this.instance.interval = setInterval(
            gameUpdateInterval,
            this.instance.states.gameInterval
          );

          break;
        }

        case Opcodes.GAME_TOGGLE: {
          this.active = data;

          this.send({
            data: this.active,
            op: Opcodes.GAME_TOGGLE,
          });

          break;
        }

        default:
      }
    });
  }

  /**
   * @brief: destroy: This function cleans up the current Tetris server socket
   * by clearing the game interval and closing the connection.
   */
  destroy() {
    if (this.instance.interval) {
      clearInterval(this.instance.interval);
    }

    if (!this.socket) {
      return;
    }

    this.socket.removeAllListeners();

    this.socket.terminate();
  }

  /**
   * @brief: send: This function handles outgoing communications with the client
   * @param:   {SocketData}   data   Data to send to the client
   */
  send(data: SocketData) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.socket.send(JSON.stringify(data));
  }
}
