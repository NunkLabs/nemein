import { describe, expect, it } from "vitest";
import { TetrisBoard, Y_START } from "../../src/core/classic/Board";
import {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  C_KEY,
  Classic,
  CTRL,
  DEFAULT_TIME_INTERVAL_MS,
  LOCK_DELAY_MS,
  NUMPAD_0,
  NUMPAD_1,
  NUMPAD_2,
  NUMPAD_3,
  NUMPAD_4,
  NUMPAD_5,
  NUMPAD_6,
  NUMPAD_7,
  NUMPAD_8,
  NUMPAD_9,
  SHIFT,
  SPACE,
  Z_KEY,
} from "../../src/core/classic/Classic";

import {
  type Tetromino,
  TetrominoRotation,
  TetrominoType,
} from "../../src/core/classic/TetrominoManager";

const DEFAULT_TEST_BOARD_WIDTH = 6;
const DEFAULT_TEST_BOARD_HEIGHT = 10;
const DEFAULT_TEST_NUM_DOWN_COMMAND_RUNS = 2;

describe("Classic", () => {
  describe("Test initilization", () => {
    const testTetris = new Classic(
      DEFAULT_TEST_BOARD_WIDTH,
      DEFAULT_TEST_BOARD_HEIGHT
    );
    const testGameStates = testTetris.updateClassicStates();
    /**
     * We're ignoring checking the values of corX, corY, ghostCorY, Tetrominos,
     * field, etc. here as they are already covered in the TetrisBoard &
     * TetrominoManager tests
     */
    it("Should return default state values", () => {
      expect(testGameStates.gameOver, "Game over value is incorrect").toBe(
        false
      );
      expect(testGameStates.corX, "Starting position corX is incorrect").toBe(
        Math.floor((DEFAULT_TEST_BOARD_WIDTH - 1) / 2)
      );
      expect(testGameStates.corY, "Starting position corY is incorrect").toBe(
        Y_START
      );
      expect(testGameStates.score, "Score value is incorrect").toBe(0);
      expect(testGameStates.level, "Level value is incorrect").toBe(1);
      expect(
        testGameStates.gameInterval,
        "Game interval value is incorrect"
      ).toBe(DEFAULT_TIME_INTERVAL_MS);
    });
  });

  describe("Test public methods", () => {
    describe("Test input handling", () => {
      /**
       * FIXME: It is way too extensive for now to test all Tetromino types and
       * rotations. Hence, we're only testing 1 case of (T, O) pair Tetromino
       */
      const testOverwrittenTetromino: Tetromino = {
        rotation: TetrominoRotation.O,
        type: TetrominoType.T,
      };

      it("Should correctly render on down input", () => {
        const testCommands = [ARROW_DOWN, NUMPAD_2];
        for (const command of testCommands) {
          const testTetris = new Classic(
            DEFAULT_TEST_BOARD_WIDTH,
            DEFAULT_TEST_BOARD_HEIGHT,
            testOverwrittenTetromino
          );
          /* Init command */
          let testGameStates = testTetris.inputHandle(command);
          // biome-ignore format: keep the board grid readable
          let testBitmap = [
            0, 3, 3, 3, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, TetrominoType.Ghost, 0, 0, 0,
            0, TetrominoType.Ghost, TetrominoType.Ghost, TetrominoType.Ghost, 0, 0,
          ];
          expect(
            TetrisBoard.tetrisColsToBitmap(testGameStates.gameField),
            `Bitmap incorrect on command ${command} (first)`
          ).toStrictEqual(testBitmap);

          /* Actual down command */
          testGameStates = testTetris.inputHandle(command);
          // biome-ignore format: keep the board grid readable
          testBitmap = [
            0, 0, 3, 0, 0, 0,
            0, 3, 3, 3, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, TetrominoType.Ghost, 0, 0, 0,
            0, TetrominoType.Ghost, TetrominoType.Ghost, TetrominoType.Ghost, 0, 0,
          ];
          expect(
            TetrisBoard.tetrisColsToBitmap(testGameStates.gameField),
            `Bitmap incorrect on command ${command} (second)`
          ).toStrictEqual(testBitmap);
        }
      });

      it("Should correctly render active Tetromino right 1 unit", () => {
        const testCommands = [ARROW_RIGHT, NUMPAD_6];
        for (const command of testCommands) {
          const testTetris = new Classic(
            DEFAULT_TEST_BOARD_WIDTH,
            DEFAULT_TEST_BOARD_HEIGHT,
            testOverwrittenTetromino
          );
          for (
            let numRuns = 0;
            numRuns < DEFAULT_TEST_NUM_DOWN_COMMAND_RUNS;
            numRuns += 1
          ) {
            testTetris.inputHandle(ARROW_DOWN);
          }
          const testGameStates = testTetris.inputHandle(command);
          // biome-ignore format: keep the board grid readable
          const testBitmap = [
              0, 0, 0, 3, 0, 0,
              0, 0, 3, 3, 3, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, TetrominoType.Ghost, 0, 0,
              0, 0, TetrominoType.Ghost, TetrominoType.Ghost, TetrominoType.Ghost, 0,
            ];
          expect(
            TetrisBoard.tetrisColsToBitmap(testGameStates.gameField),
            `Bitmap incorrect on command ${command}`
          ).toStrictEqual(testBitmap);
        }
      });

      it("Should correctly render active Tetromino left 1 unit", () => {
        const testCommands = [ARROW_LEFT, NUMPAD_4];
        for (const command of testCommands) {
          const testTetris = new Classic(
            DEFAULT_TEST_BOARD_WIDTH,
            DEFAULT_TEST_BOARD_HEIGHT,
            testOverwrittenTetromino
          );
          for (
            let numRuns = 0;
            numRuns < DEFAULT_TEST_NUM_DOWN_COMMAND_RUNS;
            numRuns += 1
          ) {
            testTetris.inputHandle(ARROW_DOWN);
          }
          const testGameStates = testTetris.inputHandle(command);
          // biome-ignore format: keep the board grid readable
          const testBitmap = [
              0, 3, 0, 0, 0, 0,
              3, 3, 3, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, TetrominoType.Ghost, 0, 0, 0, 0,
              TetrominoType.Ghost, TetrominoType.Ghost, TetrominoType.Ghost, 0, 0, 0,
            ];
          expect(
            TetrisBoard.tetrisColsToBitmap(testGameStates.gameField),
            `Bitmap incorrect on command ${command}`
          ).toStrictEqual(testBitmap);
        }
      });

      it("Should correctly render active Tetromino rotated once clockwised", () => {
        const testCommands = [ARROW_UP, NUMPAD_1, NUMPAD_5, NUMPAD_9];
        for (const command of testCommands) {
          const testTetris = new Classic(
            DEFAULT_TEST_BOARD_WIDTH,
            DEFAULT_TEST_BOARD_HEIGHT,
            testOverwrittenTetromino
          );
          for (
            let numRuns = 0;
            numRuns < DEFAULT_TEST_NUM_DOWN_COMMAND_RUNS;
            numRuns += 1
          ) {
            testTetris.inputHandle(ARROW_DOWN);
          }
          const testGameStates = testTetris.inputHandle(command);
          // biome-ignore format: keep the board grid readable
          const testBitmap = [
            0, 0, 3, 0, 0, 0,
            0, 0, 3, 3, 0, 0,
            0, 0, 3, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, TetrominoType.Ghost, 0, 0, 0,
            0, 0, TetrominoType.Ghost, TetrominoType.Ghost, 0, 0,
            0, 0, TetrominoType.Ghost, 0, 0, 0,
          ];
          expect(
            TetrisBoard.tetrisColsToBitmap(testGameStates.gameField),
            `Bitmap incorrect on command ${command}`
          ).toStrictEqual(testBitmap);
        }
      });

      it("Should correctly render active Tetromino rotated once counterclockwised", () => {
        const testCommands = [CTRL, Z_KEY, NUMPAD_3, NUMPAD_7];
        for (const command of testCommands) {
          const testTetris = new Classic(
            DEFAULT_TEST_BOARD_WIDTH,
            DEFAULT_TEST_BOARD_HEIGHT,
            testOverwrittenTetromino
          );
          for (
            let numRuns = 0;
            numRuns < DEFAULT_TEST_NUM_DOWN_COMMAND_RUNS;
            numRuns += 1
          ) {
            testTetris.inputHandle(ARROW_DOWN);
          }
          const testGameStates = testTetris.inputHandle(command);
          // biome-ignore format: keep the board grid readable
          const testBitmap = [
            0, 0, 3, 0, 0, 0,
            0, 3, 3, 0, 0, 0,
            0, 0, 3, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0,
            0, 0, TetrominoType.Ghost, 0, 0, 0,
            0, TetrominoType.Ghost, TetrominoType.Ghost, 0, 0, 0,
            0, 0, TetrominoType.Ghost, 0, 0, 0,
          ];
          expect(
            TetrisBoard.tetrisColsToBitmap(testGameStates.gameField),
            `Bitmap incorrect on command ${command}`
          ).toStrictEqual(testBitmap);
        }
      });

      it("Should correctly render active Tetromino hard-dropped", () => {
        const testCommands = [SPACE, NUMPAD_8];
        for (const command of testCommands) {
          const testTetris = new Classic(
            DEFAULT_TEST_BOARD_WIDTH,
            DEFAULT_TEST_BOARD_HEIGHT,
            testOverwrittenTetromino
          );
          for (
            let numRuns = 0;
            numRuns < DEFAULT_TEST_NUM_DOWN_COMMAND_RUNS;
            numRuns += 1
          ) {
            testTetris.inputHandle(ARROW_DOWN);
          }
          const testGameStates = testTetris.inputHandle(command);
          // biome-ignore format: keep the board grid readable
          const testBitmap = [
              0, 0, 3, 0, 0, 0,
              0, 3, 3, 3, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
              0, 0, TetrominoType.Ghost, 0, 0, 0,
              0, TetrominoType.Ghost, TetrominoType.Ghost, TetrominoType.Ghost, 0, 0,
              0, 0, 3, 0, 0, 0,
              0, 3, 3, 3, 0, 0,
            ];
          expect(
            TetrisBoard.tetrisColsToBitmap(testGameStates.gameField),
            `Bitmap incorrect on command ${command}`
          ).toStrictEqual(testBitmap);
        }
      });

      it("Should correctly hold the active Tetromino", () => {
        const testCommands = [C_KEY, NUMPAD_0, SHIFT];
        for (const command of testCommands) {
          const testTetris = new Classic(
            DEFAULT_TEST_BOARD_WIDTH,
            DEFAULT_TEST_BOARD_HEIGHT,
            testOverwrittenTetromino
          );
          for (
            let numRuns = 0;
            numRuns < DEFAULT_TEST_NUM_DOWN_COMMAND_RUNS;
            numRuns += 1
          ) {
            testTetris.inputHandle(ARROW_DOWN);
          }
          const testGameStates = testTetris.inputHandle(command);
          expect(
            testGameStates.heldTetromino,
            `Held Tetromino incorrect on command ${command}`
          ).toBe(testOverwrittenTetromino.type);
        }
      });
    });

    describe("Test lock delay", () => {
      /**
       * FIXME: It is way too extensive for now to test all Tetromino types and
       * rotations. Hence, we're only testing 1 case of (T, O) pair Tetromino
       */
      const testOverwrittenTetromino: Tetromino = {
        rotation: TetrominoRotation.O,
        type: TetrominoType.T,
      };
      const testTetris = new Classic(
        DEFAULT_TEST_BOARD_WIDTH,
        DEFAULT_TEST_BOARD_HEIGHT,
        testOverwrittenTetromino,
        true
      );
      it("Should correctly add a lock delay of 0.5s", () => {
        for (let run = 0; run < DEFAULT_TEST_BOARD_HEIGHT; run += 1) {
          const testGameStates = testTetris.inputHandle(ARROW_DOWN);
          if (run > 0 && run < DEFAULT_TEST_BOARD_HEIGHT - 1) {
            expect(
              testGameStates.gameInterval,
              `Game interval
            incorrect at iter ${run}/${DEFAULT_TEST_BOARD_HEIGHT - 1}`
            ).toBe(0);
          } else if (run === DEFAULT_TEST_BOARD_HEIGHT - 1) {
            expect(
              testGameStates.gameInterval,
              `Game interval incorrect at iter ${run}/
            ${DEFAULT_TEST_BOARD_HEIGHT - 1}`
            ).toBe(LOCK_DELAY_MS);
          }
        }
      });
    });
  });
});
