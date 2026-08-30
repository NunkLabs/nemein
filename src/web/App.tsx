import { GameSocket, Opcodes } from "libs/Socket";
import { useGameStore } from "libs/Store";
import type { FeatureBundle } from "motion/react";
import { LazyMotion } from "motion/react";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";

const ControlPanel = lazy(() => import("components/panels/Control"));
const Stage = lazy(() => import("components/game/Stage"));
const StartPanel = lazy(() => import("components/panels/Start"));

const ESCAPE_KEY = "Escape";
const VALID_KEYS = [
  /* Left */
  "0",
  "ArrowLeft",

  /* Right */
  "6",
  "ArrowRight",

  /* Down */
  "2",
  "ArrowDown",

  /* Clockwise rotate */
  "1",
  "5",
  "9",
  "x",
  "ArrowUp",

  /* Counterclockwise rotate */
  "3",
  "7",
  "z",
  "Control",

  /* Hold */
  "0",
  "c",
  "Shift",

  /* Hard drop */
  "8",
  " ",
];

export default function Nemein() {
  const gameLoadStates = useGameStore((state) => state.gameLoadStates);
  const gameOptions = useGameStore((state) => state.gameOptions);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const updateGameLoadStates = useGameStore(
    (state) => state.updateGameLoadStates
  );
  const updateGamePerformance = useGameStore(
    (state) => state.updateGamePerformance
  );
  const updateGameStates = useGameStore((state) => state.updateGameStates);
  const updateGameStatus = useGameStore((state) => state.updateGameStatus);

  const [featureBundle, setFeatureBundle] = useState<FeatureBundle | null>(
    null
  );
  /* Held in state so callbacks see the socket the effect owns */
  const [gameSocket, setGameSocket] = useState<GameSocket | null>(null);

  const startGame = useCallback(() => {
    if (!gameSocket) {
      return;
    }

    gameSocket.send({
      data: gameOptions.gameMode,
      op: Opcodes.SOCKET_READY,
    });

    updateGameStatus("ongoing");
  }, [gameOptions.gameMode, gameSocket, updateGameStatus]);

  const toggleGame = useCallback(() => {
    if (!gameSocket) {
      return;
    }

    gameSocket.send({
      data: gameStatus !== "ongoing",
      op: Opcodes.GAME_TOGGLE,
    });
  }, [gameSocket, gameStatus]);

  const handleKeydown = useCallback(
    ({ key }: { key: string }) => {
      if (!gameSocket || gameStatus === "initializing") {
        return;
      }

      if (gameStatus !== "ending" && key === ESCAPE_KEY) {
        toggleGame();

        return;
      }

      if (gameStatus !== "ongoing" || !VALID_KEYS.includes(key)) {
        return;
      }

      gameSocket.send({
        data: key,
        op: Opcodes.GAME_KEYDOWN,
      });
    },
    [gameSocket, gameStatus, toggleGame]
  );

  useEffect(() => {
    /* Listens for keyboard input */
    document.addEventListener("keydown", handleKeydown);

    return () => {
      /* Removes listener on component unmount */
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  useEffect(() => {
    /* Imports and loads the feature bundle for Framer Motion */
    if (gameLoadStates.featureBundle) {
      return;
    }

    import("libs/Animation").then((res) => {
      setFeatureBundle(res.default);

      updateGameLoadStates({ featureBundle: true });
    });
  }, [gameLoadStates.featureBundle, updateGameLoadStates]);

  useEffect(() => {
    /* Initializes and listens for socket events */
    const socket = new GameSocket();

    socket
      .on("progress", ({ percent }) => {
        if (percent < 100) {
          return;
        }

        updateGameLoadStates({ gameSocket: true });
      })
      .on("data", ({ op, data }) => {
        switch (op) {
          case Opcodes.SOCKET_READY: {
            if (data !== gameOptions.gameMode) {
              throw new Error("Game mode mismatched!");
            }

            updateGameStatus("ongoing");

            break;
          }

          case Opcodes.SOCKET_HEARTBEAT: {
            updateGamePerformance({
              currentLatency: Date.now() - data,
            });

            break;
          }

          case Opcodes.GAME_STATES: {
            updateGameStates(data);

            if (data.gameOver) {
              updateGameStatus("ending");
            }

            break;
          }

          case Opcodes.GAME_TOGGLE: {
            updateGameStatus(data ? "ongoing" : "pausing");

            break;
          }

          default:
        }
      });

    setGameSocket(socket);

    return () => {
      /* Cleans up socket on component unmount */
      socket.removeAllListeners();

      socket.destroy();
    };
  }, [
    gameOptions.gameMode,
    updateGameLoadStates,
    updateGamePerformance,
    updateGameStates,
    updateGameStatus,
  ]);

  return (
    <div className="grid h-screen min-w-fit place-items-center bg-gray-50 font-montserrat dark:bg-gray-950">
      {gameLoadStates.initialLoad ? (
        /* Acts as a placeholder while waiting for the start panel */
        <div
          className="fixed top-1/2 left-1/2 h-32 -translate-x-1/2 -translate-y-1/2 animate-pulse text-center text-5xl"
          id="start-panel-initial-header"
        >
          nemein
        </div>
      ) : null}
      {featureBundle ? (
        /* Lazy-loads in the feature bundle */
        <LazyMotion features={featureBundle} strict>
          {gameLoadStates.featureBundle ? (
            <Suspense fallback={null}>
              <Stage />
              <StartPanel startGame={startGame} />
              <ControlPanel startGame={startGame} toggleGame={toggleGame} />
            </Suspense>
          ) : null}
        </LazyMotion>
      ) : null}
    </div>
  );
}
