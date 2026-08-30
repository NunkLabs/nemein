import { Application } from "@pixi/react";
import { type GameTextures, loadGameTextures } from "libs/Pixi";
import { DmgType, TetrominoType, useGameStore } from "libs/Store";
import { AnimatePresence, m } from "motion/react";
import type { PointData } from "pixi.js";
import { type JSX, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@/theme";
import BorderGraphics from "./BorderGraphics";
import ClearedSprite from "./ClearedSprite";
import DamageSprite from "./DamageSprite";
import {
  BASE_STYLE,
  DAMAGE_TYPE_STYLES,
  GAME_PANEL,
  HOLD_PANEL,
  QUEUE_PANEL,
  STAGE_SIZE,
  STAGE_SPACER,
  TETROMINO_STYLES,
  TETROMINOS_ARR,
} from "./Misc";
import PerformanceTracker from "./PerformanceTracker";

const SCREEN_SHAKE_INTERVAL_MS = 10;
const SCREEN_SHAKE_OFFSETS: PointData[] = [
  { x: 0, y: 0 },
  { x: -10, y: -10 },
  { x: 10, y: 10 },
  { x: 0, y: 0 },
];

const noop = () => null;

function Stage() {
  const gameOptions = useGameStore((state) => state.gameOptions);
  const gameStates = useGameStore((state) => state.gameStates);

  const { theme } = useTheme();

  const styles = useRef({
    damageColor:
      theme === "light" ? DAMAGE_TYPE_STYLES.LIGHT : DAMAGE_TYPE_STYLES.DARK,
    tetrominoColor:
      theme === "light" ? TETROMINO_STYLES.LIGHT : TETROMINO_STYLES.DARK,
  });
  const blocksCleared = useRef<number>(0);
  const linesCleared = useRef<number>(0);

  const [stagePosition, setStagePosition] = useState<PointData>({ x: 0, y: 0 });
  const [gameSprites, setGameSprites] = useState<JSX.Element[]>([]);
  const [textures, setTextures] = useState<GameTextures | null>(null);

  /* Pixi 8 initializes asynchronously, so textures load once the app is up */
  const handleInit = useCallback(() => {
    loadGameTextures()
      .then(setTextures)
      .catch((error: unknown) => {
        console.error("[Stage]: Failed to load the game textures", error);
      });
  }, []);

  useEffect(() => {
    if (!(gameStates && textures)) {
      return;
    }

    const { damageColor, tetrominoColor } = styles.current;

    const sprites: JSX.Element[] = [];

    /* Constructs the main game sprites */
    if (gameStates.type === "nemein") {
      gameStates.gameField.forEach((col, colIndex) => {
        col.colArr.forEach((row, rowIndex) => {
          const tetrominoName = TetrominoType[row.type];

          sprites.push(
            gameStates.gameOver ? (
              <ClearedSprite
                isBlank={tetrominoName === "Blank"}
                key={`game-over-${colIndex}-${rowIndex}`}
                texture={textures.blank}
                tint={tetrominoColor[tetrominoName]}
                x={GAME_PANEL.X + GAME_PANEL.CHILD * colIndex}
                y={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
              />
            ) : (
              <pixiSprite
                alpha={row.type === TetrominoType.Ghost ? 0.25 : 1}
                height={GAME_PANEL.CHILD}
                key={`game-${colIndex}-${rowIndex}`}
                texture={textures.blank}
                tint={tetrominoColor[tetrominoName]}
                width={GAME_PANEL.CHILD}
                x={GAME_PANEL.X + GAME_PANEL.CHILD * colIndex}
                y={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
              />
            )
          );
        });
      });

      /* Handles line clear on Nemein game mode */
      if (gameStates.clearRecordsArr.length) {
        for (const clearRecord of gameStates.clearRecordsArr) {
          const { idx: rowIndex, lineTypeArr, dmgDealt } = clearRecord;

          for (const [colIndex, type] of lineTypeArr.entries()) {
            blocksCleared.current += 1;

            sprites.push(
              <ClearedSprite
                key={`cleared-block-${blocksCleared.current}`}
                texture={textures.blank}
                tint={tetrominoColor[TetrominoType[type]]}
                x={GAME_PANEL.X + GAME_PANEL.CHILD * colIndex}
                y={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
              />
            );
          }

          if (lineTypeArr.includes(TetrominoType.Grey)) {
            continue;
          }

          linesCleared.current += 1;

          sprites.push(
            <DamageSprite
              color={damageColor[DmgType[dmgDealt.dominantDmgType]]}
              dmgDealt={clearRecord.dmgDealt.value.toString()}
              dmgIndex={rowIndex}
              key={`damage-number-${linesCleared.current}`}
              wasCrit={clearRecord.wasCrit}
              x={GAME_PANEL.X}
              y={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
            />
          );
        }

        if (!gameOptions.stageShake) {
          return;
        }

        let offsetIterationIndex = 0;

        const stageShakeInterval = setInterval(() => {
          setStagePosition(SCREEN_SHAKE_OFFSETS[offsetIterationIndex]);

          offsetIterationIndex += 1;

          if (offsetIterationIndex < SCREEN_SHAKE_OFFSETS.length) {
            return;
          }

          clearInterval(stageShakeInterval);
        }, SCREEN_SHAKE_INTERVAL_MS);
      }
    } else {
      gameStates.gameField.forEach((col, colIndex) => {
        col.colArr.forEach((row, rowIndex) => {
          const tetrominoName = TetrominoType[row];

          sprites.push(
            <pixiSprite
              alpha={row === TetrominoType.Ghost ? 0.25 : 1}
              height={GAME_PANEL.CHILD}
              key={`game-${colIndex}-${rowIndex}`}
              texture={textures.blank}
              tint={tetrominoColor[tetrominoName]}
              width={GAME_PANEL.CHILD}
              x={GAME_PANEL.X + GAME_PANEL.CHILD * colIndex}
              y={GAME_PANEL.Y + GAME_PANEL.CHILD * rowIndex}
            />
          );
        });
      });
    }

    /* Constructs the hold panel sprites */
    const holdField = TETROMINOS_ARR[gameStates.heldTetromino];

    holdField.forEach((col, colIndex) => {
      col.forEach((row, rowIndex) => {
        const tetrominoName = TetrominoType[row];

        sprites.push(
          <pixiSprite
            alpha={gameStates.gameOver ? 0.25 : 1}
            height={HOLD_PANEL.CHILD}
            key={`hold-${colIndex}-${rowIndex}`}
            texture={textures.blank}
            tint={tetrominoColor[tetrominoName]}
            width={HOLD_PANEL.CHILD}
            x={HOLD_PANEL.X + HOLD_PANEL.CHILD * colIndex}
            y={HOLD_PANEL.Y + HOLD_PANEL.CHILD * rowIndex}
          />
        );
      });
    });

    /* Constructs the queue panel sprites */
    let queuePanelYCoord = QUEUE_PANEL.Y;

    gameStates.spawnedTetrominos.forEach((spawnedTetromino, spawnedIndex) => {
      const queueField = TETROMINOS_ARR[spawnedTetromino];

      queueField.forEach((col, colIndex) => {
        col.forEach((row, rowIndex) => {
          const tetrominoName = TetrominoType[row];

          sprites.push(
            <pixiSprite
              alpha={gameStates.gameOver ? 0.25 : 1}
              height={QUEUE_PANEL.CHILD}
              key={`queue-${spawnedIndex}-${colIndex}-${rowIndex}`}
              texture={textures.blank}
              tint={tetrominoColor[tetrominoName]}
              width={QUEUE_PANEL.CHILD}
              x={QUEUE_PANEL.X + QUEUE_PANEL.CHILD * colIndex}
              y={queuePanelYCoord + QUEUE_PANEL.CHILD * rowIndex}
            />
          );
        });
      });

      queuePanelYCoord += QUEUE_PANEL.HEIGHT + STAGE_SPACER;
    });

    setGameSprites(sprites);
  }, [gameStates, gameOptions, textures]);

  return (
    <Application
      antialias={gameOptions.antialias}
      backgroundColor={
        theme === "light"
          ? BASE_STYLE.LIGHT.SECONDARY
          : BASE_STYLE.DARK.SECONDARY
      }
      height={STAGE_SIZE}
      hello
      onInit={handleInit}
      powerPreference={
        gameOptions.powerPreference === "default"
          ? undefined
          : gameOptions.powerPreference
      }
      preference="webgpu"
      width={STAGE_SIZE}
    >
      <pixiContainer position={stagePosition}>
        <BorderGraphics />
        {gameSprites}
      </pixiContainer>
      {gameOptions.performanceDisplay ? <PerformanceTracker /> : null}
    </Application>
  );
}

/**
 * Wraps the stage with the animation div
 * Pixi requires the Application component & Pixi children to be returned separately
 */
export default function StageWrapper() {
  const gameOptions = useGameStore((state) => state.gameOptions);
  const gamePerformance = useGameStore((state) => state.gamePerformance);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const gameLoadStates = useGameStore((state) => state.gameLoadStates);
  const updateGameLoadStates = useGameStore(
    (state) => state.updateGameLoadStates
  );

  const handleAnimationComplete = useCallback(
    () => updateGameLoadStates({ gameStage: true }),
    [updateGameLoadStates]
  );

  return (
    /* Forces board to properly wait for Play */
    gameLoadStates.gameRequest &&
    gameLoadStates.gameSocket && (
      <>
        <m.div
          animate={{ opacity: 1, transition: { type: "spring" }, y: 0 }}
          initial={{ opacity: 0, y: -50 }}
          onAnimationComplete={handleAnimationComplete}
        >
          <Stage />
        </m.div>
        <div className="fixed bottom-[1%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
          <AnimatePresence onExitComplete={noop}>
            {gameOptions.performanceDisplay && gameStatus === "ongoing" && (
              <m.p
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="performance-panel"
              >
                current latency: {gamePerformance.currentLatency} ms • frame
                rate: {gamePerformance.frameRate} fps • frame time:
                {gamePerformance.frameTime} ms
              </m.p>
            )}
          </AnimatePresence>
        </div>
      </>
    )
  );
}
