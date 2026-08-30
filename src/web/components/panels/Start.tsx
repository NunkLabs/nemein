import { preloadStage } from "components/game/StageLoader";
import { buttonVariants } from "components/ui/Button";
import { useGameStore } from "libs/Store";
import { AnimatePresence, m } from "motion/react";
import { useCallback, useState } from "react";
import SettingsPanel from "./Settings";

const noop = () => null;

export default function StartPanel({ startGame }: { startGame: () => void }) {
  const gameLoadStates = useGameStore((state) => state.gameLoadStates);
  const updateGameLoadStates = useGameStore(
    (state) => state.updateGameLoadStates
  );

  const [presence, setPresence] = useState<boolean>(true);

  const handleLoadingExitComplete = useCallback(() => {
    setPresence(false);

    startGame();
  }, [startGame]);

  const handleInitialLoadComplete = useCallback(
    () => updateGameLoadStates({ initialLoad: false }),
    [updateGameLoadStates]
  );

  const handleStartClick = useCallback(
    () => updateGameLoadStates({ gameRequest: true }),
    [updateGameLoadStates]
  );

  return (
    presence && (
      <div className="fixed top-1/2 left-1/2 z-50 flex h-32 -translate-x-1/2 -translate-y-1/2 flex-col gap-y-2 text-center">
        {gameLoadStates.gameRequest ? (
          /**
           * We don't need the enter animation handling because the static
           * header is our placeholder until we need this loading animation.
           */
          <AnimatePresence onExitComplete={handleLoadingExitComplete}>
            {!(gameLoadStates.gameStage && gameLoadStates.gameSocket) && (
              <m.div
                className="flex flex-row text-5xl"
                exit={{ opacity: 0 }}
                key="start-panel-loading-header"
              >
                {Array.from("nemein").map((letter, index) => (
                  <m.span
                    animate="animate"
                    initial="initial"
                    key={`start-panel-loading-${index}`}
                    variants={{
                      /**
                       * Raises y position by 15px and shifts the opacity of
                       * each letter sequentially to create a wave effect
                       */
                      animate: () => ({
                        opacity: [0.25, 1, 0.25],
                        transition: {
                          delay: index * 0.2,
                          duration: 1,
                          ease: "easeInOut",
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 1.5,
                        },
                        y: [0, -10, 0],
                      }),
                    }}
                  >
                    {letter}
                  </m.span>
                ))}
              </m.div>
            )}
          </AnimatePresence>
        ) : (
          /**
           * We don't care about the exit animation handling here because the
           * loading header will directly replace it. Until then, this acts as
           * a placeholder for the loading header.
           */
          <m.div
            animate={{ opacity: 1 }}
            className="text-5xl"
            id="start-panel-static-header"
            initial={{ opacity: 1 }}
            onAnimationComplete={handleInitialLoadComplete}
          >
            nemein
          </m.div>
        )}
        <AnimatePresence onExitComplete={noop}>
          {!gameLoadStates.gameRequest && (
            /**
             * The enter animation sequence offsets the components -10px
             * vertically then slide them down with the spring effect for a more
             * lifelike effect. A delays of 0.05 second is added between each
             * components to create the enter order:
             *
             *   static header > start button > settings button
             *
             * The exit order is reversed:
             *
             *   settings button > start button > static/loading header
             */
            <>
              <m.button
                animate={{
                  opacity: 1,
                  transition: { delay: 0.05, type: "spring" },
                  y: 0,
                }}
                className={`${buttonVariants({
                  variant: "default",
                })} place-self-center`}
                exit={{ opacity: 0, transition: { delay: 0.05 } }}
                initial={{ opacity: 0, y: -10 }}
                key="start-panel-start"
                onClick={handleStartClick}
                onFocus={preloadStage}
                onPointerDown={preloadStage}
                onPointerEnter={preloadStage}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play
              </m.button>
              <m.div
                animate={{
                  opacity: 1,
                  transition: { delay: 0.1, type: "spring" },
                  y: 0,
                }}
                className="place-self-center"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0, y: -10 }}
                key="start-panel-settings"
              >
                <SettingsPanel />
              </m.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  );
}
