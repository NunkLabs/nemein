import { buttonVariants } from "components/ui/Button";
import { useGameStore } from "libs/Store";
import { AnimatePresence, m } from "motion/react";
import { useCallback, useEffect, useState } from "react";

export default function ControlPanel({
  startGame,
  toggleGame,
}: {
  startGame: () => void;
  toggleGame: () => void;
}) {
  const gameStatus = useGameStore((state) => state.gameStatus);

  const [presence, setPresence] = useState<boolean>(false);

  const handleExitComplete = useCallback(() => setPresence(false), []);

  useEffect(() => {
    if (gameStatus !== "pausing" && gameStatus !== "ending") {
      return;
    }

    setPresence(true);
  }, [gameStatus]);

  return (
    presence && (
      <div className="fixed top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col place-items-center gap-y-2 text-center">
        <AnimatePresence onExitComplete={handleExitComplete}>
          {(gameStatus === "pausing" || gameStatus === "ending") && (
            /**
             * The animation sequence here creates an vertical fold/unfold effect
             * from the top with the initial y offset being -10px. A delay of
             * 0.05s is added between the component visibility to veil/unveil
             * them one by one.
             *
             * The animate in property also includes a spring easing to make the
             * motion more lifelike.The exit property skips the vertical
             * translate and the spring easing because the spring motion at the
             * end won't be visible anyway.
             */
            <>
              <m.h1
                animate={{
                  opacity: 1,
                  transition: { type: "spring" },
                  y: 0,
                }}
                className="text-3xl"
                exit={{ opacity: 0, transition: { delay: 0.1 } }}
                initial={{ opacity: 0, y: -10 }}
                key="control-panel-header"
              >
                {gameStatus === "ending" ? "Game Over" : "Paused"}
              </m.h1>
              <m.button
                animate={{
                  opacity: 1,
                  transition: { delay: 0.05, type: "spring" },
                  y: 0,
                }}
                className={buttonVariants({ variant: "default" })}
                exit={{ opacity: 0, transition: { delay: 0.05 } }}
                initial={{ opacity: 0, y: -10 }}
                key="control-panel-restart"
                onClick={startGame}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Restart
              </m.button>
              {gameStatus === "pausing" && (
                <m.button
                  animate={{
                    opacity: 1,
                    transition: { delay: 0.1, type: "spring" },
                    y: 0,
                  }}
                  className={buttonVariants({ variant: "default" })}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0, y: -10 }}
                  key="control-panel-resume"
                  onClick={toggleGame}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Resume
                </m.button>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    )
  );
}
